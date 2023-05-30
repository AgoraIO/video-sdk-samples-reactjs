import React from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";

// Initialize the Agora application ID, token, and channel name
const appId = '';
const channelName = '';
const token = '';

// VideoCall class inherits from AgoraManager
class CloudProxy extends AgoraManager {
  async componentDidMount() {
    // Set the Agora application ID, channel name, and token in the component state
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
    if (this.state.agoraEngine) {
    // Start cloud proxy service in the forced UDP mode.
    this.state.agoraEngine.startProxyServer(3);
    this.state.agoraEngine.on("is-using-cloud-proxy" , isUsingProxy =>
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
}
  }
  // Handler for joining the video call
  handleJoinCall = async () => {
    await this.joinCall();
  };

  // Handler for leaving the video call
  handleLeaveCall = async () => {
    await this.leaveCall();
    this.state.agoraEngine.stopProxyServer();
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

export default CloudProxy;
