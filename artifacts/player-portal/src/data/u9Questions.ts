export type U9QuestionType =
  | "voice-text"
  | "select"
  | "multiselect"
  | "photo"
  | "staff-text"
  | "staff-multiselect";

export interface U9Question {
  text: string;
  hint: string;
  emoji: string;
  type: U9QuestionType;
  options?: string[];
  profileKey?: "traits" | "strengths" | "workEthic" | "mindset" | "goals" | "dreams" | "clubValues" | "storyThemes" | "developmentAreas";
}

export interface U9Stage {
  id: string;
  title: string;
  emoji: string;
  intro: string;
  colour: string;
  isCoaching?: boolean;
  questions: U9Question[];
}

export const U9_STAGES: U9Stage[] = [
  // ── STAGE 1: All About Me ──────────────────────────────────────────
  {
    id: "All About Me",
    title: "All About Me",
    emoji: "🌟",
    intro: "Let's start with the most important person — YOU!",
    colour: "#f59e0b",
    questions: [
      {
        type: "photo",
        emoji: "📸",
        text: "Let's add your photos for the book!",
        hint: "A clear face photo, an action shot in your kit, and any other photo you love. We use these to illustrate your story.",
      },
      {
        type: "voice-text",
        emoji: "😄",
        text: "What is your favourite thing about being you?",
        hint: "Maybe you're really fast, or super kind, or always make people laugh…",
      },
      {
        type: "multiselect",
        emoji: "✨",
        text: "Pick the words that describe you best.",
        hint: "Choose as many as you like — these will go in your book.",
        profileKey: "traits",
        options: [
          "Kind", "Funny", "Brave", "Loud", "Creative",
          "Caring", "Determined", "Quiet", "Confident", "Energetic",
          "Helpful", "Smart", "Loyal", "Adventurous", "Focused",
        ],
      },
      {
        type: "voice-text",
        emoji: "🎮",
        text: "What do you love doing when you are not playing football?",
        hint: "A game, a TV show, something you do with your friends or family…",
      },
    ],
  },

  // ── STAGE 2: My People ────────────────────────────────────────────
  {
    id: "My People",
    title: "My People",
    emoji: "❤️",
    intro: "Every great player has amazing people behind them. Tell us about yours!",
    colour: "#f43f5e",
    questions: [
      {
        type: "voice-text",
        emoji: "👨‍👩‍👧‍👦",
        text: "Who are the people at home who cheer you on?",
        hint: "Mum, dad, brothers, sisters, grandparents, anyone who believes in you!",
      },
      {
        type: "multiselect",
        emoji: "💛",
        text: "How do the people who love you make you feel?",
        hint: "Pick as many as you like!",
        profileKey: "traits",
        options: [
          "Proud", "Safe", "Loved", "Confident", "Excited",
          "Supported", "Happy", "Calm", "Strong", "Believed in",
          "Motivated", "Special",
        ],
      },
      {
        type: "voice-text",
        emoji: "📣",
        text: "Who comes to watch you play, and what do they usually shout when you do well?",
        hint: "Do they get really excited? Do they have a favourite chant?",
      },
      {
        type: "voice-text",
        emoji: "👯",
        text: "Tell me about a friend who matters to you. What do you like most about them?",
        hint: "What do you get up to together? What makes them so special?",
      },
    ],
  },

  // ── STAGE 3: Me and Football ──────────────────────────────────────
  {
    id: "Me and Football",
    title: "Me and Football",
    emoji: "⚽",
    intro: "Now let's talk about the best thing ever — football!",
    colour: "#10b981",
    questions: [
      {
        type: "voice-text",
        emoji: "💥",
        text: "Tell me about a football moment that made you feel really proud.",
        hint: "A goal, a save, a tackle — anything that made you smile.",
      },
      {
        type: "multiselect",
        emoji: "🔥",
        text: "What do you love most about football?",
        hint: "Tap everything that gets you excited!",
        options: [
          "Scoring goals", "Making saves", "Skill moves", "Teamwork",
          "The crowd", "The kit", "Matchday buzz", "Training hard",
          "Nutmegs!", "Getting assists", "Making friends", "The atmosphere",
          "Pre-match warm-up", "Set pieces",
        ],
      },
      {
        type: "multiselect",
        emoji: "🏃",
        text: "Which parts of training do you enjoy most?",
        hint: "Pick everything you love working on!",
        options: [
          "Shooting", "Dribbling", "Passing", "Defending",
          "Heading", "Fitness runs", "Small-sided games", "1v1s",
          "Set pieces", "Position work", "Crossing", "Tactics",
        ],
      },
      {
        type: "voice-text",
        emoji: "⭐",
        text: "Who is your favourite footballer, and what do you like about the way they play?",
        hint: "Is it their pace? Their skill? How they celebrate? Their attitude?",
      },
    ],
  },

  // ── STAGE 4: The Kind of Player I Am ─────────────────────────────
  {
    id: "The Kind of Player I Am",
    title: "The Kind of Player I Am",
    emoji: "🧠",
    intro: "Great players know who they are. What kind of player are YOU?",
    colour: "#3b82f6",
    questions: [
      {
        type: "multiselect",
        emoji: "💪",
        text: "What are your strongest qualities as a player?",
        hint: "Pick everything that describes your game — be honest and proud!",
        profileKey: "strengths",
        options: [
          "Fast", "Strong", "Skilful", "Reads the game well",
          "Great passer", "Clinical finisher", "Brave defender",
          "Great in the air", "Organises the team", "Never gives up",
          "Works hard for others", "Cool under pressure", "Creative", "Consistent",
        ],
      },
      {
        type: "select",
        emoji: "⚡",
        text: "When training gets tough, what do you usually do?",
        hint: "There's no wrong answer — just be honest with yourself!",
        profileKey: "workEthic",
        options: [
          "Keep going no matter what 💪",
          "Take a breath and try again 🔄",
          "Ask my coach for help 🤝",
          "Encourage my teammates to push through 📣",
          "Stay focused and quiet until it's done 🎯",
        ],
      },
      {
        type: "select",
        emoji: "🤔",
        text: "After you make a mistake in a game, what do you usually do next?",
        hint: "Everyone makes mistakes — great players know what to do next!",
        profileKey: "mindset",
        options: [
          "Shake it off and go again straight away ✨",
          "Learn from it and use it to play smarter 📚",
          "Stay calm, refocus, and get back to work 🧘",
          "Talk to my coach and get advice 💬",
          "Use it as fuel to try even harder 🔥",
        ],
      },
    ],
  },

  // ── STAGE 5: My Big Dream ─────────────────────────────────────────
  {
    id: "My Big Dream",
    title: "My Big Dream",
    emoji: "🚀",
    intro: "Every great footballer started with a dream. What's yours?",
    colour: "#8b5cf6",
    questions: [
      {
        type: "voice-text",
        emoji: "🏟️",
        text: "What kind of footballer do you want to become one day?",
        hint: "Imagine it's a cup final and you're playing. What happens?",
      },
      {
        type: "multiselect",
        emoji: "🌍",
        text: "Where would you love to play one day?",
        hint: "Pick all the stages you want to play on!",
        profileKey: "dreams",
        options: [
          "Premier League", "Champions League", "World Cup", "Euro Championship",
          "For my country", "La Liga", "Serie A", "Bundesliga",
          "Wembley Stadium", "Old Trafford", "Anfield", "The Etihad",
          "Camp Nou", "San Siro",
        ],
      },
      {
        type: "voice-text",
        emoji: "❤️",
        text: "Who would you love to say a big thank you to for helping you?",
        hint: "A mum, dad, coach, friend — who believed in you first?",
      },
      {
        type: "voice-text",
        emoji: "✉️",
        text: "What would you say to the future you before a big match?",
        hint: "What do you want your future self to remember about right now?",
      },
    ],
  },

  // ── STAGE 6: Coach Input (COACH ONLY) ─────────────────────────────
  {
    id: "Coaching Notes",
    title: "Coach Notes",
    emoji: "👨‍🏫",
    intro: "This section is for coaching staff only. Your insights directly shape the story this player receives — their values, lessons, and the messages that will stay with them.",
    colour: "#0d9488",
    isCoaching: true,
    questions: [
      {
        type: "staff-multiselect",
        emoji: "🏛️",
        text: "Which club values does this player already show consistently?",
        hint: "Select all that apply. These values will be woven into the story's core themes.",
        profileKey: "clubValues",
        options: [
          "Respect", "Commitment", "Teamwork", "Honesty", "Excellence",
          "Resilience", "Creativity", "Discipline", "Sportsmanship",
          "Leadership", "Courage", "Humility", "Ambition", "Integrity",
          "Accountability", "Work Ethic", "Inclusivity",
        ],
      },
      {
        type: "staff-multiselect",
        emoji: "📈",
        text: "What are the most important development areas for this player this season?",
        hint: "Select all that are in your programme — technical, tactical, physical and psychological.",
        profileKey: "developmentAreas",
        options: [
          "Ball control and first touch",
          "Passing and decision-making",
          "Shooting and finishing",
          "1v1 defending",
          "Positional understanding",
          "Off-the-ball movement",
          "Speed and agility",
          "Physical strength",
          "Stamina and fitness",
          "Managing pressure and nerves",
          "Confidence and self-belief",
          "Resilience after mistakes",
          "Communication on the pitch",
          "Coachability and listening",
        ],
      },
      {
        type: "staff-text",
        emoji: "🌟",
        text: "What makes this player genuinely special in a way that would never appear in a stats report?",
        hint: "This is the heart of their story — what you see that most people miss.",
      },
      {
        type: "staff-text",
        emoji: "🎭",
        text: "Describe one specific moment when this player showed real character in training or a match.",
        hint: "The more specific, the more powerful. A real story beats a general observation every time.",
      },
      {
        type: "staff-text",
        emoji: "💡",
        text: "What is the main lesson or message you would love this player to take from their story?",
        hint: "The single most important thing. The thing you'd say if you only had one sentence.",
      },
      {
        type: "staff-text",
        emoji: "🏁",
        text: "What would success look like for this player by the end of this season?",
        hint: "Paint the picture of where you want them to be. This becomes the story's closing chapter.",
      },
    ],
  },
];

export const U9_PLAYER_STAGES = U9_STAGES.filter(s => !s.isCoaching);

export function computeCharacterProfile(
  answers: { text: string }[],
  allQuestions: { stage: U9Stage; question: U9Question; idx: number }[]
): string {
  const get = (key: U9Question["profileKey"]) => {
    const match = allQuestions.find(q => q.question.profileKey === key);
    if (!match) return "";
    return answers[match.idx]?.text ?? "";
  };

  const traits = get("traits");
  const strengths = get("strengths");
  const workEthic = get("workEthic");
  const mindset = get("mindset");
  const dreams = get("dreams");
  const clubValues = get("clubValues");
  const developmentAreas = get("developmentAreas");

  const lines: string[] = ["=== CHARACTER & COACHING PROFILE SUMMATION ==="];
  if (traits) lines.push(`Personality traits: ${traits}`);
  if (strengths) lines.push(`Player strengths: ${strengths}`);
  if (workEthic) lines.push(`Work ethic: ${workEthic}`);
  if (mindset) lines.push(`Mindset under pressure: ${mindset}`);
  if (dreams) lines.push(`Dream stages: ${dreams}`);
  if (clubValues) lines.push(`Club values demonstrated: ${clubValues}`);
  if (developmentAreas) lines.push(`Development priorities (coach-selected): ${developmentAreas}`);
  lines.push("==============================================");
  return lines.join("\n");
}
