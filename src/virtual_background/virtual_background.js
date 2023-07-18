/*import React, { useEffect, useState } from "react";
import AgoraManager from "../AgoraManager/AgoraManager";
import VideoCallUI from "../AgoraManager/AgoraUI";
import VirtualBackgroundExtension from "agora-extension-virtual-background";
import AgoraRTC from "agora-rtc-react";

// Initialize the Agora application ID, token, and channel name
const appId = "";
const channelName = "";
const token = "";

const VirtualBackground = (props) => {
  const agoraManager = AgoraManager({
    appId: props.appId || appId,
    channelName: props.channelName || channelName,
    token: props.token || token
  });
  const [initialized, setInitialized] = useState(false);
  const [processors, setVirtualBackgroundExtension] = useState(null);
  const [isVirtualBackground, setVirtualBackground] = useState(false);

  useEffect(() => {
    setupVideoSDKEngine(); // Initialize Agora SDK engine
  });

  // Initialize Agora SDK engine for video
  const setupVideoSDKEngine = async () => {
    if (!initialized) {
      setInitialized(true);
      console.log("Initializing");
      await agoraManager.setupVideoSDKEngine();
    }
  };

  const handleJoinCall = async () => {
    await agoraManager.joinCall();
  };

  const enableVirtualBackground = async () => {
    if (!isVirtualBackground) {
      if (!processors) {
        console.log("Extension not configured");
        return;
      }
      await processors.enable();
      setVirtualBackground(true);
    } else {
      await processors.disable();
      setVirtualBackground(false);
    }
  };

  useEffect(() => {
    const setupVirtualBackgroundExtension = async () => {
      if (!processors && agoraManager.localVideoTrack) {
        console.log("Enabling virtual background extension.....");
        const extension = new VirtualBackgroundExtension();
        // Check browser compatibility for virtual background extension
        if (!extension.checkCompatibility()) {
          console.error("Does not support Virtual Background!");
        }
        // Register the extension
        AgoraRTC.registerExtensions([extension]);
        const processor = extension.createProcessor();
        await processor.init("./assets/wasms");
        agoraManager.localVideoTrack
          .pipe(processor)
          .pipe(agoraManager.localVideoTrack.processorDestination);
        setVirtualBackgroundExtension(processor);
      }
    };
    setupVirtualBackgroundExtension(); // Setup the virtual background extension
  }, [agoraManager.localVideoTrack, processors]);

  const handleOptionChange = async (event) => {
    if (!processors) {
      return;
    }
    const processorOptions = {};

    switch (event.target.value) {
      case "color":
        processorOptions.type = "color";
        processorOptions.color = "#00ff00";
        break;
      case "blur":
        processorOptions.type = "blur";
        processorOptions.blurDegree = 2;
        break;
      case "image":
        const image = new Image();
        image.onload = () => {
          processorOptions.type = "img";
          processorOptions.source = image;
        };
        image.src = "/<path to your image>";
        image.alt = "sourceImage";
        break;
      default:
        console.log("Please select an option from the dropdown");
        return;
    }
    processors.setOptions(processorOptions);
  };

  const handleLeaveCall = async () => {
    await agoraManager.leaveCall();
  };

  return (
    // Render the VideoCallUI component with the necessary props
    <VideoCallUI
      title={props.title}
      joined={agoraManager.joined}
      showVideo={agoraManager.showVideo}
      localVideoTrack={agoraManager.localVideoTrack}
      remoteVideoTrack={agoraManager.remoteVideoTrack}
      handleJoinCall={handleJoinCall}
      handleLeaveCall={handleLeaveCall}
      additionalContent={
        <div>
          <select onChange={handleOptionChange}>
            <option value="">Select</option>
            <option value="color">Color</option>
            <option value="blur">Blur</option>
            <option value="image">Image</option>
          </select>
          {isVirtualBackground ? (
            <button type="button" onClick={enableVirtualBackground}>
              Disable virtual background
            </button>
          ) : (
            <button type="button" onClick={enableVirtualBackground}>
              Enable virtual background
            </button>
          )}
        </div>
      }
    />
  );
};

export default VirtualBackground;
*/
