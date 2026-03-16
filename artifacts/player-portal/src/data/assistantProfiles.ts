export type AssistantId = "cheeky" | "chilled" | "driven";

export interface SubtitleLine {
  text: string;
  pauseAfterMs?: number;
}

export interface AssistantProfile {
  id: AssistantId;
  name: string;
  tone: string;
  introScript: string;
  subtitleLines: SubtitleLine[];
  voiceId: string;
  accentColor: string;
  avatarEmoji: string;
}

export const ASSISTANT_PROFILES: Record<AssistantId, AssistantProfile> = {
  cheeky: {
    id: "cheeky",
    name: "Cheeky",
    tone: "playful, direct, football-aware",
    introScript: `Oi — you caught me. I was setting the mood. Anyway, welcome to the questions. This first page is easy — just upload your picture and we'll get you set. Think of this like stepping into the tunnel before kick-off. Once that's done, we move properly. Come on then — let's get started.`,
    subtitleLines: [
      { text: "Oi — you caught me.", pauseAfterMs: 600 },
      { text: "I was setting the mood.", pauseAfterMs: 900 },
      { text: "", pauseAfterMs: 400 },
      { text: "Anyway, welcome to the questions.", pauseAfterMs: 700 },
      { text: "This first page is easy —", pauseAfterMs: 300 },
      { text: "just upload your picture and we'll get you set.", pauseAfterMs: 900 },
      { text: "", pauseAfterMs: 400 },
      { text: "Think of this like stepping into the tunnel before kick-off.", pauseAfterMs: 900 },
      { text: "Once that's done, we move properly.", pauseAfterMs: 800 },
      { text: "", pauseAfterMs: 300 },
      { text: "Come on then — let's get started.", pauseAfterMs: 0 },
    ],
    voiceId: "onyx",
    accentColor: "#EAB308",
    avatarEmoji: "⚡",
  },
  chilled: {
    id: "chilled",
    name: "Chilled",
    tone: "calm, warm, supportive",
    introScript: `Hey. Welcome. Take a breath — there's no rush here. This is your space to be honest, to go deep, and to tell your story properly. We'll start simple: upload your picture, get settled. Then we'll move through things at your pace. Ready when you are.`,
    subtitleLines: [
      { text: "Hey. Welcome.", pauseAfterMs: 700 },
      { text: "Take a breath — there's no rush here.", pauseAfterMs: 900 },
      { text: "", pauseAfterMs: 400 },
      { text: "This is your space to be honest,", pauseAfterMs: 400 },
      { text: "to go deep, and to tell your story properly.", pauseAfterMs: 900 },
      { text: "", pauseAfterMs: 400 },
      { text: "We'll start simple: upload your picture, get settled.", pauseAfterMs: 800 },
      { text: "Then we'll move through things at your pace.", pauseAfterMs: 800 },
      { text: "", pauseAfterMs: 300 },
      { text: "Ready when you are.", pauseAfterMs: 0 },
    ],
    voiceId: "nova",
    accentColor: "#22D3EE",
    avatarEmoji: "🌊",
  },
  driven: {
    id: "driven",
    name: "Driven",
    tone: "focused, intense, motivational",
    introScript: `Right. Let's go. You're here because someone saw something in you. Now it's your turn to show it. This isn't a survey — it's your story. Upload your picture and let's get started. No excuses. No holding back. Let's get to work.`,
    subtitleLines: [
      { text: "Right. Let's go.", pauseAfterMs: 600 },
      { text: "You're here because someone saw something in you.", pauseAfterMs: 900 },
      { text: "Now it's your turn to show it.", pauseAfterMs: 900 },
      { text: "", pauseAfterMs: 400 },
      { text: "This isn't a survey — it's your story.", pauseAfterMs: 900 },
      { text: "", pauseAfterMs: 300 },
      { text: "Upload your picture and let's get started.", pauseAfterMs: 700 },
      { text: "No excuses. No holding back.", pauseAfterMs: 600 },
      { text: "Let's get to work.", pauseAfterMs: 0 },
    ],
    voiceId: "echo",
    accentColor: "#F97316",
    avatarEmoji: "🔥",
  },
};

export const DEFAULT_ASSISTANT: AssistantId = "cheeky";
