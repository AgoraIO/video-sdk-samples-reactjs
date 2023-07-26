import { useEffect, useState } from "react";
import { GetStarted } from "../get-started-sdk/get-started-sdk";
import config from "../config.ts";
import { useClientEvent, useRTCClient } from "agora-rtc-react";

async function fetchRTCToken(channelName: string) {
  if (config.serverUrl !== "") {
    try {
      const response = await fetch(
        `${config.proxyUrl}${config.serverUrl}/rtc/${channelName}/publisher/uid/${config.uid}/?expiry=${config.tokenExpiryTime}`
      );
      const data = await response.json();
      console.log("RTC token fetched from server: ", data.rtcToken);
      return data.rtcToken;
    } catch (error) {
      console.error(error);
      throw error;
    }
  } else {
    return config.rtcToken;
  }
}

const useTokenWillExpire = () => {
  const agoraEngine = useRTCClient();
  useClientEvent(agoraEngine, "token-privilege-will-expire", () => {
    if (config.serverUrl !== "") {
      fetchRTCToken(config.channelName)
        .then((token: string) => {
          console.log("RTC token fetched from server: ", token);
          return agoraEngine.renewToken(token);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log("Please make sure you specified the token server URL in the configuration file");
    }
  });
};

function AuthenticationWorkflow() {
  const [token, setToken] = useState("");
  useTokenWillExpire();

  useEffect(() => {
    fetchRTCToken(config.channelName)
      .then((fetchedToken) => {
        setToken(fetchedToken);
      })
      .catch((error) => {
        setToken("");
        console.error(error);
      });
  }, [config.channelName]);

  if (!token) return <p>Fetching token</p>;

  return (
    <div>
      <GetStarted config={{ ...config, rtcToken: token }} />
    </div>
  );
}

export default AuthenticationWorkflow;
