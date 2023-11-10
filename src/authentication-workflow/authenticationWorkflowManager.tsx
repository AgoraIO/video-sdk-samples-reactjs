import { useState } from "react";
import { AgoraManager } from "../agora-manager/agoraManager";
import config from "../agora-manager/config";
import { useClientEvent, useRTCClient } from "agora-rtc-react";

async function fetchRTCToken(channelName: string) {
  if (channelName !== "") {
    try {
      const response = await fetch(
        `${config.proxyUrl}${config.serverUrl}/rtc/${channelName}/publisher/uid/${config.uid}/?expiry=${config.tokenExpiryTime}`
      );
      const data = await response.json() as { rtcToken: string };
      console.log("RTC token fetched from server: ", data.rtcToken);
      return data.rtcToken;
    } catch (error) {
      console.error(error);
      throw error;
    }
  } else {
    console.log("You did not specify a channel name in the input field");
    return config.rtcToken;
  }
}

const useTokenWillExpire = () => {
  const agoraEngine = useRTCClient();
  useClientEvent(agoraEngine, "token-privilege-will-expire", () => {
    if (config.serverUrl !== "") {
      fetchRTCToken(config.channelName)
        .then((token) => {
          console.log("RTC token fetched from server: ", token);
          if (token) return agoraEngine.renewToken(token);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log("Please make sure you specified the token server URL in the configuration file");
    }
  });
};

function AuthenticationWorkflowManager(props: { children?: React.ReactNode }) {
  const [channelName, setChannelName] = useState<string>("");
  const [joined, setJoined] = useState(false);
  useTokenWillExpire();

  const fetchTokenFunction = async () => {
    if (config.serverUrl !== "") {
      try {
        const token = await fetchRTCToken(channelName) as string;
        config.rtcToken = token;
        if(channelName !== "")
        {
          config.channelName = channelName;
        }
        setJoined(true)
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please make sure you specified the token server URL in the configuration file");
    }
  };

  return (
    <div>
      {!joined ? (
        <>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Channel name" />
          <button onClick={()=>void fetchTokenFunction()}>Join</button>
          {props.children}
        </>
      ) : (
        <>
          <button onClick={() => setJoined(false)}>Leave</button>
          <AgoraManager config={config}>
            {props.children}
          </AgoraManager>
        </>
      )}
    </div>
  );
}

export default AuthenticationWorkflowManager;
