export interface StaffQuestionSet {
  role: string;
  title: string;
  emoji: string;
  questions: string[];
}

export const STAFF_QUESTIONS: Record<string, StaffQuestionSet> = {
  football_coaching: {
    role: "football_coaching",
    title: "Football Development Observations",
    emoji: "📋",
    questions: [
      "Describe a specific moment in training or a match where this player demonstrated a key technical strength. What did you observe?",
      "What is this player's most consistent tactical behaviour that stands out during sessions?",
      "How does this player respond to coaching instructions during live play? Give a recent example.",
      "What are the priority areas of technical or tactical development for this player over the next 3-6 months?",
      "Describe this player's work rate, intensity, and commitment during a typical training week.",
      "How does this player perform in competitive match situations compared to training environments?",
      "What leadership qualities or team behaviours have you observed from this player?",
    ],
  },
  psychology: {
    role: "psychology",
    title: "Psychology Assessment",
    emoji: "🧠",
    questions: [
      "How does this player typically respond to pressure situations? Describe a specific observed pattern.",
      "What is this player's approach to setbacks and mistakes during training or matches?",
      "Describe the player's self-awareness and emotional regulation. How do they manage their emotions?",
      "What motivational patterns have you observed? What drives this player and what diminishes their engagement?",
      "How does this player interact with peers during challenging group situations?",
      "What mental skills or psychological areas would most benefit this player's development?",
      "Describe any notable growth or changes you've observed in this player's psychological development.",
    ],
  },
  education: {
    role: "education",
    title: "Education Lead Observations",
    emoji: "📚",
    questions: [
      "How does this player approach academic challenges? Describe their attitude and effort in learning environments.",
      "What strengths does this player show in classroom or study settings?",
      "How does this player balance their academic responsibilities with football commitments?",
      "Describe any notable interactions or behaviours in group learning situations.",
      "What areas of academic or personal development should be prioritised for this player?",
    ],
  },
  player_care: {
    role: "player_care",
    title: "Player Care Observations",
    emoji: "🛡️",
    questions: [
      "What is this player's general wellbeing and day-to-day demeanour? How would you describe their overall welfare?",
      "Have you observed any welfare concerns or changes in behaviour? What patterns have you noticed?",
      "How does this player manage their relationships within the academy environment?",
      "What support systems does this player have outside the academy? Who are the key people in their life?",
      "What wellbeing or lifestyle factors should be monitored or supported for this player going forward?",
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
