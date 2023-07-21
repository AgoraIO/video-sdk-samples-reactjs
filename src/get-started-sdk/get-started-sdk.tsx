import { useEffect, useRef, useState } from "react";
import {
  AgoraRTCProvider,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import config from "../config.json"; // Assuming the config.json file is in the same directory as App.tsx

function GetStarted() {
  const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    setJoined(true);
  };

  const handleLeave = () => {
    setJoined(false);
  };

  return (
    <div>
        <h1>Get started with Video Calling</h1>
      {!joined ? (
        <button onClick={handleJoin}>Join</button>
      ) : (
        <AgoraRTCProvider client={client}>
          <button onClick={handleLeave}>Leave</button>
          <GetStartedComponent />
        </AgoraRTCProvider>
      )}
    </div>
  );
}

function GetStartedComponent() {
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  usePublish([localMicrophoneTrack, localCameraTrack]);

  useJoin({
    appid: config.appId,
    channel: config.channelName,
    token: config.rtcToken,
  });

  useEffect(() => {
    if (localCameraTrack && localVideoRef.current) {
      localCameraTrack.play(localVideoRef.current);
    }
  }, [localCameraTrack]);

  useEffect(() => {
    if (remoteUsers.length > 0 && remoteVideoRef.current) {
      remoteUsers[0].videoTrack?.play(remoteVideoRef.current);
    }
  }, [remoteUsers]);

  audioTracks.map((track) => track.play());
  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading) return <div>Loading devices...</div>;

  return (
    <div id="videos">
      <div className="vid" style={{ height: "95%", width: "95%" }}>
        <video ref={localVideoRef} autoPlay />
      </div>
      <div className="vid" style={{ height: "95%", width: "95%" }}>
        <video ref={remoteVideoRef} autoPlay />
      </div>
    </div>
  );
}

export default GetStarted;
