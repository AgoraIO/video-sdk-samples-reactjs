import React, { useState, useRef, useEffect } from "react";
import {
  useRemoteUsers,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  useLocalScreenTrack,
  useConnectionState,
  useJoin,
  usePublish,
  LocalVideoTrack,
  useTrackEvent,
} from "agora-rtc-react";
import AgoraRTC, {
  DeviceInfo,
  IAgoraRTCError,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
import config from "../config";

function ProductWorkflowManager(): JSX.Element {
  return (
    <div>
      <AuthenticationWorkflowManager>
        <CallQualityFeaturesComponent />
      </AuthenticationWorkflowManager>
    </div>
  );
}

const CallQualityFeaturesComponent: React.FC = () => {
  const { localCameraTrack } = useLocalCameraTrack();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();
  const numberOfRemoteUsers = remoteUsers.length;
  const remoteUser = remoteUsers[numberOfRemoteUsers - 1];
  const [isSharingEnabled, setScreenSharing] = useState(false);
  const [isMuteVideo, setMuteVideo] = useState(false);
  const connectionState = useConnectionState();

  useOnCameraChanged(localCameraTrack);
  useOnMicrophoneChanged(localMicrophoneTrack);

  const handleLocalAudioVolumeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(evt.target.value);
    console.log("Volume of local audio:", volume);
    localMicrophoneTrack?.setVolume(volume);
  };

  const handleRemoteAudioVolumeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (remoteUser) {
      const volume = parseInt(evt.target.value);
      console.log("Volume of remote audio:", volume);
      remoteUser.audioTrack?.setVolume(volume);
    } else {
      console.log("No remote user in the channel");
    }
  };

  const toggleMuteVideo = () => {
    if (connectionState === "DISCONNECTED") {
      console.log("Join a channel to mute/unmute the local video");
      return;
    }
    localCameraTrack
      ?.setEnabled(!isSharingEnabled)
      .then(() => setMuteVideo((prev) => !prev))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      {connectionState === "CONNECTED" && (
        <button onClick={() => { setScreenSharing(previous => !previous) }}>{isSharingEnabled ? "Stop Sharing" : "Start Sharing"}</button>
      )}
      {isSharingEnabled && (<ScreenShare setScreenSharing={setScreenSharing}></ScreenShare>)}
      <br />
      {isMuteVideo ? (
        <button type="button" onClick={toggleMuteVideo}>
          Unmute Video
        </button>
      ) : (
        <button type="button" onClick={toggleMuteVideo}>
          Mute Video
        </button>
      )}
      <div>
        <label> Local Audio Level :</label>
        <input type="range" min="0" max="100" step="1" onChange={handleLocalAudioVolumeChange} />
      </div>
      <div>
        <label> Remote Audio Level :</label>
        <input type="range" min="0" max="100" step="1" onChange={handleRemoteAudioVolumeChange} />
      </div>
    </div>
  );
};

const ScreenShare = (props: {setScreenSharing: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {setScreenSharing} = props;
  const screenShareClient = useRef(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  const { screenTrack, isLoading, error } = useLocalScreenTrack(true, {}, "disable", screenShareClient.current);

  useJoin({
    appid: config.appId,
    channel: config.channelName,
    token: null,
    uid: 0,
  }, true, screenShareClient.current);
  usePublish([screenTrack], screenTrack !== null, screenShareClient.current);
  // handle "stop sharing" button click
  useTrackEvent(screenTrack, "track-ended", () => {
    setScreenSharing(false);
  });
  // handle screensharing pop up close 
  useEffect(()=>{
    if(error) setScreenSharing(false);
  }, [error, setScreenSharing])

  if (isLoading) {
    return <p>Loading Screenshare...</p>
  }

  return (
    <>
      <p>Screen sharing enabled</p>
      {screenTrack && <LocalVideoTrack track={screenTrack} play={true} style={{ width: 600, height: 300 }} />}
    </>
  );
};

const useOnMicrophoneChanged = (localMicrophoneTrack: IMicrophoneAudioTrack | null) => {
  useEffect(() => {
    AgoraRTC.onMicrophoneChanged = ((changedDevice: DeviceInfo) => {
      if (changedDevice.state === "ACTIVE") {
        localMicrophoneTrack
          ?.setDevice(changedDevice.device.deviceId)
          .then(() => console.log(""))
          .catch((error) => console.error(error));
      } else if (changedDevice.device.label === localMicrophoneTrack?.getTrackLabel()) {
        AgoraRTC.getMicrophones()
          .then((devices) => localMicrophoneTrack?.setDevice(devices[0].deviceId))
          .catch((error) => console.error(error));
      }
    });
    return () => {
      AgoraRTC.onMicrophoneChanged = undefined;
    }
  }, [localMicrophoneTrack]);

};

const useOnCameraChanged = (localCameraTrack: ICameraVideoTrack | null) => {
  useEffect(() => {
    AgoraRTC.onCameraChanged = ((changedDevice: DeviceInfo) => {
      if (changedDevice.state === "ACTIVE") {
        localCameraTrack
          ?.setDevice(changedDevice.device.deviceId)
          .then(() => console.log(""))
          .catch((error) => console.error(error));
      } else if (changedDevice.device.label === localCameraTrack?.getTrackLabel()) {
        AgoraRTC.getCameras()
          .then((devices) => localCameraTrack?.setDevice(devices[0].deviceId))
          .catch((error) => console.error(error));
      }
    });
    return () => {
      AgoraRTC.onCameraChanged = undefined;
    }
  }, [localCameraTrack]);
};

export default ProductWorkflowManager;
