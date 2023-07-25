import { useState, useRef, useEffect } from "react";
import GetStarted from "../sdk-quickstart/sdk-quickstart";
import { useRTCClient, useRemoteUsers, useNetworkQuality,useLocalMicrophoneTrack, useLocalCameraTrack, useAutoPlayVideoTrack, useConnectionState, useAutoPlayAudioTrack,  useJoin, useVolumeLevel, LocalAudioTrack } from "agora-rtc-react";
import config from "../config";
import { ICameraVideoTrack, ILocalAudioTrack, } from "agora-rtc-sdk-ng";

function EnsureCallQuality() {
  return (
    <div>
      <h1>Call Quality Best Practice</h1>
      <GetStarted>
        <CallQualityFeatures />
      </GetStarted>
    </div>
  );
}

const CallQualityFeatures: React.FC = () => {
  const agoraEngine = useRTCClient();
  const remoteUsers = useRemoteUsers();
  const [isHighRemoteVideoQuality, setVideoQualityState] = useState(false);
  const length = remoteUsers.length;
  const remoteUser = remoteUsers[length - 1];
  const [isDeviceTestRuning, setDeviceTestState] = useState(false);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { localCameraTrack } = useLocalCameraTrack();
  const enabledFeatures = useRef(false);
  // Get the uplink network condition
  const networkQuality = useNetworkQuality();
  const connectionState = useConnectionState();
  const setRemoteVideoQuality = async () => {
    if (!remoteUser) {
      console.log("No remote user in the channel");
      return;
    }

    if (!isHighRemoteVideoQuality) {
      await agoraEngine.setRemoteVideoStreamType(remoteUser.uid, 0);
      setVideoQualityState(true);
    } else {
      await agoraEngine.setRemoteVideoStreamType(remoteUser.uid, 1);
      setVideoQualityState(false);
    }
  };


  useEffect(() => {
    if (!enabledFeatures.current) {
      CallQualityEssentials();
      enabledFeatures.current = true;
    }
  }, []);

  const CallQualityEssentials = async () => {
    await agoraEngine.enableDualStream();
    await localCameraTrack?.setEncoderConfiguration({
      width: 640,
      // Specify a value range and an ideal value
      height: { ideal: 480, min: 400, max: 500 },
      frameRate: 15,
      bitrateMin: 600, bitrateMax: 1000,
    });
  };

  const updateNetworkStatus = () => {
    if (networkQuality.uplink === 1) {
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

  return (
    <div>
      {updateNetworkStatus()}
      <p>Connection State: {connectionState}</p>
      <br/>
      <button onClick={showStatistics}>Show Statistics</button>
      <button onClick={() => setRemoteVideoQuality()}>
        {isHighRemoteVideoQuality ? "Low Video Quality" : "High Video Quality"}
      </button>
      {!isDeviceTestRuning ? (
        <button onClick={() => setDeviceTestState(true)}>Start Device Test</button>
      ) : (
        <div>
          <button onClick={() => setDeviceTestState(false)}>Stop Device Test</button>
          <StartAudioDeviceTest localMicrophoneTrack={localMicrophoneTrack}/>
          <StartVideoDeviceTest localCameraTrack={localCameraTrack}/>
        </div>
      )}
    </div>
  );
};
const StartVideoDeviceTest = (props: {localCameraTrack: ICameraVideoTrack}) => {
  useJoin(
    {
      appid: config.appId,
      channel: config.channelName,
      token: config.rtcToken,
    },
    true,
  );

  const div = useRef<HTMLDivElement | null>(null);
      useAutoPlayVideoTrack(props.localCameraTrack, true, div.current);
  return (
    <div >
      <div ref={ref => (div.current = ref)} style={{ width: "600px", height: "600px" }} />
    </div>
  );
};


const StartAudioDeviceTest = (props: {localMicrophoneTrack: ILocalAudioTrack}) => {
  useJoin(
    {
      appid: config.appId,
      channel: config.channelName,
      token: config.rtcToken,
    },
    true,
  );


  useAutoPlayAudioTrack(props.localMicrophoneTrack, true);
  const volume = useVolumeLevel();
  return (
      <div className="h-screen p-3">
        <p>local Audio Volume: {volume}</p>
      </div>
  );
};


export default EnsureCallQuality;

