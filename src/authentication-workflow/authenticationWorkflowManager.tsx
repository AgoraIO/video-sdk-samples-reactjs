import { useEffect, useState } from "react";
import { AgoraManager } from "../agora-manager/agoraManager.tsx";
import config from "../agora-manager/config.ts";
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

function AuthenticationWorkflowManager(props: { children?: React.ReactNode }) {
  const [channelName, setChannelName] = useState<string>("");
  const [joined, setJoined] = useState(false);
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
      {!joined ? (
        <>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Channel name"
          />
          <button onClick={() => setJoined(true)}>Join</button>
          {props.children}
        </>
      ) : (
        <>
          <button onClick={() => setJoined(false)}>Leave</button>
          {props.children}
          <AgoraManager config={config} />
        </>
      )}
    </div>
  );
}

export default AuthenticationWorkflowManager;
