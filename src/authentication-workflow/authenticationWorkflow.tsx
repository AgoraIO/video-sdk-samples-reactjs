import {
  AgoraRTCProvider,
  useRTCClient
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "./authenticationWorkflowManager.tsx";
export function AuthenticationWorkflow() 
{
  const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <div>
      <h1>Secure Communication with an Authentication Token</h1>
      <AgoraRTCProvider client={client}>
        <AuthenticationWorkflowManager />
      </AgoraRTCProvider>
    </div>
  );
}

export default () => AuthenticationWorkflow();
