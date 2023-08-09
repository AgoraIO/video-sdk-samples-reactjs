import AgoraRTC from "agora-rtc-sdk-ng";
import { useRTCClient, AgoraRTCProvider } from "agora-rtc-react";
import AINoiseReductionManager from "./aiNoiseSuppressionManager";

export function AINoiseReduction() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  
  return (
    <div>
      <h1>AI Noise Suppression</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <AINoiseReductionManager />
      </AgoraRTCProvider>
    </div>
  );
}

export default AINoiseReduction;
