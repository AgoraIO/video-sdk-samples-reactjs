// Import statements
import { useRTCClient } from "agora-rtc-react";
import config from "../agora-manager/config.ts";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager.tsx";

function base64ToUint8Array(props: { base64Str: string }) {
  const raw = window.atob(props.base64Str);
  const result = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i += 1) {
    result[i] = raw.charCodeAt(i);
  }
  return result;
}

function hex2ascii(props: { hexx: string }) {
  let str = "";
  const hexx = props.hexx;
  for (let i = 0; i < hexx.length; i += 2) {
    str += String.fromCharCode(parseInt(hexx.substr(i, 2), 16));
  }
  return str;
}

const useMediaEncryption = () => {
  const agoraEngine = useRTCClient();
  // Convert the salt string to base64ToUint8Array.
  const salt = base64ToUint8Array({ base64Str: config.salt });
  // Convert the cipherKey string to hex2ascii.
  config.cipherKey = hex2ascii({ hexx: config.cipherKey });
  // Set an encryption mode.
  config.encryptionMode = "aes-256-gcm2";
  // Start channel encryption
  agoraEngine.setEncryptionConfig(config.encryptionMode, config.cipherKey, salt);
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
