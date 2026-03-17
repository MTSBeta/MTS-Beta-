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
      "How would you describe this player's approach to learning — in the classroom, tutorial sessions, or any structured educational setting?",
      "What are this player's key academic or educational strengths?\nPlease give examples where possible.",
      "How organised and self-disciplined is this player when managing their educational responsibilities alongside football?",
      "How engaged is this player in their learning?\nDo they participate, ask questions, and seek help when they need it?",
      "Are there any academic support needs or learning challenges that the club should be aware of?",
      "How does this player manage the demands of education and football together?\nWhat have you observed?",
      "What educational goals or focus areas would most benefit this player over the coming months?",
    ],
  },
  player_care: {
    role: "player_care",
    title: "Player Care & Welfare Notes",
    emoji: "🛡️",
    questions: [
      "How would you describe this player's general wellbeing and day-to-day state?\nWhat have you observed in their mood, energy, and demeanour?",
      "Are there any current welfare or safeguarding concerns relating to this player?\nPlease describe what you have observed.",
      "How stable and supportive does this player's home environment appear to be?\nWhat is your current understanding of their home situation?",
      "What support networks does this player have — family, friends, mentors — and how available and supportive do those networks appear?",
      "Have you noticed any significant changes in this player's behaviour, presentation, or emotional state recently?",
      "What specific welfare or support needs does this player have that the club should be actively addressing?",
      "Are there any lifestyle, health, or personal factors that may be affecting this player's wellbeing or performance?",
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
