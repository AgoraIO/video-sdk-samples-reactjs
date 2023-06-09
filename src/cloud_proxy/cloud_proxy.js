import React, {useEffect, useState} from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";

// Initialize the Agora application ID, token, and channel name
const appId = "";
const channelName = "";
const token = "";

const CloudProxyComponent = (props) => {
  const agoraManager = AgoraManager({
    appId: props.appId || appId,
    channelName: props.channelName || channelName,
    token: props.token || token
  });
  const [initialized, setInitialized] = useState(false);


  useEffect(() => 
  {
    setupVideoSDKEngine(); // Initialize Agora SDK engine
  });


// Initialize Agora SDK engine for video
const setupVideoSDKEngine = async () => {
    if(initialized)
    {
        return;
    }
    const agoraEngine = await agoraManager.setupVideoSDKEngine();
    // Start cloud proxy service in the forced UDP mode.
    agoraEngine.startProxyServer(3);
    agoraEngine.on("is-using-cloud-proxy" , isUsingProxy =>
    {
        // Display the proxy server state based on the isUsingProxy Boolean variable.
        if(isUsingProxy)///
        {
            console.log("Cloud proxy service activated");
        }
        else
        {
            console.log("Proxy service failed")
        }
    });
    setInitialized(true);
};
  const handleJoinCall = async () => {
    await agoraManager.joinCall();
  };

  const handleLeaveCall = async () => {
    await agoraManager.leaveCall();
  };
  return (
    <div>
      <VideoCallUI
        title={props.title}
        joined={agoraManager.joined}
        showVideo={agoraManager.showVideo}
        localVideoTrack={agoraManager.localVideoTrack}
        remoteVideoTrack={agoraManager.remoteVideoTrack}
        handleJoinCall={handleJoinCall}
        handleLeaveCall={handleLeaveCall}
      />
    </div>
  );
};

export default CloudProxyComponent;
