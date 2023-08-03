import React, { useState, useRef } from "react";
import {
  useRTCClient,
  useRemoteUsers,
  useClientEvent,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  useConnectionState,
  useJoin,
  usePublish,
} from "agora-rtc-react";
import {
  DeviceInfo,
  IAgoraRTCClient,
  ICameraVideoTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
import AgoraRTC from "agora-rtc-sdk-ng";
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

const useOnMicrophoneChanged = (agoraEngine: IAgoraRTCClient, localMicrophoneTrack: IMicrophoneAudioTrack) => {
  useClientEvent(agoraEngine, "onMicrophoneChanged", (changedDevice: DeviceInfo) => {
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
};

const useOnCameraChanged = (agoraEngine: IAgoraRTCClient, localCameraTrack: ICameraVideoTrack) => {
  useClientEvent(agoraEngine, "onCameraChanged", (changedDevice: DeviceInfo) => {
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
};

const CallQualityFeaturesComponent: React.FC = () => {
  const agoraEngine = useRTCClient();
  const { localCameraTrack } = useLocalCameraTrack();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();
  const numberOfRemoteUsers = remoteUsers.length;
  const remoteUser = remoteUsers[numberOfRemoteUsers - 1];
  const [isSharingEnabled, setSharingEnabled] = useState(false);
  const [isMuteVideo, setMuteVideo] = useState(false);
  const connectionState = useConnectionState();
  const screenRef = React.useRef<ILocalVideoTrack>();
  const [isScreensharing, setScreensharing] = useState(false);

  const toggleSharing = async () => {
    if (isScreensharing) {
      screenRef.current?.close();
      setScreensharing(false);
    } else {
      screenRef.current = await AgoraRTC.createScreenVideoTrack({}, "disable");
      setScreensharing(true);
    }
  };

  useOnCameraChanged(agoraEngine, localCameraTrack);
  useOnMicrophoneChanged(agoraEngine, localMicrophoneTrack);

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
        <button onClick={toggleSharing}>{isScreensharing ? "Stop Screenshare" : "Start Screenshare"}</button>
      )}
      {isScreensharing && screenRef.current && <Screenshare screenTrack={screenRef.current}></Screenshare>}
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

const Screenshare = (props: { screenTrack: ILocalVideoTrack }) => {
  const screenShareClient = useRef(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  useJoin(
    {
      appid: config.appId,
      channel: config.channelName,
      token: null,
      uid: 0,
    },
    true,
    screenShareClient.current
  );
  usePublish([props.screenTrack], true, screenShareClient.current);
  return (
    <>
      <p>Screensharing Active</p>
    </>
  );
};

export default ProductWorkflowManager;