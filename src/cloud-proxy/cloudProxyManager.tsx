import {
  useRTCClient,
  useClientEvent
} from "agora-rtc-react";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";

const useCloudProxy = () => {
  const agoraEngine = useRTCClient();
  agoraEngine.startProxyServer(3);
  useClientEvent(agoraEngine, "is-using-cloud-proxy", (isUsingProxy) => {
      // Display the proxy server state based on the isUsingProxy Boolean variable.
      if(isUsingProxy == true)
      {
          console.log("Cloud proxy service activated");
      }
      else
      {
          console.log("Proxy service failed")
      }
  });
};
export function CloudProxyManager() 
{
  useCloudProxy();
  return(
    <div>
      <AuthenticationWorkflowManager></AuthenticationWorkflowManager>
    </div>
  )
}

export default CloudProxyManager;



