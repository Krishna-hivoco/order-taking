// import { ElevenLabsClient } from "elevenlabs";
// import { Readable } from "stream";

// // Initialize the ElevenLabs client with your API key
// const client = new ElevenLabsClient({
//   apiKey: process.env.ElevenLabsClient,
// });

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).json({ error: `Method ${req.method} not allowed` });
//   }

//   try {
//     const { text, voiceId } = req.body;

//     if (!text || !voiceId) {
//       return res.status(400).json({ error: "Text and voice ID are required" });
//     }
    

//     // Get the audio stream from ElevenLabs
//     const audioStream = await client.textToSpeech.convertAsStream(voiceId, {
//       text: text,
//       model_id: "eleven_multilingual_v2",
//     });

//     res.setHeader("Content-Type", "audio/mpeg");
//     res.setHeader("Transfer-Encoding", "chunked");

//     const readableStream = Readable.from(audioStream);

//     // Pipe the stream directly to the response
//     readableStream.pipe(res);
//   } catch (error) {
//     console.error("Error in text-to-speech API:", error);
//     return res.status(500).json({ error: "Failed to generate speech" });
//   }
// }



// Ultra-optimized TTS API - /pages/api/text-to-speech/convert.js
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({
  apiKey: process.env.ElevenLabsClient,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const startTime = Date.now();

  try {
    const { text, voiceId } = req.body;

    if (!text || !voiceId) {
      return res.status(400).json({ error: "Text and voice ID are required" });
    }

    console.log(`TTS Request - Length: ${text.length} chars, Voice: ${voiceId}`);

    // FASTEST POSSIBLE SETTINGS
    const audioStream = await client.textToSpeech.convertAsStream(voiceId, {
      text: text,
      model_id: "eleven_turbo_v2", // Fastest model available
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5, // Reduced for speed
        style: 0.0,
        use_speaker_boost: false
      },
      // CRITICAL: Maximum latency optimization
      optimize_streaming_latency: 4, // 0-4, 4 is maximum optimization
      output_format: "mp3_22050_32", // Lower quality = faster generation
      
      // Additional optimizations (if supported by your ElevenLabs version)
      // language_code: "en", // Specify language for faster processing
    });

    // Optimized headers for immediate streaming
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Connection", "keep-alive");

    console.log(`TTS generation started in ${Date.now() - startTime}ms`);

    let chunkCount = 0;
    let firstChunkTime = null;

    try {
      for await (const chunk of audioStream) {
        chunkCount++;
        
        if (chunkCount === 1) {
          firstChunkTime = Date.now() - startTime;
          console.log(`First audio chunk in ${firstChunkTime}ms`);
        }
        
        // Write chunk immediately without buffering
        res.write(chunk);
        
        // Optional: Add small delay only if client can't handle the speed
        // await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      const totalTime = Date.now() - startTime;
      console.log(`TTS complete: ${totalTime}ms total, ${chunkCount} chunks, First chunk: ${firstChunkTime}ms`);
      
      res.end();
      
    } catch (streamError) {
      console.error("Streaming error:", streamError);
      if (!res.headersSent) {
        res.status(500).json({ error: "Streaming failed" });
      }
    }

  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`TTS Error after ${errorTime}ms:`, error);
    
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: "Failed to generate speech",
        details: error.message,
        time: errorTime
      });
    }
  }
}

// CRITICAL: Configure Next.js for optimal streaming
export const config = {
  api: {
    responseLimit: false, // Remove size limits
    bodyParser: {
      sizeLimit: '1mb',
    },
    // Increase timeout if needed
    // timeout: 30000,
  },
}

// Optional: Add caching for repeated phrases (advanced optimization)
const cache = new Map();
const CACHE_MAX_SIZE = 100;
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

function getCacheKey(text, voiceId) {
  return `${voiceId}:${text.substring(0, 100)}`; // Cache based on first 100 chars
}

function getFromCache(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(key, data) {
  if (cache.size >= CACHE_MAX_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, { data, timestamp: Date.now() });
}