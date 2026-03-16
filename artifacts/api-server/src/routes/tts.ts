import { Router } from "express";
import { textToSpeech } from "@workspace/integrations-openai-ai-server/audio";
import { existsSync } from "fs";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";

const router = Router();

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const CACHE_DIR = join(__dirname, "../../.tts-cache");

const ASSISTANT_VOICE_MAP: Record<string, "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"> = {
  cheeky: "onyx",
  chilled: "nova",
  driven: "echo",
};

const ASSISTANT_SCRIPTS: Record<string, string> = {
  cheeky: `Oi — you caught me. I was setting the mood. Anyway, welcome to the questions. This first page is easy — just upload your picture and we'll get you set. Think of this like stepping into the tunnel before kick-off. Once that's done, we move properly. Come on then — let's get started.`,
  chilled: `Hey. Welcome. Take a breath — there's no rush here. This is your space to be honest, to go deep, and to tell your story properly. We'll start simple: upload your picture, get settled. Then we'll move through things at your pace. Ready when you are.`,
  driven: `Right. Let's go. You're here because someone saw something in you. Now it's your turn to show it. This isn't a survey — it's your story. Upload your picture and let's get started. No excuses. No holding back. Let's get to work.`,
};

router.get("/tts/intro/:assistantId", async (req, res) => {
  const { assistantId } = req.params;

  if (!ASSISTANT_SCRIPTS[assistantId]) {
    return res.status(404).json({ error: "Unknown assistant" });
  }

  try {
    await mkdir(CACHE_DIR, { recursive: true });
    const cachePath = join(CACHE_DIR, `intro-${assistantId}.wav`);

    if (existsSync(cachePath)) {
      const cached = await readFile(cachePath);
      res.setHeader("Content-Type", "audio/wav");
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(cached);
    }

    const voice = ASSISTANT_VOICE_MAP[assistantId] ?? "onyx";
    const script = ASSISTANT_SCRIPTS[assistantId];

    const audioBuffer = await textToSpeech(script, voice, "wav");
    await writeFile(cachePath, audioBuffer);

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(audioBuffer);
  } catch (err) {
    console.error("[TTS] generation error:", err);
    return res.status(500).json({ error: "Audio generation failed" });
  }
});

router.delete("/tts/intro/:assistantId", async (req, res) => {
  const { assistantId } = req.params;
  const { unlink } = await import("fs/promises");
  const cachePath = join(CACHE_DIR, `intro-${assistantId}.wav`);
  await unlink(cachePath).catch(() => {});
  return res.json({ ok: true });
});

export default router;
