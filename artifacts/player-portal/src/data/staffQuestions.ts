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
      "How does this player respond to coaching feedback?\nGive a recent example.",
      "How would you describe this player's decision-making in football situations?",
      "What strengths do they currently show most consistently in their game?",
      "What are the most important football development areas for the next 3–6 months?",
      "How do they tend to perform when the level or pressure rises?",
    ],
  },
  psychology: {
    role: "psychology",
    title: "Psychology Support",
    emoji: "🧠",
    questions: [
      "How does this player usually respond under pressure?",
      "How do they typically react after mistakes or setbacks?",
      "What psychological strengths do they currently show?",
      "What area of mindset or emotional development would help them most next?",
      "Have you noticed any meaningful change in their confidence, behaviour, or mindset over time?",
    ],
  },
  education: {
    role: "education",
    title: "Education Lead Observations",
    emoji: "📚",
    questions: [
      "How does this player approach challenge or difficulty in learning?",
      "What do you notice about how they carry themselves in school or group settings?",
      "What consistent behaviours do you see in the way they approach learning?",
      "How do they respond to feedback and improvement?",
      "Tell me about one moment when this player showed real character in your setting.",
    ],
  },
  player_care: {
    role: "player_care",
    title: "Add Your Observations",
    emoji: "🛡️",
    helperNote: "Please keep responses focused on football, learning, character, and general observations. Do not include medical details, safeguarding disclosures, or confidential family information.",
    questions: [
      "How does this player usually present around the club day to day?",
      "What helps this player feel comfortable, included, and able to engage well?",
      "What kinds of support or routines seem to help them most?",
      "Is there anything important about how this player is best supported to feel at their best?",
      "Have you noticed any positive change in this player over time?",
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
