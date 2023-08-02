import { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
import VirtualBackgroundExtension, { IVirtualBackgroundProcessor } from "agora-extension-virtual-background";
import { useLocalCameraTrack, useConnectionState } from 'agora-rtc-react';

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
  const [processors, setVirtualBackgroundExtension] = useState<IVirtualBackgroundProcessor | null>(null);
  const [isVirtualBackground, setVirtualBackground] = useState(false);
  const { localCameraTrack } = useLocalCameraTrack();
  const path = "/path/to/your/image";
  const connectionState = useConnectionState();

  const enableVirtualBackground = async () => {
    if (!isVirtualBackground) {
      if (!processors) {
        console.log("Extension not configured");
        return;
      }
      await processors.enable();
      setVirtualBackground(true);
    } else {
      await processors?.disable();
      setVirtualBackground(false);
    }
  };

  useEffect(() => {
    const initializeVirtualBackgroundProcessor = () => {
      if (!processors && localCameraTrack) {
        console.log("Enabling virtual background extension.....");
        const extension = new VirtualBackgroundExtension();
        // Check browser compatibility for virtual background extension
        if (!extension.checkCompatibility()) {
          console.error("Does not support virtual background!");
        }
        // Register the extension
        AgoraRTC.registerExtensions([extension]);
        const processor = extension.createProcessor();
        processor.init("./assets/wasms")
          .then(() => console.log("Extension enabled"))
          .catch((error) => { console.error(error); });
        localCameraTrack
          .pipe(processor)
          .pipe(localCameraTrack.processorDestination);
        setVirtualBackgroundExtension(processor);
      }
    };
    initializeVirtualBackgroundProcessor(); // Setup the virtual background extension
  }, [localCameraTrack, processors]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!processors) {
      return;
    }
    const processorOptions = {};
    const image = new Image();
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
        image.onload = () => {
          processorOptions.type = "img";
          processorOptions.source = image;
        };
        image.src = path; // Replace with the actual image path
        image.alt = "sourceImage";
        break;
      default:
        console.log("Please select an option from the dropdown");
        return;
    }
    processors.setOptions(processorOptions);
  };

  return (
    <div>
      <select onChange={handleOptionChange} disabled = {connectionState === "DISCONNECTED"}>
        <option value="">Select</option>
        <option value="color">Color</option>
        <option value="blur">Blur</option>
        <option value="image">Image</option>
      </select>
      {isVirtualBackground ? (
        <button type="button" disabled={connectionState === "DISCONNECTED"} onClick={enableVirtualBackground}>
          Disable virtual background
        </button>
      ) : (
        <button type="button" disabled={connectionState === "DISCONNECTED"} onClick={enableVirtualBackground}>
          Enable virtual background
        </button>
      )}
    </div>
  );
}

export default VirtualBackgroundManager;
