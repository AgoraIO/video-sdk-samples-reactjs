import { useEffect, useRef, useState } from "react";
import AgoraRTC, { IBufferSourceAudioTrack, UID } from "agora-rtc-sdk-ng";
import {
  SpatialAudioExtension,
  SpatialAudioProcessor,
} from "agora-extension-spatial-audio";
import {
  useConnectionState,
  useRemoteUsers,
  useRTCClient,
  AgoraRTCProvider
} from "agora-rtc-react";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";

const extension = new SpatialAudioExtension({
  assetsPath: "./node_modules/agora-extension-spatial-audio/external/",
});

function SpatialAudio() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <div>
      <h1>Spatial Audio Extension</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <AuthenticationWorkflowManager>
          <SpatialAudioComponent />
        </AuthenticationWorkflowManager>
      </AgoraRTCProvider>
    </div>
  );
}

const AudioFileTrack: React.FC<{ track: IBufferSourceAudioTrack }> = ({ track }) => {
  useEffect(() => {
    track.startProcessAudioBuffer({ loop: true });
    track.play(); // to play the track for the local user
    return () => {
      track.stopProcessAudioBuffer();
      track.stop();
    };
  }, [track]);
  return <div> Audio file is playing. Use +/- to change the spatial audio position </div>;
};

function SpatialAudioComponent() {
  const [isSpatialAudio, setSpatialAudioState] = useState(false);
  const connectionState = useConnectionState();

  return (
    <div>
      {isSpatialAudio ? (
        <div>
          <button onClick={() => setSpatialAudioState(false)}>
            Disable spatial audio
          </button>
          <AgoraExtensionComponent />
        </div>
      ) : (
        <button
          onClick={() => setSpatialAudioState(true)}
          disabled={connectionState !== "CONNECTED"}
        >
          Enable spatial audio
        </button>
      )}
    </div>
  );
}

function AgoraExtensionComponent() {
  const [isMediaPlaying, setMediaPlaying] = useState(false);
  const [isRegistered, setRegistered] = useState(false);

  const [audioFileTrack, setAudioFileTrack] = useState<
    IBufferSourceAudioTrack | null
  >(null);
  const remoteUsers = useRemoteUsers();
  const numberOfRemoteUsers = remoteUsers.length;
  const remoteUser = remoteUsers[numberOfRemoteUsers - 1];
  const processors = useRef<Map<string | UID, SpatialAudioProcessor>>(
    new Map()
  );
  const [distance, setDistance] = useState(0);
  const mediaPlayerKey = "media-player";

  useEffect(() => {

    const cleanupFunction = () => {
      console.log("hook destroyed");
    
      try {
        const disablePromises = Array.from(processors.current.values()).map(async (processor) => {
          if (processor) {
            await processor.disable();
          }
        });
    
        Promise.all(disablePromises).catch((reason) => console.log(reason));
        processors.current.clear();
        AgoraRTC.registerExtensions([]);
      } catch (error) {
        console.error("Error in cleanup:", error);
      }
    };
    
    const initializeSpatialProcessor = async () => {
      if(!isRegistered)
      {
        console.log("Registering spatial audio extension...");
        AgoraRTC.registerExtensions([extension]);
        setRegistered(true);
      }
      if (remoteUser && !processors.current.has(remoteUser.uid)) {
        console.log("Initializing spatial audio processor...");
        try {
          const processor = extension.createProcessor();
          processors.current.set(remoteUser.uid, processor);
          remoteUser.audioTrack?.pipe(processor).pipe(remoteUser.audioTrack.processorDestination);
          await processor.enable();
        } catch (error) {
          console.error("Error enabling spatial extension:", error);
        }
      }
    };
  

    void initializeSpatialProcessor();

    return cleanupFunction;
  }, [remoteUser, isRegistered]);

  const updatePosition = () => {
    if (isMediaPlaying === false && !remoteUser) {
      console.log("Currently, there is no remote user in the channel. To test spatial audio, please click the 'Play Audio File' button");
      return;
    }
    if (isMediaPlaying) {
      const processorRef = processors.current.get(mediaPlayerKey);
      processorRef?.updatePlayerPositionInfo({
        position: [distance, 0, 0],
        forward: [1, 0, 0],
      });
    } else {
      const processorRef = processors.current.get(remoteUser.uid);
      processorRef?.updateRemotePosition({
        position: [distance, 0, 0],
        forward: [1, 0, 0],
      });
    }
  };

  const increaseDistance = () => {
    setDistance(distance + 5);
  };

  const decreaseDistance = () => {
    setDistance(distance - 5);
  };

  useEffect(() => {
    updatePosition();
  }, [distance]);

  const PlayMediaFile = () => {
    const processor = processors.current.get(mediaPlayerKey);
    if (!processor) {
      const processorRef = extension.createProcessor();
      processors.current.set(mediaPlayerKey, processorRef);
      AgoraRTC.createBufferSourceAudioTrack({
        source: "../src/assets/sample.wav", // Replace with the actual audio file path
      }).then((track) => {
        track.pipe(processorRef).pipe(track.processorDestination);
        setAudioFileTrack(track);
      })
        .catch((error) => console.log(error));
    }
    setMediaPlaying(!isMediaPlaying);
  };

  return (
    <div>
      <button onClick={increaseDistance}>+</button>
      <span>{distance}</span>
      <button onClick={decreaseDistance}>-</button>
      <button onClick={PlayMediaFile}>
        {isMediaPlaying ? "Stop Audio File" : "Play Audio File"}
      </button>
      {isMediaPlaying && audioFileTrack && <AudioFileTrack track={audioFileTrack} />}
    </div>
  );
}

export default SpatialAudio;
