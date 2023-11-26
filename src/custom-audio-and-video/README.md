# Custom video and audio sources
By default, Video SDK uses the basic audio and video modules on the device your app runs on. However, there are certain scenarios where you want to integrate a custom audio or video source into your app, such as:

* Your app has its own audio or video module.
* You want to use a non-camera source, such as recorded screen data.
* You need to process the captured audio or video with a pre-processing library for audio or image enhancement.
* You need flexible device resource allocation to avoid conflicts with other services.

## Understand the tech

To set an external audio or video source, you configure the Agora Engine before joining a channel. To manage the capture and processing of audio and video frames, you use methods from outside the Video SDK that are specific to your custom source. Video SDK enables you to push processed audio and video data to the subscribers in a channel.

## How to run this project
To see how to run this project, read the instructions in the main [README](../../readme.md) or [SDK quickstart](https://docs-beta.agora.io/en/video-calling/get-started/get-started-sdk).