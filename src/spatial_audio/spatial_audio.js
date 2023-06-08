import React, { useEffect, useState } from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";
import AgoraRTC from "agora-rtc-react";
import { SpatialAudioExtension } from "agora-extension-spatial-audio";

// Initialize the Agora application ID, token, and channel name
const appId = "";
const channelName = "";
const token = "";
let spatialSetupComplete = false;

const SpatialAudio = (props) => {
  const agoraManager = AgoraManager({
    appId: props.appId || appId,
    channelName: props.channelName || channelName,
    token: props.token || token
  });

  const [initialized, setInitialized] = useState(false);
  const [distance, setDistance] = useState(0);
  const [isMediaPlaying, setMediaPlaying] = useState(false);
  const [processors, setProcessors] = useState(null);
  const [spatialAudioExtension, setSpatialAudioExtension] = useState(null);
  const [mediaPlayerTrack, setMediaPlayerTrack] = useState(null);
  const [agoraEngine, setAgoraEngine] = useState(null);

  useEffect(() => {
    setupVideoSDKEngine(); // Initialize Agora SDK engine
  }, []);

  // Initialize Agora SDK engine for video
  const setupVideoSDKEngine = async () => {
    if (!initialized) {
      const engine = await agoraManager.setupVideoSDKEngine();
      if (engine) {
        engine.on("user-published", handleUserPublished);
      }
      setInitialized(true);
      setAgoraEngine(engine);
      await setupSpatial();
    }
  };

  const handleJoinCall = async () => {
    await agoraManager.joinCall();
  };

  const increaseDistance = () => {
    setDistance(distance + 5);
    updatePosition();
  };

  const setupSpatial = async () => {
    if (!spatialSetupComplete) {
      console.log("initialized");
      const processors = new SpatialAudioExtension({ assetsPath: '../../node_modules/agora-extension-spatial-audio/external/' });
      setProcessors(new Map());
      setSpatialAudioExtension(processors);
      AgoraRTC.registerExtensions([processors]);
      spatialSetupComplete = true;
    }
  };

  // Event handler for when a user with audio is published
  const handleUserPublished = async (user, mediaType) => {
    if (spatialAudioExtension && !spatialAudioExtension) {
      const processor = spatialAudioExtension._createProcessor();
      if (user.hasAudio) {
        setProcessors(new Map(processors).set(user.uid.toString(), processor));
        // Inject the SpatialAudioProcessor into the remote user's audio track
        const track = user.audioTrack;
        track.pipe(processor).pipe(track.processorDestination);
        // Play the remote audio track.
        track.play();
      }
    }
  };

  const decreaseDistance = () => {
    setDistance(distance - 5);
    updatePosition();
  };

  const updatePosition = () => {
    if (isMediaPlaying) {
      const processor = processors.get("media-player");
      processor.updatePlayerPositionInfo({
        position: [distance, 0, 0],
        forward: [1, 0, 0],
      });
    }
    if (agoraManager.remoteUid) {
      const processor = processors.get(agoraManager.remoteUid);
      processor.updateRemotePosition({
        position: [distance, 0, 0],
        forward: [1, 0, 0],
      });
    }
  };

  const handleLeaveCall = async () => {
    if (isMediaPlaying) {
      mediaPlayerTrack.setEnabled(false);
      setMediaPlaying(false);
    }
    await agoraManager.leaveCall();
  };

  const localPlayerStart = async () => {
    if (isMediaPlaying) {
      mediaPlayerTrack.setEnabled(false);
      setMediaPlaying(false);
      setMediaPlayerTrack(null);
      agoraEngine.unpublish(mediaPlayerTrack);
      return;
    }
    const processor = spatialAudioExtension.createProcessor();
    setProcessors(new Map(processors).set("media-player", processor));
    const track = await AgoraRTC.createBufferSourceAudioTrack({
      cacheOnlineFile: false,
      source: "/sampleFile.wav",
    });

    // Define the spatial position for the local audio player.
    const mockLocalPlayerNewPosition = {
      position: [0, 0, 0],
      forward: [0, 0, 0],
    };

    // Update the spatial position for the local audio player.
    processor.updatePlayerPositionInfo(mockLocalPlayerNewPosition);

    track.startProcessAudioBuffer({ loop: true });
    track.pipe(processor).pipe(track.processorDestination);
    track.play();
    agoraEngine.publish(track);
    setMediaPlayerTrack(track);
    setMediaPlaying(true);
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
            <p>
              {isMediaPlaying ? (
                <button type="button" onClick={localPlayerStart}>
                  Stop audio file
                </button>
              ) : (
                <button type="button" onClick={localPlayerStart}>
                  Play audio file
                </button>
              )}
            </p>
            <p>
              Distance:
              <button type="button" onClick={decreaseDistance}>-</button>
              <label>{distance}</label>
              <button type="button" onClick={increaseDistance}>+</button>
            </p>
          </div>
        }
      />
    </div>
  );
};

export default SpatialAudio;
