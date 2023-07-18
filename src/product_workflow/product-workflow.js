/*import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";

const ProductWorkflowComponent = (props) => {
  // State variables
  const [isSharingEnabled, setSharingEnabled] = useState(false);
  const [isMuteVideo, setMuteVideo] = useState(false);
  const [screenTrack, setScreenTrack] = useState(null);
  const [agoraEngine,setAgoraEngine] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize AgoraManager instance
  const agoraManager = AgoraManager({
    appId: props.appId || "",
    channelName: props.channelName || "",
    token: props.token || ""
  });

  // Run this effect only once on component mount
  useEffect(() => {
    setupVideoSDKEngine(); // Initialize Agora SDK engine
  });

  // Initialize Agora SDK engine for video
  const setupVideoSDKEngine = async () => {
    if (!initialized) {
      var engine =  await agoraManager.setupVideoSDKEngine();
      if (engine !== null) {
        setInitialized(true);
        setAgoraEngine(engine);
        await setupDeviceManager();
      }
    }
  };

  const setupDeviceManager = async () => 
  {
    if (agoraEngine) 
    {
      // Handle microphone change event
      agoraEngine.onMicrophoneChanged = async (changedDevice) => {
        if (changedDevice.state === "ACTIVE") {
          agoraManager.localAudioTrack.setDevice(changedDevice.device.deviceId);
        } else if (changedDevice.device.label === agoraManager.localAudioTrack.getTrackLabel()) {
          const oldMicrophones = await agoraEngine.getMicrophones();
          oldMicrophones[0] && agoraManager.localAudioTrack.setDevice(oldMicrophones[0].deviceId);
        }
    };

      // Handle camera change event
      agoraEngine.onCameraChanged = async (changedDevice) => {
        if (changedDevice.state === "ACTIVE") {
          agoraManager.localVideoTrack.setDevice(changedDevice.device.deviceId);
        } else if (changedDevice.device.label === agoraManager.localVideoTrack.getTrackLabel()) {
          const oldCameras = await agoraEngine.getCameras();
          oldCameras[0] && agoraManager.localVideoTrack.setDevice(oldCameras[0].deviceId);
        }
      };
    }
  }

  const shareScreen = async () => {

    if (isSharingEnabled === false) {
      // Create a screen track for screen sharing
      const newScreenTrack = await AgoraRTC.createScreenVideoTrack();
      setScreenTrack(newScreenTrack);

      // Replace the localVideoTrack with the screenTrack
      const screenStreamTrack = newScreenTrack.getMediaStreamTrack();
      agoraManager.localVideoTrack.replaceTrack(screenStreamTrack);
      setSharingEnabled(true);
    } else {
      // Stop screen sharing and switch back to the camera track
      screenTrack.close();
      let cameraVideoTrack = AgoraRTC.createCameraVideoTrack();
      agoraManager.localVideoTrack = cameraVideoTrack;
      setSharingEnabled(false);
      setScreenTrack(null);

    }
  };

const muteVideo = async () => {
    if (isMuteVideo === false) {
      // Mute the local video
      agoraManager.localVideoTrack.setEnabled(false);
      setMuteVideo(true);
    } else {
      // Unmute the local video
      agoraManager.localVideoTrack.setEnabled(true);
      setMuteVideo(false);
    }
  };

const handleLocalAudioVolumeChange = (evt) => 
{
    const volume = parseInt(evt.target.value);
    console.log('Volume of local audio:', volume);
    agoraManager.localAudioTrack.setVolume(volume);
  };

  const handleRemoteAudioVolumeChange = (evt) => 
  {
    if (agoraManager.remoteAudioTrack) {
      const volume = parseInt(evt.target.value);
      console.log('Volume of remote audio:', volume);
      agoraManager.remoteAudioTrack.setVolume(volume);
    } else {
      console.log('No remote user in the channel');
    }
  };

  // Handler for leaving a call
  const handleLeaveCall = async () => {
    await agoraManager.leaveCall();
    if(screenTrack)
    {
        screenTrack.close();
        setScreenTrack(null);
    }
    if(isSharingEnabled)
    {
        setSharingEnabled(false);
    }
  };

  // Handler for joining a call
  const handleJoinCall = async () => {
    await agoraManager.joinCall();
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
        additionalContent={
            <div>
            {isSharingEnabled ?
              <button type="button" onClick={shareScreen}>Stop Sharing</button> :
              <button type="button" onClick={shareScreen}>Share Screen</button>
            }
            {isMuteVideo ?
              <button type="button" onClick={muteVideo}>Unmute Video</button> :
              <button type="button" onClick={muteVideo}>Mute Video</button>
            }
            <div>
              <label> Local Audio Level :</label>
              <input type="range" min="0" max="100" step="1" onChange={handleLocalAudioVolumeChange} />
            </div>
            <div>
              <label> Remote Audio Level :</label>
              <input type="range" min="0" max="100" step="1" onChange={handleRemoteAudioVolumeChange} />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ProductWorkflowComponent
*/