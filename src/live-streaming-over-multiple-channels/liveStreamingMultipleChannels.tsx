import {
    AgoraRTCProvider,
    useRTCClient,
    useConnectionState,
    usePublish,
    useJoin,
    useRemoteUsers,
    RemoteUser,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    useClientEvent,
  } from "agora-rtc-react";

import AgoraRTC, { IAgoraRTCClient, ChannelMediaRelayState, ChannelMediaRelayError, ChannelMediaRelayEvent } from "agora-rtc-sdk-ng";
import config from "../agora-manager/config";
import {useState} from 'react';
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";

export function LiveStreamingMultipleChannels() {
    const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: 'vp8', mode: 'live' }));
    const agoraEngineSubscriber = AgoraRTC.createClient({ codec: "vp9", mode: "live" });

    return (
      <div>
        <h1>Live Streaming over Multiple Channels</h1>
        <AgoraRTCProvider client={agoraEngine}>
          <AuthenticationWorkflowManager>
            <ChannelMediaRelay />
            <AgoraRTCProvider client={agoraEngineSubscriber}>
                {(config.secondChannel !== "" && config.secondChannelToken !== "") ? (
                <JoinSecondChannel agoraEngineSubscriber={agoraEngineSubscriber} />
                ) : (
                    <div>
                        <label>Please specify a name, token and uid for the second channel in the config file</label>
                    </div>
                )}
            </AgoraRTCProvider>
          </AuthenticationWorkflowManager>
        </AgoraRTCProvider>
      </div>
    );
  }
  
  const JoinSecondChannel = ({ agoraEngineSubscriber }: { agoraEngineSubscriber: IAgoraRTCClient }) => {

    const [joinSecondChannelVisible, setJoinSecondChannelVisible] = useState(false);
    const remoteUsers = useRemoteUsers();
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack(joinSecondChannelVisible);
    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack(joinSecondChannelVisible);

    const connection = useConnectionState(agoraEngineSubscriber);

    useJoin({
        appid: config.appId,
        channel: config.secondChannel,
        token: config.secondChannelToken,
        uid: config.secondChannelUID,
      }, joinSecondChannelVisible, agoraEngineSubscriber);

    usePublish([localMicrophoneTrack, localCameraTrack], (connection == "CONNECTED") && joinSecondChannelVisible , agoraEngineSubscriber);

    const handleButtonClick = () => {
      setJoinSecondChannelVisible((prev) => !prev);
      // You can perform any other logic here if needed
    };

    return(
        <div>
            <button onClick={handleButtonClick}>
            {joinSecondChannelVisible ? 'Leave Second Channel' : 'Join Second Channel'}
            </button>
            {remoteUsers.map((remoteUser) => (
          <div className="vid" style={{ height: 300, width: 600 }} key={remoteUser.uid}>
            <label> Remote user {remoteUser.uid} from the `{config.secondChannel}` channel </label>
            <RemoteUser user={remoteUser} playVideo={true} playAudio={true} />
          </div>
        ))}
        </div>
    )
  }
  
  const useChannelMediaRelayState = () => {
    const agoraEngine = useRTCClient();
    useClientEvent(agoraEngine, "channel-media-relay-state", (state: ChannelMediaRelayState, code: ChannelMediaRelayError) => {
      console.log("Channel media relay state changed :", state);
      if(code)
      {
        console.error("Channel media relay error :", code);
      }
    });
  };

  const useChannelMediaRelayEvent = () => {
    const agoraEngine = useRTCClient();
    useClientEvent(agoraEngine, "channel-media-relay-event", (event: ChannelMediaRelayEvent) => {
      console.log("Channel media relay event :", event);
    })
  };
  
  const ChannelMediaRelay = () => {
    const agoraEngine = useRTCClient();
    const channelMediaConfig = AgoraRTC.createChannelMediaRelayConfiguration();
    const [isRelayRunning, setIsRelayRunning] = useState<boolean>(false);
    const connectionState = useConnectionState();

    useChannelMediaRelayState();
    useChannelMediaRelayEvent();
    if(config.destChannelName === "" || config.destChannelToken === "")
    {
        console.log("Please specify a valid channel name and a valid token for the destination channel in the config file");
        return;
    }
    
    channelMediaConfig.setSrcChannelInfo({
      channelName: config.channelName,
      token: config.rtcToken,
      uid: 0,
    });
  
    channelMediaConfig.addDestChannelInfo({
      channelName: config.destChannelName,
      token: config.destChannelToken,
      uid: config.destUID,
    });

    const startChannelMediaRelay = () => {
      agoraEngine
        .startChannelMediaRelay(channelMediaConfig)
        .then(() => {
          console.log("Channel relay started successfully");
          setIsRelayRunning(true);
        })
        .catch((e) => {
          console.log(`startChannelMediaRelay failed`, e);
        });
    };
  
    const stopChannelMediaRelay = () => {
      agoraEngine.stopChannelMediaRelay()
        .then(() => {
          console.log("Channel relay stopped successfully");
          setIsRelayRunning(false);
        })
        .catch((e) => {
          console.log(`stopChannelMediaRelay failed`, e);
        });
    };
  
    return (
      <div>
        <button onClick={isRelayRunning ? stopChannelMediaRelay : startChannelMediaRelay} disabled = {connectionState !== "CONNECTED"}>
          {isRelayRunning ? "Stop Channel Relay" : "Start Channel Relay"}
        </button>
      </div>
    );
  };
  
  export default LiveStreamingMultipleChannels;
  