import AgoraRTC, { AREAS } from "agora-rtc-sdk-ng";
import { useRTCClient, AgoraRTCProvider } from "agora-rtc-react";
import { useEffect } from "react";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
import config from "../agora-manager/config";
export function Geofencing() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: config.selectedProduct }));
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

