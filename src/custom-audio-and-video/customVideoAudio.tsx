import React, { useState, useEffect } from "react";
import {
  AgoraRTCProvider,
  useRTCClient,
  useConnectionState,
} from "agora-rtc-react";
import AgoraRTC, {ILocalAudioTrack, ILocalVideoTrack} from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
import { useAgoraContext } from "../agora-manager/agoraManager";
import config from "../agora-manager/config";

function CustomVideoAndAudio() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: config.selectedProduct }));

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

  // Create custom audio track using the user's media devices
  const createCustomAudioTrack = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioMediaStreamTracks = stream.getAudioTracks();
        // For demonstration purposes, we used the default audio device. In a real-time scenario, you can use the dropdown to select the audio device of your choice.
        setCustomAudioTrack(AgoraRTC.createCustomAudioTrack({ mediaStreamTrack: audioMediaStreamTracks[0] }));
      })
      .catch((error) => console.error(error));
  };

  // Create custom video track using the user's media devices
  const createCustomVideoTrack = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const videoMediaStreamTracks = stream.getVideoTracks();
        // For demonstration purposes, we used the default video device. In a real-time scenario, you can use the dropdown to select the video device of your choice.
        setCustomVideoTrack(AgoraRTC.createCustomVideoTrack({ mediaStreamTrack: videoMediaStreamTracks[0] }));
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (connectionState === "CONNECTED") {
      createCustomAudioTrack();
      createCustomVideoTrack();
    }
  }, [connectionState]);

  return (
    <div>
      {customMediaState ? (
        <div>
          <button onClick={() => enableCustomMedia(!customMediaState)}>Disable Media Customization</button>
          <div>Customized audio/video tracks playing</div>
          <CustomAudioComponent customAudioTrack={customAudioTrack} />
          <CustomVideoComponent customVideoTrack={customVideoTrack} />
        </div>
      ) : (
        <button onClick={() => enableCustomMedia(!customMediaState)} disabled={connectionState !== "CONNECTED"}>
          Enable Media Customization
        </button>
      )}
    </div>
  );
};

const CustomAudioComponent: React.FC<{ customAudioTrack: ILocalAudioTrack | null }> = ({ customAudioTrack }) => {
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

const CustomVideoComponent: React.FC<{ customVideoTrack: ILocalVideoTrack | null }> = ({ customVideoTrack }) => {
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
