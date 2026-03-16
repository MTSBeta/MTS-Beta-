export type U9QuestionType =
  | "voice-text"
  | "select"
  | "multiselect"
  | "photo"
  | "coaching-text"
  | "coaching-multiselect";

export interface U9Question {
  text: string;
  hint: string;
  emoji: string;
  type: U9QuestionType;
  /** Options for select / multiselect / coaching-multiselect questions */
  options?: string[];
  /** Character profile keys — used to generate summation */
  profileKey?: "traits" | "strengths" | "workEthic" | "mindset" | "goals" | "dreams" | "clubValues";
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
        text: "What is your favourite thing about being you? Tell me something that makes you special!",
        hint: "Maybe you're really fast, or super kind, or always make people laugh…",
      },
      {
        type: "multiselect",
        emoji: "✨",
        text: "Pick the words that best describe you!",
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
        text: "What do you love doing when you're NOT playing football?",
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
        text: "Tell me about your family — who lives at home with you?",
        hint: "Mum, dad, brothers, sisters, grandparents, pets — tell me everything!",
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
        text: "Who comes to watch your matches? What do they shout when you play well?",
        hint: "Do they get really excited? Do they have a favourite chant?",
      },
      {
        type: "voice-text",
        emoji: "👯",
        text: "Tell me about your best friend. What do you love about them?",
        hint: "What do you get up to together? What makes them so special?",
      },
    ],
  },

  // ── STAGE 3: I Love Football! ─────────────────────────────────────
  {
    id: "I Love Football",
    title: "I Love Football!",
    emoji: "⚽",
    intro: "Now let's talk about the best thing ever — football!",
    colour: "#10b981",
    questions: [
      {
        type: "voice-text",
        emoji: "💥",
        text: "Tell me about your best ever football moment — a goal, a save, anything you felt really proud of!",
        hint: "Close your eyes and picture it. Where were you? What happened? How did it feel?",
      },
      {
        type: "multiselect",
        emoji: "🔥",
        text: "What do you love MOST about football?",
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
        text: "Who is your favourite footballer, and what do you love about the way they play?",
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
        text: "When training gets really tough and tiring, you…",
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
        text: "After you make a mistake in a game, you…",
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
      {
        type: "multiselect",
        emoji: "🎯",
        text: "What are your goals for this season?",
        hint: "Dream big — what do you most want to achieve?",
        profileKey: "goals",
        options: [
          "Score more goals", "Keep more clean sheets", "Get in the first team",
          "Improve my weak foot", "Get stronger", "Get faster",
          "Be a better teammate", "Learn a new skill move",
          "Play every minute", "Win a trophy", "Get more assists", "Make the bench",
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
        text: "What kind of footballer do you want to be when you grow up? Tell me your biggest dream!",
        hint: "Imagine it's a cup final and you're playing. What happens?",
      },
      {
        type: "multiselect",
        emoji: "🌍",
        text: "Where do you dream of playing one day?",
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
        text: "Who do you most want to say a BIG THANK YOU to for helping you get to this academy?",
        hint: "A mum, dad, coach, friend — who believed in you first?",
      },
      {
        type: "voice-text",
        emoji: "✉️",
        text: "If you could send one message to yourself as a future professional footballer, what would you say?",
        hint: "What do you want your future self to remember about right now?",
      },
    ],
  },

  // ── STAGE 6: Coaching Notes (COACH ONLY) ──────────────────────────
  {
    id: "Coaching Notes",
    title: "Coaching Notes",
    emoji: "👨‍🏫",
    intro: "This section is for the coaching staff to fill in. Your input shapes the story's values and lessons.",
    colour: "#0d9488",
    isCoaching: true,
    questions: [
      {
        type: "coaching-text",
        emoji: "🌟",
        text: "What are this player's standout qualities on the pitch?",
        hint: "What does this player do brilliantly — what makes them special to coach?",
      },
      {
        type: "coaching-multiselect",
        emoji: "🏛️",
        text: "Which club values does this player already demonstrate?",
        hint: "Select all that apply — these will be woven into the story's themes.",
        profileKey: "clubValues",
        options: [
          "Respect", "Commitment", "Teamwork", "Honesty", "Excellence",
          "Resilience", "Creativity", "Discipline", "Sportsmanship",
          "Leadership", "Courage", "Humility", "Ambition", "Integrity",
        ],
      },
      {
        type: "coaching-text",
        emoji: "🎯",
        text: "What are this player's key development focus areas this season?",
        hint: "Be specific — what do you most want them to improve technically, tactically, or mentally?",
      },
      {
        type: "coaching-text",
        emoji: "📖",
        text: "What key lesson or message would you like woven into their story?",
        hint: "What do you want them to carry with them? What should their book remind them of?",
      },
      {
        type: "coaching-text",
        emoji: "💡",
        text: "Describe a recent moment where this player showed real character.",
        hint: "A game situation, a training moment, or a tough spell they came through.",
      },
      {
        type: "coaching-text",
        emoji: "📈",
        text: "What does success look like for this player by the end of this season?",
        hint: "Paint a picture of where you want them to be — on the pitch and as a person.",
      },
    ],
  },
];

/** Compute a character profile summary from select/multiselect answers */
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
  const goals = get("goals");
  const dreams = get("dreams");
  const clubValues = get("clubValues");

  const lines: string[] = ["=== CHARACTER PROFILE SUMMATION ==="];
  if (traits) lines.push(`Personality traits: ${traits}`);
  if (strengths) lines.push(`Player strengths: ${strengths}`);
  if (workEthic) lines.push(`Work ethic: ${workEthic}`);
  if (mindset) lines.push(`Mindset under pressure: ${mindset}`);
  if (goals) lines.push(`Season goals: ${goals}`);
  if (dreams) lines.push(`Dream stages: ${dreams}`);
  if (clubValues) lines.push(`Club values demonstrated: ${clubValues}`);
  lines.push("===================================");
  return lines.join("\n");
}
