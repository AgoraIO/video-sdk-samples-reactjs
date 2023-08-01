import { EncryptionMode, UID } from "agora-rtc-sdk-ng";

const config: configType = {
  uid: 0,
  appId: "",
  channelName: "test",
  rtcToken: null,
  serverUrl: "", // without trailing slash
  proxyUrl: "http://localhost:8080/", // without trailing slash
  tokenExpiryTime: 600,
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
