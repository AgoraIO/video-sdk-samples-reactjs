import CloudProxyManager from "./cloudProxyManager";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useRTCClient, AgoraRTCProvider } from "agora-rtc-react";

export function CloudProxy()
{

    const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
    return (
      <div>
        <h1>Connect through restricted networks with Cloud Proxy</h1>
        <AgoraRTCProvider client={client}>
          <CloudProxyManager />
        </AgoraRTCProvider>
      </div>
    );
}

export default CloudProxy
