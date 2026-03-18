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
      "Describe a moment when you felt genuinely proud of your child in their football journey.",
      "When football is not going their way, what do you tend to notice at home?",
      "Tell me about a football conversation with your child that has stayed with you.",
      "What has this football journey asked of your family?",
      "What would you want someone writing their story to truly understand about them?",
    ],
  },
  friend: {
    type: "friend",
    title: "Friend's View",
    emoji: "🤝",
    intro: "You know things about this player that the coaches will never see. That's exactly what we need from you.",
    questions: [
      "Tell me about a football moment you shared with them that meant more than most people would realise.",
      "What are they really like around the team — in the changing room, on the bus, or at training?",
      "Have you seen them go through a difficult football period? What stood out about how they handled it?",
      "What do they say about football when no adults are around?",
      "What quality or habit do you think will shape where they end up?",
    ],
  },
  football_coach: {
    type: "football_coach",
    title: "Football Coach",
    emoji: "📋",
    intro: "Your eye sees things no one else on this list can see. We need your honest professional read — grounded in what you've actually observed.",
    questions: [
      "Describe the first moment you saw something in this player that stood out.",
      "What on-pitch behaviour do they show consistently that statistics would miss?",
      "Describe a moment when their response or attitude surprised you in a positive way.",
      "What key area of development do you most want their story to reflect?",
      "What message, lesson, or theme would you want woven into their story?",
    ],
  },
  education: {
    type: "education",
    title: "Education Staff",
    emoji: "📚",
    intro: "The classroom shows you a version of this player the pitch never does. What you observe in your setting is essential to building a complete picture.",
    questions: [
      "How do they approach something they genuinely find difficult?",
      "Tell me about a moment when they showed real character in your setting.",
      "What do you notice about how they carry themselves in school or group life?",
      "What behaviours or tendencies do you observe consistently in learning?",
      "What would you want a writer to understand about this side of them?",
    ],
  },
  psychology: {
    type: "psychology",
    title: "Psychology Staff",
    emoji: "🔬",
    intro: "You observe this player in some of the most revealing moments they go through. The behavioural patterns you've noticed are some of the most valuable developmental input in the whole process.",
    questions: [
      "How do they usually behave under pressure or after mistakes?",
      "What emotional or behavioural pattern do you notice most consistently?",
      "How do they tend to communicate or carry themselves in difficult moments?",
      "What psychological strength stands out most?",
      "What is the single most important developmental focus for them next?",
    ],
  },
  player_care: {
    type: "player_care",
    title: "Player Care",
    emoji: "🛡️",
    intro: "You see the whole person, not just the footballer. What you notice from your position tells a story that nobody else on this list can tell.",
    questions: [
      "What do you notice about this player's day-to-day energy and demeanour?",
      "What seems to help them feel safe, settled, or supported?",
      "Who or what seems to strengthen them most around football?",
      "What general signs tell you they may be carrying pressure? Please keep your answer non-confidential.",
      "What everyday human detail about them would help make their story feel real?",
    ],
  },
};

export function getStakeholderQuestions(type: string): StakeholderQuestionSet {
  return STAKEHOLDER_QUESTIONS[type] ?? STAKEHOLDER_QUESTIONS["parent"];
}
