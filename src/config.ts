import { EncryptionMode, UID } from "agora-rtc-sdk-ng";

const config: configType = {
  uid: 0,
  appId: "",
  channelName: "test",
  rtcToken: null,
  serverUrl: "", // without trailing slash
  proxyUrl: "http://localhost:8080/", // with trailing slash
  tokenExpiryTime: 600,
  token: "",
  encryptionMode: "aes-128-xts",
  salt: "",
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
  salt: string;
  cipherKey: string;
};

export default config;
