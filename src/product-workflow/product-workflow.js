import React from "react";
import AgoraManager from "../AgoraHelper/AgoraManager";
import VideoCallUI from "../AgoraHelper/AgoraUI";
import AgoraRTC from "agora-rtc-react";

const appId = '<your app ID>';
const channelName = '<Your channel name>';
const token = '<Your authentication token>';

class ProductWorkflow extends AgoraManager {
  constructor(props) {
    super(props);
    this.state = {
      isSharingEnabled: false,
      isMuteVideo: false,
      screenTrack: null,
      remoteAudioTrack: null
    };
  }

  async componentDidMount() {
    this.setState({
      appId: appId,
      channelName: channelName,
      token: token
    });

    const { client } = this.state;
    if (client == null) {
      await this.setupVideoSDKEngine();
      await this.setupDeviceManager();
    }
  }

  async setupDeviceManager() {
    const { client, localAudioTrack, localVideoTrack } = this.state;
    if (client) {
      // Handle microphone change event
      client.onMicrophoneChanged = async (changedDevice) => {
        if (changedDevice.state === "ACTIVE") {
          localAudioTrack.setDevice(changedDevice.device.deviceId);
        } else if (changedDevice.device.label === localAudioTrack.getTrackLabel()) {
          const oldMicrophones = await client.getMicrophones();
          oldMicrophones[0] && localAudioTrack.setDevice(oldMicrophones[0].deviceId);
        }
      };

      // Handle camera change event
      client.onCameraChanged = async (changedDevice) => {
        if (changedDevice.state === "ACTIVE") {
          localVideoTrack.setDevice(changedDevice.device.deviceId);
        } else if (changedDevice.device.label === localVideoTrack.getTrackLabel()) {
          const oldCameras = await client.getCameras();
          oldCameras[0] && localVideoTrack.setDevice(oldCameras[0].deviceId);
        }
      };
    }
  }

  shareScreen = async () => {
    const {
      localVideoTrack,
      isSharingEnabled,
      microphoneAndCameraTracks,
      screenTrack
    } = this.state;

    if (isSharingEnabled === false) {
      // Create a screen track for screen sharing
      const newScreenTrack = await AgoraRTC.createScreenVideoTrack();
      this.setState({
        isSharingEnabled: true,
        screenTrack: newScreenTrack,
      });

      // Replace the localVideoTrack with the screenTrack
      const screenStreamTrack = newScreenTrack.getMediaStreamTrack();
      localVideoTrack.replaceTrack(screenStreamTrack);
    } else {
      // Stop screen sharing and switch back to the camera track
      screenTrack.close();
      const videoStreamTrack = microphoneAndCameraTracks[1].getMediaStreamTrack();
      localVideoTrack.replaceTrack(videoStreamTrack);
      this.setState({
        isSharingEnabled: false,
        screenTrack: null
      });
    }
  };

  muteVideo = async () => {
    const { isMuteVideo, localVideoTrack } = this.state;
    if (isMuteVideo === false) {
      // Mute the local video
      localVideoTrack.setEnabled(false);
      this.setState({ isMuteVideo: true });
    } else {
      // Unmute the local video
      localVideoTrack.setEnabled(true);
      this.setState({ isMuteVideo: false });
    }
  };

  handleLocalAudioVolumeChange = (evt) => {
    const { localAudioTrack } = this.state;
    const volume = parseInt(evt.target.value);
    console.log('Volume of local audio:', volume);
    localAudioTrack.setVolume(volume);
  };

  handleRemoteAudioVolumeChange = (evt) => {
    const { remoteAudioTrack } = this.state;
    if (remoteAudioTrack === null) {
      const volume = parseInt(evt.target.value);
      console.log('Volume of remote audio:', volume);
      remoteAudioTrack.setVolume(volume);
    } else {
      console.log('No remote user in the channel');
    }
  };

  handleJoinCall = async () => {
    await this.joinCall();
  };

  handleLeaveCall = async () => {
    await this.leaveCall();
  };

  render() {
    const {
      joined,
      showVideo,
      localVideoTrack,
      remoteVideoTrack,
      isSharingEnabled,
      isMuteVideo
    } = this.state;

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
              {isSharingEnabled ?
                <button type="button" onClick={this.shareScreen}>Stop Sharing</button> :
                <button type="button" onClick={this.shareScreen}>Share Screen</button>
              }
              {isMuteVideo ?
                <button type="button" onClick={this.muteVideo}>Unmute Video</button> :
                <button type="button" onClick={this.muteVideo}>Mute Video</button>
              }
              <div>
                <label> Local Audio Level :</label>
                <input type="range" min="0" max="100" step="1" onChange={this.handleLocalAudioVolumeChange} />
              </div>
              <div>
                <label> Remote Audio Level :</label>
                <input type="range" min="0" max="100" step="1" onChange={this.handleRemoteAudioVolumeChange} />
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

export default ProductWorkflow;
