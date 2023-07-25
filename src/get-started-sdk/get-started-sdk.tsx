import { useState } from "react";
import {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteUsers,
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import configImport, { configType } from "../config.ts"; // Assuming the config.ts file is in the same directory as App.tsx

export function GetStarted(props: { config: configType }) {
  const config = props.config;
  const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  const [joined, setJoined] = useState(false);

  return (
    <div>
      <h1>Get started with Video Calling</h1>
      {!joined ? (
        <button onClick={() => setJoined(true)}>Join</button>
      ) : (
        <AgoraRTCProvider client={client}>
          <button onClick={() => setJoined(false)}>Leave</button>
          <GetStartedComponent config={config} />
        </AgoraRTCProvider>
      )}
    </div>
  );
}

function GetStartedComponent(props: { config: configType }) {
  const config = props.config;
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();

  usePublish([localMicrophoneTrack, localCameraTrack]);

  useJoin({
    appid: config.appId,
    channel: config.channelName,
    token: config.rtcToken,
  });

  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading) return <div>Loading devices...</div>;

  return (
    <div id="videos">
      <div className="vid" style={{ height: 300, width: 600 }}>
        <LocalVideoTrack track={localCameraTrack} play={true} />
      </div>
      {remoteUsers.map((remoteUser) => (
        <div className="vid" style={{ height: 300, width: 600 }} key={remoteUser.uid}>
          <RemoteUser user={remoteUser} playVideo={true} playAudio={true} />
        </div>
      ))}
    </div>
  );
}

export default () => GetStarted({ config: configImport });
