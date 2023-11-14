import { AgoraRTCProvider, useRTCClient, useConnectionState } from "agora-rtc-react";
import { useState, useEffect } from "react";
import AgoraRTC, {ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
import { useAgoraContext } from "../agora-manager/agoraManager";
function CustomVideoAndAudio() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <div>
      <h1>Custom video and audio sources</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <AuthenticationWorkflowManager>
          <CustomVideoAndAudioComponent />
        </AuthenticationWorkflowManager>      
      </AgoraRTCProvider>
    </div>
  );
}

const CustomVideoAndAudioComponent: React.FC = () => {
  const [customAudioTrack, setCustomAudioTrack] = useState<ILocalAudioTrack | null>(null);
  const [customVideoTrack, setCustomVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const connectionState = useConnectionState();
  const [customMediaState, enableCustomMedia] = useState(false);

  // Create custom audio and video tracks using the user's media devices
  const createCustomAudioAndVideoTracks = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        const audioMediaStreamTracks = stream.getAudioTracks();
        const videoMediaStreamTracks = stream.getVideoTracks();
        // For demonstration purposes, we used the default audio/video devices. In a real-time scenario, you can use the dropdown to select the audio/video device of your choice.
        setCustomAudioTrack(AgoraRTC.createCustomAudioTrack({ mediaStreamTrack: audioMediaStreamTracks[0] }));
        setCustomVideoTrack(AgoraRTC.createCustomVideoTrack({ mediaStreamTrack: videoMediaStreamTracks[0] }));
      }).catch((error) => console.error(error));
  };

  useEffect(() => {
    if (connectionState === "CONNECTED") {
      createCustomAudioAndVideoTracks();
    }
  }, [connectionState]);

  return (
    <div>
      {customMediaState ? (
        <div>
        <button onClick={() => enableCustomMedia(!customMediaState)}>Disable Media Customization</button>
        <div>Customized audio/video tracks playing</div>
        <CustomAudioTrack customAudioTrack={customAudioTrack} />
        <CustomVideoTrack customVideoTrack={customVideoTrack} />
        </div>
      ) : (
        <button onClick={() => enableCustomMedia(!customMediaState)} disabled = {connectionState !== "CONNECTED"}>Enable Media Customization</button>
      )}
    </div>
  );
};

const CustomAudioTrack: React.FC<{ customAudioTrack: ILocalAudioTrack | null }> = ({ customAudioTrack }) => {
  const agoraContext = useAgoraContext();

  useEffect(() => {
    if (customAudioTrack && agoraContext.localMicrophoneTrack) {
      agoraContext.localMicrophoneTrack.stop(); // Stop the default microphone track
      customAudioTrack?.play(); // Play the custom audio track for the local user
    }

    return () => {
      customAudioTrack?.stop(); // Stop the custom audio track when the component unmounts
    };
  }, [customAudioTrack, agoraContext.localMicrophoneTrack]);

  return <></>;
};

const CustomVideoTrack: React.FC<{ customVideoTrack: ILocalVideoTrack | null }> = ({ customVideoTrack }) => {
  const agoraContext = useAgoraContext();

  useEffect(() => {
    if (customVideoTrack && agoraContext.localCameraTrack) {
      const mediaStreamTrack = customVideoTrack.getMediaStreamTrack();
      agoraContext.localCameraTrack.replaceTrack(mediaStreamTrack, true)
        .then(() => console.log("The default local video track has been changed"))
        .catch((error) => { console.log(error) })
    }

    return () => {
      customVideoTrack?.stop(); // Stop the custom video track when the component unmounts
    };
  }, [agoraContext.localCameraTrack, customVideoTrack]);

  return <></>;
};

export default CustomVideoAndAudio;
