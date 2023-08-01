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

1. Install the dependencies:

    In Terminal, navigate to `video-sdk-samples-reactjs`, and execute the following command.

    ``` bash
    npm install
    ```


1. In `src/config.json`, update the values of `appID`, `channelName`, and `token` with the values for your temporary token.

1. In Terminal, run the following command:

    ``` bash
    yarn dev
    ```
    The project opens in your default browser.

1. Open another terminal in the project folder and run the following command to start a proxy server in order to fetch a token:

    ```bash
    node ./utils/proxy.js
    ```

1. In the dropdown, select a sample you want to run and test the code.
