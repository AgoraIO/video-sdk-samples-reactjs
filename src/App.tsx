import { useState, ChangeEvent } from "react";
import {GetStarted} from "./get-started-sdk/getStartedSdk";
import AuthenticationWorkflow from "./authentication-workflow/authenticationWorkflow";
import audioAndVoiceEffects, { AudioAndVoiceEffects } from "./audio-and-voice-effects/audioAndVoiceEffects";
import config from "./config";

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
  | "audioEffects"
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
      case "audioEffects":
        return <AudioAndVoiceEffects/>
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
          <option value="audioEffects">Audio and Voice Effects</option>
        </select>
        {renderSelectedOption()}
    </div>
  );
}

export default App;
