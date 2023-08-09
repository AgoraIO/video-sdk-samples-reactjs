import { useState, ChangeEvent } from "react";
import { GetStarted } from "./get-started-sdk/getStartedSdk";
import AuthenticationWorkflow from "./authentication-workflow/authenticationWorkflow";
import Geofencing from "./geofencing/geofencing";
import CloudProxy  from "./cloud-proxy/cloudProxy";
import  AudioAndVoiceEffects from "./audio-and-voice-effects/audioAndVoiceEffects";
import CallQuality from "./ensure-call-quality/ensureCallQuality";
import VirtualBackground from "./virtual-background/virtualBackground";
import MediaPlaying from "./play-media/playMedia";
import CustomVideoAndAudio from "./custom-audio-and-video/customVideoAudio";
import AINoiseReduction from "./ai-noise-suppression/aiNoiseSuppression";
type SelectedOption =
  | "getStarted"
  | "callQuality"
  | "audioEffects"
  | "productWorkflow"
  | "cloudProxy"
  | "virtualBackground"
  | "authenticationWorkflow"
  | "geofencing"
  | "audioEffects"
  | "customMediaSources"
  | "mediaPlaying"
  | "aiNoiseReduction"
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
      case "geofencing":
        return <Geofencing />;
      case "cloudProxy":
        return <CloudProxy />;
      case "audioEffects":
        return <AudioAndVoiceEffects/>
      case "callQuality":
        return <CallQuality />;
        case "virtualBackground":
          return <VirtualBackground />
      case "customMediaSources":
        return <CustomVideoAndAudio/>
      case "mediaPlaying":
        return <MediaPlaying />
      case "aiNoiseReduction":
        return <AINoiseReduction/>
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
          <option value="audioEffects">Audio and Voice Effects</option>
          <option value="callQuality">Ensure Call Quality</option>
          <option value="virtualBackground">Virtual Background</option>
          <option value="customMediaSources">Custom Video and Audio</option>
          <option value="mediaPlaying">Stream media to a channel</option>
          <option value="aiNoiseReduction">AI Noise Suppression</option>
        </select>
        {renderSelectedOption()}
    </div>
  );
}

export default App;
