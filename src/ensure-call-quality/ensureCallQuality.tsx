import {
  AgoraRTCProvider,
  useRTCClient,
  useRemoteUsers,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useNetworkQuality,
  useConnectionState,
  useJoin,
  LocalVideoTrack,
  useAutoPlayAudioTrack,
  useVolumeLevel
} from "agora-rtc-react";
import AgoraRTC, {ILocalAudioTrack, ICameraVideoTrack} from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
import { useState, useRef, useEffect } from "react";
import config from "../agora-manager/config";

export function EnsureCallQuality() 
{
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: config.selectedProduct }));

  return (
    <div>
      <h1>Call Quality Best Practice</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <AuthenticationWorkflowManager>
          <CallQualityFeaturesComponent />
        </AuthenticationWorkflowManager>
      </AgoraRTCProvider>
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
    try {
      await agoraEngine.enableDualStream();
    } catch (error) {
      console.log(error);
    }
    await localCameraTrack?.setEncoderConfiguration({
      width: 640,
      height: { ideal: 480, min: 400, max: 500 },
      frameRate: 15,
      bitrateMin: 600,
      bitrateMax: 1000,
    });
  };

  const updateNetworkStatus = () => {
    const networkLabels = {
      0: 'Unknown', 1: 'Excellent',
      2: 'Good', 3: 'Poor',
      4: 'Bad', 5: 'Very Bad',
      6: 'No Connection'
    }
    return <label>Network Quality: {networkLabels[networkQuality.uplink]}</label>;
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

    const newQualityState = !isHighRemoteVideoQuality;
    const streamType = newQualityState ? 0 : 1;

    agoraEngine
      .setRemoteVideoStreamType(remoteUser.uid, streamType)
      .then(() => setVideoQualityState(newQualityState))
      .catch((error) => console.error(error));
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
      {connectionState !== "DISCONNECTED" && !isDeviceTestRunning && (
        <>
          <button onClick={showStatistics}>Log statistics to console</button>
          <button onClick={() => setRemoteVideoQuality()}>
            {isHighRemoteVideoQuality ? "Low Video Quality" : "High Video Quality"}
          </button>
        </>
      )}
      {connectionState === "DISCONNECTED" && !isDeviceTestRunning && (
        <button onClick={handleStartDeviceTest}>Start Device Test</button>
      )}
      {connectionState !== "DISCONNECTED" && isDeviceTestRunning && (
        <button onClick={handleStopDeviceTest}>Stop Device Test</button>
      )}
      {isDeviceTestRunning && (
        <div>
          <VideoDeviceTestComponent localCameraTrack={localCameraTrack} />
          {localMicrophoneTrack && <AudioDeviceTestComponent localMicrophoneTrack={localMicrophoneTrack} />}
        </div>
      )}
    </div>
  );
};

const VideoDeviceTestComponent: React.FC<{ localCameraTrack: ICameraVideoTrack | null }> = ({ localCameraTrack }) => {
  useJoin({ appid: config.appId, channel: config.channelName, token: config.rtcToken }, true);

  return (
    <div>
      <LocalVideoTrack track={localCameraTrack} play={true} style={{ width: "600px", height: "600px" }} />
    </div>
  );
};

const AudioDeviceTestComponent: React.FC<{ localMicrophoneTrack: ILocalAudioTrack }> = ({ localMicrophoneTrack }) => {
  useAutoPlayAudioTrack(localMicrophoneTrack, true);
  const volume = useVolumeLevel(localMicrophoneTrack);

  return (
    <div className="h-screen p-3">
      <p>local Audio Volume: {Math.floor(volume * 100)}</p>
    </div>
  );
};

export default EnsureCallQuality;
