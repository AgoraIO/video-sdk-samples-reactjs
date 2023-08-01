import { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AudioAndVoiceEffectsManager from "./audioAndVoiceEffectsManager.tsx";

function AudioAndVoiceEffects() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <div>
      <h1>Audio and voice effects</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <AudioAndVoiceEffectsManager />
      </AgoraRTCProvider>
    </div>
  );
}

export default AudioAndVoiceEffects;
