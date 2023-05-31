import React, { useState } from "react";
import GetStarted from './sdk_quickstart/get_started';
import CallQuality from './call_quality/call_quality';
import AudioEffects from './audio_and_voice_effects/audio_and_voice_effects';
import ProductWorkflow from './product_workflow/product-workflow';
import CloudProxy from './cloud_proxy/cloud_proxy';
import MediaEncryption from './media_stream_encryption/media_stream_encryption';

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
      case "customMedia":
        return <CustomMedia 
        appId = {appId}
        channelName = {channelName}
        token = {token}
        title = 'Customize your video and audio source'
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
