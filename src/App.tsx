import { useState, ChangeEvent } from "react";
import {GetStarted} from "./get-started-sdk/getStartedSdk";
import AuthenticationWorkflow from "./authentication-workflow/authenticationWorkflow";
import Geofencing from "./geofencing/geofencing";
import CloudProxy  from "./cloud-proxy/cloudProxy";
import MediaEncryption from "./media-encryption/mediaEncryption";

import config from "./agora-manager/config";

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
  | "geofencing"
  | "";

function App() {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>("");

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value as SelectedOption);
  };

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case "getStarted":
        return <GetStarted config={config} title="Get Started with Video Calling"/>; // Step 2: Pass the title prop to GetStarted
      case "authenticationWorkflow":
        return <AuthenticationWorkflow />;
      case "geofencing":
        return <Geofencing />;
      case "mediaEncryption":
        return <MediaEncryption />;
      case "cloudProxy":
        return <CloudProxy />;
      default:
        return null;
    }
  };

  return (
    <div>
        <h3>Select a sample code:</h3>
        <select value={selectedOption} onChange={handleOptionChange}>
          <option value="">Select</option>
          <option value="getStarted">Get Started</option>
          <option value="authenticationWorkflow">Authentication Workflow</option>
          <option value="cloudProxy">Cloud Proxy</option>
          <option value="geofencing">Geofencing</option>
          <option value="mediaEncryption">Media Stream Encryption</option>

        </select>
        {renderSelectedOption()}
    </div>
  );
}

export default App;
