import React, { useEffect, useRef } from "react";

class VideoCallUI extends Component {
  constructor(props) {
    super(props);
    // Create references for the local and remote video elements
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
  }
  componentDidUpdate(prevProps) 
  {
    if(prevProps.localVideoTrack!== null || prevProps.remoteVideoTrack !== null)
    {
      this.playVideoTracks();
    }
  }
  playVideoTracks() {
    const { localVideoTrack, remoteVideoTrack } = this.props;
    // Play the local video track on the local video element
    if (localVideoTrack && this.localVideoRef.current) 
    {
      localVideoTrack.play(this.localVideoRef.current);
    }
    // Play the remote video track on the remote video element
    if (remoteVideoTrack && this.remoteVideoRef.current) {
      remoteVideoTrack.play(this.remoteVideoRef.current);
    }
  }

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
