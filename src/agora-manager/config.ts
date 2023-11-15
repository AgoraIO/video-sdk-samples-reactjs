import { EncryptionMode, UID, SDK_MODE } from "agora-rtc-sdk-ng";

const config: configType = {
  uid: 0,
  appId: "9d2498880e934632b38b0a68fa2f1622",
  channelName: "demo",
  rtcToken: "007eJxSYNhT/LXYPvnjQom0qoLdb8ItFV/Nz/yyoYTl/Kqn61XCgn4pMFimGJlYWlhYGKRaGpuYGRslGVskGSSaWaQlGqUZmhkZGXeFpBqUMjBk97sxMEIhiM/CkJKam8/AAAgAAP//n6kfZg==",
  serverUrl: "https://agora-token-service-production-b619.up.railway.app/",
  proxyUrl: "http://localhost:8080/",
  tokenExpiryTime: 600,
  token: "007eJxSYNhUmaX6NkvysPbes49EjarnLTljfNxXd4NyaeP9tNzdulkKDJYpRiaWFhYWBqmWxiZmxkZJxhZJBolmFmmJRmmGZkZGcRbBqQalDAzHP7xlZWSAQBCfhSElNTefgQEQAAD//yj1HtA=",
  encryptionMode: "aes-128-gcm2",
  salt: "",
  cipherKey: "",
  destChannelName: "",
  destChannelToken: "",
  destUID: 2,
  secondChannel: "",
  secondChannelToken: "",
  secondChannelUID: 2,
  selectedProduct: "rtc"
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
  secondChannelUID: number,
  selectedProduct: SDK_MODE
};

export default config;