import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";

// Initialize the ElevenLabs client with your API key
const client = new ElevenLabsClient({
  apiKey: process.env.ElevenLabsClient,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { text, voiceId } = req.body;

    if (!text || !voiceId) {
      return res.status(400).json({ error: "Text and voice ID are required" });
    }
    

    // Get the audio stream from ElevenLabs
    const audioStream = await client.textToSpeech.convertAsStream(voiceId, {
      text: text,
      model_id: "eleven_multilingual_v2",
    });

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");

    const readableStream = Readable.from(audioStream);

    // Pipe the stream directly to the response
    readableStream.pipe(res);
  } catch (error) {
    console.error("Error in text-to-speech API:", error);
    return res.status(500).json({ error: "Failed to generate speech" });
  }
}
