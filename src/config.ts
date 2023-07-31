import { EncryptionMode, UID } from "agora-rtc-sdk-ng";

const config: configType = {
  uid: 0,
  appId: "30a6bc89994d4222a71eba01c253cbc7",
  channelName: "test",
  rtcToken: null,
  serverUrl: "http://localhost:8082", // without trailing slash
  proxyUrl: "", // without trailing slash
  tokenExpiryTime: 35,
  token: "",
  encryptionMode: "aes-128-xts",
  salt: new Uint8Array(),
  cipherKey: "",
};

export type configType = {
  uid: UID;
  appId: string;
  channelName: string;
  rtcToken: string | null;
  serverUrl: string;
  proxyUrl: string;
  tokenExpiryTime: number;
  token: string;
  encryptionMode: EncryptionMode;
  salt: Uint8Array;
  cipherKey: string;
};

export default config;
