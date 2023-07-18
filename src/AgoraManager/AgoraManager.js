import { useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const AgoraManager = ({ appId, channelName, token }) => {
  const [agoraEngine, setAgoraEngine] = useState(null);
  const [microphoneAndCameraTracks, setMicrophoneAndCameraTracks] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState(null);
  const [remoteUid, setRemoteUid] = useState(null);
  const [joined, setJoined] = useState(false);
  const [showVideo, setShowVideo] = useState(false);


  const setupVideoSDKEngine = async () => 
  {
    const engine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    if(engine && tracks)
    {
      setAgoraEngine(engine);
      setMicrophoneAndCameraTracks(tracks);
      engine.on("user-published", async (user, mediaType) => {
      await engine.subscribe(user, mediaType);
      if (mediaType === "video") {
        setRemoteVideoTrack(user.videoTrack);
        setRemoteUid(user.uid);
      }
    });

    engine.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video" && user.uid === remoteUid) {
        setRemoteVideoTrack(null);
        setRemoteUid(null);
      }
    });
  }
  return engine;
  };

  const joinCall = async () => {
    try {
      await agoraEngine.join(appId, channelName, token, 0);
      setLocalAudioTrack(microphoneAndCameraTracks[0]);
      setLocalVideoTrack(microphoneAndCameraTracks[1]);
      await agoraEngine.publish([microphoneAndCameraTracks[0], microphoneAndCameraTracks[1]]);
      setJoined(true);
      setShowVideo(true);
    } catch (error) {
      console.error("Failed to join or publish:", error);
    }
  };

  const leaveCall = async () => {
    try {
      await agoraEngine.unpublish([localAudioTrack, localVideoTrack]);
      await agoraEngine.leave();
      setJoined(false);
      setShowVideo(false);
    } catch (error) {
      console.error("Failed to unpublish or leave:", error);
    }
  };

  return {
    agoraEngine,
    microphoneAndCameraTracks,
    joined,
    appId,
    token,
    channelName,
    localVideoTrack,
    remoteVideoTrack,
    localAudioTrack,
    remoteUid,
    showVideo,
    joinCall,
    leaveCall,
    setupVideoSDKEngine,
    setMicrophoneAndCameraTracks
  };
};

export default AgoraManager;
