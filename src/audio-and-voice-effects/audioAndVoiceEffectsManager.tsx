import "../App.css";
import React, { useEffect, useRef, useState } from "react";
import { usePublish, useRTCClient, useConnectionState, useTrackEvent } from "agora-rtc-react";
import AgoraRTC, { IBufferSourceAudioTrack } from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";

function AudioAndVoiceEffectsManager(): JSX.Element {
  return (
    <div>
      <AuthenticationWorkflowManager>
        <AudioAndVoiceEffectsComponent />
      </AuthenticationWorkflowManager>
    </div>
  );
}

const AudioMixing: React.FC<{ track: IBufferSourceAudioTrack }> = ({ track }) => {
  usePublish([track]);

  useEffect(() => {
    track.startProcessAudioBuffer();
    track.play(); // to play the track for the local user
    return () => {
      track.stopProcessAudioBuffer();
      track.stop();
    };
  }, [track]);

  return <div> Audio mixing is in progress </div>;
};

const AudioAndVoiceEffectsComponent: React.FC = () => {
  const [isAudioMixing, setAudioMixing] = useState(false);
  const [audioFileTrack, setAudioFileTrack] = useState<IBufferSourceAudioTrack | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [playbackDevices, setPlaybackDevices] = useState<MediaDeviceInfo[]>([]);
  const playoutDeviceRef = useRef<HTMLSelectElement>(null);
  const connectionState = useConnectionState();

  // Event handler for changing the audio playback device
  const handleAudioRouteChange = () => {
    if (audioFileTrack) {
      const deviceID = playoutDeviceRef.current?.value;
      if (deviceID) {
        console.log("The selected device id is: " + deviceID);
        try {
          audioFileTrack.setPlaybackDevice(deviceID);
        } catch (error) {
          console.error("Error setting playback device:", error);
        }
      }
    }
  };

  // Event handler for selecting an audio file
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      try {
        setAudioFileTrack(await AgoraRTC.createBufferSourceAudioTrack({ source: selectedFile }));
      } catch (error) {
        console.error("Error creating buffer source audio track:", error);
      }
    }
  };

  // Fetch the available audio playback devices when the component mounts
  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices?.().then((devices) => {
      try {
        const playbackDevices = devices.filter((device) => device.kind === "audiooutput");
        setPlaybackDevices(playbackDevices);
        setShowDropdown(playbackDevices.length > 0);
      } catch (error) {
        console.error("Error enumerating playback devices:", error);
      }
    });
  }, []);

  return (
    <div>
      <br />
      <label htmlFor="filepicker">Select an audio file: </label>
      <input
        type="file"
        id="filepicker"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={connectionState === "DISCONNECTED"}
      />
      <br /><br />
      <button type="button" id="audioMixing" onClick={() => setAudioMixing((p) => !p)} disabled={!audioFileTrack}>
        {isAudioMixing ? "Stop audio mixing" : "Start audio mixing"}
      </button>
      <br /><br />
      {showDropdown && (
        <div>
          <label htmlFor="PlayoutDevice">Output Device: </label>
          <select ref={playoutDeviceRef} onChange={handleAudioRouteChange}>
            {playbackDevices.map((device, index) => (
              <option key={index} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {isAudioMixing && audioFileTrack && <AudioMixing track={audioFileTrack} />}
      <br />
    </div>
  );
};

export default AudioAndVoiceEffectsManager;
