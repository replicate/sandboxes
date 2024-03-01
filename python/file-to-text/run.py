import replicate

image = "./image.png"
input = {
    # NOTE: We must pass 'rb' to read the file as binary.
    "image": open(image, 'rb'),
    "top_p": 1,
    "prompt": "Are you allowed to swim here?",
    "max_tokens": 1024,
    "temperature": 0.2,
}
print(f"input image: {image}, prompt: {input['prompt']}")

print("Running...")
output = replicate.run(
    "yorickvp/llava-13b:a0fdc44e4f2e1f20f2bb4e27846899953ac8e66c5886c5878fa1d6b73ce009e5",
    input=input
)
print("".join(output))
