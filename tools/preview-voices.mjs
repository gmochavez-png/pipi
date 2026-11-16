import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { Readable } from "stream";

const client = new ElevenLabsClient();

const voices = [
  { id: "F3pPb09f6SpwgQJHax6h", name: "01-Liz", text: "¡Hola, soy PIPI! Vamos a leer y jugar juntos. ¡Tú puedes!" },
  { id: "attjAvEwtUIAm108to6B", name: "02-Andrea", text: "¡Hola, soy PIPI! Vamos a leer y jugar juntos. ¡Tú puedes!" },
  { id: "br0MPoLVxuslVxf61qHn", name: "03-Lizy", text: "¡Hola, soy PIPI! Vamos a leer y jugar juntos. ¡Tú puedes!" },
  { id: "cgSgspJ2msm6clMCkdW9", name: "04-Jessica-EN", text: "Great job! Well done! Let's learn English together!" }
];

const dir = "C:/Users/Ghia/Downloads/test harness/tmp_pip/samples";
await mkdir(dir, { recursive: true });

for (const v of voices) {
  try {
    const audio = await client.textToSpeech.convert(v.id, {
      text: v.text,
      modelId: "eleven_v4",
      voiceSettings: { stability: 0.45, similarityBoost: 0.8 }
    });
    const path = `${dir}/${v.name}.mp3`;
    await new Promise((resolve, reject) => {
      const ws = createWriteStream(path);
      Readable.fromWeb(audio).pipe(ws);
      ws.on("finish", resolve);
      ws.on("error", reject);
    });
    console.log("ok", v.name, path);
  } catch (e) {
    console.log("fail", v.name, e && e.message);
  }
}
