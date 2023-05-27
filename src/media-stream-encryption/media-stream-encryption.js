import React from "react";
import AgoraManager from "../AgoraHelper/AgoraManager";
import VideoCallUI from "../AgoraHelper/AgoraUI";
const { Buffer } = require('buffer');

// Initialize the Agora application ID, token, and channel name
const appId = '<Your app ID>';
const channelName = '<Your channel name>';
const token = '<Your authentication token>';
// In a production environment, you retrieve the key and salt from
// an authentication server. For this code example you generate locally.

var encryptionKey = "<Encryption key>";
var encryptionSaltBase64 = "<Encryption salt in base64 format>";
// Set an encryption mode.
var encryptionMode = "aes-256-gcm2";

function base64ToUint8Array(base64String) {
  const binaryString = Buffer.from(base64String, 'base64').toString('binary');
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

function hex2ascii(hexx) {
  const hex = hexx.toString(); // force conversion
  let str = '';
  for (let i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

// VideoCall class inherits from AgoraManager
class VideoCall extends AgoraManager {
  async componentDidMount() {
    // Set the Agora application ID, channel name, and token in the component state
    this.setState({
      appId: appId,
      channelName: channelName,
      token: token
    });

    // Initialize the AgoraManager if it hasn't been initialized already
    if (!this.state.agoraEngine) {
      await this.setupVideoSDKEngine();
      // Convert the encryptionSaltBase64 string to Uint8Array
      encryptionSaltBase64 = await base64ToUint8Array(encryptionSaltBase64);
      // Convert the encryptionKey string to ASCII
      encryptionKey = await hex2ascii(encryptionKey);
      // Start channel encryption
      await this.enableEncryption();
    }
  }

  enableEncryption = async () => {
    if (this.agoraEngine && this.agoraEngine.setEncryptionConfig) {
      this.agoraEngine.setEncryptionConfig(encryptionMode, encryptionKey, encryptionSaltBase64);
    } else {
      console.error('Encryption configuration is not supported by the Agora SDK.');
    }
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
