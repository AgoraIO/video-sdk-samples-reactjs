import React from "react";
import AgoraManager from "../AgoraHelper/AgoraManager";
import VideoCallUI from "../AgoraHelper/AgoraUI";
import AgoraRTC from "agora-rtc-react";

const appId = '<App ID>'; // Agora App ID
const channelName = '<Channel name>'; // Name of the channel to join
const token = '<Your authentication token>'; // Token for authentication

class EnsureCallQuality extends AgoraManager {
  constructor(props) {
    super(props);
    this.state = {
      isHighRemoteVideoQuality: false,
      isDeviceTestRunning: false,
      audioDevices: [],
      videoDevices: [],
    };
  }

  async componentDidMount() {
    this.setState({
      appId: appId,
      channelName: channelName,
      token: token
    });
    const {agoraEngine} = this.state;
    if (!agoraEngine) {
      console.log("Init Engine");
      await this.setupVideoSDKEngine(); // Set up the video SDK engine
      this.enableCallQualityFeatures(); // Enable call quality features
      this.getAudioAndVideoDevices(); // Get available audio and video devices
    }
  }
  
  async getAudioAndVideoDevices() {
    try {
      const devices = await AgoraRTC.getDevices();
      const audioDevices = devices.filter(device => device.kind === "audioinput");
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      this.setState({
        audioDevices: audioDevices,
        videoDevices: videoDevices
      });
    } catch (error) {
      console.log("Error getting audio and video devices:", error);
    }
  }

  // Enable call quality features
  async enableCallQualityFeatures() {
    const { agoraEngine } = this.state;
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
      agoraEngine.enableDualStream(); // Enable dual stream for the client

      this.setState({
        localVideoTrack: localVideoTrack,
        microphoneAndCameraTracks: [localAudioTrack, localVideoTrack]
      });

      // Event listeners for connection state change and network quality
      agoraEngine.on("connection-state-change", (curState, prevState, reason) => {
        console.log("Connection state has changed to: " + curState);
        console.log("Connection state was: " + prevState);
        console.log("Connection state change reason: " + reason);
      });

      agoraEngine.on("network-quality", (quality) => {
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

      // Event listener for user-published event
      agoraEngine.on("user-published", async (user, mediaType) => {
        if (mediaType === "video") {
          agoraEngine.setStreamFallbackOption(user.uid, 1); // Set stream fallback option for video
        }
      });
    }
  }

  // Display statistics
  showStatistics = async () => {
    const { agoraEngine, remoteUid } = this.state;
    if (agoraEngine) {
      // Display local audio, video, and channel statistics
      const localAudioStats = agoraEngine.getLocalAudioStats();
      console.log("Local audio stats = { sendBytes :" + localAudioStats.sendBytes + ", sendBitrate :" + localAudioStats.sendBitrate + ", sendPacketsLost :" + localAudioStats.sendPacketsLost + " }");
      const localVideoStats = agoraEngine.getLocalVideoStats();
      console.log("Local video stats = { sendBytes :" + localVideoStats.sendBytes + ", sendBitrate :" + localVideoStats.sendBitrate + ", sendPacketsLost :" + localVideoStats.sendPacketsLost + " }");
      const rtcStats = agoraEngine.getRTCStats();
      console.log("Channel statistics = { UserCount :" + rtcStats.UserCount + ", OutgoingAvailableBandwidth :" + rtcStats.OutgoingAvailableBandwidth + ", RTT :" + rtcStats.RTT + " }");

      if (remoteUid === null) {
        // Display remote audio and video statistics
        const remoteAudioStats = agoraEngine.getRemoteAudioStats()[remoteUid];
        console.log("Remote audio stats = { receiveBytes :" + remoteAudioStats.receivedBytes + ", receiveBitrate :" + remoteAudioStats.receiveBitrate + ", receivePacketsLost :" + remoteAudioStats.receivePacketsLost + " }");
        const remoteVideoStats = agoraEngine.getRemoteVideoStats()[remoteUid];
        console.log("Local video stats = { receiveBytes :" + remoteVideoStats.receiveBytes + ", receiveBitrate :" + remoteVideoStats.receiveBitrate + ", receivePacketsLost :" + remoteVideoStats.receivePacketsLost + " }");
      } else {
        console.log("To view statistics of remote users, click 'Show Statistics' when a remote user joins the channel");
      }
    }
  }

  // Join call handler
  handleJoinCall = async () => {
    await this.joinCall();
  };

  // Start/Stop device test handler
  startDeviceTest = async () => {
    const { agoraEngine, joined, isDeviceTestRunning, microphoneAndCameraTracks, videoDevices, audioDevices } = this.state;

    if (!joined) {
      console.log("Join a channel to test your audio/video devices");
      return;
    }

    // Create tracks using the selected devices and publish tracks in the channel.
    if (!isDeviceTestRunning) 
    {
      const videoTrack = await AgoraRTC.createCameraVideoTrack({ cameraId: videoDevices[0].deviceId });
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({ microphoneId: audioDevices[0].deviceId });
      await agoraEngine.unpublish();

      this.setState({
        microphoneAndCameraTracks: [audioTrack, videoTrack],
        isDeviceTestRunning: true
      });

      await agoraEngine.publish(microphoneAndCameraTracks);
    } else 
    {
      console.log(false);
      await agoraEngine.unpublish();
      this.setState({
        isDeviceTestRunning: false,
        microphoneAndCameraTracks: await AgoraRTC.createMicrophoneAndCameraTracks()
      });

      await agoraEngine.publish(microphoneAndCameraTracks);
    }
  }

  // Leave call handler
  handleLeaveCall = async () => {
    await this.leaveCall();
  };

  render() {
    const { joined, audioDevices, videoDevices,showVideo, localVideoTrack, remoteVideoTrack, isDeviceTestRunning } = this.state;

    return (
      <div>
        <VideoCallUI
          joined={joined}
          showVideo={showVideo}
          localVideoTrack={localVideoTrack}
          remoteVideoTrack={remoteVideoTrack}
          handleJoinCall={this.handleJoinCall}
          handleLeaveCall={this.handleLeaveCall}
          additionalContent={
            <div>
              <div>
                <button type="button" id="statistics" onClick={this.showStatistics}>Show Statistics</button>
                {isDeviceTestRunning ?
                  <button type="button" id="testDevices" onClick={this.startDeviceTest}>Stop Device Test</button> :
                  <button type="button" id="testDevices" onClick={this.startDeviceTest}>Start Device Test</button>
                }
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
  }
}

export default EnsureCallQuality;
