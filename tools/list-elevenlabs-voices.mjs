import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const client = new ElevenLabsClient();
const result = await client.voices.getAll();
const voices = result.voices || [];

console.log("total_voices=" + voices.length);
for (const v of voices) {
  const id = v.voiceId || v.voice_id || "";
  const name = v.name || "";
  const category = v.category || "";
  const labels = v.labels || {};
  const preview = v.previewUrl || v.preview_url || "";
  console.log(JSON.stringify({
    id,
    name,
    category,
    language: labels.language || "",
    gender: labels.gender || "",
    age: labels.age || "",
    accent: labels.accent || "",
    use_case: labels.use_case || labels.useCase || "",
    description: labels.description || "",
    preview
  }));
}
