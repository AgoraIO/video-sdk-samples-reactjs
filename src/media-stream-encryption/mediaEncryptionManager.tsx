// Import statements
import { useEffect } from "react";
import { useRTCClient } from 'agora-rtc-react';
import config from '../agora-manager/config.ts';
import AuthenticationWorkflowManager from '../authentication-workflow/authenticationWorkflowManager.tsx';

const useMediaEncryption = () => {
  const agoraEngine = useRTCClient();
  useEffect(() => 
  {
    // Convert the salt string to Uint8Array.
    const salt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 1, 2]);
    // Set an encryption mode.
    const encryptionMode = config.encryptionMode || "aes-128-gcm2";
    // Start channel encryption
    agoraEngine.setEncryptionConfig(encryptionMode, config.cipherKey, salt);
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts
};

function MediaEncryptionManager() {
  useMediaEncryption();
  return (
    <div>
      <AuthenticationWorkflowManager />
    </div>
  );
}

export default MediaEncryptionManager;
