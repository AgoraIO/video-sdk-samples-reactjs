// Import statements
import { AgoraRTCProvider, useRTCClient } from 'agora-rtc-react';
import MediaEncryptionManager from './mediaEncryptionManager';
import AgoraRTC from 'agora-rtc-sdk-ng';
function MediaEncryption() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <div>
      <h1>Secure channel encryption</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <MediaEncryptionManager />
      </AgoraRTCProvider>
    </div>
  );
}

export default MediaEncryption;