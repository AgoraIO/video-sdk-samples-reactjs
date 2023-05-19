# SDK quickstart

Video Calling enables one-to-one or small-group video chat connections with smooth, jitter-free streaming video. Agora’s Video SDK makes it easy to embed real-time video chat into web, mobile, and native apps.

Thanks to Agora’s intelligent and global Software Defined Real-time Network ([Agora SD-RTN™](https://docs.agora.io/en/video-calling/overview/core-concepts#agora-sd-rtn)), you can rely on the highest available video and audio quality.

This page provides a sample project with best-practice code that illustrates the integration of high-quality, low-latency Video Calling features into an app using Video SDK.

## Understand the tech

This section explains how Video Calling works in an app. Best practice is to implement the following steps:

- *Set a token*: A token is a computer-generated string that authenticates a user when an app joins a channel. For testing purposes in this guide, you generate a temporary token from Agora Console. In a production environment, you need to create an authentication server and retrieve the token from it. See [Implement the authentication workflow](https://docs.agora.io/en/video-calling/develop/authentication-workflow) and [Token generators](https://docs.agora.io/en//video-calling/develop/integrate-token-generation) for details.

- *Join a channel*: Call methods to create an Agora Engine instance and join a channel. A token is generated for a single channel. The apps that pass tokens generated using the same app ID and channel name join the same channel.

- *Send and receive video and audio in the channel*: All users send and receive video and audio streams from all users in the channel.


![Video Calling Web UIKit](./images/video-call.png)

## Prerequisites

In order to get and run the SDK quickstart project sample, you must have:

* Installed [Git](https://git-scm.com/downloads).
- A [supported browser](https://docs.agora.io/en/video-calling/reference/supported-platforms?platform=web#browsers).
- Physical media input devices, such as a camera and a microphone.
- A JavaScript package manager such as [npm](https://www.npmjs.com/package/npm).
- An Agora [account](https://docs.agora.io/en/video-calling/reference/manage-agora-account#create-an-agora-account) and [project](https://docs.agora.io/en/video-calling/reference/manage-agora-account#create-an-agora-project).
- A computer with Internet access.

    Ensure that no firewall is blocking your network communication.

## Project setup

To get the sample project, take the following steps:

1. Clone the Git repository by executing the following command in a terminal window:

    ```bash
    git clone https://github.com/AgoraIO/video-sdk-samples-reactjs
    ```

1. To install the video SDK, open a command prompt in the root directory of the project and run the following command:

    ```bash
    npm i agora-rtc-react
    ```
    if you already cloned the repo and installed the Video SDK, you can skip these steps.


## Implementing a client for Video Calling

When a user attempts to join the channel, you initialize Agora Engine and connect to it.


The following workflow demonstrates these core features:

![image](./images/video-call-logic-android.svg)


This section highlights essential code from the sample project to demonstrate how you can implement the basic Video Calling API call sequence in your own project. The code highlighted on this page is stored in `src/sdk_quickstart/AgoraManager.js`. This file defines the `AgoraManager` class that encapsulates the `AgoraRtc` instance and its core functionality. The code performs the following functions:

1. Imports the `AgoraRTC` library and the React library.

1. Initializes the Agora client and setting up event handlers for remote video track publication and un-publication. To initialize a client, it does the following:

    1. Creates an instance of the engine using the `AgoraRTC.createClient` method. The client is configured with the mode `rtc` and codec `vp8`.
    1. Creates microphone and camera tracks using the `AgoraRTC.createMicrophoneAndCameraTracks`. These tracks allow the local user to capture audio and video.

1. Set ups an event handler to receive the `user-published` and `user-unpublished` events. These events are triggered when a remote user publishes or unpublishes their video track. 

1. Set ups the `joinCall` method to join a channel and publish local tracks. The `joinCall` method:
    1. Retrieves the necessary information from the component state, such as `appId`, `channelName`, `token`, and `uid`.

    1. Joins a channel using the `client.join` method.
    
    1. Publishes the local microphone and camera tracks using the `client.publish`.

1. Set ups the `leaveCall` method to un-publish the local tracks, leave the Agora channel, and reset the component state to its initial values. The `leaveCall` method:

    1. Un-publishes the local microphone and camera tracks by calling `client.unpublish` method.
    1. Leaves the channel by calling the `client.leave` method.
    1. Updates the component state to indicate that the user has left the call and video should no longer be shown. The local and remote video tracks are set to null.

```javascript
import AgoraRTC from "agora-rtc-react";
import React from "react";

class AgoraManager extends React.Component {
  constructor(props) {
    super(props);
    // Initialize the component state with default values
    this.state = {
      client: null,
      microphoneAndCameraTracks: null,
      joined: false,
      appId: null,
      token: null,
      channelName: null,
      localVideoTrack: null,
      remoteVideoTrack: null,
      showVideo: false,
      uid: 0,
    };
  }

  async setupVideoSDKEngine() {
    // Create an Agora client with mode "rtc" and codec "vp8"
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    // Create microphone and camera tracks using AgoraRTC
    const microphoneAndCameraTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    // Set the local video track to the second track in the microphoneAndCameraTracks array
    this.setState({
      client: client,
      microphoneAndCameraTracks: microphoneAndCameraTracks,
      localVideoTrack: microphoneAndCameraTracks[1],
    });

    // Subscribe to the "user-published" event to handle remote video track publication
    client.on("user-published", async (user, mediaType) => {
      if (mediaType === "video") {
        // Subscribe to the remote user's video track
        await client.subscribe(user, mediaType);
        console.log(user.videoTrack);
        // Set the remote video track in the component state
        this.setState({ remoteVideoTrack: user.videoTrack });
      }
    });

    // Handle the "user-unpublished" event to remove remote video track when a user unpublishes
    client.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        // Reset the remote video track in the component state
        this.setState({ remoteVideoTrack: null });
      }
    });
  }

  async joinCall() {
    try {
      const { client, microphoneAndCameraTracks, appId, channelName, token, uid } = this.state;
      // Join the Agora channel using the provided appId, channelName, token, and uid
      await client.join(appId, channelName, token, uid);
      // Publish the microphone and camera tracks
      await client.publish(microphoneAndCameraTracks);
      // Update the component state to indicate that the user has joined the call and video should be shown
      this.setState({
        joined: true,
        showVideo: true,
      }, () => {
        // Call the render method after the state has been updated
        this.render();
      });
    } catch (error) {
      console.error("Failed to join or publish:", error);
    }
  }

  async leaveCall() {
    try {
      const { client, microphoneAndCameraTracks } = this.state;
      // Unpublish the microphone and camera tracks
      await client.unpublish(microphoneAndCameraTracks);
      // Leave the Agora channel
      await client.leave();
      // Reset the component state to its initial values
      this.setState({
        joined: false,
        showVideo: false,
      });
    } catch (error) {
      console.error("Failed to unpublish or leave:", error);
    }
  }

  componentWillUnmount() {
    // Reset the local and remote video tracks in the component state before unmounting
    this.setState({
      localVideoTrack: null,
      remoteVideoTrack: null,
    });
  }
}

export default AgoraManager;
```

## Test your implementation

This section explains how to run the sample project and see the corresponding features in an app. Best practice is to run this project on a physical mobile device, as some simulators may not support the full features of this project.

1. [Generate a temporary token](https://docs.agora.io/en/video-calling/reference/manage-agora-account#generate-a-temporary-token) in Agora Console.

1. In your browser, navigate to the <Link target="_blank" to="{{Global.DEMO_BASIC_VIDEO_CALL_URL}}">Agora web demo</Link> and update _App ID_, _Channel_, and _Token_ with the values for your temporary token, then click **Join**.

1. In `src/sdk_quickstart/get-started.js`, update `appId`, `channelName`, and `token` with your values.

1. To run the project, execute the following command in the terminal:
    
    ```bash
    npm start
    ```
    Use the URL displayed in the terminal to open the app in your browser.

1. Click **Join** to start a call. Now, you can see yourself on the device screen and talk to the remote user using your app.

## Reference

This section contains information that completes the information in this page, or points you to documentation that explains other aspects to this product.

- [Downloads](https://docs.agora.io/en/video-calling/reference/downloads) shows you how to install Video SDK manually.

- For a more complete example, see the <a href="https://github.com/AgoraIO-Community/Agora-RTC-React/tree/master/example">open source Video Calling example project</a> on GitHub.
