// Import statements
import { useEffect } from "react";
import { useRTCClient } from 'agora-rtc-react';
import config from '../agora-manager/config.ts';
import AuthenticationWorkflowManager from '../authentication-workflow/authenticationWorkflowManager.tsx';
function base64ToUint8Array({ base64Str }) {
  const raw = window.atob(base64Str);
  const result = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i += 1) {
    result[i] = raw.charCodeAt(i);
  }
  return result;
}

function hex2ascii({ hexx }) {
  let str = '';
  for (let i = 0; i < hexx.length; i += 2) {
    str += String.fromCharCode(parseInt(hexx.substring(i, 2), 16));
  }
  return str;
}


const useMediaEncryption = () => {
  const agoraEngine = useRTCClient();
  useEffect(() => {
    // Convert the salt string to base64ToUint8Array.
    const salt = base64ToUint8Array({ base64Str: config.salt }) || config.salt;
    // Convert the cipherKey string to hex2ascii.
    const cipherKey = hex2ascii({ hexx: config.cipherKey }) || config.cipherKey;
    // Set an encryption mode.
    const encryptionMode = config.encryptionMode || "aes-256-gcm2";
    // Start channel encryption
    agoraEngine.setEncryptionConfig(encryptionMode, cipherKey, salt);
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts
};

function MediaEncryptionManager() {
  useMediaEncryption();
  return (
    <div>
      <AuthenticationWorkflowManager/>
    </div>
  );
}

export default MediaEncryptionManager;
