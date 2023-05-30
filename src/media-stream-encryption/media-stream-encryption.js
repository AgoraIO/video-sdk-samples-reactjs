import React from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";

// Initialize the required variables for Agora integration
const appId = "";
const channelName = "";
const token = "";
const encryptionKey = "<Add a strong encryption key here>"; // Replace with a strong encryption key
const encryptionSaltBase64 = "<Encryption salt in base 64 format>";
const encryptionMode = "aes-256-gcm2";

// Function to convert a base64 string to Uint8Array
function base64ToUint8Array(base64Str) {
  const binaryStr = atob(base64Str);
  const len = binaryStr.length;
  const uint8Array = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    uint8Array[i] = binaryStr.charCodeAt(i);
  }

  return uint8Array;
}

// Function to convert a hex string to ASCII string
function hexToAscii(hexString) {
  let asciiString = "";
  for (let i = 0; i < hexString.length; i += 2) {
    const hexCode = parseInt(hexString.substr(i, 2), 16);
    asciiString += String.fromCharCode(hexCode);
  }
  return asciiString;
}

// Class component for media stream encryption, extends AgoraManager
class MediaStreamEncryption extends AgoraManager {
  async componentDidMount() {
    // Check if the required props (appId, channelName, token) are provided
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
      console.error("You did not specify the appId, channelName, and token");
    }

    try {
      // Convert the encryption salt from base64 to Uint8Array
      const encryptionSalt = await base64ToUint8Array(encryptionSaltBase64);

      // Convert the encryption key from hex to ASCII string
      const convertedKey = hexToAscii(encryptionKey);

      if (!this.state.agoraEngine) {
        // Setup Agora video SDK engine if not already initialized
        await this.setupVideoSDKEngine();

        if (this.state.agoraEngine) {
          const { agoraEngine } = this.state;
          console.log("Encryption enabled");

          // Set the encryption configuration using the converted key and salt
          await agoraEngine.setEncryptionConfig(encryptionMode, convertedKey, encryptionSalt);

          // Add a listener for the "crypt-error" event
          agoraEngine.on("crypt-error", (error) => {
            console.log("Crypt error:", error);
          });
        }
      }
    } catch (error) {
      console.error("Failed to convert encryption key or salt:", error);
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

export default MediaStreamEncryption;
