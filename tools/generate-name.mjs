/* Genera assets/audio/ui/nombre.mp3 con la voz de PIPI.
   El nombre NO se escribe aquí (el repositorio es público):
   agrega a .env.local una línea   PIPI_NAME=TuNombre
   y ejecuta:   npm run voices:name
   Al terminar, copia la huella que se imprime en NAME_AUDIO (js/app.js). */
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream } from "fs";
import { Readable } from "stream";

const name = (process.env.PIPI_NAME || "").trim();
if (!name) {
  console.error("Falta PIPI_NAME en .env.local");
  process.exit(1);
}

function nameHash(s) {
  s = s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
  let x = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i);
    x = Math.imul(x, 0x01000193) >>> 0;
  }
  return x.toString(16).padStart(8, "0");
}

const client = new ElevenLabsClient();

const audio = await client.textToSpeech.convert("F3pPb09f6SpwgQJHax6h", {
  text: name,
  modelId: "eleven_v4",
  voiceSettings: { stability: 0.45, similarityBoost: 0.8 }
});

await new Promise((resolve, reject) => {
  const ws = createWriteStream("assets/audio/ui/nombre.mp3");
  Readable.fromWeb(audio).pipe(ws);
  ws.on("finish", resolve);
  ws.on("error", reject);
});

console.log("ok nombre.mp3 · huella para NAME_AUDIO en js/app.js:", nameHash(name));
