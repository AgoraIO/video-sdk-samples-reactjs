import React, { useEffect, useRef } from "react";

const VideoCallUI = ({
  title,
  joined,
  showVideo,
  localVideoTrack,
  remoteVideoTrack,
  handleJoinCall,
  handleLeaveCall,
  additionalContent
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      localVideoTrack.play(localVideoRef.current);
    }

    if (remoteVideoTrack && remoteVideoRef.current) {
      remoteVideoTrack.play(remoteVideoRef.current);
    }

    return () => {
      if (localVideoTrack && !showVideo) {
        localVideoTrack.stop();
      }

      if (remoteVideoTrack && !showVideo) {
        remoteVideoTrack.stop();
      }
    };
  }, [localVideoTrack, remoteVideoTrack, showVideo]);

  return (
    <div>
      <header className="App-header">
        <h1>{title}</h1>
      </header>
      <div>
        <div>
          <button onClick={joined ? handleLeaveCall : handleJoinCall}>
            {joined ? "Leave" : "Join"}
          </button>
        </div>
        {additionalContent && (
          <div>
            {/* Render additional content here */}
            {additionalContent}
          </div>
        )}
        {showVideo && (
          <div id="videos">
            <div className="vid" style={{ height: "95%", width: "95%" }}>
              {localVideoTrack && <video ref={localVideoRef} autoPlay />}
            </div>
            <div className="vid" style={{ height: "95%", width: "95%" }}>
              {remoteVideoTrack && <video ref={remoteVideoRef} autoPlay />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallUI;
