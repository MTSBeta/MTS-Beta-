export interface StaffQuestionSet {
  role: string;
  title: string;
  emoji: string;
  helperNote?: string;
  questions: string[];
}

export const STAFF_QUESTIONS: Record<string, StaffQuestionSet> = {
  football_coaching: {
    role: "football_coaching",
    title: "Football Development Observations",
    emoji: "📋",
    questions: [
      "How does this player respond to coaching feedback during sessions?\nPlease give a recent specific example.",
      "How quickly does this player learn and apply new information — whether that's a tactical instruction, a technical adjustment, or a positional change?",
      "How would you describe this player's decision-making on the pitch?\nPlease give examples of good or poor decisions you have observed.",
      "How does this player apply themselves in training?\nDescribe their attitude, effort, and focus across a typical week.",
      "How does this player perform when the stakes are raised — in competitive matches, trials, or high-pressure training situations?",
      "What technical or tactical strengths does this player currently demonstrate most consistently?",
      "What are the most important areas of football development for this player to focus on over the next 3–6 months?",
    ],
  },
  psychology: {
    role: "psychology",
    title: "Psychology Support",
    emoji: "🧠",
    questions: [
      "How does this player usually respond under pressure in training or matches?\nPlease give a recent example.",
      "How does the player react after mistakes, setbacks, or disappointment?\nFor example, do they recover quickly, become frustrated, withdraw, or respond positively?",
      "How well does the player manage their emotions?\nPlease describe what you have observed in challenging or high-pressure moments.",
      "What seems to motivate this player most?\nWhat tends to increase their engagement, confidence, and effort? What seems to reduce it?",
      "How does this player interact with team-mates during difficult moments?\nFor example, when the team is losing, under pressure, or facing conflict.",
      "What psychological strengths does this player currently show?\nFor example, resilience, confidence, focus, discipline, leadership, coachability.",
      "What psychological areas would most support this player's development next?\nPlease focus on the most important 1–2 areas.",
      "Have you noticed any meaningful changes in this player's mindset, confidence, or behaviour over time?\nPlease describe briefly.",
    ],
  },
  education: {
    role: "education",
    title: "Education Lead Observations",
    emoji: "📚",
    questions: [
      "How does this player approach a problem or challenge they haven't seen before?\nDescribe what you observe — how they think, how they start, and what they do when they get stuck.",
      "Tell me about a specific moment when this player showed real character in a learning or group setting.\nWhat happened, and what did it tell you about who they are?",
      "What do you notice about how this player carries themselves in school?\nAre they consistent across different situations? What does their presence in your setting feel like?",
      "What consistent behaviours have you observed in how this player approaches their learning?\nFor example, how they prepare, how they follow up, and how they respond to feedback.",
      "How does this player handle difficulty or pressure in an academic context?\nWhat do you observe when they find something hard, make a mistake, or feel uncertain?",
      "What does this player's relationship with feedback and improvement look like?\nDo they seek it out? How do they use it? What does that tell you about their mindset?",
      "If you were writing the opening paragraph of this player's story using only what you have seen in your setting, what would you say?\nFocus on who they are — not on grades or results.",
    ],
  },
  player_care: {
    role: "player_care",
    title: "Add Your Observations",
    emoji: "🛡️",
    helperNote: "Please keep responses general, supportive, and relevant to the player's development. Do not include medical information, safeguarding disclosures, confidential family matters, or other highly personal details.",
    questions: [
      "How does this player usually present at training or around the club environment?\nYou may comment on their mood, energy, confidence, or how settled they seem.",
      "What helps this player feel comfortable, included, and able to engage well?\nPlease focus on what you have observed in the club environment.",
      "How does this player tend to interact with staff and team-mates day to day?\nPlease share any positive patterns you have noticed.",
      "What kind of support from home or outside the club seems to encourage this player most?\nPlease keep this high level and avoid private or sensitive details.",
      "Are there any positive influences, routines, or values outside football that seem important to this player's development?\nFor example, encouragement from family, role models, structure, or hobbies.",
      "Have you noticed any positive changes in this player over time?\nThis could relate to confidence, communication, maturity, or engagement.",
      "Is there anything important about how this player should be supported to help them feel at their best?\nPlease avoid including confidential or highly personal information.",
    ],
  },
};

export function getStaffQuestions(role: string): StaffQuestionSet | null {
  return STAFF_QUESTIONS[role] ?? null;
}

export const STAFF_ROLES = [
  { value: "football_coaching", label: "Football Development Lead" },
  { value: "psychology",        label: "Psychology Lead" },
  { value: "education",         label: "Education Lead" },
  { value: "player_care",       label: "Player Care & Welfare Lead" },
  { value: "academy_admin",     label: "Education Lead / Super Admin" },
];

export const ROLE_LABELS: Record<string, string> = {
  football_coaching: "Football Development Lead",
  psychology:        "Psychology Lead",
  education:         "Education Lead",
  player_care:       "Player Care & Welfare Lead",
  academy_admin:     "Education Lead / Super Admin",
};

/** Short display label for use in tight UI spaces */
export const ROLE_SHORT: Record<string, string> = {
  football_coaching: "Football Development",
  psychology:        "Psychology",
  education:         "Education",
  player_care:       "Player Care & Welfare",
  academy_admin:     "Super Admin",
};
