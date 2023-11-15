import {
  AgoraRTCProvider,
  useRTCClient
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "./authenticationWorkflowManager.tsx";
import config from "../agora-manager/config.ts";
export function AuthenticationWorkflow() 
{
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: config.selectedProduct }));

  return (
    <div>
      <h1>Secure Communication with an Authentication Token</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <AuthenticationWorkflowManager />
      </AgoraRTCProvider>
    </div>
  );
}

export default () => AuthenticationWorkflow();
