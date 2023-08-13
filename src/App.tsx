import { useState, ChangeEvent } from "react";
import { GetStarted } from "./get-started-sdk/getStartedSdk";
import AuthenticationWorkflow from "./authentication-workflow/authenticationWorkflow";
import Geofencing from "./geofencing/geofencing";
import CloudProxy  from "./cloud-proxy/cloudProxy";
import  AudioAndVoiceEffects from "./audio-and-voice-effects/audioAndVoiceEffects";
import CallQuality from "./ensure-call-quality/ensureCallQuality";
import ProductWorkflow from "./product-workflow/productWorkflow";
import "./App.css";

import VirtualBackground from "./virtual-background/virtualBackground";
import MediaPlaying from "./play-media/playMedia";
import CustomVideoAndAudio from "./custom-audio-and-video/customVideoAudio";
import { LiveStreamingMultipleChannels } from "./live-streaming-over-multiple-channels/liveStreamingMultipleChannels";
import config from "./agora-manager/config";
import MediaEncryption from "./media-stream-encryption/mediaStreamEncryption";
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
  | "multiChannelLiveStreaming"
  | "mediaEncryption"
  | "";

  type SelectedProduct =
  | "videoCalling"
  | "ILS"
  | "";

function App() {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>("");
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct>("");

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value as SelectedOption);
  };

  const handleProductChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(event.target.value as SelectedProduct);
    if(event.target.value === "ILS")
    {
      config.selectedProduct = "live"
    }
    else{
      config.selectedProduct = "rtc";
    }
  };

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case "getStarted":
        return <GetStarted />; 
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
      case "productWorkflow":
        return <ProductWorkflow/>
        case "virtualBackground":
          return <VirtualBackground />
      case "customMediaSources":
        return <CustomVideoAndAudio/>
      case "mediaPlaying":
      case "mediaEncryption":
        return <MediaEncryption />;
        return <MediaPlaying />
      case "multiChannelLiveStreaming":
        if(selectedProduct !== "ILS") return null
        else return <LiveStreamingMultipleChannels/>
      default:
        return null;
    }
  };

  return (
    <div>
      <h3>Choose a product:</h3>
        <select value={selectedProduct} onChange={handleProductChange}>
          <option value="">Select</option>
          <option value="videoCalling">Video Calling</option>
          <option value="ILS">Interactive Live Streaming</option>
        </select>
        <h3>Select a sample code:</h3>
        <select value={selectedOption} onChange={handleOptionChange}>
          <option value="">Select</option>
          <option value="getStarted">Get Started</option>
          <option value="authenticationWorkflow">Authentication Workflow</option>
          <option value="cloudProxy">Cloud Proxy</option>
          <option value="geofencing">Geofencing</option>
          <option value="audioEffects">Audio and Voice Effects</option>
          <option value="callQuality">Ensure Call Quality</option>
          <option value="productWorkflow">Screen Share and Volume Control</option>
          <option value="virtualBackground">Virtual Background</option>
          <option value="customMediaSources">Custom Video and Audio</option>
          <option value="mediaPlaying">Stream media to a channel</option>
          <option value="multiChannelLiveStreaming">Live steaming over multiple channel</option>
          <option value="mediaEncryption">Media Stream Encryption</option>
        </select>
        {renderSelectedOption()}
    </div>
  );
}

export default App;
