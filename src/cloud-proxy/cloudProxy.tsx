import AgoraRTC from "agora-rtc-sdk-ng";
import { useRTCClient, AgoraRTCProvider, useClientEvent } from "agora-rtc-react";
import {useEffect} from 'react';
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
export function CloudProxy() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  
  return (
    <div>
      <h1>Connect through restricted networks with Cloud Proxy</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <EnableCloudProxy/>
      </AgoraRTCProvider>
    </div>
  );
}
const useCloudProxy = () => {
  const agoraEngine = useRTCClient();
  useEffect(() => {
    agoraEngine.startProxyServer(3);
  }, []);

  useClientEvent(agoraEngine, "is-using-cloud-proxy", (isUsingProxy) => {
    // Display the proxy server state based on the isUsingProxy Boolean variable.
    if (isUsingProxy == true) {
      console.log("Cloud proxy service activated");
    } else {
      console.log("Proxy service failed")
    }
  });
};

export function EnableCloudProxy() {
  useCloudProxy();
  return (
    <div>
      <AuthenticationWorkflowManager />
    </div>
  )
}


export default CloudProxy
