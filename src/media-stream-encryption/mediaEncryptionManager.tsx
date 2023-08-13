// Import statements
import { useEffect } from "react";
import { useRTCClient } from 'agora-rtc-react';
import config from '../agora-manager/config.ts';
import AuthenticationWorkflowManager from '../authentication-workflow/authenticationWorkflowManager.tsx';

function base64ToUint8Array(base64Str: string): number[] {
    const raw = window.atob(base64Str);
    const result = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i += 1) {
      result[i] = raw.charCodeAt(i);
    }
    return Array.from(result);
  }
  

function hexToAscii(hexString: string): string {
    let asciiString = '';
  
    for (let i = 0; i < hexString.length; i += 2) {
      const hexPair = hexString.substring(i, i + 2);
      const asciiCode = parseInt(hexPair, 16);
      asciiString += String.fromCharCode(asciiCode);
    }
  
    return asciiString;
  }  
const useMediaEncryption = () => {
  const agoraEngine = useRTCClient();
  useEffect(() => {
    // Convert the salt string to base64ToUint8Array.
    // const salt = base64ToUint8Array(config.salt) || config.salt;
    const salt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 1, 2]);

    // Convert the cipherKey string to ascii.
    const cipherKey = hexToAscii(config.cipherKey) || config.cipherKey;
    console.log(cipherKey);
    // Set an encryption mode.
    const encryptionMode = config.encryptionMode || "aes-256-gcm2";
    // Start channel encryption
    agoraEngine.setEncryptionConfig("aes-256-gcm2", "!@#ASDasd123", salt);
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
