import React from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";
import AgoraRTC from 'agora-rtc-react';

// Initialize the Agora application ID, token, and channel name
var appId = '';
var channelName = '';
var token = '';

// PlayMedia class inherits from AgoraManager
class PlayMedia extends AgoraManager {
  constructor() {
    super();
    this.state = {
      isMediaPlaying: false,
      audioFileTrack: null 
    };
  }

  async componentDidMount() {
    if (this.props.appId && this.props.channelName && this.props.token) {
      this.setState({
        appId: this.props.appId,
        channelName: this.props.channelName,
        token: this.props.token
      });
    } else if (appId && channelName && token) {
      this.setState({
        appId: appId,
        channelName: channelName,
        token: token
      });
    } else {
      console.log('You did not specify appId, channelName, and token');
    }

    // Initialize the AgoraManager
    await this.setupVideoSDKEngine();
  }

  // Handler for joining the video call
  handleJoinCall = async () => {
    await this.joinCall();
  };

  playAudioFile = async () => {
    if (!this.state.isMediaPlaying) {
      if (this.state.joined) { 
        // Create an audio track from a source file
        try {
          const track = await AgoraRTC.createBufferSourceAudioTrack({
            cacheOnlineFile: false,
            source: "/sampleFile.wav",
          });

          this.state.agoraEngine.publish([track]);
          track.startProcessAudioBuffer({ loop: false });
          track.play();

          this.setState({
            isMediaPlaying: true,
            audioFileTrack: track,
          });
        } catch (error) {
          console.error("Failed to play audio file:", error);
        }
      } else {
        console.log('Join a channel first to stream media to the channel');
      }
    } else {
        this.state.agoraEngine.unpublish([this.state.audioFileTrack]);
        this.state.audioFileTrack.close();
        this.setState({ 
          isMediaPlaying: false,
          audioFileTrack: null
        });
    }
  }

  // Handler for leaving the video call
  handleLeaveCall = async () => {
    await this.leaveCall();
    if (this.state.audioFileTrack) {
      this.state.audioFileTrack.close();
      this.setState({
        audioFileTrack: null,
        isMediaPlaying: false
      });
    }
  };

  render() {
    const { joined, showVideo, isMediaPlaying, localVideoTrack, remoteVideoTrack } = this.state;

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
        additionalContent={
          <div>
            {isMediaPlaying ? (
              <button type="button" onClick={this.playAudioFile}>
                Stop audio file
              </button>
            ) : (
              <button type="button" onClick={this.playAudioFile}>
                Play audio file
              </button>
            )}
          </div>
        }
      />
    );      
  }
}

export default PlayMedia;
