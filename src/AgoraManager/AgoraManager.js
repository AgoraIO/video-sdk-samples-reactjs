import AgoraRTC from "agora-rtc-react";
import React from "react";

class AgoraManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null,
      microphoneAndCameraTracks: null,
      joined: false,
      appId: null,
      token: null,
      channelName: null,
      localVideoTrack: null,
      remoteVideoTrack: null,
      localAudioTrack: null,
      remoteAudioTrack: null,
      showVideo: false,
      uid: 0,
      remoteUid: null
    };
  }

  async componentDidMount() {
    await this.setupVideoSDKEngine();
  }

  // Setup an instance of the agora SDK and create microphone and camera tracks.
  async setupVideoSDKEngine() {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    const microphoneAndCameraTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    this.setState({
      client: client,
      microphoneAndCameraTracks: microphoneAndCameraTracks,
      localAudioTrack: microphoneAndCameraTracks[0],
      localVideoTrack: microphoneAndCameraTracks[1]
    });

    // Triggers when a remote user publishes the media stream in the channel. 
    client.on("user-published", async (user, mediaType) => {
      if (mediaType === "video") {
        await client.subscribe(user, mediaType);
        console.log(user.videoTrack);
        this.setState({ remoteVideoTrack: user.videoTrack, remoteAudioTrack: user.audioTrack, remoteUid:user.uid });
      }
    });
    // Triggers when a remote user unpublishes the media stream in the channel. 
    client.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        this.setState({ remoteVideoTrack: null, remoteUid: null });
      }
    });
  }

  // Function to join the channel.
  async joinCall() {
    try {
      const { client, microphoneAndCameraTracks, appId, channelName, token, uid } = this.state;
      await client.join(appId, channelName, token, uid);
      await client.publish(microphoneAndCameraTracks);
      this.setState({
        joined: true,
        showVideo: true,
      }, () => {
        this.render();
      });
    } catch (error) {
      console.error("Failed to join or publish:", error);
    }
  }
 // Function to leave the channel.
  async leaveCall() {
    try {
      const { client, microphoneAndCameraTracks } = this.state;
      await client.unpublish(microphoneAndCameraTracks);
      await client.leave();
      this.setState({
        joined: false,
        showVideo: false,
      });
    } catch (error) {
      console.error("Failed to unpublish or leave:", error);
    }
  }
}

export default AgoraManager;
