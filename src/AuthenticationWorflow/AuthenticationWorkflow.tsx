import { useEffect } from "react";
import GetStarted from "../get-started-sdk/get-started-sdk";
import axios from "axios";
import config from '../config.json';

async function FetchToken() {
  if(config.serverUrl)
  try {
    const response = await axios.get(`${config.serverUrl}/rtc/${config.channelName}/1/uid/${config.uid}/?expiry=${config.tokenExpiryTime}`);
    console.log(response.data.rtcToken);
    config.rtcToken = response.data.rtcToken; // Update the token in the config file
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function AuthenticationWorkflow() {
  useEffect(() => {
    FetchToken().catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <div>
      <GetStarted />
    </div>
  );
}

export default AuthenticationWorkflow;
