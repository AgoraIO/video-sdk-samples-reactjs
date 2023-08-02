import { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import MediaPlayingManager from "./playMediaManager";
function MediaPlaying() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <div>
      <h1>Stream media to a channel</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <MediaPlayingManager />
      </AgoraRTCProvider>
    </div>
  );
}

export default MediaPlaying;
