# Agora Video SDK for ReactJS reference app

This app demonstrates use of [Agora's Video SDK](https://docs.agora.io/en/video-calling/get-started/get-started-sdk) for real-time audio and video communication. It is a robust and comprehensive documentation reference app for Android, designed to enhance your productivity and understanding. It's built to be flexible, easily extensible, and beginner-friendly.

Clone the repo, run and test the samples, and use the code in your own project. Enjoy.

- [Samples](#samples)
- [Prerequisites](#prerequisites)
- [Run this project](#run-this-project)
- [Contact](#contact)

## Samples

The runnable code examples are:

- [SDK quickstart](./src/get-started-sdk/README.md) - The minimum code you need to integrate high-quality, low-latency Video 
  Calling features into your app using Video SDK.
- [Authentication Workflow](./src/authentication-workflow/README.md) - Authenticate the current user and channel with a token 
  retrieved from a token server.
- [Connect through restricted networks with Cloud Proxy](./src/cloud-proxy/README.md) - Connect from an environment 
  with a restricted network.
- [Stream media to a channel](./src/play-media/README.md) - Use the media player classes in Video SDK to enable your 
  users to publish media files to a channel.
- [Call quality best practice](./src/ensure-call-quality/README.md) - use Video SDK features to  ensure optimal audio and video quality in your app.
- [Audio and voice effects](./src/audio-and-voice-effects/README.md) - Modify the captured audio to add sound 
  effects, mix in a pre-recorded audio, or change the voice quality. 

- [Geofencing](./src/geofencing/README.md) - Control and customize data routing in your app by specifying the Agora SD-RTN™ 
  region users 
  connect to.

## Prerequisites

Before getting started with this reference app, ensure you have the following set up:

- A [supported browser](../reference/supported-platforms#browsers).
- Physical media input devices, such as a camera and a microphone.
- A JavaScript package manager such as [npm](https://www.npmjs.com/package/npm).

## Run this project

To run the sample projects in this folder, take the following steps:


1. **Clone the repository**

    To clone the repository to your local machine, open Terminal and navigate to the directory where you want to clone the repository. Then, use the following command:

    ```bash
    git clone https://github.com/AgoraIO/video-sdk-samples-reactjs
    ```

1. **Install the dependencies**

    In Terminal, navigate to `video-sdk-samples-reactjs`, and execute the following command.

    ``` bash
    npm install
    ```

1. **Modify the project configuration**

   The app loads connection parameters from the [`config.json`](.`src/agora-manager/config.json`) file. Ensure that the file is populated with the required parameter values before running the application.

    - `uid`: The user ID associated with the application.
    - `appId`: (Required) The unique ID for the application obtained from [Agora Console](https://console.agora.io). 
    - `channelName`: The default name of the channel to join.
    - `rtcToken`: An token generated for `channelName`. You generate a temporary token using the [Agora token builder](https://agora-token-generator-demo.vercel.app/).
    - `serverUrl`: The URL for the token generator. See [Secure authentication with tokens](authentication-workflow) for information on how to set up a token server.
    - `tokenExpiryTime`: The time in seconds after which a token expires.

    If a valid `serverUrl` is provided, all samples use the token server to obtain a token except the **SDK quickstart** project that uses the `rtcToken`. If a `serverUrl` is not specified, all samples except **Secure authentication with tokens** use the `rtcToken` from `config.json`.

1. **Build and run the project**

     In Terminal, run the following command:

    ``` bash
    yarn dev
    ```

1. **Run the samples in the reference app**

   1. Open the project in your browser. The default URL is http://localhost:5173/.

   1. In the dropdown, select this document and test <Vpd k="PRODUCT" />.

## Contact

If you have any questions, issues, or suggestions, please file an issue in our [GitHub Issue Tracker](https://github.com/AgoraIO/video-sdk-samples-reactjs/issues).
