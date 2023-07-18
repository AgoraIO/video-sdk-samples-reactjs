import React, { useState, useEffect } from "react";
import {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteUsers,
  useRemoteAudioTracks,
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import config from "./config.json";
import VideoCallUI from "./AgoraUI";


export function SetupVideoSdkEngine() 
{
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  return agoraEngine;
}
export function Join(props) {
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const videoCallUIProps = props.videoCallUIProps;
  const [remoteVideoTrack, setRemoteVideoTrack] = useState(null);

  useEffect(() => {
    if (remoteUsers.length > 0) {
      const latestUser = remoteUsers[remoteUsers.length - 1];
      const latestRemoteVideoTrack = latestUser.videoTrack;
      setRemoteVideoTrack(latestRemoteVideoTrack);
    } else {
      setRemoteVideoTrack(null);
    }
  }, [remoteUsers]);

  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: config.appId,
    channel: config.channelName,
    token: config.rtcToken === "" ? null : config.rtcToken,
  });

  audioTracks.map(track => track.play());

  return (
    <div>
      <VideoCallUI
        {...videoCallUIProps}
        localVideoTrack={localCameraTrack}
        remoteVideoTrack={remoteVideoTrack}
      />
    </div>
  );
}

  
