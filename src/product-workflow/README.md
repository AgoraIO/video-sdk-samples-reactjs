# Screen share, volume control and mute

To use Video SDK for audio and video communication, you implement a simple workflow in your app. The app joins a new or an existing channel using an app ID and an authentication token. If a channel of the given name exists within the context of the app ID, the app joins the channel. If the named channel does not exist, a new channel is created that other users may join. Once the app joins a channel, it subscribes to one or more of the audio and video streams published in the channel. The app also publishes its own audio and video streams that other users in the channel subscribe to. Each user publishes streams that share their captured camera, microphone, and screen data.

The basics of joining and leaving a channel are presented in the <Link to="../get-started/get-started-sdk">SDK quickstart</Link> project for Interactive Live Streaming. This document explains the common workflows you need to handle in your app.

## Understand the tech

For context on this sample, and a full explanation of the essential code snippets used in this project, read [Stream media to a channel](https://docs-beta.agora.io/en/video-calling/develop/play-media?platform=react-js).

## How to run this project

To see how to run this project, read the instructions in the main [README](../../readme.md) or [SDK quickstart](https://docs-beta.agora.io/en/video-calling/get-started/get-started-sdk).


