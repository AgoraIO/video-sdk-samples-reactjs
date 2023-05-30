import React from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";
import AgoraRTC from "agora-rtc-react";

const appId = '';
const channelName = '';
const token = '';

class ProductWorkflowComponent extends AgoraManager {
  constructor(props) 
  {
    super(props);
    this.state = 
    {
      isSharingEnabled: false,
      isMuteVideo: false,
      screenTrack: null,
      remoteAudioTrack: null
    };
    this.screenTrackRef = React.createRef();
  }

  async componentDidMount() 
  {
    // If props values are not available or empty, use local variables
    if(this.props.appId && this.props.channelName && this.props.token)
    {
      this.setState({
        appId: this.props.appId,
        channelName: this.props.channelName,
        token: this.props.token
      });
    }
    else if(appId && channelName && token)
    {
      this.setState({
        appId: appId,
        channelName: channelName,
        token: token
      });
    }
    else{
      console.log('You did not specify appId, channelName, and token');
    }

    const { agoraEngine } = this.state;
    if (agoraEngine == null) {
      console.log("Init Engine");
      await this.setupVideoSDKEngine();
      await this.setupDeviceManager();
    }
  }

  async setupDeviceManager() {
    const { agoraEngine, localAudioTrack, localVideoTrack } = this.state;
    if (agoraEngine) {
      // Handle microphone change event
      agoraEngine.onMicrophoneChanged = async (changedDevice) => {
        if (changedDevice.state === "ACTIVE") {
          localAudioTrack.setDevice(changedDevice.device.deviceId);
        } else if (changedDevice.device.label === localAudioTrack.getTrackLabel()) {
          const oldMicrophones = await agoraEngine.getMicrophones();
          oldMicrophones[0] && localAudioTrack.setDevice(oldMicrophones[0].deviceId);
        }
      };

      // Handle camera change event
      agoraEngine.onCameraChanged = async (changedDevice) => {
        if (changedDevice.state === "ACTIVE") {
          localVideoTrack.setDevice(changedDevice.device.deviceId);
        } else if (changedDevice.device.label === localVideoTrack.getTrackLabel()) {
          const oldCameras = await agoraEngine.getCameras();
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
    if (remoteAudioTrack) {
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
          title={this.props.title}
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

export default ProductWorkflowComponent;
