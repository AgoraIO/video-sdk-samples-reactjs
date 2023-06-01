import React from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";
import { SpatialAudioExtension } from 'agora-extension-spatial-audio';
import AgoraRTC from 'agora-rtc-react';

// ...imports

const appId = ''; // Agora App ID
const channelName = ''; // Name of the channel to join
const token = ''; // Token for authentication

class CustomSpatialAudioManager extends AgoraManager {
  constructor(props) {
    super(props);
    this.state = {
      distance: 0,
      isMediaPlaying: false,
      processors: null,
      spatialAudioExtension: null,
      mediaPlayerTrack: null, // A variable to hold the media file track.
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

    if (!this.state.agoraEngine) {
      console.log("Init Engine");
      await this.setupVideoSDKEngine(); // Set up the video SDK engine

      if (this.state.agoraEngine) {
        this.state.agoraEngine.on("user-published", this.handleUserPublished);
      }
    }
    await this.setupSpatial();
  }

  // Event handler for when a user with audio is published
  handleUserPublished = async (user, mediaType) => {
    if (this.state.spatialAudioExtension) {
      const processor = this.state.spatialAudioExtension._createProcessor();

      if (user.hasAudio) {
        this.setState(prevState => ({
          processors: new Map(prevState.processors).set(user.uid.toString(), processor)
        }));

        // Inject the SpatialAudioProcessor into the audio track
        const track = user.audioTrack;
        track.pipe(processor).pipe(track.processorDestination);
        // Play the remote audio track.
        track.play();
      }
    }
  };

  setupSpatial = async () => {
    if (!this.state.spatialAudioExtension) {
      const processors = new SpatialAudioExtension({ assetsPath: '../../node_modules/agora-extension-spatial-audio/external/' });
      this.setState({
        processors: new Map(),
        spatialAudioExtension: processors
      });
      AgoraRTC.registerExtensions([processors]);
    }
  }

  decreaseDistance = () => {
    this.setState(prevState => ({ distance: prevState.distance - 5 }));
    this.updatePosition();
  };

  updatePosition = () => {
    if (this.state.isMediaPlaying) {
      const processor = this.state.processors.get("media-player");
      processor.updatePlayerPositionInfo({
        position: [this.state.distance, 0, 0],
        forward: [1, 0, 0],
      });
    }
    if (this.state.remoteUid) {
      const processor = this.state.processors.get(this.state.remoteUid);
      processor.updateRemotePosition({
        position: [this.state.distance, 0, 0],
        forward: [1, 0, 0],
      });
    }
  };

  increaseDistance = () => {
    this.setState(prevState => ({ distance: prevState.distance + 5 }));
    this.updatePosition();
  };

  localPlayerStart = async () => {
    if (this.state.isMediaPlaying) {
      this.state.mediaPlayerTrack.setEnabled(false);
      this.setState({ isMediaPlaying: false,
      mediaPlayerTrack: null });
      return;
    }

    const processor = this.state.spatialAudioExtension.createProcessor();
    this.setState(prevState => ({
      processors: new Map(prevState.processors).set("media-player", processor)
    }));

    const track = await AgoraRTC.createBufferSourceAudioTrack({
      cacheOnlineFile: false,
      source: "/sampleFile.wav",
    });

    // Define the spatial position for the local audio player.
    const mockLocalPlayerNewPosition = {
      position: [0, 0, 0],
      forward: [0, 0, 0],
    };

    // Update the spatial position for the local audio player.
    processor.updatePlayerPositionInfo(mockLocalPlayerNewPosition);

    track.startProcessAudioBuffer({ loop: true });
    track.pipe(processor).pipe(track.processorDestination);
    track.play();

    this.setState({ isMediaPlaying: true, mediaPlayerTrack: track });
  };

  // Event handler for leaving the call
  handleLeaveCall = async () => {
    if (this.state.isMediaPlaying) {
      this.state.mediaPlayerTrack.setEnabled(false);
      this.setState({ isMediaPlaying: false });
    }
    await this.leaveCall();
  };

  // Event handler for joining the call
  handleJoinCall = async () => {
    await this.joinCall();
  };

  render() {
    const {
      joined,
      showVideo,
      localVideoTrack,
      remoteVideoTrack,
      distance,
      isMediaPlaying
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
              <p>
                {isMediaPlaying ?
                  <button type="button" onClick={this.localPlayerStart}>Stop audio file</button> :
                  <button type="button" onClick={this.localPlayerStart}>Play audio file</button>
                }
              </p>
              <p>
                Distance:
                <button type="button" onClick={this.decreaseDistance}>-</button>
                <label>{distance}</label>
                <button type="button" onClick={this.increaseDistance}>+</button>
              </p>
            </div>
          }
        />
      </div>
    );
  }
}

export default CustomSpatialAudioManager;
