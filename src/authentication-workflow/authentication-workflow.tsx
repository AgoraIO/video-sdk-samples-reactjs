import { useEffect, useState } from "react";
import { GetStarted } from "../get-started-sdk/get-started-sdk.tsx";
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

function AuthenticationWorkflow(props: {title?: string}) {
  const [channelName, setChannelName] = useState<string>("");
  useTokenWillExpire();

  useEffect(() => {
    if (config.serverUrl !== "" && channelName !== "") {
      fetchRTCToken(channelName)
        .then((token: string) => {
          config.rtcToken = token;
          config.channelName = channelName;
          console.log("RTC token fetched from server: ", token);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log("Please make sure you specified the token server URL in the configuration file");
    }
  }, [channelName]);


  return (
    <div>
      <h1>{props.title? props.title: "Secure Communication with an Authentication Token"}</h1>
      <input
        type="text"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        placeholder="Channel name"
      />
      <GetStarted config={{ ...config}} title="" />
    </div>
  );
}

export default AuthenticationWorkflow;

