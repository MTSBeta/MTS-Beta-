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

function buildScript(assistantId: string, playerName: string): string | null {
  const n = playerName.trim() || "there";
  switch (assistantId) {
    case "cheeky":
      return (
        `Hiya ${n} — we're about to get some information from you so we can write a book about you. ` +
        `This is your story that we're making, so we need your help to bring it to life properly. ` +
        `Your coaches and your academy are going to help too, and even your parents and friends might have a part to play as well. ` +
        `If you've got 20 to 30 minutes now, that would be great, but don't worry if not — you can always come back and finish it later. ` +
        `I'd also check with your coaches to see when they need this done by. ` +
        `If you ever get stuck on any of the questions, just click me and I'll help you through it.`
      );
    case "chilled":
      return (
        `Hey ${n}. Welcome. Take a breath — there's no rush here. ` +
        `This is your space to be honest, to go deep, and to tell your story properly. ` +
        `Your coaches, your academy, even your parents and friends might all have a part to play. ` +
        `If you've got 20 to 30 minutes now, great — but you can always come back and finish it later. ` +
        `If you ever get stuck, just click me and I'll help you through it.`
      );
    case "driven":
      return (
        `Right, ${n} — let's do this. We're writing a book about you, and we need your help to make it real. ` +
        `Your coaches and your academy are involved. Your parents and friends too. ` +
        `Set aside 20 to 30 minutes and get it done. If not now, come back later — but check with your coaches on the deadline. ` +
        `If you get stuck, click me. Let's get to work.`
      );
    default:
      return null;
  }
}

function slugifyName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").slice(0, 40);
}

router.get("/tts/intro/:assistantId", async (req, res) => {
  const { assistantId } = req.params;
  const playerName = (req.query.name as string | undefined) || "there";

  const script = buildScript(assistantId, playerName);
  if (!script) {
    return res.status(404).json({ error: "Unknown assistant" });
  }

  try {
    await mkdir(CACHE_DIR, { recursive: true });
    const slug = slugifyName(playerName);
    const cachePath = join(CACHE_DIR, `intro-${assistantId}-${slug}.wav`);

    if (existsSync(cachePath)) {
      const cached = await readFile(cachePath);
      res.setHeader("Content-Type", "audio/wav");
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(cached);
    }

    const voice = ASSISTANT_VOICE_MAP[assistantId] ?? "onyx";
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
  const { unlink } = await import("fs/promises");
  const files = (await import("fs")).readdirSync(CACHE_DIR).filter(f => f.startsWith(`intro-${req.params.assistantId}`));
  await Promise.all(files.map(f => unlink(join(CACHE_DIR, f)).catch(() => {})));
  return res.json({ ok: true, cleared: files.length });
});

export default router;
