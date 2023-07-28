import AuthenticationWorkflow from "../authentication-workflow/authentication-workflow.tsx";
import { useClientEvent, useRTCClient } from "agora-rtc-react";


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

function CloudProxy() {

    useCloudProxy();
  return (
    <div>
        <AuthenticationWorkflow title="Connect through restricted networks with Cloud Proxy"/>
    </div>
  );
}

export default CloudProxy;

