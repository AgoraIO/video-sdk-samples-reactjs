import { useState, useRef, useEffect } from "react";
import {
  AgoraRTCProvider,
  useRTCClient,
  useConnectionState
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
import { useAgoraContext } from "../agora-manager/agoraManager";
import VirtualBackgroundExtension, { IVirtualBackgroundProcessor } from "agora-extension-virtual-background";
import demoImage from '../assets/image.webp';
import wasm from "agora-extension-virtual-background/wasms/agora-wasm.wasm?url";
import config from "../agora-manager/config";

function VirtualBackground() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: config.selectedProduct }));

  return (
    <div>
      <h1>Virtual Background</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <AuthenticationWorkflowManager>
          <VirtualBackgroundComponent />
        </AuthenticationWorkflowManager>
      </AgoraRTCProvider>
    </div>
  );
}

function VirtualBackgroundComponent() {
  const [isVirtualBackground, setVirtualBackground] = useState(false);
  const connectionState = useConnectionState();

  return (
    <div>
      {isVirtualBackground ? (
        <div>
          <button onClick={() => setVirtualBackground(false)}>Disable virtual background</button>
          <AgoraExtensionComponent />
        </div>
      ) : (
        <button onClick={() => setVirtualBackground(true)} disabled={connectionState !== "CONNECTED"}>
          Enable virtual background
        </button>
      )}
    </div>
  );
}

function AgoraExtensionComponent() {
  const connectionState = useConnectionState();
  const agoraContext = useAgoraContext();
  const extension = useRef(new VirtualBackgroundExtension());
  const processor = useRef<IVirtualBackgroundProcessor>();
  const [selectedOption, setSelectedOption] = useState("");

  const checkCompatibility = () => {
    if (!extension.current.checkCompatibility()) {
      console.error("Virtual background not supported on this platform.");
      // You might consider providing more information or guidance here.
    }
  };

  const colorBackground = () => {
    processor.current?.setOptions({ type: "color", color: "#00ff00" });
  };

  const imageBackground = () => {
    const image = new Image();
    image.onload = () => {
      processor.current?.setOptions({ type: "img", source: image });
    };
    image.src = demoImage;
  };

  const blurBackground = () => {
    processor.current?.setOptions({ type: "blur", blurDegree: 2 });
  };

  useEffect(() => {
    const initializeVirtualBackgroundProcessor = async () => {
      AgoraRTC.registerExtensions([extension.current]);

      checkCompatibility();

      if (agoraContext.localCameraTrack) {
        console.log("Initializing virtual background processor...");
        try {
          processor.current = extension.current.createProcessor();
          await processor.current.init(wasm);
          agoraContext.localCameraTrack.pipe(processor.current).pipe(agoraContext.localCameraTrack.processorDestination);
          processor.current.setOptions({ type: "color", color: "#00ff00" });
          await processor.current.enable();
          setSelectedOption('color');
        } catch (error) {
          console.error("Error initializing virtual background:", error);
        }
      }
    };

    void initializeVirtualBackgroundProcessor();

    return () => {
      const disableVirtualBackground = async () => {
        processor.current?.unpipe();
        agoraContext.localCameraTrack?.unpipe();
        await processor.current?.disable();
      };
      void disableVirtualBackground();
    };
  }, [agoraContext.localCameraTrack]);

  const changeBackground = (selectedOption: string) => {
    if (!processor.current) {
      console.error("Virtual background processor not initialized");
      return;
    }

    // Apply selected option settings here
    switch (selectedOption) {
      case "color":
        setSelectedOption(selectedOption);
        colorBackground();
        break;
      case "blur":
        setSelectedOption(selectedOption);
        blurBackground();
        break;
      case "image":
        setSelectedOption(selectedOption);
        imageBackground();
        break;
      default:
        console.error("Invalid option:", selectedOption);
    }
  };

  return (
    <div>
      <select value={selectedOption} onChange={(event) => changeBackground(event.target.value)} disabled={connectionState === "DISCONNECTED"}>
        <option value="color">Color</option>
        <option value="blur">Blur</option>
        <option value="image">Image</option>
      </select>
    </div>
  );
}

export default VirtualBackground;
