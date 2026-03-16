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
      "Describe a specific moment — at home, at a match, on the way back from training — when you saw something in your child that made you genuinely proud. Paint me that scene. What happened, and what did you feel?",
      "What does your child look like at home when things aren't going well in football? What do they do, what do they say, how do you actually know they're struggling before they tell you?",
      "Tell me about a conversation you've had with your child about football that stuck with you. Where were you, and what was actually said?",
      "What has this football journey cost your family — in time, money, emotion, sacrifice? And what has made it worth keeping going despite all of that?",
      "In your own words, what is the real story of this player? Not the highlight reel — the story only you know, because you've been there for all of it.",
    ],
  },
  friend: {
    type: "friend",
    title: "Friend's View",
    emoji: "🤝",
    intro: "You know things about this player that the coaches will never see. That's exactly what we need from you.",
    questions: [
      "Tell me about a game or a training session you've shared — what did they do in it that only someone who really knows them would actually understand the significance of?",
      "What's your mate like in the changing room or at training? Not what they say — what they actually do. The real detail that shows who they are.",
      "Have you been there when they were genuinely struggling — not performing badly, but really struggling? Tell me about it. What did you do, or what do you wish you had done?",
      "What do they say about football when it's just the two of you — no coaches, no parents, nothing to perform? What's the honest version they give you that nobody else gets?",
      "When they make it — what's the thing you'll tell people you knew about them that nobody else would have seen coming?",
    ],
  },
  football_coach: {
    type: "football_coach",
    title: "Football Coach",
    emoji: "📋",
    intro: "Your eye sees things no one else on this list can see. We need your honest, professional read — the version beyond the session report. You'll also help shape how this player's story is told.",
    questions: [
      "Describe the session or the specific moment when you first thought — this player is different. Not better necessarily, different. What exactly happened, and what did you see?",
      "What is this player's most significant quality that would never appear in a statistics report or standard coaching assessment?",
      "Tell me about a moment when this player genuinely surprised you — positively or negatively. What did it reveal about who they actually are?",
      "What does this player need to hear — something that might be uncomfortable to say and that you may not have said yet — that would genuinely change the trajectory of their development?",
      "If you had to describe this player in five words, what would those words be? Then pick just one of them and tell me the story behind why you chose it.",
      "Which club values does this player demonstrate most strongly? Give a specific example of one in action.",
      "What are the two or three development areas you most want their story to reflect — the challenges they are actively working through right now?",
      "What themes, lessons, or messages do you want woven into this player's story? Think about what you want them to carry with them from this chapter of their journey.",
    ],
  },
  education: {
    type: "education",
    title: "Education Staff",
    emoji: "📚",
    intro: "The classroom shows you a version of this player the pitch never does. That version matters enormously to their story.",
    questions: [
      "How does this player approach something they find genuinely difficult? Give me a specific example if you can — how do they behave when something isn't easy or natural for them?",
      "Tell me about a moment when they showed real character in an academic or group setting — something that made you take note of who they actually are.",
      "Do you see their football world bleeding into how they carry themselves at school? What does the academy life look like when it walks into your room?",
      "What does this player's personality look like in a learning environment — the traits and tendencies that never make it into a coaching report but that tell a real story?",
      "If you were writing the opening paragraph of this player's story and could only draw on what you've seen from them in your setting — what would you write?",
    ],
  },
  psychology: {
    type: "psychology",
    title: "Psychology Staff",
    emoji: "🔬",
    intro: "You work with their inner world. What you observe here is some of the most important and valuable material in the whole story.",
    questions: [
      "How does this player relate to pressure — not in general, but specifically and observably? Give me the moment or the pattern that tells the truest story.",
      "What is their relationship with failure — do they avoid it, own it, obsess over it, deflect it, something else? What does that tell you about who they are?",
      "As far as you can observe it — what does this player's inner dialogue look like? What do they appear to tell themselves in difficult moments?",
      "What emotional pattern have you seen repeat in your work with this player? What does it tell you about what they're working through and what shaped them?",
      "In your professional view, what does this player need most over the next 12 months — and why is that the thing above everything else?",
    ],
  },
  player_care: {
    type: "player_care",
    title: "Player Care",
    emoji: "🛡️",
    intro: "You see the whole human, not just the footballer. That perspective is essential to building an honest, complete story.",
    questions: [
      "What does this player's daily energy tell you — and when does it change? What shifts do you notice that others around them might not pick up on?",
      "Has there been a welfare or wellbeing moment with this player that you've witnessed? How did they handle it, and what did their response tell you about them?",
      "Who genuinely shows up for this player — inside the academy and outside it? Tell me about those relationships as you observe them.",
      "What does being at this academy cost this player emotionally? What are they carrying that perhaps nobody else around them fully sees or acknowledges?",
      "If you were writing the opening scene of their story — the human, day-to-day detail that makes a story feel real and alive — what would be in it?",
    ],
  },
};

export function getStakeholderQuestions(type: string): StakeholderQuestionSet {
  return STAKEHOLDER_QUESTIONS[type] ?? STAKEHOLDER_QUESTIONS["parent"];
}
