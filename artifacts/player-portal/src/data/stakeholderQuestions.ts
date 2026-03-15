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
    intro: "You know your child better than anyone. Share what you see.",
    questions: [
      "How has football shaped who your child is — both on and off the pitch?",
      "What's been the toughest moment you've both faced in their football journey, and how did they handle it?",
      "What are you most proud of when you watch your child play or train?",
      "How does the person you see at home match the player they are on the pitch?",
      "What are your hopes for your child's future — in football and in life?",
    ],
  },
  friend: {
    type: "friend",
    title: "Friend's View",
    emoji: "🤝",
    intro: "You know what they're really like. Give it to them straight.",
    questions: [
      "What's your mate actually like as a player — how would you describe them?",
      "What do they do when things get tough in a game or at training?",
      "Tell me something about them that most people wouldn't know from watching them play.",
      "What kind of teammate are they — honestly?",
      "Where do you think your mate could go in football if they really went for it?",
    ],
  },
  football_coach: {
    type: "football_coach",
    title: "Football Coach",
    emoji: "📋",
    intro: "Your professional perspective on this player's development journey.",
    questions: [
      "How has this player's game developed technically and tactically since you've been working with them?",
      "What mental strengths do you see in this player during training and matches?",
      "How do they respond when things go wrong — in a game, in training, or after a setback?",
      "What do they bring to the group — as a teammate and as a character in the squad?",
      "What do you believe this player is capable of, and what's the main focus area for their development?",
    ],
  },
  education: {
    type: "education",
    title: "Education Staff",
    emoji: "📚",
    intro: "Your observations on how this player approaches learning and development.",
    questions: [
      "How would you describe their approach to learning — focus, attitude, and resilience in the classroom?",
      "How do they handle pressure and high-stakes moments in an academic setting?",
      "What personal qualities do they show that you think also help them as a footballer?",
      "How do they interact with peers and handle competition or conflict?",
      "What will they need most as they balance education with the demands of elite sport?",
    ],
  },
  psychology: {
    type: "psychology",
    title: "Psychology Staff",
    emoji: "🔬",
    intro: "Your clinical and developmental observations on this player.",
    questions: [
      "How would you describe this player's emotional baseline and self-awareness at this stage?",
      "How do they process pressure, failure, and feedback — what have you observed?",
      "What coping strategies and mental resilience tools does this player currently use?",
      "How developed is their sense of identity outside of football?",
      "What areas of psychological development would most benefit this player over the next 12 months?",
    ],
  },
  player_care: {
    type: "player_care",
    title: "Player Care",
    emoji: "🛡️",
    intro: "Your welfare and wellbeing perspective on this player.",
    questions: [
      "How does this player manage their physical and emotional energy day to day?",
      "How do they present in 1:1 settings — are they open, guarded, or somewhere in between?",
      "What support systems do they currently have in and around the academy?",
      "Have there been any welfare or wellbeing concerns you've observed that should be noted?",
      "What type of support would most benefit this player in the next phase of their development?",
    ],
  },
};

export function getStakeholderQuestions(type: string): StakeholderQuestionSet {
  return STAKEHOLDER_QUESTIONS[type] ?? STAKEHOLDER_QUESTIONS["parent"];
}
