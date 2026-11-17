import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream, readFileSync, mkdirSync } from "fs";
import { Readable } from "stream";
import vm from "vm";
import path from "path";

const client = new ElevenLabsClient();
const appRoot = process.cwd();
const code = readFileSync(path.join(appRoot, "js", "stories.js"), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const stories = sandbox.window.PIPI_STORIES;

const outDir = path.join(appRoot, "assets", "audio", "cuentos");
mkdirSync(outDir, { recursive: true });

for (const story of stories) {
  const text = story.lines.join(" ");
  const audio = await client.textToSpeech.convert("F3pPb09f6SpwgQJHax6h", {
    text,
    modelId: "eleven_v4",
    voiceSettings: { stability: 0.45, similarityBoost: 0.8 }
  });
  const file = path.join(outDir, story.slug + ".mp3");
  await new Promise((resolve, reject) => {
    const ws = createWriteStream(file);
    Readable.fromWeb(audio).pipe(ws);
    ws.on("finish", resolve);
    ws.on("error", reject);
  });
  console.log("ok", story.slug, story.lines.length + " lineas");
}
