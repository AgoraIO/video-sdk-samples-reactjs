import { EncryptionMode, UID } from "agora-rtc-sdk-ng";

const config: configType = {
  uid: 0,
  appId: "9d2498880e934632b38b0a68fa2f1622",
  channelName: "test",
  rtcToken: "",
  serverUrl: "https://agora-token-service-production-b75a.up.railway.app/",
  proxyUrl: "http://localhost:8080/",
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