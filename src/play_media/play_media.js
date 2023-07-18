/*import React, {useEffect, useState} from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";
import AgoraRTC from "agora-rtc-sdk-ng";

// Initialize the Agora application ID, token, and channel name
const appId = "";
const channelName = "";
const token = "";

const PlayMedia = (props) => {
  const agoraManager = AgoraManager({
    appId: props.appId || appId,
    channelName: props.channelName || channelName,
    token: props.token || token
  });
  const [initialized, setInitialized] = useState(false);
  const [isMediaPlaying, setMediaPlaying] = useState(false);
  const [audioFileTrack, setAudioFileTrack] = useState(null);
  const [agoraEngine, setAgoraEngine] = useState(null);


  useEffect(() => 
  {
    setupVideoSDKEngine(); // Initialize Agora SDK engine
  });

  // Initialize Agora SDK engine for video
  const setupVideoSDKEngine = async () => {
    if(!initialized)
    {
      const engine = await agoraManager.setupVideoSDKEngine();
      setInitialized(true);
      setAgoraEngine(engine);
    }
    };
  const playAudioFile = async () => 
  {
      if (!isMediaPlaying) {
        if (agoraManager.joined) { 
          // Create an audio track from a source file
          try {
            const track = await AgoraRTC.createBufferSourceAudioTrack({
              cacheOnlineFile: false,
              source: "/sampleFile.wav",
            });
  
            agoraEngine.publish([track]);
            track.startProcessAudioBuffer({ loop: false });
            track.play();

            setMediaPlaying(true);
            setAudioFileTrack(track);
          } catch (error) {
            console.error("Failed to play audio file:", error);
          }
        } else {
          console.log('Join a channel first to stream media to the channel');
        }
      } else {
          agoraEngine.unpublish([audioFileTrack]);
          audioFileTrack.close();
          setMediaPlaying(false);
          setAudioFileTrack(null);
      }
    }
  
  const handleJoinCall = async () => {
    await agoraManager.joinCall();
  };

  const handleLeaveCall = async () => {
    await agoraManager.leaveCall();
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
            {isMediaPlaying ? (
              <button type="button" onClick={playAudioFile}>
                Stop audio file
              </button>
            ) : (
              <button type="button" onClick={playAudioFile}>
                Play audio file
              </button>
            )}
          </div>
        }
      />
    </div>
  );
};

export default PlayMedia;
*/