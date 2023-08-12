import { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import SpatialAudioManager from "./spatialAudioManager";
function SpatialAudio() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <div>
      <h1>Spatial Audio Extension</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <SpatialAudioManager />
      </AgoraRTCProvider>
    </div>
  );
}

export default SpatialAudio;
