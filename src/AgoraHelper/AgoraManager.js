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
      showVideo: false,
      uid: 0,
    };
  }

  async setupVideoSDKEngine() {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    const microphoneAndCameraTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    this.setState({
    client: client,
    microphoneAndCameraTracks: microphoneAndCameraTracks,
    localVideoTrack: microphoneAndCameraTracks[1],
  });

    client.on("user-published", async (user, mediaType) => {
      if (mediaType === "video") {
        await client.subscribe(user, mediaType);
        console.log(user.videoTrack);
        this.setState({ remoteVideoTrack: user.videoTrack });
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        this.setState({ remoteVideoTrack: null });
      }
    });
  }

  async joinCall() {
    try {
      const { client,microphoneAndCameraTracks,appId, channelName, token, uid } = this.state;
      await client.join(appId, channelName, token, uid);
      await client.publish(microphoneAndCameraTracks);
      this.setState({
        joined: true,
        showVideo: true,
      }, ()=>
      {
        this.render();
      });
    } catch (error) {
      console.error("Failed to join or publish:", error);
    }
  }


  async leaveCall() {
    try {
      const { client,microphoneAndCameraTracks } = this.state;
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
  componentWillUnmount()
  {
    this.setState(
      {
        localVideoTrack: null,
        remoteVideoTrack: null
      });
  }
}

export default AgoraManager;