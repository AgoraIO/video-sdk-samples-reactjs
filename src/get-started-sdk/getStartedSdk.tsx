import { useState } from "react";
import {
  AgoraRTCProvider,
  useRTCClient
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import configImport, { configType } from "../agora-manager/config"; // Assuming the config.ts file is in the same directory as App.tsx
import {AgoraManager} from "../agora-manager/agoraManager";
import config from "../agora-manager/config";
interface GetStartedProps {
  title: string;
  config: configType;
}

export function GetStarted(props: GetStartedProps) 
{
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  const [joined, setJoined] = useState(false);

  return (
    <div>
      <h1>{props.title}</h1>
      {!joined ? 
      (
        <button onClick={() => setJoined(true)}>Join</button>
      ) : 
      (
        <AgoraRTCProvider client={agoraEngine}>
          <button onClick={() => setJoined(false)}>Leave</button>
          <AgoraManager config={config}>
          </AgoraManager>
        </AgoraRTCProvider>
      )}
    </div>
  );
}

export default () => GetStarted({ config: configImport, title: "" });
