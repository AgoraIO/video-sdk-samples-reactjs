import { useState, ChangeEvent } from "react";
import GetStarted from "./get-started-sdk/get-started-sdk";
import AuthenticationWorkflow from "./AuthenticationWorflow/AuthenticationWorkflow";
import { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";

type SelectedOption =
  | "getStarted"
  | "callQuality"
  | "audioEffects"
  | "productWorkflow"
  | "cloudProxy"
  | "mediaEncryption"
  | "mediaPlaying"
  | "virtualBackground"
  | "authenticationWorkflow"
  | "";

function App() {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>("");
  const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value as SelectedOption);
  };

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case "getStarted":
        return <GetStarted />;
      case "authenticationWorkflow":
        return <AuthenticationWorkflow />;
      default:
        return null;
    }
  };

  return (
    <div>
      <AgoraRTCProvider client={client}>
        <h3>Select a sample code:</h3>
        <select value={selectedOption} onChange={handleOptionChange}>
          <option value="">Select</option>
          <option value="getStarted">Get Started</option>
          <option value="authenticationWorkflow">Authentication Workflow</option>
        </select>
        {renderSelectedOption()}
      </AgoraRTCProvider>
    </div>
  );
}

export default App;
