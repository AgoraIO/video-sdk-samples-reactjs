import {
  AgoraRTCProvider,
  useRTCClient
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import EnsureCallQualityManager from "./ensureCallQualityManager";
export function CallQuality() 
{
  const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <div>
      <h1>Call Quality Best Practice</h1>
      <AgoraRTCProvider client={client}>
        <EnsureCallQualityManager />
      </AgoraRTCProvider>
    </div>
  );
}

export default () => CallQuality();
