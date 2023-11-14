// AgoraManager.tsx
import {
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import configImport, { configType } from "./config";
// AgoraContext.tsx
import React, { createContext, useContext } from "react";
import { IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-sdk-ng";

interface AgoraContextType {
  localCameraTrack: ICameraVideoTrack;
  localMicrophoneTrack: IMicrophoneAudioTrack;
  children: React.ReactNode;
}

const AgoraContext = createContext<AgoraContextType | null>(null);

export const AgoraProvider: React.FC<AgoraContextType> = ({ children, localCameraTrack, localMicrophoneTrack }) => (
  <AgoraContext.Provider value={{ localCameraTrack, localMicrophoneTrack, children }}>
    {children}
  </AgoraContext.Provider>
);

export const useAgoraContext = () => {
  const context = useContext(AgoraContext);
  if (!context) throw new Error("useAgoraContext must be used within an AgoraProvider");
  return context;
};

export const AgoraManager = ({ config, children }: { config: configType; children: React.ReactNode }) => {
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();
  usePublish([localMicrophoneTrack, localCameraTrack]);

  useJoin({
    appid: config.appId,
    channel: config.channelName,
    token: config.rtcToken,
    uid: config.uid,
  });

  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading) return <div>Loading devices...</div>;

  return (
    <AgoraProvider localCameraTrack={localCameraTrack} localMicrophoneTrack={localMicrophoneTrack}>
      {children}
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
    </AgoraProvider>
  );
};

export default () => <AgoraManager config={configImport}></AgoraManager>;
