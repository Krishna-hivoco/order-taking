// // pages/order.js

// import { useEffect, useRef, useState } from "react";
// import Head from "next/head";
// import Link from "next/link";
// import useSpeechRecognition from "@/hooks/useSpeechRecognition";
// import { useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";
// import Loading from "@/components/Loading";
// export default function OrderPage() {
//   const videoRef = useRef(null);
//   const audioRef = useRef(null);
//   const [order, setOrder] = useState("");
//   const [uuid, setUuid] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();
//   // Handle speech recognition end
//   const handleSpeechEnd = () => {
//     console.log("Speech recognition completed");
//   };

//   // Use the speech recognition hook
//   const {
//     recording,
//     speechText,
//     startSpeechRecognition,
//     stopSpeechRecognition,
//   } = useSpeechRecognition(handleSpeechEnd);

//   // Update order text when speech recognition completes
//   useEffect(() => {
//     if (speechText && !recording) {
//       setOrder((prevOrder) =>
//         prevOrder ? `${prevOrder}\n${speechText}` : speechText
//       );
//     }
//   }, [speechText, recording]);

//   //  const router = useRouter();

//   useEffect(() => {
//     // This function handles the beforeunload event (page refresh)
//     const handleBeforeUnload = (event) => {
//       // Store a flag in sessionStorage to indicate a page refresh is happening
//       sessionStorage.setItem("isRefreshing", "true");
//     };

//     // This function runs when the page loads
//     const handlePageLoad = () => {
//       // Check if the page is being loaded after a refresh
//       const isRefreshing = sessionStorage.getItem("isRefreshing");

//       if (isRefreshing === "true") {
//         // Clear the flag
//         sessionStorage.removeItem("isRefreshing");

//         // Redirect to the home page
//         router.push("/");
//       }
//     };

//     // Add event listeners
//     window.addEventListener("beforeunload", handleBeforeUnload);

//     // Check on page load
//     if (typeof window !== "undefined") {
//       handlePageLoad();
//     }

//     // Clean up event listeners when component unmounts
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [router]);
//   // No need for camera setup with static video

//   useEffect(() => {
//     // if (router.isReady) {
//     setIsLoading(true);
//     const uid = uuidv4();
//     setUuid(uid);
//     fetchAudio(uid, "start");
//     setIsLoading(false);
//     // }
//   }, []); // Add fetchQuestions here

//   useEffect(() => {
//     if (speechText) {
//       if (audioRef.current) {
//         audioRef.current.pause();
//       }

//       fetchAudio();
//     }
//   }, [speechText]);
//   const handleStartRecording = async () => {
//     if (recording) return;
//     if (videoRef.current) {
//       videoRef.current.pause();
//     }
//     if (audioRef.current) {
//       console.log("audioref");

//       audioRef.current.pause();
//     }

//     startSpeechRecognition();
//   };
//   const handleStopRecording = async () => {
//     stopSpeechRecognition();
//   };

//   const handleAudioEnded = () => {
//     setIsPlaying(false);
//     if (selectedOption) return;
//     handleStartRecording();
//   };

//   const fetchAudio = async (uid, question) => {
//     try {
//       const response = await fetch("https://node.hivoco.com/api/order_chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           session_id: uid ? uid : uuid,
//           user_text: question ? question : speechText,
//           open_model: false,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch audio response");
//       }

//       // Get the response data - expecting an S3 audio URL
//       const data = await response.json();

//       if (data.audio) {
//         if (audioRef.current) {
//           audioRef.current.src = `data:audio/wav;base64,${data.audio}`;
//           audioRef.current.load(); // Load the new audio
//           audioRef.current.play(); // Play the audio
//           if (videoRef.current) {
//             videoRef.current.play();
//           }
//         }
//       } else {
//         console.error("No audio URL in the response");
//       }
//     } catch (error) {
//       console.error("Error fetching audio:", error);
//     }
//   };

//   const playQuestionAudio = () => {
//     // if (!allowAudio) return;

//     if (audio) {
//       audio.pause();
//     }
//     setAllowAudio(true);
//     const questionAudio = new Audio(
//       `data:audio/wav;base64,${questions[currentQuestionIndex]?.audio}`
//     );

//     questionAudio
//       .play()
//       .then(() => {
//         setIsPlaying(true);
//         setAudio(questionAudio);
//       })
//       .catch((error) => console.error("Audio play error:", error));

//     questionAudio.onended = () => {
//       setIsPlaying(false);
//       if (selectedOption) return;
//       handleStartRecording();
//     };
//   };

//   const audioEndFunction = () => {
//     if (recording) return;
//     handleStartRecording();
//   };

//   return (
//     <div className="min-h-screen flex flex-col relative bg-black">
//       <Head>
//         <title>Place Your Order | Hong's Kitchen</title>
//         <meta
//           name="description"
//           content="Place your order with Hong's Kitchen"
//         />
//       </Head>

//       {/* Header with logo */}
//       <header className="absolute top-0 left-0 right-0 z-10 py-4 px-4 md:px-10 flex justify-center items-center">
//         <Link href="/">
//           <div className="w-32 md:w-40 cursor-pointer">
//             <img
//               src="https://hongskitchen.in/jfl-discovery-ui/public/dist/default/images/global/loginLogoHK.svg"
//               alt="Hong's Kitchen Logo"
//               className="w-full"
//             />
//           </div>
//         </Link>
//       </header>

//       {/* Full-height video */}
//       <div className="flex-grow flex flex-col items-center justify-center overflow-hidden bg-gray-900">
//         <video
//           ref={videoRef}
//           src={"/videos/panda-speaking.mp4"}
//           className="min-h-full min-w-full object-contain max-h-svh"
//           muted
//           playsInline
//           autoPlay
//           loop
//         />

//         {/* Order text overlay */}
//         {/* {order && (
//           <div className="absolute top-1/4 left-0 right-0 px-6 py-4">
//             <div className="bg-black bg-opacity-60 rounded-lg p-4 max-w-lg mx-auto">
//               <h3 className="text-white text-lg mb-2 font-medium">
//                 Your Order:
//               </h3>
//               <p className="text-white whitespace-pre-line">{order}</p>
//             </div>
//           </div>
//         )} */}

//         {/* Start Mic Button */}
//         <div className="absolute bottom-28 left-0 right-0 flex justify-center">
//           <button
//             onClick={recording ? handleStopRecording : handleStartRecording}
//             className={`${
//               recording ? "bg-red-500 animate-pulse" : "bg-teal-500"
//             }
//               text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110`}
//           >
//             <div className="flex items-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
//                 />
//               </svg>
//               <span className="ml-2 text-lg font-medium">
//                 {recording ? "Stop Recording" : "Start Mic"}
//               </span>
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Floating Place Order Button */}
//       <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
//         <button
//           className="bg-red-500 text-white py-4 px-8 rounded-lg font-bold text-lg shadow-lg w-full max-w-sm transition-all duration-300 hover:bg-opacity-90"
//           onClick={() => {
//             router.push("/summary");
//           }}
//         >
//           Place Your Order
//         </button>
//       </div>
//       <audio
//         ref={audioRef}
//         onEnded={audioEndFunction}
//         // controls
//         style={{ display: "block", marginTop: "20px" }}
//       />
//       <Loading isVisible={isLoading} />
//     </div>
//   );
// }

// pages/order.js

// import { useEffect, useRef, useState } from "react";
// import Head from "next/head";
// import Link from "next/link";
// import useSpeechRecognition from "@/hooks/useSpeechRecognition";
// import { useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";
// import Loading from "@/components/Loading";
// import { useOrder } from "@/context/OrderContext";

// export default function OrderPage() {
//   const speakingVideoRef = useRef(null);
//   const listeningVideoRef = useRef(null);
//   const audioRef = useRef(null);
//   const [order, setOrder] = useState("");
//   const [uuid, setUuid] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeVideo, setActiveVideo] = useState("speaking"); // To track which video is active
//   const [userResponse, setUserResponse] = useState(null);
//   const router = useRouter();
//   const { setOrderDetailsAPI } = useOrder();

//   // Handle speech recognition end
//   const handleSpeechEnd = () => {
//     console.log("Speech recognition completed");
//   };

//   // Use the speech recognition hook
//   const {
//     recording,
//     speechText,
//     startSpeechRecognition,
//     stopSpeechRecognition,
//   } = useSpeechRecognition(handleSpeechEnd);

//   useEffect(() => {
//     // This function handles the beforeunload event (page refresh)
//     const handleBeforeUnload = (event) => {
//       // Store a flag in sessionStorage to indicate a page refresh is happening
//       sessionStorage.setItem("isRefreshing", "true");
//     };

//     // This function runs when the page loads
//     const handlePageLoad = () => {
//       // Check if the page is being loaded after a refresh
//       const isRefreshing = sessionStorage.getItem("isRefreshing");

//       if (isRefreshing === "true") {
//         // Clear the flag
//         sessionStorage.removeItem("isRefreshing");

//         // Redirect to the home page
//         router.push("/");
//       }
//     };

//     // Add event listeners
//     window.addEventListener("beforeunload", handleBeforeUnload);

//     // Check on page load
//     if (typeof window !== "undefined") {
//       handlePageLoad();
//     }

//     // Clean up event listeners when component unmounts
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [router]);

//   // Add this at the top of your component function
//   const hasInitialized = useRef(false);

//   // Then update your initial useEffect like this:
//   useEffect(() => {
//     // If we've already initialized, don't do it again
//     if (hasInitialized.current) {
//       console.log("Already initialized, skipping duplicate fetch");
//       return;
//     }

//     console.log("Performing initial setup");
//     setIsLoading(true);
//     const uid = uuidv4();
//     console.log("Generated UUID:", uid);
//     setUuid(uid);

//     // Mark as initialized BEFORE the fetch to prevent race conditions
//     hasInitialized.current = true;

//     // Now fetch the initial audio
//     fetchAudio(uid, "start");
//     setIsLoading(false);
//   }, []); // Keep the empty dependency array // Add fetchQuestions here

//   useEffect(() => {
//     if (speechText) {
//       if (audioRef.current) {
//         audioRef?.current?.pause();
//       }

//       fetchAudio();
//     }
//   }, [speechText]);

//   const switchToSpeakingVideo = () => {
//     if (speakingVideoRef.current && listeningVideoRef.current) {
//       // First, start playing the video we're switching to, while it's still hidden
//       speakingVideoRef.current.play().then(() => {
//         // Use opacity for a smoother transition
//         listeningVideoRef.current.style.opacity = "0";
//         speakingVideoRef.current.style.opacity = "1";

//         // Wait for a short moment to ensure the new video is ready, then pause the old one
//         setTimeout(() => {
//           listeningVideoRef?.current?.pause();
//         }, 50);
//       });

//       setActiveVideo("speaking");
//     }
//   };

//   const switchToListeningVideo = () => {
//     if (speakingVideoRef.current && listeningVideoRef.current) {
//       // First, start playing the video we're switching to, while it's still hidden
//       listeningVideoRef.current.play().then(() => {
//         // Use opacity for a smoother transition
//         speakingVideoRef.current.style.opacity = "0";
//         listeningVideoRef.current.style.opacity = "1";

//         // Wait for a short moment to ensure the new video is ready, then pause the old one
//         setTimeout(() => {
//           speakingVideoRef?.current?.pause();
//         }, 50);
//       });

//       setActiveVideo("listening");
//     }
//   };

//   const handleStartRecording = async () => {
//     if (recording) return;

//     // Switch to listening video when recording starts
//     switchToListeningVideo();

//     if (audioRef.current) {
//       console.log("audioref");
//       audioRef?.current?.pause();
//     }

//     startSpeechRecognition();
//   };

//   const handleStopRecording = async () => {
//     stopSpeechRecognition();
//     // When recording stops, switch back to speaking video
//     // switchToSpeakingVideo();
//   };

//   const handleAudioEnded = () => {
//     setIsPlaying(false);
//     handleStartRecording();
//   };

//   const calculateOrderDetails = async () => {
//     try {
//       if (audioRef.current) {
//         audioRef.current.pause();
//       }
//       setIsLoading(true);
//       const response = await fetch(
//         "http://192.168.1.10:8827/api/order_summary",
//         // "https://node.hivoco.com/api/order_summary",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             session_id: uuid,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch audio response");
//       }

//       // Get the response data - expecting an S3 audio URL
//       const data = await response.json();

//       if (data) {
//         console.log("object", data);

//         setOrderDetailsAPI(data);

//         router.push("/summary");
//       } else {
//         console.error("No audio URL in the response");
//       }
//     } catch (error) {
//       setIsLoading(false);
//       console.error("Error fetching audio:", error);
//     }
//   };

//   const handleStream = async (text) => {
//     if (!text) return;
//     console.log(
//       "Starting audio stream for text:",
//       text.substring(0, 20) + "..."
//     );

//     setIsPlaying(true);

//     const mediaSource = new MediaSource();
//     const audio = audioRef.current;

//     // Clear any previous src
//     if (audio.src) {
//       URL.revokeObjectURL(audio.src);
//     }

//     audio.src = URL.createObjectURL(mediaSource);
//     audio.load();

//     return new Promise((resolve, reject) => {
//       mediaSource.addEventListener("sourceopen", async () => {
//         console.log("MediaSource opened");
//         let sourceBuffer;

//         try {
//           sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
//         } catch (error) {
//           console.error("Error adding source buffer:", error);
//           setIsPlaying(false);
//           reject(error);
//           return;
//         }

//         try {
//           console.log("Fetching audio from API...");
//           const response = await fetch("/api/text-to-speech/convert", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ text, voiceId: "7QwDAfHpHjPD14XYTSiq" }),
//           });

//           console.log("API response status:", response.status);

//           if (!response.ok || !response.body) {
//             throw new Error(
//               `Failed to stream audio: ${response.status} ${response.statusText}`
//             );
//           }

//           const reader = response.body.getReader();

//           const queue = [];
//           let isEndOfStream = false;

//           const appendNextChunk = () => {
//             if (queue.length === 0) {
//               if (isEndOfStream && !sourceBuffer.updating) {
//                 console.log("End of stream reached, closing MediaSource");
//                 try {
//                   mediaSource.endOfStream();
//                 } catch (err) {
//                   console.warn("Error ending stream:", err);
//                 }
//               }
//               return;
//             }

//             if (sourceBuffer.updating) return;

//             const chunk = queue.shift();
//             try {
//               sourceBuffer.appendBuffer(chunk);
//             } catch (err) {
//               console.error("Error appending buffer:", err);
//               if (err.name === "QuotaExceededError") {
//                 // Clear some from the buffer and try again later
//                 queue.unshift(chunk);
//                 sourceBuffer.remove(0, 2); // Remove first 2 seconds
//               }
//             }
//           };

//           sourceBuffer.addEventListener("updateend", appendNextChunk);

//           const pump = async () => {
//             try {
//               const { done, value } = await reader.read();

//               if (done) {
//                 console.log("Reader done, marking end of stream");
//                 isEndOfStream = true;
//                 appendNextChunk(); // Try to end the stream
//                 return;
//               }

//               queue.push(value);
//               appendNextChunk();
//               pump();
//             } catch (err) {
//               console.error("Error during read:", err);
//               isEndOfStream = true;
//               appendNextChunk();
//             }
//           };

//           // Make sure the audio element is fully ready before playing
//           audio.addEventListener(
//             "canplay",
//             () => {
//               console.log("Audio can play now, starting playback");
//               try {
//                 const playPromise = audio.play();
//                 if (playPromise !== undefined) {
//                   playPromise
//                     .then(() => {
//                       console.log("Audio playback started successfully");
//                       // Switch to speaking video when API gives a response
//                       switchToSpeakingVideo();
//                     })
//                     .catch((err) => {
//                       console.error("Error playing audio:", err);
//                       setIsPlaying(false);
//                     });
//                 }
//               } catch (err) {
//                 console.error("Error during play:", err);
//                 setIsPlaying(false);
//               }
//             },
//             { once: true }
//           ); // only trigger once

//           pump();
//         } catch (err) {
//           console.error("Streaming error:", err);
//           setIsPlaying(false);
//           reject(err);
//         }
//       });

//       // Handle any errors with the MediaSource
//       mediaSource.addEventListener("error", (err) => {
//         console.error("MediaSource error:", err);
//         setIsPlaying(false);
//         reject(err);
//       });
//     });
//   };

//   useEffect(() => {
//     if (!userResponse) return;
//     handleStream(userResponse);
//     return () => {};
//   }, [userResponse]);

//   const fetchAudio = async (uid, question) => {
//     try {
//       const response = await fetch("http://192.168.1.10:8827/api/order_chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           session_id: uid ? uid : uuid,
//           user_text: question ? question : speechText,
//           open_model: false,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch audio response");
//       }

//       // Get the response data - expecting an S3 audio URL
//       const data = await response.json();
//       // console.log("data", data.response);
//       setUserResponse(data.response);

//       // if (data.audio) {
//       //   if (audioRef.current) {
//       //     audioRef.current.src = `data:audio/wav;base64,${data.audio}`;
//       //     audioRef.current.load(); // Load the new audio
//       //     audioRef.current.play(); // Play the audio

//       //     // Switch to speaking video when API gives a response
//       //     switchToSpeakingVideo();
//       //   }
//       // } else {
//       //   console.error("No audio URL in the response");
//       // }
//     } catch (error) {
//       console.error("Error fetching audio:", error);
//     }
//   };

//   const audioEndFunction = () => {
//     if (recording) return;
//     handleStartRecording();
//   };

//   return (
//     <div className="h-svh flex flex-col relative bg-black">
//       <Head>
//         <title>Place Your Order | Hong's Kitchen</title>
//         <meta
//           name="description"
//           content="Place your order with Hong's Kitchen"
//         />
//       </Head>

//       {/* Header with logo */}
//       <header className="absolute top-0 left-0 right-0 z-10 py-4 px-4 md:px-10 flex justify-center items-center">
//         <Link href="/">
//           <div className="w-32 md:w-40 cursor-pointer">
//             <img
//               src="https://hongskitchen.in/jfl-discovery-ui/public/dist/default/images/global/loginLogoHK.svg"
//               alt="Hong's Kitchen Logo"
//               className="w-full"
//             />
//           </div>
//         </Link>
//       </header>

//       {/* Full-height video container */}
//       <div className="flex-grow flex flex-col items-center justify-center overflow-hidden bg-gray-900">
//         {/* Speaking video */}
//         <video
//           ref={speakingVideoRef}
//           src="/videos/panda-speaking.mp4"
//           className="absolute top-0 left-0 min-h-full min-w-full object-contain max-h-svh transition-opacity duration-300"
//           muted
//           playsInline
//           // autoPlay
//           loop
//           style={{ opacity: activeVideo === "speaking" ? 1 : 0 }}
//         />

//         {/* Listening video */}
//         <video
//           ref={listeningVideoRef}
//           src="/videos/panda-listning.mp4"
//           className="absolute top-0 left-0 min-h-full min-w-full object-contain max-h-svh transition-opacity duration-300"
//           muted
//           playsInline
//           loop
//           style={{ opacity: activeVideo === "listening" ? 1 : 0 }}
//         />

//         {/* Start Mic Button */}
//         <div className="absolute bottom-2 left-0 right-0 gap-2 p-2 flex items-center flex-col justify-center">
//           <button
//             onClick={recording ? handleStopRecording : handleStartRecording}
//             className={` ${
//               recording ? "bg-red-500 animate-pulse" : "bg-teal-500"
//             }
//               text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 max-w-fit`}
//           >
//             <div className="flex items-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
//                 />
//               </svg>
//               <span className="ml-2 text-lg font-medium">
//                 {recording ? "Stop Recording" : "Start Mic"}
//               </span>
//             </div>
//           </button>
//           <button
//             className="bg-red-500 text-white py-4 px-8 rounded-lg font-bold text-lg shadow-lg w-full max-w-sm transition-all duration-300 hover:bg-opacity-90"
//             onClick={() => calculateOrderDetails()}
//           >
//             Place Your Order
//           </button>
//         </div>
//       </div>

//       {/* Floating Place Order Button */}
//       {/* <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
//         <button
//           className="bg-red-500 text-white py-4 px-8 rounded-lg font-bold text-lg shadow-lg w-full max-w-sm transition-all duration-300 hover:bg-opacity-90"
//           onClick={() => {
//             router.push("/summary");
//           }}
//         >
//           Place Your Order
//         </button>
//       </div> */}
//       <audio
//         ref={audioRef}
//         onEnded={() => {
//           console.log("Audio playback ended");
//           setIsPlaying(false);

//           // Add a small delay before starting recording
//           // This helps ensure all resources are properly released
//           setTimeout(() => {
//             console.log("Starting recording after delay");
//             if (!recording) {
//               handleStartRecording();
//             } else {
//               console.warn(
//                 "Recording already in progress, cannot start new recording"
//               );
//             }
//           }, 300); // 300ms delay
//         }}
//         onError={(e) => {
//           console.error("Audio error:", e);
//           setIsPlaying(false);
//         }}
//         // controls
//         style={{ display: "block", marginTop: "20px" }}
//       />
//       <Loading isVisible={isLoading} />
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Loading from "@/components/Loading";
import { useOrder } from "@/context/OrderContext";

export default function OrderPage() {
  const speakingVideoRef = useRef(null);
  const listeningVideoRef = useRef(null);
  const audioRef = useRef(null);
  const [order, setOrder] = useState("");
  const [uuid, setUuid] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState("speaking"); // To track which video is active
  const [userResponse, setUserResponse] = useState(null);
  const router = useRouter();
  const { setOrderDetailsAPI } = useOrder();

  // Refs to track initialization state
  const hasInitialized = useRef(false);
  const initialFetchDone = useRef(false);

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
  } = useSpeechRecognition(handleSpeechEnd);

  useEffect(() => {
    // This function handles the beforeunload event (page refresh)
    const handleBeforeUnload = (event) => {
      // Store a flag in sessionStorage to indicate a page refresh is happening
      sessionStorage.setItem("isRefreshing", "true");
    };

    // This function runs when the page loads
    const handlePageLoad = () => {
      // Check if the page is being loaded after a refresh
      const isRefreshing = sessionStorage.getItem("isRefreshing");

      if (isRefreshing === "true") {
        // Clear the flag
        sessionStorage.removeItem("isRefreshing");

        // Redirect to the home page
        router.push("/");
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Check on page load
    if (typeof window !== "undefined") {
      handlePageLoad();
    }

    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router]);

  // Initialize component and generate UUID
  useEffect(() => {
    // If we've already initialized, don't do it again
    if (hasInitialized.current) {
      console.log("Already initialized, skipping duplicate setup");
      return;
    }

    console.log("Performing initial setup");
    setIsLoading(true);
    const uid = uuidv4();
    console.log("Generated UUID:", uid);
    setUuid(uid);

    // Mark as initialized BEFORE the fetch to prevent race conditions
    hasInitialized.current = true;

    // Now fetch the initial audio - but only once
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchAudio(uid, "start");
    }

    setIsLoading(false);
  }, []); // Keep the empty dependency array

  // Handle speech text changes
  useEffect(() => {
    if (speechText && uuid) {
      // Make sure UUID exists before fetching
      if (audioRef.current) {
        audioRef?.current?.pause();
      }

      fetchAudio(uuid, speechText); // Pass both UUID and speech text
    }
  }, [speechText, uuid]); // Add UUID dependency

  const switchToSpeakingVideo = () => {
    if (speakingVideoRef.current && listeningVideoRef.current) {
      // First, start playing the video we're switching to, while it's still hidden
      speakingVideoRef.current.play().then(() => {
        // Use opacity for a smoother transition
        listeningVideoRef.current.style.opacity = "0";
        speakingVideoRef.current.style.opacity = "1";

        // Wait for a short moment to ensure the new video is ready, then pause the old one
        setTimeout(() => {
          listeningVideoRef?.current?.pause();
        }, 50);
      });

      setActiveVideo("speaking");
    }
  };

  const switchToListeningVideo = () => {
    if (speakingVideoRef.current && listeningVideoRef.current) {
      // First, start playing the video we're switching to, while it's still hidden
      listeningVideoRef.current.play().then(() => {
        // Use opacity for a smoother transition
        speakingVideoRef.current.style.opacity = "0";
        listeningVideoRef.current.style.opacity = "1";

        // Wait for a short moment to ensure the new video is ready, then pause the old one
        setTimeout(() => {
          speakingVideoRef?.current?.pause();
        }, 50);
      });

      setActiveVideo("listening");
    }
  };

  const handleStartRecording = async () => {
    if (recording) return;

    // Switch to listening video when recording starts
    switchToListeningVideo();

    if (audioRef.current) {
      console.log("audioref");
      audioRef?.current?.pause();
    }

    startSpeechRecognition();
  };

  const handleStopRecording = async () => {
    stopSpeechRecognition();
    // When recording stops, switch back to speaking video
    // switchToSpeakingVideo();
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    handleStartRecording();
  };

  const calculateOrderDetails = async () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsLoading(true);
      const response = await fetch(
        // "http://192.168.1.10:8827/api/order_summary",
        "https://node.hivoco.com/api/order_summary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: uuid,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch audio response");
      }

      // Get the response data - expecting an S3 audio URL
      const data = await response.json();

      if (data) {
        console.log("object", data);

        setOrderDetailsAPI(data);

        router.push("/summary");
      } else {
        console.error("No audio URL in the response");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching audio:", error);
    }
  };

  const handleStream = async (text) => {
    if (!text) return;
    console.log(
      "Starting audio stream for text:",
      text.substring(0, 20) + "..."
    );

    setIsPlaying(true);

    const mediaSource = new MediaSource();
    const audio = audioRef.current;

    // Clear any previous src
    if (audio.src) {
      URL.revokeObjectURL(audio.src);
    }

    audio.src = URL.createObjectURL(mediaSource);
    audio.load();

    return new Promise((resolve, reject) => {
      mediaSource.addEventListener("sourceopen", async () => {
        console.log("MediaSource opened");
        let sourceBuffer;

        try {
          sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
        } catch (error) {
          console.error("Error adding source buffer:", error);
          setIsPlaying(false);
          reject(error);
          return;
        }

        try {
          console.log("Fetching audio from API...");
          const response = await fetch("/api/text-to-speech/convert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, voiceId: "7QwDAfHpHjPD14XYTSiq" }),
          });

          console.log("API response status:", response.status);

          if (!response.ok || !response.body) {
            throw new Error(
              `Failed to stream audio: ${response.status} ${response.statusText}`
            );
          }

          const reader = response.body.getReader();

          const queue = [];
          let isEndOfStream = false;

          const appendNextChunk = () => {
            if (queue.length === 0) {
              if (isEndOfStream && !sourceBuffer.updating) {
                console.log("End of stream reached, closing MediaSource");
                try {
                  mediaSource.endOfStream();
                } catch (err) {
                  console.warn("Error ending stream:", err);
                }
              }
              return;
            }

            if (sourceBuffer.updating) return;

            const chunk = queue.shift();
            try {
              sourceBuffer.appendBuffer(chunk);
            } catch (err) {
              console.error("Error appending buffer:", err);
              if (err.name === "QuotaExceededError") {
                // Clear some from the buffer and try again later
                queue.unshift(chunk);
                sourceBuffer.remove(0, 2); // Remove first 2 seconds
              }
            }
          };

          sourceBuffer.addEventListener("updateend", appendNextChunk);

          const pump = async () => {
            try {
              const { done, value } = await reader.read();

              if (done) {
                console.log("Reader done, marking end of stream");
                isEndOfStream = true;
                appendNextChunk(); // Try to end the stream
                return;
              }

              queue.push(value);
              appendNextChunk();
              pump();
            } catch (err) {
              console.error("Error during read:", err);
              isEndOfStream = true;
              appendNextChunk();
            }
          };

          // Make sure the audio element is fully ready before playing
          audio.addEventListener(
            "canplay",
            () => {
              console.log("Audio can play now, starting playback");
              try {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                  playPromise
                    .then(() => {
                      console.log("Audio playback started successfully");
                      // Switch to speaking video when API gives a response
                      switchToSpeakingVideo();
                    })
                    .catch((err) => {
                      console.error("Error playing audio:", err);
                      setIsPlaying(false);
                    });
                }
              } catch (err) {
                console.error("Error during play:", err);
                setIsPlaying(false);
              }
            },
            { once: true }
          ); // only trigger once

          pump();
        } catch (err) {
          console.error("Streaming error:", err);
          setIsPlaying(false);
          reject(err);
        }
      });

      // Handle any errors with the MediaSource
      mediaSource.addEventListener("error", (err) => {
        console.error("MediaSource error:", err);
        setIsPlaying(false);
        reject(err);
      });
    });
  };

  useEffect(() => {
    if (!userResponse) return;
    handleStream(userResponse);
    return () => {};
  }, [userResponse]);

  // Modified to handle both initial fetch and subsequent fetches
  const fetchAudio = async (sessionId, question) => {
    if (!sessionId) {
      console.error("Cannot fetch audio without a valid session ID");
      return;
    }

    try {
      console.log(
        `Fetching audio with session ID: ${sessionId} and question: ${
          question || "start"
        }`
      );

      const response = await fetch("https://node.hivoco.com/api/order_chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_text: question,
          open_model: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audio response");
      }

      // Get the response data
      const data = await response.json();
      setUserResponse(data.response);
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  return (
    <div className="h-svh flex flex-col relative bg-black">
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

      {/* Full-height video container */}
      <div className="flex-grow flex flex-col items-center justify-center overflow-hidden bg-gray-900">
        {/* Speaking video */}
        <video
          ref={speakingVideoRef}
          src="/videos/panda-speaking.mp4"
          className="absolute top-0 left-0 min-h-full min-w-full object-contain max-h-svh transition-opacity duration-300"
          muted
          playsInline
          // autoPlay
          loop
          style={{ opacity: activeVideo === "speaking" ? 1 : 0 }}
        />

        {/* Listening video */}
        <video
          ref={listeningVideoRef}
          src="/videos/panda-listning.mp4"
          className="absolute top-0 left-0 min-h-full min-w-full object-contain max-h-svh transition-opacity duration-300"
          muted
          playsInline
          loop
          style={{ opacity: activeVideo === "listening" ? 1 : 0 }}
        />

        {/* Start Mic Button */}
        <div className="absolute bottom-2 left-0 right-0 gap-2 p-2 flex items-center flex-col justify-center">
          <button
            onClick={recording ? handleStopRecording : handleStartRecording}
            className={` ${
              recording ? "bg-red-500 animate-pulse" : "bg-teal-500"
            } 
              text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 max-w-fit`}
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
          <button
            className="bg-red-500 text-white py-4 px-8 rounded-lg font-bold text-lg shadow-lg w-full max-w-sm transition-all duration-300 hover:bg-opacity-90"
            onClick={() => calculateOrderDetails()}
          >
            Place Your Order
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        onEnded={() => {
          console.log("Audio playback ended");
          setIsPlaying(false);

          // Add a small delay before starting recording
          // This helps ensure all resources are properly released
          setTimeout(() => {
            console.log("Starting recording after delay");
            if (!recording) {
              handleStartRecording();
            } else {
              console.warn(
                "Recording already in progress, cannot start new recording"
              );
            }
          }, 300); // 300ms delay
        }}
        onError={(e) => {
          console.error("Audio error:", e);
          setIsPlaying(false);
        }}
        // controls
        style={{ display: "block", marginTop: "20px" }}
      />
      <Loading isVisible={isLoading} />
    </div>
  );
}
