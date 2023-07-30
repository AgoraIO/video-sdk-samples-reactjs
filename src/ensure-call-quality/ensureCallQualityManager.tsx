// EnsureCallQualityManager.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  useRTCClient,
  useRemoteUsers,
  useNetworkQuality,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  useConnectionState,
  useAutoPlayAudioTrack,
  useJoin,
  useVolumeLevel,
  LocalVideoTrack,
} from "agora-rtc-react";
import { ICameraVideoTrack, ILocalAudioTrack } from "agora-rtc-sdk-ng";
import config from "../config";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";

function EnsureCallQualityManager(): JSX.Element {
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
  const remoteUsers = useRemoteUsers();
  const [isHighRemoteVideoQuality, setVideoQualityState] = useState(false);
  const numberOfRemoteUsers = remoteUsers.length;
  const remoteUser = remoteUsers[numberOfRemoteUsers - 1];
  const [isDeviceTestRunning, setDeviceTestState] = useState(false);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { localCameraTrack } = useLocalCameraTrack();
  const enabledFeatures = useRef(false);
  const networkQuality = useNetworkQuality();
  const connectionState = useConnectionState();

  useEffect(() => {
    if (!enabledFeatures.current) {
      callQualityEssentials()
        .then(() => console.log("Call quality features enabled"))
        .catch((error) => console.error(error));
      enabledFeatures.current = true;
    }
  }, []);
  

  const callQualityEssentials = async () => {
    await agoraEngine.enableDualStream();
    await localCameraTrack?.setEncoderConfiguration({
      width: 640,
      height: { ideal: 480, min: 400, max: 500 },
      frameRate: 15,
      bitrateMin: 600,
      bitrateMax: 1000,
    });
  };

  const updateNetworkStatus = () => {
    if (networkQuality.uplink === 0) {
      return <label>Network Quality: Unknown</label>;
    } else if (networkQuality.uplink === 1) {
      return <label>Network Quality: Excellent</label>;
    } else if (networkQuality.uplink === 2) {
      return <label>Network Quality: Good</label>;
    } else {
      return <label>Network Quality: Bad</label>;
    }
  };

  const showStatistics = () => {
    const localAudioStats = agoraEngine.getLocalAudioStats();
    console.log("Local audio stats:", localAudioStats);

    const localVideoStats = agoraEngine.getLocalVideoStats();
    console.log("Local video stats:", localVideoStats);

    const rtcStats = agoraEngine.getRTCStats();
    console.log("Channel statistics:", rtcStats);
  };

  const setRemoteVideoQuality = () => {
    if (!remoteUser) {
      console.log("No remote user in the channel");
      return;
    }

    if (!isHighRemoteVideoQuality) {
      agoraEngine.setRemoteVideoStreamType(remoteUser.uid, 0)
      .then(() => setVideoQualityState(true))
      .catch((error) => console.error(error));
    } else {
      agoraEngine.setRemoteVideoStreamType(remoteUser.uid, 1)
      .then(() => setVideoQualityState(false))
      .catch((error) => console.error(error));
    }
  };

  const handleStartDeviceTest = () => {
    setDeviceTestState(true);
  };

  const handleStopDeviceTest = () => {
    setDeviceTestState(false);
  };

  return (
    <div>
      {updateNetworkStatus()}
      <p>Connection State: {connectionState}</p>
      <br />
      <button onClick={showStatistics}>Log statistics to console</button>
      <button onClick={() => setRemoteVideoQuality()}>
        {isHighRemoteVideoQuality ? "Low Video Quality" : "High Video Quality"}
      </button>
      {connectionState === "DISCONNECTED" && !isDeviceTestRunning && (
        <button onClick={handleStartDeviceTest}>Start Device Test</button>
      )}
      {connectionState !== "DISCONNECTED" && isDeviceTestRunning && (
        <button onClick={handleStopDeviceTest}>Stop Device Test</button>
      )}
      {isDeviceTestRunning && (
        <div>
          <VideoDeviceTestComponent localCameraTrack={localCameraTrack} />
          <AudioDeviceTestComponent localMicrophoneTrack={localMicrophoneTrack} />
        </div>
      )}
    </div>
  );
};

const VideoDeviceTestComponent: React.FC<{ localCameraTrack: ICameraVideoTrack }> = ({
  localCameraTrack,
}) => {
  useJoin({ appid: config.appId, channel: config.channelName, token: config.rtcToken }, true);

  return (
    <div>
      <LocalVideoTrack track={localCameraTrack} play={true} style={{ width: "600px", height: "600px" }} />
    </div>
  );
};

const AudioDeviceTestComponent: React.FC<{ localMicrophoneTrack: ILocalAudioTrack }> = ({
  localMicrophoneTrack,
}) => {

  useAutoPlayAudioTrack(localMicrophoneTrack, true);
  const volume = useVolumeLevel(localMicrophoneTrack);

  return (
    <div className="h-screen p-3">
      <p>local Audio Volume: {Math.floor(volume * 100)}</p>
    </div>
  );
};

export default EnsureCallQualityManager;
