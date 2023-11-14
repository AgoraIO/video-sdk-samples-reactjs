import { EncryptionMode, UID } from "agora-rtc-sdk-ng";

const config: configType = {
  uid: 0,
  appId: "",
  channelName: "test",
  rtcToken: "",
  serverUrl: "",
  proxyUrl: "http://localhost:8080/",
  tokenExpiryTime: 600,
  token: "",
  encryptionMode: "aes-128-gcm2",
  salt: "",
  cipherKey: "",
  destChannelName: "",
  destChannelToken: "",
  destUID: 2,
  secondChannel: "",
  secondChannelToken: "",
  secondChannelUID: 2
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
  destUID: number;
  destChannelName: string,
  destChannelToken: string,
  secondChannel: string,
  secondChannelToken: string
  secondChannelUID: number
};

export default config;