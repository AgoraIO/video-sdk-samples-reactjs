# Screen share, volume control and mute

To use Video SDK for audio and video communication, you implement a simple workflow in your app. The app joins a new or an existing channel using an app ID and an authentication token. If a channel of the given name exists within the context of the app ID, the app joins the channel. If the named channel does not exist, a new channel is created that other users may join. Once the app joins a channel, it subscribes to one or more of the audio and video streams published in the channel. The app also publishes its own audio and video streams that other users in the channel subscribe to. Each user publishes streams that share their captured camera, microphone, and screen data.

This page explains the features that a basic Video Calling app provides:

* **Screen Sharing**

    Enables users in a channel to share what is on their screen with other users in the channel. This technology is useful in several online communication scenarios such as:

    * Sharing a local image or web page for discussion.
    * Showing slides or notes in an online student teacher interaction.
    * Running a third party app for online collaboration or troubleshooting.

* **Switch media input devices**

    A user may plug in, or switch to an alternate input device during a call. The Agora Web SDK provides APIs for managing media devices. Your app receives notification of any device changes enabling you to dynamically switch the audio and video media input devices.

* **Volume control**

    Users in a channel often need to adjust the volume for local and remote audio. For example, they may want to increase the input volume from remote users and decrease the local audio recording volume. You use Video SDK to enable app users to adjust recording and playback volumes. Video SDK also provides methods to mute local audio, audio from a particular remote user, or audio from all remote users. Video SDK provides several methods to manage local and remote audio volumes. These methods enable the user to control:

        * **Recording signal volume**: The volume of the signal recorded by the local user.
        * **Muting video streams**: Stop or resume playing a specified remote or local video.

## Full Documentation

[Agora's product workflow guide](https://docs.agora.io/en/video-calling/develop/product-workflow?platform=web).


