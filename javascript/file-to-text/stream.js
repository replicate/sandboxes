import Replicate from "replicate";
import { readFile } from "node:fs/promises";

const replicate = new Replicate();
const input = {
  image: await readFile("./image.png"),
  top_p: 1,
  prompt: "Are you allowed to swim here?",
  max_tokens: 1024,
  temperature: 0.2,
};
console.log("input image: %s, prompt: %s", "./image.png", input.prompt);

console.log("Running...");
for await (const event of replicate.stream(
  "yorickvp/llava-13b:a0fdc44e4f2e1f20f2bb4e27846899953ac8e66c5886c5878fa1d6b73ce009e5",
  { input },
)) {
  process.stdout.write(event.toString());
}
process.stdout.write("\n");
