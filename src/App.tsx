import { useState, ChangeEvent } from "react";
import GetStarted from './get-started-sdk/get-started-sdk';
import AuthenticationWorkflow from "./AuthenticationWorflow/AuthenticationWorkflow";
import EnsureCallQuality from "./ensure-call-quality/ensure-call-quality";


type SelectedOption = "getStarted" | "callQuality" | "audioEffects" | "productWorkflow" | "cloudProxy"
  | "mediaEncryption" | "mediaPlaying" | "virtualBackground" | "authenticationWorkflow" | "";

function App() {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>("");

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value as SelectedOption);
  };

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case "getStarted":
        return <GetStarted
        />;
      case "authenticationWorkflow":
          return <AuthenticationWorkflow
          />;
      case "callQuality":
          return <EnsureCallQuality
      />;
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
        <option value="callQuality">Ensure Call Quality</option>
      </select>
      {renderSelectedOption()}
    </div>
  );
}

export default App;
