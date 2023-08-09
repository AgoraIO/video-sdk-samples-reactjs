import GeofencingManager from "./geofencingManager";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useRTCClient, AgoraRTCProvider } from "agora-rtc-react";

export function Geofencing() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  return (
    <div>
      <h1>Geofencing</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <GeofencingManager />
      </AgoraRTCProvider>
    </div>
  );
}

export default Geofencing
