import { AgoraRTCProvider, useRTCClient, useConnectionState } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
import { useState, useRef, useEffect } from "react";
import { useAgoraContext } from "../agora-manager/agoraManager";
import VirtualBackgroundExtension, { IVirtualBackgroundProcessor } from "agora-extension-virtual-background";
import demoImage from '../assets/image.webp';
import wasm from "agora-extension-virtual-background/wasms/agora-wasm.wasm?url";


function VirtualBackground() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

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
        <button onClick={() => setVirtualBackground(true)} disabled={connectionState !== "CONNECTED"}>Enable virtual background</button>
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
        agoraContext.localCameraTrack.unpipe();
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

    const image = new Image();
    // Apply selected option settings here
    switch (selectedOption) {
      case "color":
        processor.current.setOptions({ type: "color", color: "#00ff00" });
        setSelectedOption(selectedOption);
        break;
      case "blur":
        processor.current.setOptions({ type: "blur", blurDegree: 2 });
        setSelectedOption(selectedOption);
        break;
      case "image":
        image.onload = () => { processor.current?.setOptions({ type: "img", source: image }) }
        image.src = demoImage;
        setSelectedOption(selectedOption);
        break;
    }
  }

  return (
    <div>
      <select value={selectedOption} onChange={(event) => { changeBackground(event.target.value) }} disabled={connectionState === "DISCONNECTED"}>
        <option value="color">Color</option>
        <option value="blur">Blur</option>
        <option value="image">Image</option>
      </select>
    </div>
  );
}

export default VirtualBackground;
