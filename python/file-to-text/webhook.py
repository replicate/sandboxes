import replicate
from aiohttp import web
import socket
import asyncio


async def main():
    # Create a Queue to handle the webhook events.
    webhook_queue = asyncio.Queue(1)

    # NOTE: The sandbox must be unlisted/public for the callback to work without auth
    port = 8000
    root = f"https://{socket.gethostname()}-{port}.csb.app"
    callback = f"{root}/callback/replicate"

    # Create a python webserver using aiohttp to handle the webhook and push
    # the completed prediction into our queue.
    routes = web.RouteTableDef()

    @routes.post('/callback/replicate')
    async def callback_replicate(request):
        prediction = await request.json()
        await webhook_queue.put(prediction)
        return web.Response(text="OK")

    app = web.Application()
    app.add_routes(routes)

    # Start the webserver.
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, port=port)
    await site.start()

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
    await replicate.predictions.async_create(
        version="a0fdc44e4f2e1f20f2bb4e27846899953ac8e66c5886c5878fa1d6b73ce009e5",
        input=input,
        webhook=callback,
        webhook_events_filter=["completed"]
    )

    # Wait for the webhook event to complete and output the prediction.
    prediction = await webhook_queue.get()
    print("".join(prediction.get('output')))

    await site.stop()

asyncio.run(main())
