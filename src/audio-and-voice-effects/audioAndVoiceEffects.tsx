import {
    AgoraRTCProvider,
    useRTCClient
  } from "agora-rtc-react";
  import AgoraRTC from "agora-rtc-sdk-ng";
  import AudioAndVoiceEffectsManager from "./audioAndVoiceEffectsManager.tsx";
  export function AudioAndVoiceEffects() 
  {
    const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  
    return (
      <div>
        <h1>Audio and voice effects</h1>
        <AgoraRTCProvider client={client}>
          <AudioAndVoiceEffectsManager />
        </AgoraRTCProvider>
      </div>
    );
  }
  
  export default () => AudioAndVoiceEffects();