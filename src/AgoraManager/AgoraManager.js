import AgoraRTC from "agora-rtc-react";
import React from "react";

class AgoraManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agoraEngine: null,
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
    const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    const microphoneAndCameraTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    this.setState({
      agoraEngine: agoraEngine,
      microphoneAndCameraTracks: microphoneAndCameraTracks,
      localAudioTrack: microphoneAndCameraTracks[0],
      localVideoTrack: microphoneAndCameraTracks[1]
    });

    // Triggers when a remote user publishes the media stream in the channel. 
    agoraEngine.on("user-published", async (user, mediaType) => {
        await agoraEngine.subscribe(user, mediaType);
        this.setState({ remoteVideoTrack: user.videoTrack, remoteAudioTrack: user.audioTrack, remoteUid:user.uid });
    });
    // Triggers when a remote user unpublishes the media stream in the channel. 
    agoraEngine.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        this.setState({ remoteVideoTrack: null, remoteUid: null });
      }
    });
  }

  // Function to join the channel.
  async joinCall() {
    try {
      const { agoraEngine, microphoneAndCameraTracks, appId, channelName, token, uid } = this.state;
      await agoraEngine.join(appId, channelName, token, uid);
      await agoraEngine.publish(microphoneAndCameraTracks);
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
      const { agoraEngine, localAudioTrack, localVideoTrack } = this.state;
      await agoraEngine.unpublish([localAudioTrack,localVideoTrack]);
      await agoraEngine.leave();
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
