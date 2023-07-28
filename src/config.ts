import { EncryptionMode, UID } from "agora-rtc-sdk-ng";

const config: configType = {
  uid: 0,
  appId: "0cc8ea75bf504ed08d3e8f5ef3c371bf",
  channelName: "test",
  rtcToken: "007eJxTYDiQetjRbMM/SeUHzy+c2nxs42L2w2X6fIyTNv/o/FR5w2yzAoNBcrJFaqK5aVKaqYFJaoqBRYpxqkWaaWqacbKxuWFS2qqDh1IaAhkZ9qa7MjEyQCCIz8JQklpcwsAAAEA9IxU=",
  serverUrl: "https://agora-token-service-production-b75a.up.railway.app/",
  proxyUrl: "http://localhost:8080/",
  tokenExpiryTime: 600,
  token: "",
  encryptionMode: "aes-128-xts",
  salt: "oR+2M7bd5eX7twnkzHUnT6f7+HZNVer/ea0v9JxBqCE=",
  cipherKey: "1a685b2079334db10a434c0d10e43b35afd10f03bf541a15f1561139f26b95d5",
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
