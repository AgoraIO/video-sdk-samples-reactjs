// customVideoAudioManager.tsx
import "../App.css";
import React, { useEffect, useState } from "react";
import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { usePublish, useLocalCameraTrack, useConnectionState } from "agora-rtc-react";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";

function CustomVideoAndAudioManager(): JSX.Element {
  return (
    <div>
      <AuthenticationWorkflowManager>
        <CustomVideoAndAudioComponent />
      </AuthenticationWorkflowManager>
    </div>
  );
}

const CustomAudioTrack: React.FC<{ customAudioTrack: ILocalAudioTrack | null }> = ({ customAudioTrack }) => {
  usePublish([customAudioTrack]);

  useEffect(() => {
    customAudioTrack?.play(); // to play the track for the local user
    return () => {
      customAudioTrack?.stop();
    };
  }, [customAudioTrack]);

  return null;
};

const CustomVideoTrack: React.FC<{ customVideoTrack: ILocalVideoTrack | null }> = ({ customVideoTrack }) => {
  const { localCameraTrack } = useLocalCameraTrack();
  useEffect(() => {
    const mediaStreamTrack = customVideoTrack?.getMediaStreamTrack();
    if (mediaStreamTrack) {
      localCameraTrack?.replaceTrack(mediaStreamTrack, true)
        .then(() => console.log("Track replaced"))
        .catch((error) => console.error(error));
    }
    return () => {
      // Stop the replaced local camera track when the component unmounts
      localCameraTrack?.stop();
    };
  }, [customVideoTrack, localCameraTrack]);

  return null;
};

const CustomVideoAndAudioComponent: React.FC = () => {
  const [customAudioTrack, setCustomAudioTrack] = useState<ILocalAudioTrack | null>(null);
  const [customVideoTrack, setCustomVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const connectionState = useConnectionState();
  const [customMediaState, enableCustomMedia] = useState(false);

  // Create custom audio and video tracks using the user's media devices
  const createCustomAudioAndVideoTracks = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        const audioMediaStreamTracks = stream.getAudioTracks();
        const videoMediaStreamTracks = stream.getVideoTracks();
        setCustomAudioTrack(AgoraRTC.createCustomAudioTrack({ mediaStreamTrack: audioMediaStreamTracks[0] }));
        setCustomVideoTrack(AgoraRTC.createCustomVideoTrack({ mediaStreamTrack: videoMediaStreamTracks[0] }));
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (connectionState === "CONNECTED") {
      createCustomAudioAndVideoTracks();
    }
  }, [connectionState]);

  return (
    <div>
      {customMediaState ? (
        <button onClick={() => enableCustomMedia(!customMediaState)}>Disable Media Customization</button>
      ) : (
        <button onClick={() => enableCustomMedia(!customMediaState)}>Customize Media Source</button>
      )}
      {customMediaState && (
        <div>
            <div>Customized audio/video tracks playing</div>
            <CustomAudioTrack customAudioTrack={customAudioTrack} />
            <CustomVideoTrack customVideoTrack={customVideoTrack} />
        </div>
      )}
    </div>
  );
};

export default CustomVideoAndAudioManager;
