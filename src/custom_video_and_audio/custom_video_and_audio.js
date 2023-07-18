/*import React, { useEffect, useState } from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";
import AgoraRTC from "agora-rtc-sdk-ng";

// Initialize the Agora application ID, token, and channel name
const appId = "";
const channelName = "";
const token = "";

const CustomAudioAndVideo = (props) => {
  const agoraManager = AgoraManager({
    appId: props.appId || appId,
    channelName: props.channelName || channelName,
    token: props.token || token
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setupVideoSDKEngine(); // Initialize Agora SDK engine
  }, []);

  // Create custom audio and video tracks using the user's media devices
  const createCustomAudioAndVideoTracks = async () => {
    try {
      const constraints = { audio: true, video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const audioTracks = stream.getAudioTracks();
      const videoTracks = stream.getVideoTracks();
      console.log('Using audio device: ' + audioTracks[0].label);
      console.log('Using video device: ' + videoTracks[0].label);
      const customAudioTrack = await AgoraRTC.createCustomAudioTrack({ mediaStreamTrack: audioTracks[0] });
      const customVideoTrack = await AgoraRTC.createCustomVideoTrack({ mediaStreamTrack: videoTracks[0] });
      agoraManager.setMicrophoneAndCameraTracks([customAudioTrack, customVideoTrack]);
    } catch (error) {
      console.error("Failed to create custom audio track:", error);
    }
  };

  // Initialize Agora SDK engine for video
  const setupVideoSDKEngine = async () => {
    if (!initialized) {
      await agoraManager.setupVideoSDKEngine();
      setInitialized(true);
      try {
        await createCustomAudioAndVideoTracks();
      } catch (error) {
        console.error("Failed to initialize video call:", error);
      }
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

export default CustomAudioAndVideo;
*/