import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";

const CallQualityComponent = (props) => {
  // State variables
  const [isDeviceTestRunning, setDeviceTestRunning] = useState(false);
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [agoraEngine, setAgoraEngine] = useState(null);
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
    if (!initialized) 
    {
      const engine =  await agoraManager.setupVideoSDKEngine();
      setAgoraEngine(engine);
      if (agoraEngine) {
        setInitialized(true);
        enableCallQualityFeatures(); // Enable call quality features
        getAudioAndVideoDevices(); // Fetch available audio and video devices
      }
    }
  };

  // Handler for joining a call
  const handleJoinCall = async () => {
    await agoraManager.joinCall();
  };

  // Fetch available audio and video devices
  const getAudioAndVideoDevices = async () => {
    try {
      const devices = await AgoraRTC.getDevices();
      const audioDevices = devices.filter(device => device.kind === "audioinput");
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      setAudioDevices(audioDevices);
      setVideoDevices(videoDevices);
    } catch (error) {
      console.log("Error getting audio and video devices:", error);
    }
  };

  // Enable call quality features
  const enableCallQualityFeatures = async () => {
    if (agoraEngine) {
      const localVideoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: {
          optimizationMode: "detail",
          width: 640,
          height: { ideal: 480, min: 400, max: 500 },
          frameRate: 15,
          bitrateMin: 600,
          bitrateMax: 1000
        }
      });

      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({ encoderConfig: "high_quality_stereo" });
      agoraEngine.enableDualStream();
      agoraManager.setMicrophoneAndCameraTracks([localAudioTrack, localVideoTrack]);

      // Event listeners for connection state change, network quality, and user-published
      agoraEngine.on("connection-state-change", (curState, prevState, reason) => {
        console.log("Connection state has changed to: " + curState);
        console.log("Connection state was: " + prevState);
        console.log("Connection state change reason: " + reason);
      });

      agoraEngine.on("network-quality", (quality) => {
        // Update network quality UI
        const upLinkIndicator = document.getElementById("QIndicator");
        if (quality.uplinkNetworkQuality === 1) {
          upLinkIndicator.innerHTML = "Network: Excellent";
          upLinkIndicator.style.color = "green";
        } else if (quality.uplinkNetworkQuality === 2) {
          upLinkIndicator.innerHTML = "Network: Good";
          upLinkIndicator.style.color = "yellow";
        } else if (quality.uplinkNetworkQuality >= 3) {
          upLinkIndicator.innerHTML = "Network: Poor";
          upLinkIndicator.style.color = "red";
        }
      });

      agoraEngine.on("user-published", async (user, mediaType) => {
        if (mediaType === "video") {
          agoraEngine.setStreamFallbackOption(user.uid, 1);
        }
      });
    }
  };

  // Show call statistics
  const showStatistics = async () => {
    if (agoraEngine) {
      const localAudioStats = agoraEngine.getLocalAudioStats();
      console.log(localAudioStats);
      // Log local audio stats

      const localVideoStats = agoraEngine.getLocalVideoStats();
      console.log(localVideoStats);
      // Log local video stats

      const rtcStats = agoraEngine.getRTCStats();
      console.log(rtcStats);
      // Log channel statistics

      if (agoraManager.remoteUid !== null) {
        const remoteAudioStats = agoraEngine.getRemoteAudioStats()[agoraManager.remoteUid];
        console.log(remoteAudioStats);
        // Log remote audio stats

        const remoteVideoStats = agoraEngine.getRemoteVideoStats()[agoraManager.remoteUid];
        console.log(remoteVideoStats);
        // Log remote video stats
      } else {
        console.log("To view statistics of remote users, click 'Show Statistics' when a remote user joins the channel");
      }
    } else {
      console.log("Local Agora engine not initialized");
    }
  };

  // Start or stop testing audio/video devices
  const startDeviceTest = async () => {
    if (!agoraManager.joined) {
      console.log("Join a channel to test your audio/video devices");
      return;
    }

    if (!isDeviceTestRunning) {
      const videoTrack = await AgoraRTC.createCameraVideoTrack({ cameraId: videoDevices[0].deviceId });
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({ microphoneId: audioDevices[0].deviceId });

      await agoraEngine.unpublish();
      agoraEngine.publish([audioTrack, videoTrack]);
      setDeviceTestRunning(true);
    } else {
      await agoraEngine.unpublish();
      setDeviceTestRunning(false);
      await agoraEngine.publish(agoraManager.microphoneAndCameraTracks);
    }
  };

  // Handler for leaving a call
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
        additionalContent={
          <div>
            <div>
              <button type="button" id="statistics" onClick={showStatistics}>Show Statistics</button>
              {isDeviceTestRunning ? (
                <button type="button" id="testDevices" onClick={startDeviceTest}>Stop Device Test</button>
              ) : (
                <button type="button" id="testDevices" onClick={startDeviceTest}>Start Device Test</button>
              )}
            </div>
            <div>
              <label>Audio Input:</label>
              <select id="audioDevicesDropdown">
                {audioDevices.map((device, index) => (
                  <option key={index} value={device.deviceId}>{device.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Video Input:</label>
              <select id="videoDevicesDropdown">
                {videoDevices.map((device, index) => (
                  <option key={index} value={device.deviceId}>{device.label}</option>
                ))}
              </select>
            </div>
            <div id="QIndicator"></div>
          </div>
        }
      />
    </div>
  );
};

export default CallQualityComponent
