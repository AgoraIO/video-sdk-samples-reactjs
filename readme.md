# Agora Video SDK for ReactJS reference app

This repository holds the code examples used for the [Agora Video SDK for ReactJS ](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=web) documentation. Clone the repo, run and test the samples, and use the code in your own project. Enjoy.

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






## Run this project

To run the sample projects in this folder, take the following steps:

1. Clone the Git repository by executing the following command in a terminal window:

    ```bash
    git clone https://github.com/AgoraIO/video-sdk-samples-reactjs
    ```

1. Install the dependencies:

    In Terminal, navigate to `video-sdk-samples-reactjs`, and execute the following command.

    ``` bash
    npm install
    ```

1. In the `video-sdk-samples-reactjs` reference app, open `src/agora-manager/config.json` and set `appId` to the 
   [AppID](https://docs-beta.agora.io/en/video-calling/reference/manage-agora-account?platform=android#get-the-app-id) of your project.

1. Set the authentication token:
    - **Temporary token**:
        1. Set `rtcToken`  with the value of your [temporary token](https://docs-beta.agora.io/en/video-calling/reference/manage-agora-account?platform=android#generate-a-temporary-token)
    - **Authentication server**:
        1. Setup an [Authentication server](https://docs-beta.agora.io/en/video-calling/get-started/authentication-workflow?platform#create-and-run-a-token-server)
        1. In `config.json`:
       
           1. Set  `rtcToken` to an empty string.
           1. Set `serverUrl` to the base URL of your authentication server. For example, `https://agora-token-service-production-1234.up.railway.app`.
        1. Start a proxy server so this web app can make HTTP calls to fetch a token. In a Terminal instance in the reference app root, run the following command:

             ```bash
             node ./utils/proxy.js
             ```
           
1. Start this reference app.

     In Terminal, run the following command:

    ``` bash
    yarn dev
    ```

1. Open the project in your browser. The default URL is http://localhost:5173/.

1. In the dropdown, select this document and test <Vpd k="PRODUCT" />.

