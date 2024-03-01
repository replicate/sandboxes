# Replicate JavaScript Example

This project contains four examples for working with file-to-text models hosted on Replicate using the JavaScript SDK.

This example uses Llava providing an image file and ask the model to answer a question about the image.

Running a basic prediction by providing an image file ([image.png](./image.png)) in [run.js](./run.js):

```
node run.js
```

Running the above prediction and streaming the output in [stream.js](./webhook.js):

```
node stream.js
```

Running the above prediction using webhooks to avoid polling in [webhook.js](./webhook.js):

```
node webhook.js
```

