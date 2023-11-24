import AgoraRTC from "agora-rtc-sdk-ng";
import { useRTCClient, AgoraRTCProvider } from "agora-rtc-react";
import { useEffect, useRef, useState } from "react";
import AuthenticationWorkflowManager from "../authentication-workflow/authenticationWorkflowManager";
import {AIDenoiserExtension, AIDenoiserProcessorLevel, AIDenoiserProcessorMode, IAIDenoiserProcessor} from "agora-extension-ai-denoiser";
import { useConnectionState } from 'agora-rtc-react';
import { useAgoraContext } from "../agora-manager/agoraManager";
import "../App.css";
export function AINoiseReduction() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  
  return (
    <div>
      <h1>AI Noise Suppression</h1>
      <AgoraRTCProvider client={agoraEngine}>
        <AuthenticationWorkflowManager>
          <AINoiseSuppressionComponent />
        </AuthenticationWorkflowManager>      
      </AgoraRTCProvider>
    </div>
  );
}
function AINoiseSuppressionComponent() {
  const [isNoiseReduction, setNoiseReductionState] = useState(false);
  const connectionState = useConnectionState();

  return (
    <div>
      {isNoiseReduction ? (
        <div>
          <button onClick={() => setNoiseReductionState(false)}>Disable noise Reduction</button>
          <AgoraExtensionComponent />
        </div>
      ) : (
        <button onClick={() => setNoiseReductionState(true)} disabled={connectionState !== "CONNECTED"}>Enable noise reduction</button>
      )}
    </div>
  );
}

function AgoraExtensionComponent() {
  const connectionState = useConnectionState();
  const agoraContext = useAgoraContext();
  const extension = useRef(new AIDenoiserExtension({assetsPath:'./node_modules/agora-extension-ai-denoiser/external'}));
  const processor = useRef<IAIDenoiserProcessor>();

  useEffect(() => {
    const initializeAIDenoiserProcessor = async () => {
      AgoraRTC.registerExtensions([extension.current]);
      if (!extension.current.checkCompatibility()) {
        console.error("Does not support AI Denoiser!");
        return;
      }

      if (agoraContext.localMicrophoneTrack) 
      {
        console.log("Initializing an ai noise processor...");
        try {
          processor.current = extension.current.createProcessor();
          agoraContext.localMicrophoneTrack.pipe(processor.current).pipe(agoraContext.localMicrophoneTrack.processorDestination);
          await processor.current.enable();
        } catch (error) {
          console.error("Error applying noise reduction:", error);
        }
      }
    };

    void initializeAIDenoiserProcessor();

    return () => {
      const disableAIDenoiser = async () => {
        processor.current?.unpipe();
        agoraContext.localMicrophoneTrack.unpipe();
        await processor.current?.disable();
      };
      void disableAIDenoiser();
    };
  }, [agoraContext.localMicrophoneTrack]);


  const changeNoiseReductionMode = (selectedOption: string) => {
    if (!processor.current) {
      console.error("AI noise reduction processor not initialized");
      return;
    }
    if(selectedOption === "STATIONARY_NS")
    {
        processor.current.setMode(AIDenoiserProcessorMode.STATIONARY_NS)
        .then(() =>
        {
            console.log("Mode set to:", selectedOption);
        })
        .catch((error) =>
        {
            console.log(error);
        });
    }
    else
    {
        processor.current.setMode(AIDenoiserProcessorMode.NSNG)
        .then(() =>
        {
            console.log("Mode set to:", selectedOption);
        })
        .catch((error) =>
        {
            console.log(error);
        });
    }
  }
  const changeNoiseReductionLevel = (selectedOption: string) => {
    if (!processor.current) {
      console.error("AI noise reduction processor not initialized");
      return;
    }
    if(selectedOption === "aggressive")
    {
        processor.current.setLevel(AIDenoiserProcessorLevel.AGGRESSIVE)
        .then(() =>
        {
            console.log("Level set to:", selectedOption);
        })
        .catch((error) =>
        {
            console.log(error);
        });
    }
    else
    {
      processor.current.setLevel(AIDenoiserProcessorLevel.SOFT)
      .then(() =>
        {
            console.log("Level set to:", selectedOption);
        })
        .catch((error) =>
        {
            console.log(error);
        });
    }
  }

  return (
    <div>
      <label>Noise reduction mode: </label>
      <select onChange={(event) => { changeNoiseReductionMode(event.target.value) }} disabled={connectionState === "DISCONNECTED"}>
        <option value="STATIONARY_NS">Stationary noise reduction</option>
        <option value="NSNG">Normal noise reduction</option>
      </select>
      <br/>
      <label>Noise reduction level: </label>
      <select onChange={(event) => { changeNoiseReductionLevel(event.target.value) }} disabled={connectionState === "DISCONNECTED"}>
        <option value="aggressive">Aggressive</option>
        <option value="soft">Soft</option>
      </select>
    </div>
  );
}

export default AINoiseReduction;
