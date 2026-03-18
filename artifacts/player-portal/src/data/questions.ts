export type JourneyQuestionType =
  | "voice-text"
  | "select"
  | "multiselect"
  | "staff-text"
  | "staff-multiselect";

export interface FollowUpBranch {
  triggerOption: string;
  question: string;
  hint?: string;
  prompts?: string[];
}

export interface JourneyQuestion {
  text: string;
  hint?: string;
  emoji?: string;
  prompts?: string[];
  type?: JourneyQuestionType;
  options?: string[];
  profileKey?: "traits" | "strengths" | "workEthic" | "mindset" | "goals" | "dreams" | "clubValues" | "storyThemes" | "developmentAreas";
  requiresSecondPosition?: boolean;
  positionIds?: string[];
  followUps?: FollowUpBranch[];
  positionLabel?: string;
}

export interface JourneyStage {
  id: string;
  title: string;
  emoji: string;
  subtitle: string;
  description: string;
  isStaffSection?: boolean;
  questions: JourneyQuestion[];
}

export const COACH_QUESTIONS = [
  "What makes this player genuinely special in a way that would never appear in a stats report?",
  "Describe one specific moment when this player showed real character in training or a match.",
  "What is the main lesson or message you would love this player to take from their story?",
  "What would success look like for this player by the end of this season?",
  "Any additional context for the story writer?",
];

export const JOURNEY_STAGES: JourneyStage[] = [
  // ── STAGE 1: Your World ──────────────────────────────────────────────────
  {
    id: "Your World",
    title: "Your World",
    emoji: "⚽",
    subtitle: "Before we talk about football, let's talk about you. The real version.",
    description: "The scene, the people, the daily world that shapes everything.",
    questions: [
      {
        type: "multiselect",
        emoji: "🪞",
        text: "Pick the words that describe you best as a person.",
        hint: "Select as many as feel true. These build your character profile for the story.",
        profileKey: "traits",
        options: [
          "Determined", "Creative", "Loyal", "Funny", "Competitive",
          "Calm", "Intense", "Ambitious", "Quiet", "Expressive",
          "Hard-working", "Confident", "Sensitive", "Resilient", "Caring",
          "Brave", "Focused", "Restless", "Thoughtful", "Bold",
        ],
      },
      {
        type: "voice-text",
        emoji: "🎬",
        text: "Tell me about one football moment you always go back to when you remember why you love the game.",
        prompts: ["Where was it?", "What happened?", "How did it feel?"],
      },
      {
        type: "voice-text",
        emoji: "🎮",
        text: "Describe the way you play in your own words — not your position, your game.",
        prompts: ["What are you best at?", "What part of your game is still developing?", "How would a teammate describe you?"],
      },
      {
        type: "voice-text",
        emoji: "❤️",
        text: "Who do you usually tell first when something good happens in football, and what do they normally say?",
        prompts: ["Can you remember their exact words?", "Why do you always tell them first?"],
      },
      {
        type: "voice-text",
        emoji: "🏠",
        text: "Is there anything at home that means something to you about football — a shirt, boots, notebook, photo, anything like that? Why does it matter?",
        prompts: ["What is it?", "Where did you get it?", "Why does it matter to you?"],
      },
      {
        type: "voice-text",
        emoji: "🔄",
        text: "When you switch positions, what changes most in the way you think or play?",
        hint: "Versatile players are rare. Understanding what actually changes in your thinking is part of your story.",
        prompts: ["Which role feels more natural?", "What does each position bring out in you?", "Has playing both made you a better player overall?"],
        requiresSecondPosition: true,
      },
    ],
  },

  // ── STAGE 2: Your Football Mind ──────────────────────────────────────────
  {
    id: "Your Football Mind",
    title: "Your Football Mind",
    emoji: "🧠",
    subtitle: "This is where great players are separated from good ones. Not pace, not strength — the thinking.",
    description: "Tactical scenarios, game intelligence, and the decisions that define you.",
    questions: [

      // ── Position-specific scenarios ──────────────────────────────────────
      {
        type: "voice-text",
        emoji: "🧤",
        text: "A striker is through on goal and your defender is recovering. What are you reading, and what is your decision?",
        positionIds: ["GK"],
      },
      {
        type: "voice-text",
        emoji: "🛡️",
        text: "The striker drops deep to receive. What tells you whether to step in or hold your line?",
        positionIds: ["CB"],
      },
      {
        type: "voice-text",
        emoji: "🏃",
        text: "Your winger has the ball ahead of you in attack. What tells you whether to overlap, underlap, or hold your position?",
        positionIds: ["LB", "RB"],
      },
      {
        type: "voice-text",
        emoji: "⚙️",
        text: "The opposition break through the middle and you are the last midfielder back. What are you looking at first, and how do you deal with it?",
        positionIds: ["CDM"],
      },
      {
        type: "voice-text",
        emoji: "💫",
        text: "Your holding midfielder is under pressure in build-up. Where do you move, and what are you trying to give the team?",
        positionIds: ["CM"],
      },
      {
        type: "voice-text",
        emoji: "🎯",
        text: "You are about to receive between the lines. What are you checking before the ball arrives, and what are you hoping to create?",
        positionIds: ["CAM"],
      },
      {
        type: "voice-text",
        emoji: "⚡",
        text: "You are 1v1 out wide. What tells you whether to go outside, come inside, or wait for support?",
        positionIds: ["LW", "RW"],
      },
      {
        type: "voice-text",
        emoji: "🎯",
        text: "Your team wins the ball and breaks quickly. What is your first movement, and what are you trying to open up?",
        positionIds: ["ST", "CF"],
      },

      // ── All positions ─────────────────────────────────────────────────────
      {
        type: "voice-text",
        emoji: "⏱️",
        text: "Your team is 1–0 up with ten minutes left. What changes in the way you play?",
        prompts: ["What decisions change?", "How do you manage the game differently?", "What do you communicate to teammates?"],
      },
      {
        type: "voice-text",
        emoji: "🔄",
        text: "Before your first touch arrives under pressure, what are you already checking or knowing?",
        prompts: ["What information have you scanned for?", "What are your options before you even touch it?", "How does your body shape affect what's possible?"],
      },
      {
        type: "select",
        emoji: "🤝",
        text: "If a teammate keeps getting a positional detail wrong in a game, how do you handle it?",
        hint: "How you handle this says a lot about your game intelligence and your character.",
        options: [
          "Talk to them quietly at the next stoppage — pick the right moment",
          "Give them a quick instruction during play from close range",
          "Leave it to the coach — it's not my place to correct them",
          "Show them through my own movement — lead without saying a word",
        ],
        followUps: [
          {
            triggerOption: "Talk to them quietly at the next stoppage — pick the right moment",
            question: "What would you actually say?",
          },
          {
            triggerOption: "Give them a quick instruction during play from close range",
            question: "What would you actually say?",
          },
          {
            triggerOption: "Leave it to the coach — it's not my place to correct them",
            question: "What would you actually say?",
          },
          {
            triggerOption: "Show them through my own movement — lead without saying a word",
            question: "What would you actually say?",
          },
        ],
      },
      {
        type: "voice-text",
        emoji: "💡",
        text: "When you are not at your best personally, how do you still help the team?",
        prompts: ["What do you focus on when the technical side isn't flowing?", "What can you always control on a bad day?"],
      },
    ],
  },

  // ── STAGE 3: The Work Nobody Sees ────────────────────────────────────────
  {
    id: "The Work Nobody Sees",
    title: "The Work Nobody Sees",
    emoji: "👁️",
    subtitle: "Every player has periods where they feel unseen. Tell me about yours.",
    description: "The work no one sees. The moments you were overlooked.",
    questions: [
      {
        type: "voice-text",
        emoji: "❌",
        text: "Tell me about a time you were disappointed in football — maybe not being picked, not starting, or feeling overlooked. What happened?",
        prompts: ["What did you do straight after?", "What did you not say out loud?", "How long did it take to shake off?"],
      },
      {
        type: "voice-text",
        emoji: "🏋️",
        text: "What do you do for your game that most people do not see?",
        prompts: ["What do you practise on your own?", "Do you have any private routines?", "What do you do that no one gives you credit for?"],
      },
      {
        type: "select",
        emoji: "⚡",
        text: "When you feel overlooked or undervalued, what do you usually do next?",
        hint: "Be honest with yourself — there's no wrong answer here.",
        profileKey: "mindset",
        options: [
          "Put my head down and work harder to prove myself",
          "Speak to a coach or someone I trust about how I feel",
          "Lean on family or friends outside football for support",
          "Use the frustration as fuel and channel it into my game",
          "Give myself time and trust the process will pay off",
          "Honestly struggle with it for a while before bouncing back",
        ],
        followUps: [
          {
            triggerOption: "Put my head down and work harder to prove myself",
            question: "What does that actually look like for you — what do you do differently?",
          },
          {
            triggerOption: "Speak to a coach or someone I trust about how I feel",
            question: "Who do you usually go to, and what do you say?",
          },
          {
            triggerOption: "Lean on family or friends outside football for support",
            question: "What do they say that helps?",
          },
          {
            triggerOption: "Use the frustration as fuel and channel it into my game",
            question: "What does that look like in practice?",
          },
          {
            triggerOption: "Give myself time and trust the process will pay off",
            question: "How long does it usually take before you feel settled again?",
          },
          {
            triggerOption: "Honestly struggle with it for a while before bouncing back",
            question: "What eventually helps you turn the corner?",
          },
        ],
      },
      {
        type: "voice-text",
        emoji: "🔮",
        text: "What is one quality in your game that people often miss?",
        prompts: ["What do you wish people knew about your game?", "What would a camera miss about you?"],
      },
      {
        type: "voice-text",
        emoji: "👤",
        text: "Who at this club really understands you — not just your football, but you?",
        prompts: ["What do they do or say?", "How do you know they actually see you?"],
      },
    ],
  },

  // ── STAGE 4: Tough Periods ───────────────────────────────────────────────
  {
    id: "Tough Periods",
    title: "Tough Periods",
    emoji: "🪨",
    subtitle: "The realest part. No highlights here — just what actually happened.",
    description: "Your toughest stretch. What tested you. The real version.",
    questions: [
      {
        type: "voice-text",
        emoji: "🌧️",
        text: "Tell me about a difficult period in football that really tested you. What made it hard?",
        prompts: ["How long did it last?", "What was happening around you?", "What was happening inside you?"],
      },
      {
        type: "voice-text",
        emoji: "💭",
        text: "During that period, what were you thinking or feeling most often?",
        prompts: ["What thoughts kept coming back?", "How did it affect your day-to-day?"],
      },
      {
        type: "voice-text",
        emoji: "😰",
        text: "What does pressure usually look like in you during games — in your body, your thoughts, or your behaviour?",
        prompts: ["What happens to your breathing?", "Where do you feel it — stomach, legs, head?", "Does your thinking change?"],
      },
      {
        type: "multiselect",
        emoji: "🧱",
        text: "What helped you keep going during that period?",
        hint: "Select all that helped you through — this tells your story of resilience.",
        profileKey: "workEthic",
        options: [
          "My family and the sacrifices they'd made",
          "A coach who kept believing in me",
          "My teammates and the bonds we had",
          "My own stubborn refusal to quit",
          "The love of the game that never left",
          "A specific moment I kept replaying in my head",
          "Proving doubters wrong",
          "Wanting to be a role model for someone",
          "My faith or spiritual belief",
          "Just not knowing how to stop",
        ],
      },
      {
        type: "voice-text",
        emoji: "🤝",
        text: "Was there anyone who helped you through it, even in a small way? What did they do?",
        prompts: ["Did you tell them, or did they notice?", "What did they do with that knowledge?", "How did that make you feel?"],
      },
    ],
  },

  // ── STAGE 5: The Turn ────────────────────────────────────────────────────
  {
    id: "The Turn",
    title: "The Turn",
    emoji: "🔥",
    subtitle: "Something shifted. Let's find exactly where and how.",
    description: "What changed. The person, the moment, the private decision.",
    questions: [
      {
        type: "voice-text",
        emoji: "🗣️",
        text: "Was there a moment, conversation, or decision that started to change things for you? Tell me about it.",
        prompts: ["Where were you?", "Who was involved?", "Why did it land differently?"],
      },
      {
        type: "multiselect",
        emoji: "🔄",
        text: "What actually shifted that helped you move forward?",
        hint: "Choose honestly — this goes straight into the heart of your story.",
        options: [
          "A private decision I made on my own",
          "One conversation that reframed everything",
          "A physical change — fitness, recovery, training harder",
          "A mental shift in how I thought about mistakes",
          "Changing what I was doing outside of football",
          "A different relationship with a coach or mentor",
          "Watching someone else go through it and come out the other side",
          "Time — just letting it pass",
          "A performance that reminded me who I was",
          "Setting a very specific target and chasing it",
        ],
      },
      {
        type: "voice-text",
        emoji: "✨",
        text: "Describe the first session or match where you felt more like yourself again. What was different?",
        prompts: ["What happened in it?", "What felt different about how you moved?", "What were you thinking?"],
      },
      {
        type: "voice-text",
        emoji: "🔭",
        text: "Looking back now, what do you understand that you could not see at the time?",
        prompts: ["What would you tell yourself back then?", "What changed your perspective?"],
      },
    ],
  },

  // ── STAGE 6: Who You Are ─────────────────────────────────────────────────
  {
    id: "Who You Are",
    title: "Who You Are",
    emoji: "🧠",
    subtitle: "This is the chapter where you stop performing and just tell the truth.",
    description: "What you know now. What you won't trade. The truth.",
    questions: [
      {
        type: "multiselect",
        emoji: "💪",
        text: "What are your strongest qualities as a player and as a person?",
        hint: "Pick everything that genuinely describes you. This shapes your character summation.",
        profileKey: "strengths",
        options: [
          "Never gives up no matter what",
          "Leads by example",
          "Technical quality and skill",
          "Reads the game brilliantly",
          "Makes teammates better",
          "Cool and calm under pressure",
          "Works twice as hard as anyone",
          "Mentally strong after setbacks",
          "Creative and unpredictable",
          "Honest and trustworthy",
          "Passionate and emotionally connected",
          "Consistent day after day",
          "Takes responsibility for mistakes",
          "Lifts the mood in the group",
        ],
      },
      {
        type: "voice-text",
        emoji: "🤫",
        text: "What is something true about you that people do not always see straight away?",
        prompts: ["What do you wish people understood about you?", "What takes time for people to notice?"],
      },
      {
        type: "voice-text",
        emoji: "🛋️",
        text: "What would your closest teammates say about you away from the pitch?",
        prompts: ["Be honest — the real version.", "What would surprise a coach?", "What's the nickname or running joke?"],
      },
      {
        type: "voice-text",
        emoji: "🏠",
        text: "What keeps you going in football when things are hard?",
        prompts: ["Not the polished answer — the honest one.", "What do you think about when it's hardest?"],
      },
      {
        type: "voice-text",
        emoji: "🎁",
        text: "What do you know about yourself now that you would not want to lose?",
        prompts: ["What has the hard stuff taught you?", "What strength came from the struggle?"],
      },
    ],
  },

  // ── STAGE 7: The Chapter Ahead ───────────────────────────────────────────
  {
    id: "The Chapter Ahead",
    title: "The Chapter Ahead",
    emoji: "🚀",
    subtitle: "Your story isn't finished. Let's talk about what comes next.",
    description: "Where you're going. Your legacy. The next version of you.",
    questions: [
      {
        type: "multiselect",
        emoji: "🎯",
        text: "What do you want to achieve this season, on and off the pitch?",
        hint: "Dream big and be specific — this is your season's purpose statement.",
        profileKey: "goals",
        options: [
          "Score more goals / create more assists",
          "Keep more clean sheets",
          "Break into the first team / get more minutes",
          "Become a leader in my group",
          "Improve a specific weakness in my game",
          "Stay injury-free all season",
          "Win a trophy with the team",
          "Earn a new contract or move up an age group",
          "Become more consistent week to week",
          "Improve my mental toughness",
          "Build better relationships with coaches",
          "Become someone younger players look up to",
        ],
      },
      {
        type: "multiselect",
        emoji: "🌍",
        text: "Where do you dream of playing one day?",
        profileKey: "dreams",
        options: [
          "Premier League", "Champions League", "World Cup", "European Championship",
          "For my country's senior team", "La Liga", "Serie A", "Bundesliga",
          "Wembley Stadium", "Old Trafford", "Anfield", "The Etihad",
          "Camp Nou", "San Siro", "Lusail Stadium",
        ],
      },
      {
        type: "voice-text",
        emoji: "🏟️",
        text: "What kind of player and person do you want to become over the next few years?",
        prompts: ["Not just the football — the person.", "What do you want to be known for?", "What do you want to build in yourself?"],
      },
      {
        type: "voice-text",
        emoji: "🏆",
        text: "What do you hope people say about you that has nothing to do with stats or trophies?",
        prompts: ["What kind of person do you want to be known as?", "What do you want teammates to say?"],
      },
      {
        type: "voice-text",
        emoji: "✉️",
        text: "If this chapter of your football life had a title, what would it be?",
        prompts: ["Don't overthink it.", "What word or phrase captures where you are right now?"],
      },
    ],
  },

  // ── STAGE 8: Coach Input ─────────────────────────────────────────────────
  {
    id: "Coach Input",
    title: "Coach Input",
    emoji: "📋",
    subtitle: "This section is for coaching staff only. Your insights directly shape the story this player receives.",
    description: "Professional observations that give the story its values, lessons, and purpose.",
    isStaffSection: true,
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
        hint: "Technical, tactical, physical and psychological — select all that are in your programme.",
        profileKey: "developmentAreas",
        options: [
          "Technical: ball control and first touch",
          "Technical: passing range and accuracy",
          "Technical: finishing and composure in front of goal",
          "Technical: 1v1 defending",
          "Tactical: positional understanding",
          "Tactical: pressing and off-the-ball work",
          "Tactical: decision-making in transition",
          "Physical: speed and explosive power",
          "Physical: strength and physical presence",
          "Physical: stamina and match fitness",
          "Psychological: managing pressure",
          "Psychological: confidence and self-belief",
          "Psychological: resilience after setbacks",
          "Leadership: communication on the pitch",
          "Leadership: accountability to teammates",
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

export const PLAYER_STAGES = JOURNEY_STAGES.filter(s => !s.isStaffSection);
export const COACHING_STAGE_INDEX = JOURNEY_STAGES.findIndex(s => s.isStaffSection);

export function computeCharacterProfile(
  allAnswersByStage: Record<string, { text: string }[]>
): string {
  const getByProfileKey = (key: JourneyQuestion["profileKey"]): string => {
    for (const stage of JOURNEY_STAGES) {
      for (let qi = 0; qi < stage.questions.length; qi++) {
        const q = stage.questions[qi];
        if (q.profileKey === key) {
          const stageAnswers = allAnswersByStage[stage.id] ?? [];
          const answer = stageAnswers[qi]?.text ?? "";
          if (answer) return answer;
        }
      }
    }
    return "";
  };

  const traits = getByProfileKey("traits");
  const strengths = getByProfileKey("strengths");
  const workEthic = getByProfileKey("workEthic");
  const mindset = getByProfileKey("mindset");
  const goals = getByProfileKey("goals");
  const dreams = getByProfileKey("dreams");
  const clubValues = getByProfileKey("clubValues");
  const developmentAreas = getByProfileKey("developmentAreas");

  const lines: string[] = ["=== CHARACTER & COACHING PROFILE SUMMATION ==="];
  if (traits) lines.push(`Personality traits: ${traits}`);
  if (strengths) lines.push(`Key strengths: ${strengths}`);
  if (workEthic) lines.push(`Resilience / what kept them going: ${workEthic}`);
  if (mindset) lines.push(`Mindset & response patterns: ${mindset}`);
  if (goals) lines.push(`Season goals: ${goals}`);
  if (dreams) lines.push(`Career dreams: ${dreams}`);
  if (clubValues) lines.push(`Club values demonstrated: ${clubValues}`);
  if (developmentAreas) lines.push(`Development priorities: ${developmentAreas}`);
  lines.push("==============================================");
  return lines.join("\n");
}
