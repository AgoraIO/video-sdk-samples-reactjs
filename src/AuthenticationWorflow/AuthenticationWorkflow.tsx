import { useEffect } from "react";
import GetStarted from "../get-started-sdk/get-started-sdk.tsx";
import axios from "axios";
import config from '../config.ts';

async function fetchRTCToken(channelName: string) {
  if (config.serverUrl !== "") {
    try {
      const response = await axios.get(
        `${config.proxyUrl}${config.serverUrl}/rtc/${channelName}/1/uid/${config.uid}/?expiry=${config.tokenExpiryTime}`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      console.log("RTC token fetched from server: ", response.data.rtcToken);
      return response.data.rtcToken;
    } catch (error) {
      console.error(error);
      throw error;
    }
  } else {
    return config.rtcToken;
  }
}

function AuthenticationWorkflow() {
  useEffect(() => {
    fetchRTCToken("hussain").then((token) => {
      config.rtcToken = token;
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <div>
      <h1>Secure authentication with tokens</h1>
      <GetStarted />
    </div>
  );
}

export default AuthenticationWorkflow;
