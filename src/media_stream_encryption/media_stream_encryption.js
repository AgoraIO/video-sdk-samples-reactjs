/*import React, { useState, useEffect } from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";

const encryptionKey = "<Add a strong encryption key here>"; // Replace with a strong encryption key
const encryptionSaltBase64 = "<Encryption salt in base 64 format>";
const encryptionMode = "aes-256-gcm2";

function base64ToUint8Array(base64Str) {
  const binaryStr = atob(base64Str);
  const len = binaryStr.length;
  const uint8Array = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    uint8Array[i] = binaryStr.charCodeAt(i);
  }

  return uint8Array;
}

function hexToAscii(hexString) {
  let asciiString = "";
  for (let i = 0; i < hexString.length; i += 2) {
    const hexCode = parseInt(hexString.substr(i, 2), 16);
    asciiString += String.fromCharCode(hexCode);
  }
  return asciiString;
}

const MediaEncryptionComponent = (props) => {
  const [initialized, setInitialized] = useState(false);
  
  const agoraManager = AgoraManager({
    appId: props.appId || "",
    channelName: props.channelName || "",
    token: props.token || ""
  });

  useEffect(() => {
    setupVideoSDKEngine();
  });

  const setupVideoSDKEngine = async () => {
    if (!initialized) {
      const encryptionSalt = base64ToUint8Array(encryptionSaltBase64);
      const convertedKey = hexToAscii(encryptionKey);

      const engine = await agoraManager.setupVideoSDKEngine();
      if (engine !== null) {
        setInitialized(true);
      }
      await engine.setEncryptionConfig(encryptionMode, convertedKey, encryptionSalt);
      engine.on("crypt-error", (error) => {
        console.log("Crypt error:", error);
      });
    }
  };

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
      />
    </div>
  );
};

export default MediaEncryptionComponent;
*/