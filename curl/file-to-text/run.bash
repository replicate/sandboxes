#!/bin/bash

set -eou pipefail
if [ "${DEBUG:-}" != "" ]; then
	set -x
fi

# This demo makes use of the `jq` tool for processing JSON on the command line.
# See: https://jqlang.github.io/jq/
#
# Otherwise if you have NodeJS you can use the following as equivalent:
# json () { node -pe 'JSON.parse(require("fs").readFileSync(0, "utf-8"))'"$@" }
# curl ... | json '.url'

if [ "$REPLICATE_API_TOKEN" == "" ]; then
	echo 'Missing REPLICATE_API_TOKEN set it with `export REPLICATE_API_TOKEN=r8_<your-token-here>`'
	exit 1
fi

image="./image.png"

# First we need to make our file available to Replicate using the files API:
file=$(
	curl -s -X POST "https://api.replicate.com/v1/files" \
		-H "Authorization: Token $REPLICATE_API_TOKEN" \
		-H "Content-Type: multipart/form-data" \
		-F "content=@$image;type=image/png;filename=$image"
)
image_url=$(echo "$file" | jq -r '.urls.get')

input=$(
	cat <<-EOM
		{
			"version": "a0fdc44e4f2e1f20f2bb4e27846899953ac8e66c5886c5878fa1d6b73ce009e5",
			"input": {
				"image": "$image_url",
				"top_p": 1,
				"prompt": "Are you allowed to swim here?",
				"max_tokens": 1024,
				"temperature": 0.2
			}
		}
	EOM
)

echo "Running..."
output=$(
	curl -s -X POST "https://api.replicate.com/v1/predictions" \
		-H "Authorization: Token $REPLICATE_API_TOKEN" \
		-H "Content-Type: application/json" \
		-d "$input"
)

prediction_url=$(echo $output | jq -r '.urls.get')
while true; do
	output=$(curl -s "$prediction_url" -H "Authorization: Token $REPLICATE_API_TOKEN")
	status=$(echo $output | jq -r '.status')
	if [ "$status" == "succeeded" ]; then
		echo $output | jq -r '.output | join("")'
		exit
	fi
	if [ "$status" == "failed" ]; then
		exit 1
	fi
	sleep 2
done
