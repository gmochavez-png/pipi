import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream } from "fs";
import { Readable } from "stream";

const client = new ElevenLabsClient();

const audio = await client.textToSpeech.convert("F3pPb09f6SpwgQJHax6h", {
  text: "Antonella",
  modelId: "eleven_v4",
  voiceSettings: { stability: 0.45, similarityBoost: 0.8 }
});

await new Promise((resolve, reject) => {
  const ws = createWriteStream("assets/audio/ui/name-antonella.mp3");
  Readable.fromWeb(audio).pipe(ws);
  ws.on("finish", resolve);
  ws.on("error", reject);
});

console.log("ok name-antonella.mp3");
