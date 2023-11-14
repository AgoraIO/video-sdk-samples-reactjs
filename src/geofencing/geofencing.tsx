import AgoraRTC, { AREAS } from "agora-rtc-sdk-ng";
import { useRTCClient, AgoraRTCProvider } from "agora-rtc-react";
import { useEffect } from "react";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";

export function Geofencing() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  return (
    <div>
      <h1>Geofencing</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <EnableGeofencing />
      </AgoraRTCProvider>
    </div>
  );
}
const useGeofencing = () => {
  useEffect(() => {
    AgoraRTC.setArea({
      areaCode: [AREAS.NORTH_AMERICA, AREAS.ASIA]
    })
  }, []);
};

function EnableGeofencing() {
  useGeofencing();

  return (
    <div>
      <AuthenticationWorkflowManager />
    </div>
  );
}

export default Geofencing

