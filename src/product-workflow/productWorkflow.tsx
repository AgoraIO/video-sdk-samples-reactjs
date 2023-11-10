import {
  AgoraRTCProvider,
  useRTCClient,
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import ProductWorkflowManager from "./productWorkflowManager";

export function ProductWorkflow() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <div>
      <h1>Screen share, volume control and mute</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <ProductWorkflowManager />
      </AgoraRTCProvider>
    </div>
  );
}

export default ProductWorkflow;
