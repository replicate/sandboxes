import Replicate from "replicate";
import { EventEmitter } from "node:events";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { readFile } from "node:fs/promises";
import { hostname } from "node:os";

// NOTE: Devbox must be public/unlisted for webhook to work.
const port = 3000;
const root = `https://${hostname}-${port}.csb.app`;
const callbackURL = `${root}/webhooks/replicate`;

// Use an EventEmitter to share the webhooks across the application.
const webhooks = new EventEmitter();

// Create our webserver for handling the webhooks.
// We use Hono, a web standards based framework here but this pattern
// applies to any web server like express, koa, hapi etc.
const app = new Hono();

// Replicate will POST a prediction to this endpoint.
app.post("/webhooks/replicate", async (c) => {
  // Extract the prediction from the request body.
  const prediction = await c.req.json();

  // Publish the prediction on the event bus, keyed by id.
  webhooks.emit(prediction.id, prediction);

  // Tell Replicate we received the request.
  c.status(200);
  return c.body("OK");
});

// Start the server.
const server = serve({ port, fetch: app.fetch });

// Setup Replicate.
const replicate = new Replicate();

const input = {
  image: await readFile("./image.png"),
  top_p: 1,
  prompt: "Are you allowed to swim here?",
  max_tokens: 1024,
  temperature: 0.2,
};
console.log("input image: %s, prompt: %s", "./image.png", input.prompt);

// Now we run the model and provide the callback url, filtering on the "completed" event.
console.log("Running...");
const prediction = await replicate.predictions.create({
  model: "yorickvp/llava-13b",
  version: "a0fdc44e4f2e1f20f2bb4e27846899953ac8e66c5886c5878fa1d6b73ce009e5",
  input,
  webhook: callbackURL,
  webhook_events_filter: ["completed"],
});

// Finally we wait for the webhooks EventEmitter to emit the completed prediction.
const completed = await new Promise((resolve) =>
  webhooks.once(prediction.id, resolve),
);
console.log(completed.output.join(""));

server.close();
