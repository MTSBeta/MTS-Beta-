export type AssistantId = "cheeky" | "chilled" | "driven";

export interface SubtitleLine {
  text: string;
}

export interface AssistantProfile {
  id: AssistantId;
  name: string;
  displayName: "Mety";
  pronunciation: "(me-thai)";
  tone: string;
  getIntroScript: (playerName: string) => string;
  getSubtitleLines: (playerName: string) => SubtitleLine[];
  voiceId: string;
  accentColor: string;
  avatarEmoji: string;
}

export const ASSISTANT_PROFILES: Record<AssistantId, AssistantProfile> = {
  cheeky: {
    id: "cheeky",
    name: "Cheeky",
    displayName: "Mety",
    pronunciation: "(me-thai)",
    tone: "warm, friendly, football-aware",
    getIntroScript: (name) =>
      `Hiya ${name} — we're about to get some information from you so we can write a book about you. ` +
      `This is your story that we're making, so we need your help to bring it to life properly. ` +
      `Your coaches and your academy are going to help too, and even your parents and friends might have a part to play as well. ` +
      `If you've got 20 to 30 minutes now, that would be great, but don't worry if not — you can always come back and finish it later. ` +
      `I'd also check with your coaches to see when they need this done by. ` +
      `If you ever get stuck on any of the questions, just click me and I'll help you through it.`,
    getSubtitleLines: (name) => [
      { text: `Hiya ${name} —` },
      { text: "we're about to get some information from you so we can write a book about you." },
      { text: "" },
      { text: "This is your story that we're making," },
      { text: "so we need your help to bring it to life properly." },
      { text: "Your coaches and your academy are going to help too," },
      { text: "and even your parents and friends might have a part to play as well." },
      { text: "" },
      { text: "If you've got 20 to 30 minutes now, that would be great," },
      { text: "but don't worry if not — you can always come back and finish it later." },
      { text: "" },
      { text: "I'd also check with your coaches to see when they need this done by." },
      { text: "" },
      { text: "If you ever get stuck on any of the questions," },
      { text: "just click me and I'll help you through it." },
    ],
    voiceId: "onyx",
    accentColor: "#EAB308",
    avatarEmoji: "⚡",
  },
  chilled: {
    id: "chilled",
    name: "Chilled",
    displayName: "Mety",
    pronunciation: "(me-thai)",
    tone: "calm, warm, supportive",
    getIntroScript: (name) =>
      `Hey ${name}. Welcome. Take a breath — there's no rush here. ` +
      `This is your space to be honest, to go deep, and to tell your story properly. ` +
      `Your coaches, your academy, even your parents and friends might all have a part to play. ` +
      `If you've got 20 to 30 minutes now, great — but you can always come back and finish it later. ` +
      `If you ever get stuck, just click me and I'll help you through it.`,
    getSubtitleLines: (name) => [
      { text: `Hey ${name}. Welcome.` },
      { text: "Take a breath — there's no rush here." },
      { text: "" },
      { text: "This is your space to be honest," },
      { text: "to go deep, and to tell your story properly." },
      { text: "Your coaches, your academy, even your parents and friends" },
      { text: "might all have a part to play." },
      { text: "" },
      { text: "If you've got 20 to 30 minutes now, great —" },
      { text: "but you can always come back and finish it later." },
      { text: "" },
      { text: "If you ever get stuck, just click me and I'll help you through it." },
    ],
    voiceId: "nova",
    accentColor: "#22D3EE",
    avatarEmoji: "🌊",
  },
  driven: {
    id: "driven",
    name: "Driven",
    displayName: "Mety",
    pronunciation: "(me-thai)",
    tone: "focused, direct, motivational",
    getIntroScript: (name) =>
      `Right, ${name} — let's do this. We're writing a book about you, and we need your help to make it real. ` +
      `Your coaches and your academy are involved. Your parents and friends too. ` +
      `Set aside 20 to 30 minutes and get it done. If not now, come back later — but check with your coaches on the deadline. ` +
      `If you get stuck, click me. Let's get to work.`,
    getSubtitleLines: (name) => [
      { text: `Right, ${name} — let's do this.` },
      { text: "We're writing a book about you, and we need your help to make it real." },
      { text: "" },
      { text: "Your coaches and your academy are involved." },
      { text: "Your parents and friends too." },
      { text: "" },
      { text: "Set aside 20 to 30 minutes and get it done." },
      { text: "If not now, come back later — but check with your coaches on the deadline." },
      { text: "" },
      { text: "If you get stuck, click me. Let's get to work." },
    ],
    voiceId: "echo",
    accentColor: "#F97316",
    avatarEmoji: "🔥",
  },
};

export const DEFAULT_ASSISTANT: AssistantId = "cheeky";
