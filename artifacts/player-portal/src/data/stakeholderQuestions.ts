export interface StakeholderQuestionSet {
  type: string;
  title: string;
  emoji: string;
  intro: string;
  questions: string[];
}

export const STAKEHOLDER_QUESTIONS: Record<string, StakeholderQuestionSet> = {
  parent: {
    type: "parent",
    title: "Parent Perspective",
    emoji: "💛",
    intro: "You see sides of this player that no coach or teammate ever will. We need your version of their story — the real one, from home.",
    questions: [
      "Describe a specific moment — at home, at a match, travelling back from training — when you saw something in your child that made you genuinely proud. What happened, and what did you observe in them?",
      "What does your child look like at home when things aren't going well in football? What do they do, what do they say — and how do you usually notice they're struggling before they've said anything?",
      "Tell me about a conversation you've had with your child about football that has stayed with you. Where were you, what came up, and what was actually said?",
      "What has this football journey asked of your family — the time, the commitment, the difficult moments? And what has kept you going through the harder periods?",
      "If you had to describe this player's journey to someone who has never met them, what would you want them to understand? What moments, habits, or qualities tell their truest story?",
    ],
  },
  friend: {
    type: "friend",
    title: "Friend's View",
    emoji: "🤝",
    intro: "You know things about this player that the coaches will never see. That's exactly what we need from you.",
    questions: [
      "Tell me about a game or a training session you've shared with them — what did they do that only someone who really knows them would understand the significance of?",
      "What are they actually like in the changing room, on the bus, or at training? Not what they say — what they do. The real behaviour that tells you who they are.",
      "Have you been around them when things weren't going well — not just a bad game, but a genuinely hard time? What did that look like, and what did you do?",
      "What do they say about football when it's just the two of you — no coaches, no parents around? What's the version of their experience that you get that nobody else does?",
      "Looking back at everything you've been through together — what is the quality or the habit that you think will define where they end up?",
    ],
  },
  football_coach: {
    type: "football_coach",
    title: "Football Coach",
    emoji: "📋",
    intro: "Your eye sees things no one else on this list can see. We need your honest professional read — grounded in what you've actually observed. You'll also help shape how this player's story is told.",
    questions: [
      "Describe the session or moment when you first observed something in this player that set them apart — not necessarily better, but different. What exactly happened, and what did you notice?",
      "What is this player's most consistent on-pitch behaviour or habit that would never show up in a statistics report or standard session notes? Give one specific example of when you observed it.",
      "Describe a moment in training or a match when this player's response genuinely surprised you. What happened, what did you observe, and what did that tell you about them as a developing player?",
      "Based on your observations, what is the single most important development conversation you haven't yet had clearly enough with this player — and why is it the priority right now?",
      "Which club values does this player demonstrate most consistently in training or matches? Give a specific example of one of those values in action.",
      "What are the two or three areas of development you most want their story to reflect — the challenges they are actively working through right now?",
      "What themes, lessons, or messages do you want woven into this player's story? What do you want them to carry forward from this chapter of their development?",
    ],
  },
  education: {
    type: "education",
    title: "Education Staff",
    emoji: "📚",
    intro: "The classroom shows you a version of this player the pitch never does. What you observe in your setting is essential to building a complete picture.",
    questions: [
      "How does this player approach something they find genuinely difficult? Give a specific example — what do you observe in their behaviour and attitude when something isn't coming easily to them?",
      "Tell me about a moment when this player showed real character in an academic or group setting. What happened, and what did you see?",
      "What do you notice about how this player carries themselves in school? Are there behaviours, habits, or attitudes that you think connect to their football environment?",
      "What consistent behaviours or tendencies do you observe in this player within a learning environment — things that wouldn't appear in any coaching report but that give you a clear picture of how they operate?",
      "If you were writing the opening paragraph of this player's story using only what you've seen in your setting — what would you write?",
    ],
  },
  psychology: {
    type: "psychology",
    title: "Psychology Staff",
    emoji: "🔬",
    intro: "You observe this player in some of the most revealing moments they go through. The behavioural patterns you've noticed are some of the most valuable developmental input in the whole process.",
    questions: [
      "How does this player typically behave under pressure — in high-stakes moments, after errors, or during difficult phases? Describe the pattern you have observed most consistently.",
      "How does this player usually respond after mistakes, setbacks, or disappointing performances? What do you observe in their behaviour, communication, or body language in those moments — and how long does that response typically last?",
      "In difficult moments — a mistake, a conflict, or a setback — what do you observe in this player's communication, body language, or attitude toward themselves and others? What does that pattern tend to look like?",
      "What is the most consistent behavioural or emotional pattern you have observed during your work with this player? Describe the situations in which it tends to appear and how frequently it shows up.",
      "Based on what you have observed over time, what is the single most important developmental focus for this player over the next 12 months? What specific evidence or pattern leads you to that view?",
    ],
  },
  player_care: {
    type: "player_care",
    title: "Player Care",
    emoji: "🛡️",
    intro: "You see the whole person, not just the footballer. What you notice from your position tells a story that nobody else on this list can tell.",
    questions: [
      "What does this player's daily energy and demeanour tell you — and when does it change? What shifts have you noticed that others around them might not pick up on?",
      "Has there been a welfare or wellbeing moment with this player that you've witnessed? What happened, how did they respond, and what did you observe about how they handled it?",
      "Who genuinely shows up for this player — inside the academy and outside it? What do those relationships look like from what you've observed?",
      "What signs or behaviours have you noticed that suggest this player is managing real pressure or challenge? What situations tend to bring these out, and how often do you see them?",
      "If you were writing the opening scene of their story — the day-to-day human detail that makes a story feel real — what would be in it?",
    ],
  },
};

export function getStakeholderQuestions(type: string): StakeholderQuestionSet {
  return STAKEHOLDER_QUESTIONS[type] ?? STAKEHOLDER_QUESTIONS["parent"];
}
