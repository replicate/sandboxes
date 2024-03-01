# Replicate cURL Example

This project contains three examples for working with file-to-text models hosted on Replicate using cURL on the command line.

This example uses [LLaVA 1.5](https://replicate.com/yorickvp/llava-13b?input=http) providing an image file and ask the model to answer a question about the image.

Running a basic prediction by providing an image file ([image.png](./image.png)) in [run.bash](./run.bash):

```
bash run.bash
```

Running the above prediction and streaming the output in [stream.bash](./stream.bash):

```
bash stream.bash
```

Running the above prediction and using a local server to receive webhook updates when the prediction is complete in [webhook.bash](./webhook.bash)

```
bash webhook.bash
```