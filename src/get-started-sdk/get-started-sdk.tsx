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
import config from "../config.ts"; // Assuming the config.ts file is in the same directory as App.tsx

interface GetStartedProps {
  title?: string;
  children?: React.ReactNode;
}
const GetStarted: React.FC<GetStartedProps> = ({ title, children }) => {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  const [joined, setJoined] = useState(false);

  return (
    <div>
      <h1>{title}</h1>
      {!joined ? (
        <AgoraRTCProvider client={agoraEngine}>
        <button onClick={() => setJoined(true)}>Join</button>
        {children}
        </AgoraRTCProvider>
      ) : (
        <AgoraRTCProvider client={agoraEngine}>
          <button onClick={() => setJoined(false)}>Leave</button>
          {children}
          <GetStartedComponent />
        </AgoraRTCProvider>
      )}
    </div>
  );
}

function GetStartedComponent() 
{
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();
  usePublish([localMicrophoneTrack, localCameraTrack]);

  useJoin({
    appid: config.appId,
    channel: config.channelName,
    token: config.rtcToken === "" ? null : config.rtcToken,
  });

  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading) return <div>Loading devices...</div>;

  return (
    <div id="videos">
      <div className="vid" style={{ height: 300, width: 600 }}>
        <LocalVideoTrack track={localCameraTrack} play={true} />
      </div>
      {remoteUsers.map((remoteUser) => (
        <div className="vid" style={{ height: 300, width: 600 }}>
          <RemoteUser user={remoteUser} playVideo={true} playAudio={true} />
        </div>
      ))}
    </div>
  );
}

export default GetStarted;
