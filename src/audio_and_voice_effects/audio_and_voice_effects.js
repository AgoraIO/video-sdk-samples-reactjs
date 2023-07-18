/*import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-react-ng";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";

const AudioVoiceEffectsComponent = (props) => {
  // State variables
  const [isAudioMixing, setAudioMixing] = useState(false);
  const [audioFileTrack, setAuidoFileTrack] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [playbackDevices, setPlaybackDevices] = useState(null);
  const [agoraEngine, setAgoraEngine] = useState(null);
  const [initialized, setInitialized] = useState(false);

  

  // Initialize AgoraManager instance
  const agoraManager = AgoraManager({
    appId: props.appId || "",
    channelName: props.channelName || "",
    token: props.token || ""
  });

  // Run this effect only once on component mount
  useEffect(() => {
    setupVideoSDKEngine(); // Initialize Agora SDK engine
  });

  // Initialize Agora SDK engine for video
  const setupVideoSDKEngine = async () => {
    if (!initialized) {
      const engine =  await agoraManager.setupVideoSDKEngine();
      if (engine !== null) {
        setAgoraEngine(engine);
        let playbackDevices = await AgoraRTC.getPlaybackDevices(true);
        setPlaybackDevices(playbackDevices)
        engine.on("user-published", handleUserPublished);
        engine.on("user-unpublished", handleUserUnpublished);
        setInitialized(true);
    }
}
};
 // Event handler for when a user with audio is published
 const handleUserPublished = async (user, mediaType) => {
    if (user.hasAudio) {
      
        setShowDropdown(true);
    }
  };

  // Event handler for when a user with audio is unpublished
const handleUserUnpublished = (user, mediaType) => {
    setPlaybackDevices(null);
    setShowDropdown(false);
  };

  // Handler for joining a call
  const handleJoinCall = async () => {
    await agoraManager.joinCall();
  };

  // Handler for leaving a call
  const handleLeaveCall = async () => {
    await agoraManager.leaveCall();
    setShowDropdown(false);
    setAudioMixing(false);
    setAuidoFileTrack(null);
    // Reset the file picker
    const fileInput = document.getElementById("filepicker");
    if (fileInput) 
    {
        fileInput.value = null;
    }
  };

   // Event handler for changing the audio playback device
const handleAudioRouteChange = () => {
    const deviceID = document.getElementById("PlayoutDevice").value;
    console.log("The selected device id is : " + deviceID);
    agoraManager.remoteAudioTrack.setPlaybackDevice(deviceID);
  };

  // Event handler for selecting an audio file
const handleFileChange = async (event) => {
    setAuidoFileTrack(await AgoraRTC.createBufferSourceAudioTrack({ source: event.target.files[0]}));
  };
// Event handler for starting/stopping audio mixing
const handleAudioMixing = async () => {
    if (!audioFileTrack) {
      console.log("Please select an audio file to create a custom track");
      return;
    }
  
    if (!agoraManager.joined) {
      console.log("Join a channel first to start audio mixing");
      return;
    }
  
    if (agoraManager.joined && !isAudioMixing) {
      try {
        // Start processing the audio data from the audio file.
        await audioFileTrack.startProcessAudioBuffer();
        await agoraEngine.publish(audioFileTrack);
        await audioFileTrack.play();
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
  
  return (
    <div>
      <VideoCallUI
        title={props.title}
        joined={agoraManager.joined}
        showVideo={agoraManager.showVideo}
        localVideoTrack={agoraManager.localVideoTrack}
        remoteVideoTrack={agoraManager.remoteVideoTrack}
        handleJoinCall={handleJoinCall}
        handleLeaveCall={handleLeaveCall}
        additionalContent={
            <div>
            <label htmlFor="filepicker">Select an audio file:</label>
            <input type="file" id="filepicker" accept="audio/*" onChange={handleFileChange} />
            <br />
            <button type="button" id="audioMixing" onClick={handleAudioMixing}>
              {isAudioMixing ? 'Stop audio mixing' : 'Start audio mixing'}
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
        }
      />
    </div>
  );
};

export default AudioVoiceEffectsComponent
*/