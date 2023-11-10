import React, { useState, useRef, useEffect } from "react";
import {
  useRemoteUsers,
  useConnectionState,
  useJoin,
  usePublish,
  useLocalScreenTrack,
  useTrackEvent,
} from "agora-rtc-react";
import AgoraRTC, { DeviceInfo } from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
import config from "../agora-manager/config";
import { useAgoraContext } from "../agora-manager/agoraManager";

function ProductWorkflowManager(): JSX.Element {
  return (
    <div>
      <AuthenticationWorkflowManager>
        <ProductWorkflowComponents />
      </AuthenticationWorkflowManager>
    </div>
  );
}

const ProductWorkflowComponents: React.FC = () => {
  const connectionState = useConnectionState();
  const [isConnected, setConnected] = useState(false);
  const [isSharingEnabled, setScreenSharing] = useState(false);

  useEffect(() => {
    setConnected(connectionState === "CONNECTED");
  }, [connectionState]);

  const handleToggleScreenSharing = () => {
    setScreenSharing((previous) => !previous);
  };

  return (
    <div>
      {isConnected && (
        <>
          <div>
            <button onClick={handleToggleScreenSharing}>
              {isSharingEnabled ? "Stop Sharing" : "Start Sharing"}
            </button>
          </div>
          {isSharingEnabled && <ShareScreenComponent setScreenSharing={setScreenSharing} />}
          <MuteVideoComponent />
          <RemoteAndLocalVolumeComponent />
          <OnMicrophoneChangedHook />
          <OnCameraChangedHook />
        </>
      )}
    </div>
  );
};

const RemoteAndLocalVolumeComponent: React.FC = () => {
  const agoraContext = useAgoraContext();
  const remoteUsers = useRemoteUsers();
  const numberOfRemoteUsers = remoteUsers.length;
  const remoteUser = remoteUsers[numberOfRemoteUsers - 1];

  const handleLocalAudioVolumeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(evt.target.value);
    console.log("Volume of local audio:", volume);
    agoraContext.localMicrophoneTrack?.setVolume(volume);
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

  return (
    <div>
      <>
        <label> Local Audio Level :</label>
        <input type="range" min="0" max="100" step="1" onChange={handleLocalAudioVolumeChange} />
      </>
      <div>
        <>
          <label> Remote Audio Level :</label>
          <input type="range" min="0" max="100" step="1" onChange={handleRemoteAudioVolumeChange} />
        </>
      </div>
    </div>
  );
};

const MuteVideoComponent: React.FC = () => {
  const agoraContext = useAgoraContext();
  const [isMuteVideo, setMuteVideo] = useState(false);

  const toggleMuteVideo = () => {
    agoraContext.localCameraTrack
      ?.setEnabled(isMuteVideo)
      .then(() => setMuteVideo((prev) => !prev))
      .catch((error) => console.error(error));
  };

  return (
    <button onClick={toggleMuteVideo}>{isMuteVideo ? "Unmute Video" : "Mute Video"}</button>
  );
};

const ShareScreenComponent: React.FC<{ setScreenSharing: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  setScreenSharing,
}) => {
  const screenShareClient = useRef(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  const { screenTrack, isLoading, error } = useLocalScreenTrack(true, {}, "disable", screenShareClient.current);

  useJoin(
    {
      appid: config.appId,
      channel: config.channelName,
      token: config.rtcToken,
      uid: 0,
    },
    true,
    screenShareClient.current
  );
  useTrackEvent(screenTrack, "track-ended", () => {
    setScreenSharing(false);
  });
  useEffect(() => {
    if (error) setScreenSharing(false);
  }, [error, setScreenSharing]);

  usePublish([screenTrack], screenTrack !== null, screenShareClient.current);

  if (isLoading) {
    return <p>Sharing screen...</p>;
  }
  return <></>;
};

const OnMicrophoneChangedHook: React.FC = () => {
  const agoraContext = useAgoraContext();

  useEffect(() => {
    const onMicrophoneChanged = (changedDevice: DeviceInfo) => {
      if (changedDevice.state === "ACTIVE") {
        agoraContext.localMicrophoneTrack?.setDevice(changedDevice.device.deviceId).catch((error) => console.error(error));
      } else if (changedDevice.device.label === agoraContext.localMicrophoneTrack?.getTrackLabel()) {
        AgoraRTC.getMicrophones()
          .then((devices) => agoraContext.localMicrophoneTrack?.setDevice(devices[0].deviceId))
          .catch((error) => console.error(error));
      }
    };

    AgoraRTC.onMicrophoneChanged = onMicrophoneChanged;

    return () => {
      AgoraRTC.onMicrophoneChanged = undefined;
    };
  }, [agoraContext.localMicrophoneTrack]);

  return null;
};

const OnCameraChangedHook: React.FC = () => {
  const agoraContext = useAgoraContext();

  useEffect(() => {
    const onCameraChanged = (changedDevice: DeviceInfo) => {
      if (changedDevice.state === "ACTIVE") {
        agoraContext.localCameraTrack?.setDevice(changedDevice.device.deviceId).catch((error) => console.error(error));
      } else if (changedDevice.device.label === agoraContext.localCameraTrack?.getTrackLabel()) {
        AgoraRTC.getCameras()
          .then((devices) => agoraContext.localCameraTrack?.setDevice(devices[0].deviceId))
          .catch((error) => console.error(error));
      }
    };

    AgoraRTC.onCameraChanged = onCameraChanged;

    return () => {
      AgoraRTC.onCameraChanged = undefined;
    };
  }, [agoraContext.localCameraTrack]);

  return null;
};

export default ProductWorkflowManager;
