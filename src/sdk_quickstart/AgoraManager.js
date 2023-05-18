import AgoraRTC from "agora-rtc-react";
import React from "react";

class AgoraManager extends React.Component {
  constructor(props) {
    super(props);
    // Initialize the component state with default values
    this.state = {
      client: null,
      microphoneAndCameraTracks: null,
      joined: false,
      appId: null,
      token: null,
      channelName: null,
      localVideoTrack: null,
      remoteVideoTrack: null,
      showVideo: false,
      uid: 0,
    };
  }

  async initialize() {
    // Create an Agora client with mode "rtc" and codec "vp8"
    this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    // Create microphone and camera tracks using AgoraRTC
    this.microphoneAndCameraTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    // Set the local video track to the second track in the microphoneAndCameraTracks array
    this.localVideoTrack = this.microphoneAndCameraTracks[1];
    
    // Subscribe to the "user-published" event to handle remote video track publication
    this.client.on("user-published", async (user, mediaType) => {
      if (mediaType === "video") {
        console.log("A user published");
        // Subscribe to the remote user's video track
        await this.client.subscribe(user, mediaType);
        // Set the remote video track in the component state
        this.setState({ remoteVideoTrack: user.videoTrack });
      }
    });

    // Handle the "user-unpublished" event to remove remote video track when a user unpublishes
    this.client.on("user-unpublished", (user, mediaType) => {
      console.log("A user unpublished");
      if (mediaType === "video") {
        // Reset the remote video track in the component state
        this.setState({
          remoteVideoTrack: null,
        });
      }
    });
  }

  async joinCall() {
    try {
      const { appId, channelName, token, uid } = this.state;
      // Join the Agora channel using the provided appId, channelName, token, and uid
      await this.client.join(appId, channelName, token, uid);
      // Publish the microphone and camera tracks
      await this.client.publish(this.microphoneAndCameraTracks);
      // Update the component state to indicate that the user has joined the call and video should be shown
      this.setState({
        joined: true,
        showVideo: true,
      });
    } catch (error) {
      console.error("Failed to join or publish:", error);
    }
  }

  async leaveCall() {
    try {
      // Unpublish the microphone and camera tracks
      await this.client.unpublish(this.microphoneAndCameraTracks);
      // Leave the Agora channel
      await this.client.leave();
      // Reset the component state to its initial values
      this.setState({
        joined: false,
        showVideo: false,
        localVideoTrack: null,
        remoteVideoTrack: null,
      });
    } catch (error) {
      console.error("Failed to unpublish or leave:", error);
    }
  }
}

export default AgoraManager;
