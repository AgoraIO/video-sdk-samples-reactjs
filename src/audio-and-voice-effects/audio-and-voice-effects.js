import React from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";
import AgoraRTC from "agora-rtc-react";
// ...imports

const appId = ''; // Agora App ID
const channelName = ''; // Name of the channel to join
const token = ''; // Token for authentication

class ProductWorkflow extends AgoraManager {
  constructor(props) {
    super(props);
    this.state = {
      isAudioMixing: false, // Flag indicating whether audio mixing is active
      audioFileTrack: null, // Selected audio file track
      setShowDropdown: false, // Flag indicating whether to show the dropdown for selecting the audio playback device
      playbackDevices: null // List of available audio playback devices
    };
  }

  async componentDidMount() 
  {
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

    if (!this.state.agoraEngine) 
    {
      console.log("Init Engine");
      await this.setupVideoSDKEngine(); // Set up the video SDK engine
      this.setState({ playbackDevices: await AgoraRTC.getPlaybackDevices(true) });

      this.state.agoraEngine.on("user-published", this.handleUserPublished);
      this.state.agoraEngine.on("user-unpublished", this.handleUserUnpublished);
    }
  }

  // Event handler for when a user with audio is published
  handleUserPublished = async (user, mediaType) => {
    if (user.hasAudio) {
      this.setState({
        setShowDropdown: true
      });
    }
  };

  // Event handler for when a user with audio is unpublished
  handleUserUnpublished = (user, mediaType) => {
    this.setState({
      playbackDevices: null,
      setShowDropdown: false
    });
  };

  // Event handler for leaving the call
  handleLeaveCall = async () => {
    await this.leaveCall();
    this.setState({
      setShowDropdown: false,
      isAudioMixing: false,
      audioFileTrack: null // Clear the selected file
    });
    // Reset the file picker
    const fileInput = document.getElementById("filepicker");
    if (fileInput) {
      fileInput.value = null;
    }
  };

  // Event handler for joining the call
  handleJoinCall = async () => {
    await this.joinCall();
  };

  // Event handler for changing the audio playback device
  handleAudioRouteChange = () => {
    const { remoteAudioTrack } = this.state;
    const deviceID = document.getElementById("PlayoutDevice").value;
    console.log("The selected device id is : " + deviceID);
    remoteAudioTrack.setPlaybackDevice(deviceID);
  };

  // Event handler for selecting an audio file
  handleFileChange = async (event) => {
    this.setState({
      audioFileTrack: await AgoraRTC.createBufferSourceAudioTrack({ source: event.target.files[0] })
    });
  };

  // Event handler for starting/stopping audio mixing
  handleAudioMixing = async () => {
    this.setState((prevState) => ({
      isAudioMixing: !prevState.isAudioMixing
    }), this.processAudioMixing);
  };

  // Logic for starting/stopping audio mixing
  processAudioMixing = async () => {
    const { agoraEngine, isAudioMixing, audioFileTrack } = this.state;
    // Check the audio mixing state.
    if (isAudioMixing && audioFileTrack) {
      // Start processing the audio data from the audio file.
      await audioFileTrack.startProcessAudioBuffer();
      // Call replaceTrack with stopOldTrack set to false to publish audioFileTrack and localAudioTrack together.
      await agoraEngine.publish(audioFileTrack);
      await audioFileTrack.play();
    } else {
      // To stop audio mixing, stop processing the audio data and unpublish the audioFileTrack.
      audioFileTrack.stopProcessAudioBuffer();
      audioFileTrack.stop();
      await agoraEngine.unpublish(audioFileTrack);
    }
  };

  render() {
    const {
      joined,
      setShowDropdown,
      showVideo,
      localVideoTrack,
      remoteVideoTrack,
      playbackDevices
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
              <label htmlFor="filepicker">Select an audio file:</label>
              <input type="file" id="filepicker" accept="audio/*" onChange={this.handleFileChange} />
              <br />
              <button type="button" id="audioMixing" onClick={this.handleAudioMixing}>
                {this.state.isAudioMixing ? 'Stop audio mixing' : 'Start audio mixing'}
              </button>
              <br />
              {setShowDropdown && (
                <div>
                  <label htmlFor="PlayoutDevice">Playout Device:</label>
                  <select id="PlayoutDevice" onChange={this.handleAudioRouteChange}>
                    {playbackDevices.map((device, index) => (
                      <option key={index} value={device.deviceId}>
                        {device.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          }
        />
      </div>
    );
  }
}

export default ProductWorkflow;
