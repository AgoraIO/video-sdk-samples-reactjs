import { useState, ChangeEvent } from "react";
import { GetStarted } from "./get-started-sdk/getStartedSdk";
import AuthenticationWorkflow from "./authentication-workflow/authenticationWorkflow";
import  AudioAndVoiceEffects from "./audio-and-voice-effects/audioAndVoiceEffects";
import CallQuality from "./ensure-call-quality/ensureCallQuality";
import CustomVideoAndAudio from "./custom-audio-and-video/customVideoAudio";
//import CustomVideoAndAudio from "./custom-video-and-audio/customVideoAudio";

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
  | "customMediaSources"
  | "";

function App() {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>("");

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value as SelectedOption);
  };

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case "getStarted":
        return <GetStarted title="Get Started with Video Calling" />; // Step 2: Pass the title prop to GetStarted
      case "authenticationWorkflow":
        return <AuthenticationWorkflow />;
      case "audioEffects":
        return <AudioAndVoiceEffects/>
      case "callQuality":
        return <CallQuality />;
      case "customMediaSources":
        return <CustomVideoAndAudio/>
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
          <option value="callQuality">Ensure Call Quality</option>
          <option value="customMediaSources">Custom Video and Audio</option>
        </select>
        {renderSelectedOption()}
    </div>
  );
}

export default App;
