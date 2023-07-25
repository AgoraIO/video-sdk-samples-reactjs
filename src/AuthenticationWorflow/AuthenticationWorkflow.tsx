import { useEffect, useState } from "react";
import { GetStarted } from "../get-started-sdk/get-started-sdk";
import config from "../config.ts";

async function fetchRTCToken(channelName: string) {
  if (config.serverUrl !== "") {
    try {
      const response = await fetch(
        `${config.proxyUrl}/${config.serverUrl}/rtc/${channelName}/1/uid/${config.uid}/?expiry=${config.tokenExpiryTime}`
      );
      const data = await response.json();
      console.log("RTC token fetched from server: ", data.rtcToken);
      return data.rtcToken;
    } catch (error) {
      console.error(error);
      throw error;
    }
  } else {
    return config.rtcToken;
  }
}

function AuthenticationWorkflow() {
  const [token, setToken] = useState("");

  useEffect(() => {
    fetchRTCToken(config.channelName)
      .then((fetchedToken) => {
        setToken(fetchedToken);
      })
      .catch((error) => {
        setToken("");
        console.error(error);
      });
  }, [config.channelName]);

  if (!token) return <p>Fetching token</p>;

  return (
    <div>
      <GetStarted config={{ ...config, rtcToken: token }} />
    </div>
  );
}

export default AuthenticationWorkflow;
