import {SetupVideoSdkEngine, Join} from "../AgoraManager/AgoraManager";
import { AgoraRTCProvider} from "agora-rtc-react";
import { useState } from "react";
import VideoCallUI from "../AgoraManager/AgoraUI";
const GetStartedComponent = (props) => {
  const agoraEngine = SetupVideoSdkEngine();
  const [joined, setJoined] = useState(false);

  const handleJoinAndLeave = () =>
    {
      setJoined(prevJoined => !prevJoined);
    }

  const videoCallUIProps = {
    title: props.title,
    joined: joined,
    showVideo: joined,
    handleJoinAndLeave: handleJoinAndLeave
    // Other props specific to VideoCallUI
  };

  return (
    <div>
      {!joined ? (<VideoCallUI {...videoCallUIProps}></VideoCallUI>) : 
      (
        <AgoraRTCProvider client={agoraEngine}>
          <Join videoCallUIProps={videoCallUIProps} />
        </AgoraRTCProvider>
      )}
    </div>
  );
};

export default GetStartedComponent;