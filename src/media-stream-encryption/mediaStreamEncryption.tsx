// Import statements
import { AgoraRTCProvider, useRTCClient, useClientEvent } from 'agora-rtc-react';
import config from '../agora-manager/config.ts';
import AuthenticationWorkflowManager from '../authentication-workflow/authenticationWorkflowManager.tsx';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useEffect } from "react";

const stringToUint8Array = (str: string): Uint8Array => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};
const useCryptError = () => {
  const agoraEngine = useRTCClient();
  useClientEvent(agoraEngine,"crypt-error" , () => {
    console.log("decryption failed");
  });
};
function MediaEncryption() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: config.selectedProduct }));

  return (
    <div>
      <h1>Secure channel encryption</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <MediaEncryptionManager />
      </AgoraRTCProvider>
    </div>
  );
}

const useMediaEncryption = () => {
  const agoraEngine = useRTCClient();
  useEffect(() => 
  {
    const salt = stringToUint8Array(config.salt);
    // Start channel encryption
    agoraEngine.setEncryptionConfig(config.encryptionMode, config.encryptionKey, salt);
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts
};

function MediaEncryptionManager() {
  useMediaEncryption();
  useCryptError();
  return (
    <div>
      <AuthenticationWorkflowManager />
    </div>
  );
}
export default MediaEncryption;
