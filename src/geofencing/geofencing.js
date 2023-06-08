import React, { useEffect, useState } from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";
import AgoraRTC from "agora-rtc-react";

// Initialize the Agora application ID, token, and channel name
const appId = "";
const channelName = "";
const token = "";

const GeoFencing = (props) => {
  const agoraManager = AgoraManager({
    appId: props.appId || appId,
    channelName: props.channelName || channelName,
    token: props.token || token
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setupVideoSDKEngine(); // Initialize Agora SDK engine
  }, []);

  // Initialize Agora SDK engine for video
  const setupVideoSDKEngine = async () => {
    if (!initialized) {
      await agoraManager.setupVideoSDKEngine();
      // Your app will only connect to Agora SD-RTN located in North America.
      AgoraRTC.setArea({ areaCode: "NORTH_AMERICA" });
      // You can use [] to include more than one region.
      setInitialized(true);
    }
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

export default GeoFencing;
