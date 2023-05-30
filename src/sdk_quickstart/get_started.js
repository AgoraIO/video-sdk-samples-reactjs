import React from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";

// Initialize the Agora application ID, token, and channel name
var appId = '';
var channelName = '';
var token = '';

// VideoCall class inherits from AgoraManager
class VideoCall extends AgoraManager {
  async componentDidMount() {
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

    // Initialize the AgoraManager
    await this.setupVideoSDKEngine();
  }

  // Handler for joining the video call
  handleJoinCall = async () => {
    await this.joinCall();
  };

  // Handler for leaving the video call
  handleLeaveCall = async () => {
    await this.leaveCall();
  };

  render() {
    const { joined, showVideo, localVideoTrack, remoteVideoTrack } = this.state;

    return (
      // Render the VideoCallUI component with the necessary props
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

export default VideoCall;
