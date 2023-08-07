import React, { useState, useRef } from "react";
import {
  useRTCClient,
  useRemoteUsers,
  useClientEvent,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  useLocalScreenTrack,
  useConnectionState,
  useJoin,
  usePublish,
  LocalVideoTrack,
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

const CallQualityFeaturesComponent: React.FC = () => {
  const agoraEngine = useRTCClient();
  const { localCameraTrack } = useLocalCameraTrack();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();
  const numberOfRemoteUsers = remoteUsers.length;
  const remoteUser = remoteUsers[numberOfRemoteUsers - 1];
  const [isSharingEnabled, setScreenSharing] = useState(false);
  const [isMuteVideo, setMuteVideo] = useState(false);
  const connectionState = useConnectionState();

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
        <button onClick={() => { setScreenSharing(previous => !previous) }}>{isSharingEnabled ? "Stop Sharing" : "Start Sharing"}</button>
      )}
      {isSharingEnabled && (<ScreenShare></ScreenShare>)}
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

const ScreenShare = () => {
  const screenShareClient = useRef(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  // explore using screenshareProvider
  // looks like function overload isn't working
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const { screenTrack } = useLocalScreenTrack(true, {}, "disable", screenShareClient.current);

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
  usePublish([screenTrack as ILocalVideoTrack], screenTrack !== null, screenShareClient.current);
  return (
    <>
      <p>Screen sharing enabled</p>
      {screenTrack && <LocalVideoTrack track={screenTrack as ILocalVideoTrack} play={true} style={{ width: 600, height: 300 }} />}
    </>
  );
};

const useOnMicrophoneChanged = (agoraEngine: IAgoraRTCClient, localMicrophoneTrack: IMicrophoneAudioTrack | null) => {
  // do you intend to use TrackEvent instead? this event doesn't seem to exist here
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

const useOnCameraChanged = (agoraEngine: IAgoraRTCClient, localCameraTrack: ICameraVideoTrack | null) => {
  // do you intend to use TrackEvent instead? this event doesn't seem to exist here
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

export default ProductWorkflowManager;
