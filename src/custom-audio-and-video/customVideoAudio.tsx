import { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import CustomVideoAndAudioManager from "./customVideoAudioManager";

function CustomVideoAndAudio() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <div>
      <h1>Custom video and audio sources</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <CustomVideoAndAudioManager />
      </AgoraRTCProvider>
    </div>
  );
}

export default CustomVideoAndAudio;
