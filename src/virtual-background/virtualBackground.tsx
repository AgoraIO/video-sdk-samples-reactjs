import { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import VirtualBackgroundManager from "./virtualBackgroundManager";
function VirtualBackground() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <div>
      <h1>Virtual Background</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <VirtualBackgroundManager />
      </AgoraRTCProvider>
    </div>
  );
}

export default VirtualBackground;
