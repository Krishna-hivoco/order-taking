// pages/order.js

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { useRouter } from "next/navigation";

export default function OrderPage() {
  const videoRef = useRef(null);
  const [order, setOrder] = useState("");
  const router = useRouter();
  // Handle speech recognition end
  const handleSpeechEnd = () => {
    console.log("Speech recognition completed");
  };

  // Use the speech recognition hook
  const {
    recording,
    speechText,
    startSpeechRecognition,
    stopSpeechRecognition,
    imageRef,
  } = useSpeechRecognition(handleSpeechEnd);

  // Update order text when speech recognition completes
  useEffect(() => {
    if (speechText && !recording) {
      setOrder((prevOrder) =>
        prevOrder ? `${prevOrder}\n${speechText}` : speechText
      );
    }
  }, [speechText, recording]);

  // No need for camera setup with static video

  useEffect(() => {
    if (router.isReady) {
      //   fetchQuestions();
    }
  }, [router.isReady]); // Add fetchQuestions here

  useEffect(() => {
    if (speechText) {
      if (videoRef.current) {
        videoRef.current.play();
      }
      //   verifyAnswer(speechText);
    }
  }, [speechText]);
  const handleStartRecording = async () => {
    if (recording) return;
    if (videoRef.current) {
      videoRef.current.pause();
    }

    startSpeechRecognition();
  };
  const handleStopRecording = async () => {
    stopSpeechRecognition();
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-black">
      <Head>
        <title>Place Your Order | Hong's Kitchen</title>
        <meta
          name="description"
          content="Place your order with Hong's Kitchen"
        />
      </Head>

      {/* Header with logo */}
      <header className="absolute top-0 left-0 right-0 z-10 py-4 px-4 md:px-10 flex justify-center items-center">
        <Link href="/">
          <div className="w-32 md:w-40 cursor-pointer">
            <img
              src="https://hongskitchen.in/jfl-discovery-ui/public/dist/default/images/global/loginLogoHK.svg"
              alt="Hong's Kitchen Logo"
              className="w-full"
            />
          </div>
        </Link>
      </header>

      {/* Full-height video */}
      <div className="flex-grow flex flex-col items-center justify-center overflow-hidden bg-gray-900">
        <video
          ref={videoRef}
          src="/videos/panda_sample.mp4"
          className="min-h-full min-w-full object-contain max-h-svh"
          muted
          playsInline
          autoPlay
          loop
        />

        {/* Order text overlay */}
        {/* {order && (
          <div className="absolute top-1/4 left-0 right-0 px-6 py-4">
            <div className="bg-black bg-opacity-60 rounded-lg p-4 max-w-lg mx-auto">
              <h3 className="text-white text-lg mb-2 font-medium">
                Your Order:
              </h3>
              <p className="text-white whitespace-pre-line">{order}</p>
            </div>
          </div>
        )} */}

        {/* Start Mic Button */}
        <div className="absolute bottom-28 left-0 right-0 flex justify-center">
          <button
            onClick={recording ? handleStopRecording : handleStartRecording}
            className={`${
              recording ? "bg-red-500 animate-pulse" : "bg-teal-500"
            } 
              text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110`}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <span className="ml-2 text-lg font-medium">
                {recording ? "Stop Recording" : "Start Mic"}
              </span>
            </div>
          </button>
          {/* Hidden button for speech end callback */}
          <button ref={imageRef} className="hidden" />
        </div>
      </div>

      {/* Floating Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
        <button
          className="bg-red-500 text-white py-4 px-8 rounded-lg font-bold text-lg shadow-lg w-full max-w-sm transition-all duration-300 hover:bg-opacity-90"
          onClick={() => {
            router.push("/summary");
          }}
        >
          Place Your Order
        </button>
      </div>
    </div>
  );
}
