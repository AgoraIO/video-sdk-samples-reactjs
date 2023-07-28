import AgoraRTC, { AREAS } from "agora-rtc-sdk-ng";
import AuthenticationWorkflow from "../authentication-workflow/authentication-workflow.tsx";


const useGeofencing = () => {
    AgoraRTC.setArea({
        areaCode: [AREAS.NORTH_AMERICA, AREAS.ASIA]
      })
  };

function Geofencing() {

    useGeofencing();
  return (
    <div>
        <AuthenticationWorkflow title="Geofencing"/>
    </div>
  );
}

export default Geofencing;

