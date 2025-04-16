// hooks/useSpeechRecognition.js
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const useSpeechRecognition = (onSpeechEnd) => {
  const [recognition, setRecognition] = useState(null);
  const [speechText, setSpeechText] = useState("");
  const [recording, setRecording] = useState(false);
  const imageRef = useRef();
  const router = useRouter();

  // Handle routing - ensure recording stops when navigating
  useEffect(() => {
    const handleRouteChange = () => {
      if (recording && recognition) {
        recognition.stop();
        setRecording(false);
        console.log("Stopping recording due to navigation");
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [recording, recognition, router]);

  const handleSpeechResult = (e) => {
    const transcript = Array.from(e.results)
      .map((result) => result[0].transcript)
      .join("");
    setSpeechText(transcript);
    console.log("Transcript:", transcript);
  };

  const handleSpeechEnd = (e) => {
    e?.stopImmediatePropagation();
    setRecording(false);
    console.log("Speech Ended");

    if (onSpeechEnd && imageRef.current) {
      imageRef.current.click();
    }
  };

  const startSpeechRecognition = () => {
    if (recording || !recognition) return; // Prevent multiple starts
    setRecording(true);
    console.log("Recording Started");
    try {
      recognition.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setRecording(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (!recording || !recognition) return;
    console.log("Recording Stopped");
    try {
      recognition.stop();
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
    setRecording(false);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.interimResults = false;
    // recognitionInstance.maxAlternatives = 1;
    recognitionInstance.lang = "en-IN";

    setRecognition(recognitionInstance);

    recognitionInstance.addEventListener("result", handleSpeechResult);
    recognitionInstance.addEventListener("end", handleSpeechEnd);

    return () => {
      // Clean up event listeners
      recognitionInstance.removeEventListener("result", handleSpeechResult);
      recognitionInstance.removeEventListener("end", handleSpeechEnd);

      // Make sure recognition is stopped when component unmounts
      try {
        recognitionInstance.abort();
      } catch (e) {
        console.log("Recognition already stopped");
      }
    };
  }, []);

  return {
    recording,
    speechText,
    startSpeechRecognition,
    stopSpeechRecognition,
    imageRef,
  };
};

export default useSpeechRecognition;
