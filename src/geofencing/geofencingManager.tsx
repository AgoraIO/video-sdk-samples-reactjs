import { useEffect } from "react";
import AgoraRTC, { AREAS } from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";

const useGeofencing = () => {
  useEffect(() => {
    AgoraRTC.setArea({
      areaCode: [AREAS.NORTH_AMERICA, AREAS.ASIA]
    })
  }, []);
};

function GeofencingManager() {
  useGeofencing();

  return (
    <div>
      <AuthenticationWorkflowManager />
    </div>
  );
}

export default GeofencingManager;

