import { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
import VirtualBackgroundExtension, { IVirtualBackgroundProcessor } from "agora-extension-virtual-background";
import { useConnectionState } from 'agora-rtc-react';
import wasm from "agora-extension-virtual-background/wasms/agora-wasm.wasm?url";
import { useAgoraContext } from "../agora-manager/agoraManager";
import "../App.css";
function VirtualBackgroundManager(): JSX.Element {
  return (
    <div>
      <AuthenticationWorkflowManager>
        <VirtualBackgroundComponent />
      </AuthenticationWorkflowManager>
    </div>
  );
}

function VirtualBackgroundComponent() {
  const [isVirtualBackground, setVirtualBackground] = useState(false);
  const connectionState = useConnectionState();
  const enableVirtualBackground = () => {
    setVirtualBackground(true);
  };

  return (
    <div>
      {isVirtualBackground ? (
        <div>
          <button onClick={() => setVirtualBackground(false)}>Disable virtual background</button>
          <AgoraExtensionComponent />
        </div>
      ) : (
        <button onClick={enableVirtualBackground} disabled ={connectionState !== "CONNECTED"}>Enable virtual background</button>
      )}
    </div>
  );
}

function AgoraExtensionComponent() {
  const connectionState = useConnectionState();
  const agoraContext = useAgoraContext();
  const extension = useRef(new VirtualBackgroundExtension());
  const processor = useRef<IVirtualBackgroundProcessor>();
  const [selectedOption, setSelectedOption] = useState(""); // Track selected dropdown option

  useEffect(() => {
    
    const initializeVirtualBackgroundProcessor = async () => {
      AgoraRTC.registerExtensions([extension.current]);

      if (!extension.current.checkCompatibility()) {
        console.error("Does not support virtual background!");
        return;
      }

      if (agoraContext.localCameraTrack) {
        console.log("Initializing virtual background processor...");
        try {
          processor.current = extension.current.createProcessor();
          console.log("processor.current", processor.current);
          console.log("wasm", wasm);
          await processor.current.init(wasm);
          agoraContext.localCameraTrack.pipe(processor.current).pipe(agoraContext.localCameraTrack.processorDestination);
          processor.current.setOptions({
            type: "color",
            color: "#00ff00",
          });
          await processor.current.enable();
          console.log("Virtual background enabled.");
        } catch (error) {
          console.error("Error initializing virtual background:", error);
        }
      }
    };

    initializeVirtualBackgroundProcessor();

    return async () => {
      if (processor) {
        await processor.current?.disable();
      }
    };
  }, [agoraContext.localCameraTrack]);

  
  const changeBackground = (selectedOption: string) =>
   { 
    if (!processor.current) {
      return;
    }
    console.log("changing virtual background option to:", selectedOption);
    // Apply selected option settings here
    if (selectedOption === "color") 
    {
      processor.current.setOptions({
        type: "color",
        color: "#00ff00",
      });
    } 
    else if (selectedOption === "blur") 
    {
      processor.current.setOptions({type: "blur", blurDegree: 2});
    }
    else if (selectedOption === "image") 
    {
      const image = new Image();
      image.src = "/path/to/your/image"; // Replace with the actual image path
      image.alt = "sourceImage";
      if(image.src === "/path/to/your/image")
      {
        console.log("Please specify an image path");
        return;
      }
      processor.current.setOptions({type: "image", source: image})
    }
  }

  return (
    <div>
      <select
        value={selectedOption}
        onChange={(event) => {changeBackground(event.target.value)}}
        disabled={connectionState === "DISCONNECTED"}
      >
        <option value="">Select</option>
        <option value="color">Color</option>
        <option value="blur">Blur</option>
        <option value="image">Image</option>
      </select>
    </div>
  );
}

export default VirtualBackgroundManager;
