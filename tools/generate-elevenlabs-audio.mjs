import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream } from "fs";
import { mkdir, readFile } from "fs/promises";
import { Readable } from "stream";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const audioRoot = path.join(appRoot, "assets", "audio");

const VOICE_ES = "F3pPb09f6SpwgQJHax6h"; // Liz - dulce y cálida
const VOICE_EN = "cgSgspJ2msm6clMCkdW9"; // Jessica - juguetona y brillante
const MODEL = "eleven_v4";

const client = new ElevenLabsClient();

/* Cargar las lecciones desde js/lessons.js */
const code = await readFile(path.join(appRoot, "js", "lessons.js"), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const lessons = sandbox.window.PIPI_LESSONS;

const items = [];
for (const mod of Object.keys(lessons)) {
  for (const cat of Object.keys(lessons[mod].categories)) {
    lessons[mod].categories[cat].items.forEach((it, i) => {
      if (mod === "ingles") {
        items.push({ module: mod, category: cat, index: i, text: it.en, lang: "en" });
      } else {
        items.push({ module: mod, category: cat, index: i, text: it.say || it.big, lang: "es" });
      }
    });
  }
}

const ui = [
  { slug: "hola", text: "¡Hola! Soy PIPI", lang: "es" },
  { slug: "jugamos-leer", text: "¿Jugamos a leer?", lang: "es" },
  { slug: "vamos-ingles", text: "¡Vamos a aprender inglés!", lang: "es" },
  { slug: "sonries", text: "¡Me gusta cuando sonríes!", lang: "es" },
  { slug: "estrella", text: "¿Quieres una estrella?", lang: "es" },
  { slug: "tu-puedes", text: "¡Tú puedes!", lang: "es" },
  { slug: "tocame", text: "Tócame y te hablo", lang: "es" },
  { slug: "muy-bien", text: "¡Muy bien!", lang: "es" },
  { slug: "terminaste", text: "¡Muy bien! Terminaste.", lang: "es" },
  { slug: "feliz-1", text: "¡Muy bien!", lang: "es" },
  { slug: "feliz-2", text: "¡Excelente!", lang: "es" },
  { slug: "feliz-3", text: "¡Lo hiciste genial!", lang: "es" },
  { slug: "feliz-4", text: "¡Qué bien lees!", lang: "es" },
  { slug: "feliz-5", text: "¡Bravo!", lang: "es" },
  { slug: "feliz-6", text: "¡Eres una campeona!", lang: "es" },
  { slug: "feliz-7", text: "¡Eso es!", lang: "es" },
  { slug: "feliz-8", text: "¡Genial!", lang: "es" },
  { slug: "feliz-9", text: "¡Pipi está muy feliz!", lang: "es" },
  { slug: "feliz-10", text: "¡Sigue así!", lang: "es" },
  { slug: "en-1", text: "Great job!", lang: "en" },
  { slug: "en-2", text: "Excellent!", lang: "en" },
  { slug: "en-3", text: "Well done!", lang: "en" },
  { slug: "en-4", text: "You are amazing!", lang: "en" },
  { slug: "en-5", text: "Keep it up!", lang: "en" }
];

const jobs = [
  ...items.map((x) => ({
    text: x.text,
    voice: x.lang === "en" ? VOICE_EN : VOICE_ES,
    out: path.join(audioRoot, x.module, x.category, x.index + ".mp3")
  })),
  ...ui.map((x) => ({
    text: x.text,
    voice: x.lang === "en" ? VOICE_EN : VOICE_ES,
    out: path.join(audioRoot, "ui", x.slug + ".mp3")
  }))
];

console.log(`total=${jobs.length} (items=${items.length}, ui=${ui.length})`);

function writeStream(stream, file) {
  return new Promise((resolve, reject) => {
    const ws = createWriteStream(file);
    Readable.fromWeb(stream).pipe(ws);
    ws.on("finish", resolve);
    ws.on("error", reject);
  });
}

async function synth(text, voice) {
  let last;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await client.textToSpeech.convert(voice, {
        text,
        modelId: MODEL,
        voiceSettings: { stability: 0.45, similarityBoost: 0.8 }
      });
    } catch (e) {
      last = e;
      if (attempt < 3) await new Promise((r) => setTimeout(r, 1200 * attempt));
    }
  }
  throw last;
}

let ok = 0;
let fail = 0;
for (const job of jobs) {
  try {
    await mkdir(path.dirname(job.out), { recursive: true });
    const stream = await synth(job.text, job.voice);
    await writeStream(stream, job.out);
    ok++;
  } catch (e) {
    fail++;
    console.log("FAIL " + job.out + " :: " + (e && e.message));
  }
  if ((ok + fail) % 10 === 0) {
    console.log(`progress ${ok + fail}/${jobs.length} ok=${ok} fail=${fail}`);
  }
}
console.log(`DONE ok=${ok} fail=${fail}`);
