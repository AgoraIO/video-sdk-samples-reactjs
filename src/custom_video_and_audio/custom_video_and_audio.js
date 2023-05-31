import React from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";
import AgoraRTC from 'agora-rtc-react';
// Initialize the required variables for Agora integration
const appId = "";
const channelName = "";
const token = "";
class CustomAudioAndVideo extends AgoraManager {
  async componentDidMount() {
    if (this.props.appId && this.props.channelName && this.props.token) {
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
    } else {
      console.error("You did not specify appId, channelName, and token");
    }

    try {
      await this.setupVideoSDKEngine();
      await this.createCustomVideoTrack();
      await this.createCustomAudioTrack();
    } catch (error) {
      console.error("Failed to initialize video call:", error);
    }
  }

  createCustomVideoTrack = async () => {
    try {
      const constraints = { audio: false, video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoTracks = stream.getVideoTracks();
      console.log('Using video device: ' + videoTracks[0].label);
      const customVideoTrack = await AgoraRTC.createCustomVideoTrack({ mediaStreamTrack: videoTracks[0] });
      this.setState({ localVideoTrack: customVideoTrack });
    } catch (error) {
      console.error("Failed to create custom video track:", error);
    }
  };

  createCustomAudioTrack = async () => {
    try {
      const constraints = { audio: true, video: false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const audioTracks = stream.getAudioTracks();
      console.log('Using audio device: ' + audioTracks[0].label);
      const customAudioTrack = await AgoraRTC.createCustomAudioTrack({ mediaStreamTrack: audioTracks[0] });
      this.setState({ localAudioTrack: customAudioTrack });
    } catch (error) {
      console.error("Failed to create custom audio track:", error);
    }
  };

  handleJoinCall = async () => {
    await this.joinCall();
  };

  handleLeaveCall = async () => {
    await this.leaveCall();
  };

  render() {
    const { joined, showVideo, localVideoTrack, remoteVideoTrack } = this.state;

    return (
      <VideoCallUI
        title={this.props.title}
        joined={joined}
        showVideo={showVideo}
        localVideoTrack={localVideoTrack}
        remoteVideoTrack={remoteVideoTrack}
        handleJoinCall={this.handleJoinCall}
        handleLeaveCall={this.handleLeaveCall}
      />
    );
  }
}

export default CustomAudioAndVideo;
