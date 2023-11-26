# Live streaming over multiple channels
Some special scenarios require streaming over two or more separate channels. Depending on the scenario, the app joins both channels as host, both channels as audience, or one channel as host and the other as audience. For example, consider the case of an online singing contest, where hosts of different channels interact with each other. The audience receives streams from two channels while the contestants broadcast to both channels.

Agora Video SDK multi-channel streaming allows you to join multiple channels at the same time and broadcast or receive audio and video over them. This page shows you how to implement two different multi-channel methods into your app using Video SDK. Choose the method that best fits your particular scenario.

## Understand the tech
Agora Video SDK provides the following approaches to implementing multi-channel streaming:

* **Channel media relay**

    In channel media relay, one channel is used as the source channel from which audio and video is relayed to a second channel called the destination channel. The audience on the destination channel subscribes to the relayed media stream. A host can relay media stream to a maximum of four destination channels. Relaying media streams provides the following benefits:

        * All hosts in the channels can see and hear each other.
        * The audience in the channels can see and hear all hosts.

* **Join multiple channels**

    To join multiple channels, a host first sets up a primary channel and starts an event. The host then joins a second channel and publishes to the new channel. The audience joins either channel and subscribes to the host channel. The two channels are independent and users on one channels don't see users on the other channel. You can extend this functionality to join as many channels as required.

## How to run this project

To see how to run this project, read the instructions in the main [README](../../readme.md) or [SDK quickstart](https://docs-beta.agora.io/en/video-calling/get-started/get-started-sdk).
