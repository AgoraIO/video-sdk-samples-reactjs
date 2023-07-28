# Agora Video SDK for ReactJS sample projects

This repository holds the code examples used for the [Agora Video SDK for React ](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=web) documentation. Clone the repo, run and test the samples, and use the code in your own project. Enjoy.

## Samples  

The runnable code examples are:

- [SDK quickstart](./src//get-started-sdk/get-started-sdk.tsx) - The minimum code you need to integrate high-quality, low-latency Video 
  Calling features into your app using Video SDK.
- [Authentication Workflow](./src/AuthenticationWorflow/AuthenticationWorkflow.tsx) - Authenticate the users with an authentication token.


## Run this project

To run the sample projects in this folder, take the following steps:

1. Clone the Git repository by executing the following command in a terminal window:

    ```bash
    git clone https://github.com/AgoraIO/video-sdk-samples-reactjs
    ```

1. To install the video SDK, open a command prompt in the root directory of the project and run the following command:

    ```bash
    npm i agora-rtc-react@2.0.0-alpha.0
    ```

1. In `src/config.json`, replace `appId`, `channelName`, and `rtcToken` with your app ID, channel name , and authentication token.

1. Open a command prompt in the project folder, and run the following command:

    ``` bash
    yarn dev
    ```
    The project opens in your default browser.

1. Open another terminal in the project folder and run the following command to start a proxy server in order to fetch a token:

    ```bash
    node ./utils/proxy.js
    ```

1. Select a sample code from the dropdown that you wish to execute.
