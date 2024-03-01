# Replicate Python Example

This project contains four examples for working with file-to-text models hosted on Replicate using the Python SDK.

This example uses [LLaVA 1.5](https://replicate.com/yorickvp/llava-13b?input=python) providing an image file and ask the model to answer a question about the image.

Running a basic prediction by providing an image file ([image.png](./image.png)) in [run.py](./run.py):

```
python run.py
```

Running the above prediction and streaming the output in [stream.py](./webhook.py):

```
python stream.py
```

Running the above prediction using webhooks to avoid polling in [webhook.py](./webhook.py):

```
python webhook.py
```

