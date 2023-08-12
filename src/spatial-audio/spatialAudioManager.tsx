import { useEffect, useRef, useState } from "react";
import AgoraRTC, { IBufferSourceAudioTrack, UID } from "agora-rtc-sdk-ng";
import {
  SpatialAudioExtension,
  SpatialAudioProcessor,
} from "agora-extension-spatial-audio";
import {
  useConnectionState,
  useRemoteUsers
} from "agora-rtc-react";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";

function SpatialAudioManager(): JSX.Element {
  return (
    <div>
      <AuthenticationWorkflowManager>
        <SpatialAudioComponent />
      </AuthenticationWorkflowManager>
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
  const [audioFileTrack, setAudioFileTrack] = useState<
    IBufferSourceAudioTrack | null
  >(null);
  const remoteUsers = useRemoteUsers();
  const numberOfRemoteUsers = remoteUsers.length;
  const remoteUser = remoteUsers[numberOfRemoteUsers - 1];
  const extension = useRef<SpatialAudioExtension | null>(null);
  const processors = useRef<Map<string|UID, SpatialAudioProcessor>>(
    new Map()
  );
  const [distance, setDistance] = useState(0); 
  const mediaPlayerKey = "media-player";

  useEffect(() => {
    const initializeSpatialProcessor = async () => {
      if (extension.current === null) {
        extension.current = new SpatialAudioExtension({
          assetsPath: "./node_modules/agora-extension-spatial-audio/external/",
        });
        AgoraRTC.registerExtensions([extension.current]);
      }

      if (remoteUser) {
        console.log("Initializing spatial audio processor...");
        try {
          const processor = extension.current.createProcessor();
          processors.current.set(remoteUser.uid, processor);
          remoteUser.audioTrack?.pipe(processor).pipe(remoteUser.audioTrack.processorDestination);
          await processor.enable();
        } catch (error) {
          console.error("Error enabling spatial extension:", error);
        }
      }
    };

    void initializeSpatialProcessor();

    return () => {
      const disableSpatialAudio = async () => {
        console.log("hook destroyed");
        if(remoteUser)
        {
            const processor = processors.current.get(remoteUser.uid);
            processor?.unpipe();
            remoteUser.audioTrack?.unpipe();
            await processor?.disable();
        }
        if(audioFileTrack)
        {
          const processorMediaPlayer = processors.current.get(mediaPlayerKey);
          processorMediaPlayer?.unpipe();
          audioFileTrack?.unpipe();
          await processorMediaPlayer?.disable();
        }
      };
      void disableSpatialAudio();
    };
  }, []);

  const updatePosition = () => {
    if(isMediaPlaying === false && !remoteUser)
    {
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

  const PlayMediaFile = () =>
  {
    const processor = processors.current.get(mediaPlayerKey);
    if(!processor)
    {
      const processorRef = extension.current!.createProcessor();
      processors.current.set(mediaPlayerKey, processorRef);
      AgoraRTC.createBufferSourceAudioTrack({
        source: "../src/assets/sample.wav", // Replace with the actual audio file path
      }).then((track) => 
      {
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

export default SpatialAudioManager;
