// EnsureCallQualityManager.tsx
import React, { useState } from "react";
import { useRTCClient } from "agora-rtc-react";
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

const AudioAndVoiceEffectsComponent: React.FC = () => {
  const [isAudioMixing, setAudioMixing] = useState(false);
  const [audioFileTrack, setAudioFileTrack] = useState<IBufferSourceAudioTrack | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [playbackDevices, setPlaybackDevices] = useState<MediaDeviceInfo[]>([]);
  const agoraEngine = useRTCClient();

  // Event handler for changing the audio playback device
  const handleAudioRouteChange = () => {
    if (audioFileTrack) {
      const deviceID = document.getElementById("PlayoutDevice")?.value;
      if (deviceID) {
        console.log("The selected device id is: " + deviceID);
        audioFileTrack.setPlaybackDevice(deviceID);
      }
    }
  };

  // Event handler for selecting an audio file
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setAudioFileTrack(await AgoraRTC.createBufferSourceAudioTrack({ source: selectedFile }));
    }
  };

  // Event handler for starting/stopping audio mixing
  const handleAudioMixing = async () => {
    if (!audioFileTrack) {
      console.log("Please select an audio file to create a custom track");
      return;
    }

    if (!isAudioMixing) {
      try {
        // Start processing the audio data from the audio file.
        audioFileTrack.startProcessAudioBuffer();
        await agoraEngine.publish(audioFileTrack);
        audioFileTrack.play();
        setAudioMixing(true);
      } catch (error) {
        console.log("Error starting audio mixing:", error);
      }
    } else {
      try {
        // To stop audio mixing, stop processing the audio data and unpublish the audioFileTrack.
        audioFileTrack.stopProcessAudioBuffer();
        audioFileTrack.stop();
        await agoraEngine.unpublish(audioFileTrack);
        setAudioMixing(false);
      } catch (error) {
        console.log("Error stopping audio mixing:", error);
      }
    }
  };

  // Fetch the available audio playback devices when the component mounts
  React.useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const playbackDevices = devices.filter((device) => device.kind === "audiooutput");
        setPlaybackDevices(playbackDevices);
        setShowDropdown(playbackDevices.length > 0);
      });
    }
  }, []);

  return (
    <div>
      <label htmlFor="filepicker">Select an audio file:</label>
      <input type="file" id="filepicker" accept="audio/*" onChange={handleFileChange} />
      <br />
      <button type="button" id="audioMixing" onClick={handleAudioMixing}>
        {isAudioMixing ? "Stop audio mixing" : "Start audio mixing"}
      </button>
      <br />
      {showDropdown && (
        <div>
          <label htmlFor="PlayoutDevice">Playout Device:</label>
          <select id="PlayoutDevice" onChange={handleAudioRouteChange}>
            {playbackDevices.map((device, index) => (
              <option key={index} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default AudioAndVoiceEffectsManager;
