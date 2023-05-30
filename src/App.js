import React, { useState } from "react";
import GetStarted from './sdk_quickstart/get-started';
import CallQuality from './call-quality/call-quality';
import AudioEffects from './audio-and-voice-effects/audio-and-voice-effects';
import ProductWorkflow from './product-workflow/product-workflow';
import CloudProxy from './cloud-proxy/cloud-proxy';
import MediaEncryption from './media-stream-encryption/media-stream-encryption';

// Initialize the Agora application ID, token, and channel name
const appId = '<Your app ID>';
const channelName = '<Your channel name>';
const token = '<Your authentication token>';

function App() {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case "getStarted":
        return <GetStarted
        appId = {appId}
        channelName = {channelName}
        token = {token}
        title = 'Get started with Video Calling'
         />;
      case "callQuality":
        return <CallQuality 
        appId = {appId}
        channelName = {channelName}
        token = {token}
        title = 'Call quality best practice'
        />;
      case "audioEffects":
        return <AudioEffects 
        appId = {appId}
        channelName = {channelName}
        token = {token}
        title = 'Audio and voice effects'
        />;
      case "productWorkflow":
        return <ProductWorkflow 
        appId = {appId}
        channelName = {channelName}
        token = {token}
        title = 'Screen share, volume control, and mute'
        />;
      case "cloudProxy":
        return <CloudProxy 
        appId = {appId}
        channelName = {channelName}
        token = {token}
        title = 'Connect through restricted networks with Cloud Proxy'
        />;
      case "mediaEncryption":
        return <MediaEncryption 
        appId = {appId}
        channelName = {channelName}
        token = {token}
        title = 'Secure channel encryption'
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
        <option value="callQuality">Call quality best practice</option>
        <option value="productWorkflow">Screen share, volume control, and mute</option>
        <option value="mediaEncryption">Secure channel encryption</option>
        <option value="audioEffects">Audio and voice effects</option>
        <option value="cloudProxy">Cloud proxy</option>
      </select>
      {renderSelectedOption()}
    </div>
  );
}

export default App;
