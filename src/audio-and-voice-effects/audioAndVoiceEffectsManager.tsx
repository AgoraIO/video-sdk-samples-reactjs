// EnsureCallQualityManager.tsx
import React, { useState } from "react";
import { usePublish, useRTCClient, useConnectionState } from "agora-rtc-react";
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
  const connectionState = useConnectionState();
  usePublish([audioFileTrack]);


  // Event handler for changing the audio playback device
  const handleAudioRouteChange = () => {
    if (audioFileTrack) {
      const deviceID = document.getElementById("PlayoutDevice")?.value;
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

  // Event handler for starting/stopping audio mixing
  const handleAudioMixing = () => {
    if (!audioFileTrack) {
      console.log("Please select an audio file to create a custom track");
      return;
    }
    if(connectionState === "DISCONNECTED")
    {
        console.log("You cannot mix audio before joining a channel")
        return;
    }
    if (!isAudioMixing) {
      try {
        // Start processing the audio data from the audio file.
        audioFileTrack.startProcessAudioBuffer();
        agoraEngine.publish(audioFileTrack);
        audioFileTrack.play();
        setAudioMixing(true);
      } catch (error) {
        console.error("Error starting audio mixing:", error);
      }
    } else {
      try {
        // To stop audio mixing, stop processing the audio data and unpublish the audioFileTrack.
        audioFileTrack.stopProcessAudioBuffer();
        audioFileTrack.stop();
        agoraEngine.unpublish(audioFileTrack);
        setAudioMixing(false);
      }
      catch (error) 
      {
        console.error("Error stopping audio mixing:", error);
      }
    }
  };

  // Fetch the available audio playback devices when the component mounts
  React.useEffect(() => {
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
