export type JourneyQuestionType =
  | "voice-text"
  | "select"
  | "multiselect"
  | "staff-text"
  | "staff-multiselect";

/** A conditional follow-up that appears after selecting a specific option */
export interface FollowUpBranch {
  /** The exact option text that triggers this follow-up */
  triggerOption: string;
  /** Follow-up question text (always answered as short voice-text) */
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
  /** If set, this question only appears for players whose primary position matches one of these IDs */
  positionIds?: string[];
  /** Conditional follow-up questions keyed to specific option selections */
  followUps?: FollowUpBranch[];
  /**
   * Runtime-computed label set by the question selector (e.g. "Centre Back", "Right Back", "CB / RB").
   * Never stored in question data — always attached by selectPositionQuestions().
   */
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
  "Describe the player's technical abilities across different game situations.",
  "What are their key strengths in the football coaching pillar?",
  "Where do they need development in this pillar?",
  "How would you support their growth in this area?",
  "Any additional observations or context?"
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
        type: "voice-text",
        emoji: "🎬",
        text: "Close your eyes. Think of one game — one specific moment — that you keep going back to when you think about why you play. Tell me about it.",
        prompts: ["Where was it?", "What happened?", "What did you hear?", "How did it feel?"],
      },
      {
        type: "multiselect",
        emoji: "🪞",
        text: "Pick the words that best describe you — not as a footballer, but as a person.",
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
        emoji: "🎮",
        text: "Describe how you actually play — not your position, your game. The way you move, how you think on the pitch.",
        prompts: ["What are you best at?", "What part of your game is still developing?", "How would a teammate describe you?"],
      },
      {
        type: "voice-text",
        emoji: "🔄",
        text: "You play in more than one position. Tell me about how your game changes — what shifts mentally and physically when you switch roles.",
        hint: "Versatile players are rare. Understanding what actually changes in your thinking is part of your story.",
        prompts: ["Which role feels more natural?", "What does each position bring out in you?", "Has playing both made you a better player overall?"],
        requiresSecondPosition: true,
      },
      {
        type: "voice-text",
        emoji: "❤️",
        text: "Who's the first person you tell when something great happens in football? What do they usually say?",
        prompts: ["Can you remember their exact words?", "Why do you always tell them first?"],
      },
      {
        type: "voice-text",
        emoji: "🏠",
        text: "Is there something at home that means something to you about football? A poster, notebook, old kit — anything.",
        prompts: ["What is it?", "Where did you get it?", "Why does it matter to you?"],
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

      // ── GK ──────────────────────────────────────────
      {
        type: "select",
        emoji: "🧤",
        text: "The opposition striker is through on goal and your defender is chasing back. What do you do?",
        hint: "There's no single right answer — your thinking process is what matters here.",
        positionIds: ["GK"],
        options: [
          "Come out aggressively — close the angle and take away their shooting space",
          "Spread wide and stand my ground — give them as little of the goal as possible",
          "Hold my position until the last moment — wait for them to fully commit",
        ],
        followUps: [
          {
            triggerOption: "Come out aggressively — close the angle and take away their shooting space",
            question: "You've committed to coming out and the striker has nipped the ball wide at the last second. What are you doing with your body and your communication?",
            prompts: ["How do you recover your position?", "What do you shout to the defender?", "What's the danger you're managing now?"],
          },
          {
            triggerOption: "Hold my position until the last moment — wait for them to fully commit",
            question: "You've held your ground. The striker is right on top of you now and shaping to shoot near post. Describe your body position and mindset in that split second.",
            prompts: ["Where do you put your weight?", "What are you reading in their body shape?", "What goes through your head?"],
          },
        ],
      },

      // ── CB ──────────────────────────────────────────
      {
        type: "select",
        emoji: "🛡️",
        text: "The striker drops deep to receive the ball. Do you follow them out or hold your defensive line?",
        hint: "Both choices have consequences — what drives your decision?",
        positionIds: ["CB"],
        options: [
          "Follow them tight — I can't let them turn with the ball facing goal",
          "Hold my line — I trust my midfield to pick them up when they drop",
          "Move towards them but don't fully commit — stay in a controlled mid-position",
        ],
        followUps: [
          {
            triggerOption: "Follow them tight — I can't let them turn with the ball facing goal",
            question: "You've followed them deep. As you do, a second runner makes a run into the space you've just vacated. What do you shout and how do you react?",
            prompts: ["How do you communicate?", "Do you track back or stay on the striker?", "What's the priority?"],
          },
          {
            triggerOption: "Hold my line — I trust my midfield to pick them up when they drop",
            question: "You hold and the midfielder doesn't track. The striker turns and now faces goal with pace. Talk through how you approach that 1v1.",
            prompts: ["How do you set your body?", "When do you commit?", "What are you trying to force them to do?"],
          },
        ],
      },

      // ── LB / RB ──────────────────────────────────────────
      {
        type: "select",
        emoji: "🏃",
        text: "Your winger has the ball ahead of you and your team is building an attack. What's your decision?",
        hint: "Your movement in the next few seconds changes the whole picture.",
        positionIds: ["LB", "RB"],
        options: [
          "Overlap — get outside them to create a two-v-one out wide",
          "Underlap — move inside to open a combination and give them the space to go outside",
          "Hold — stay in position for defensive balance in case we lose it",
        ],
        followUps: [
          {
            triggerOption: "Overlap — get outside them to create a two-v-one out wide",
            question: "You've made the run. The winger's attempted pull-back is blocked and the ball falls back to you near the byline with a second to decide. What are your options and what do you do?",
            prompts: ["Who's making runs in the box?", "What's the goalkeeper's position?", "Do you cross early or take a touch?"],
          },
        ],
      },

      // ── CDM ──────────────────────────────────────────
      {
        type: "select",
        emoji: "⚙️",
        text: "The opposition wins the ball and launches a counter-attack straight through the middle. You're the last midfielder. What's your approach?",
        hint: "This decision happens in less than a second. What goes through your head?",
        positionIds: ["CDM"],
        options: [
          "Delay — get goal-side, show them wide, buy time for teammates to recover",
          "Press hard immediately — don't let them build any momentum",
          "Position myself to tackle at the right moment, but stay on my feet",
        ],
        followUps: [
          {
            triggerOption: "Delay — get goal-side, show them wide, buy time for teammates to recover",
            question: "You've been delaying for several seconds but no cover has arrived. The striker is now in a shooting position 25 yards out. Do you stay on your feet, commit to a tackle, or foul intelligently? What decides it?",
            prompts: ["What's the score?", "How much time is left?", "Where are your nearest teammates?"],
          },
          {
            triggerOption: "Press hard immediately — don't let them build any momentum",
            question: "You go to press. The striker lets the ball roll across their body and skips past you. You're beaten and behind the play. What's your immediate next action?",
            prompts: ["Do you chase or drop off?", "What do you communicate?", "How do you stop the damage?"],
          },
        ],
      },

      // ── CM ──────────────────────────────────────────
      {
        type: "select",
        emoji: "💫",
        text: "Your team is building play and your holding midfielder has the ball but is being pressed. Where do you move and why?",
        hint: "Your movement creates the pass — where you go decides what's possible.",
        positionIds: ["CM"],
        options: [
          "Show between the lines — I want to receive and turn and drive at their backline",
          "Make a run beyond the striker — if they play early we could break through",
          "Drift wide to overload the flank and pull their midfield out of shape",
        ],
        followUps: [
          {
            triggerOption: "Show between the lines — I want to receive and turn and drive at their backline",
            question: "You receive the ball between the lines with a midfielder closing fast behind you. What's your first touch and what happens next?",
            prompts: ["Which foot do you receive on?", "What have you already spotted?", "Do you turn, lay it off, or drive?"],
          },
        ],
      },

      // ── CAM ──────────────────────────────────────────
      {
        type: "select",
        emoji: "🎯",
        text: "You're about to receive the ball in the space between the opposition midfield and defence — the pocket every number 10 lives for. What are you checking before the pass arrives?",
        hint: "The best number 10s have already made the decision before they touch the ball.",
        positionIds: ["CAM"],
        options: [
          "Where the runners are in behind — I want to know if I can play through the line immediately",
          "Which defender is closest and which foot I want to receive on",
          "What the striker is doing — I'm looking to play off their movement first",
        ],
        followUps: [
          {
            triggerOption: "Where the runners are in behind — I want to know if I can play through the line immediately",
            question: "You've spotted a run in behind and the timing looks right. As you receive, the opponent tracking you lunges in from behind. How do you protect the ball and still get the pass away?",
            prompts: ["Do you shield first or release early?", "What does your body shape need to do?", "What's the risk if you get it wrong?"],
          },
        ],
      },

      // ── LW / RW ──────────────────────────────────────────
      {
        type: "select",
        emoji: "⚡",
        text: "You've got the ball 1v1 against the full-back out wide. What tells you whether to go outside, cut inside, or hold for support?",
        hint: "Great wingers read these cues instantly — what are yours?",
        positionIds: ["LW", "RW"],
        options: [
          "Go outside — use my pace and get to the byline to cross",
          "Cut inside onto my stronger foot — I'm looking to shoot or play through",
          "Hold up and wait — read the situation before committing to anything",
        ],
        followUps: [
          {
            triggerOption: "Go outside — use my pace and get to the byline to cross",
            question: "You've beaten them on the outside and you're at the byline. You can see two centre-backs goal-side of the striker and one runner arriving at the back post. Where do you aim and why?",
            prompts: ["Near post? Far post? Cut-back?", "What tells you which run is best timed?", "What does the goalkeeper's position change?"],
          },
          {
            triggerOption: "Cut inside onto my stronger foot — I'm looking to shoot or play through",
            question: "You've cut inside. The covering centre-back slides across to block your shooting lane. What do you look for — shoot anyway, recycle, or something else?",
            prompts: ["Is there a shooting angle?", "Has the overlap arrived?", "What's the ball-side danger if you lose it?"],
          },
        ],
      },

      // ── ST / CF ──────────────────────────────────────────
      {
        type: "select",
        emoji: "🎯",
        text: "Your team wins the ball and breaks quickly. You're the striker — what's your movement?",
        hint: "Your first two steps decide whether the chance exists at all.",
        positionIds: ["ST", "CF"],
        options: [
          "Run in behind the last defender — stretch them and create the depth",
          "Come short to the ball — link play and look to turn quickly",
          "Pull into the channel — drag a centre-back wide and open space centrally",
        ],
        followUps: [
          {
            triggerOption: "Run in behind the last defender — stretch them and create the depth",
            question: "Your timing is perfect and you're in behind. The keeper rushes out. The ball is arriving at pace. Talk through your decision — where do you put it and how does the distance between you and the keeper change that?",
            prompts: ["Do you go round them or over them?", "What does pace of the ball do to your options?", "What's your body shape as you receive?"],
          },
          {
            triggerOption: "Pull into the channel — drag a centre-back wide and open space centrally",
            question: "The centre-back has followed you wide and there's a gap centrally. How do you communicate that, and what do you need from a teammate to exploit it?",
            prompts: ["What run do you want from midfield?", "When do you peel back inside?", "What's the timing of the pass you're asking for?"],
          },
        ],
      },

      // ── POSITION-INDEPENDENT ──────────────────────────────────────────

      {
        type: "voice-text",
        emoji: "⏱️",
        text: "Your team is 1–0 up with ten minutes to go. How does that change the way you play compared to when the score is level?",
        prompts: ["What decisions change?", "How do you manage the game differently?", "What do you communicate to teammates?"],
      },
      {
        type: "voice-text",
        emoji: "🔄",
        text: "You receive the ball facing your own goal with a player pressing tight behind you. What should you already know before your first touch arrives?",
        prompts: ["What information have you scanned for?", "What are your options before you even touch it?", "How does your body shape affect what's possible?"],
      },
      {
        type: "select",
        emoji: "🤝",
        text: "A teammate keeps making the same positional mistake two or three times in the same game. What do you do?",
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
            question: "You pull them aside and they react defensively — 'I know, I know.' How do you respond to keep the conversation useful without damaging the relationship?",
            prompts: ["Do you back off or push the point?", "What matters more right now — the mistake or the relationship?", "What's the goal of the conversation?"],
          },
          {
            triggerOption: "Give them a quick instruction during play from close range",
            question: "They don't respond to the instruction and make the same error a fourth time. What do you do now?",
            prompts: ["Do you stay patient or change your approach?", "How do you adjust your own game to compensate?", "What do you say — or not say?"],
          },
        ],
      },
      {
        type: "voice-text",
        emoji: "💡",
        text: "When you're not performing at your best personally, how do you still make yourself valuable to the team?",
        prompts: ["What do you focus on when the technical side isn't flowing?", "What can you always control on a bad day?", "What do teammates need from you even when you're out of form?"],
      },
    ],
  },

  // ── STAGE 3: The Invisible Days ──────────────────────────────────────────
  {
    id: "The Invisible Days",
    title: "The Invisible Days",
    emoji: "👁️",
    subtitle: "Every player has periods where they feel unseen. Tell me about yours.",
    description: "The work no one sees. The moments you were overlooked.",
    questions: [
      {
        type: "voice-text",
        emoji: "❌",
        text: "Tell me about a time you didn't make the team. The actual moment you found out — where were you?",
        prompts: ["What did you do straight after?", "What did you not say out loud?", "How long did it take to shake off?"],
      },
      {
        type: "voice-text",
        emoji: "🏋️",
        text: "What do you do in training that nobody sees? The extra work — before or after everyone else goes home.",
        prompts: ["What do you practise on your own?", "Do you have any private routines?", "What do you do that no one gives you credit for?"],
      },
      {
        type: "select",
        emoji: "⚡",
        text: "When you feel overlooked or undervalued at the club, you tend to…",
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
      },
      {
        type: "voice-text",
        emoji: "🔮",
        text: "What is the thing about you as a player that goes unnoticed? The quality that people just don't see?",
        prompts: ["What do you wish people knew about your game?", "What would a camera miss about you?"],
      },
      {
        type: "voice-text",
        emoji: "👤",
        text: "Who at this club really knows what you're made of — not just your ability, but you as a person?",
        prompts: ["What do they do or say?", "How do you know they actually see you?"],
      },
    ],
  },

  // ── STAGE 4: When It Broke ───────────────────────────────────────────────
  {
    id: "When It Broke",
    title: "When It Broke",
    emoji: "🪨",
    subtitle: "The realest part. No highlights here — just what actually happened.",
    description: "Your lowest point. The hardest stretch. The real version.",
    questions: [
      {
        type: "voice-text",
        emoji: "🌧️",
        text: "Tell me about your worst stretch in football — not just a bad game, a bad period. What was going on?",
        prompts: ["How long did it last?", "What was happening around you?", "What was happening inside you?"],
      },
      {
        type: "voice-text",
        emoji: "😶",
        text: "Describe the moment when it all felt like too much. Where were you, what were you doing?",
        prompts: ["What were you thinking?", "What did your body feel like?", "Did anyone see it happen?"],
      },
      {
        type: "multiselect",
        emoji: "🧱",
        text: "When things were at their hardest, what kept you going? Pick everything that rings true.",
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
        emoji: "😰",
        text: "What does your body actually do when you're under real pressure in a game?",
        prompts: ["What happens to your breathing?", "Where do you feel it — stomach, legs, head?", "Does your thinking change?"],
      },
      {
        type: "voice-text",
        emoji: "🤐",
        text: "Who found out you were really struggling — and how did they find out?",
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
        text: "Was there one person whose words found you at exactly the right moment? Who were they, and what did they say?",
        prompts: ["Where were you when they said it?", "Were they a coach, parent, teammate?", "Why did those words land differently?"],
      },
      {
        type: "voice-text",
        emoji: "🤫",
        text: "Tell me about the quiet moment before things changed — not the big game, the moment before it.",
        prompts: ["What were you doing?", "What did you suddenly understand?", "Were you alone?"],
      },
      {
        type: "multiselect",
        emoji: "🔄",
        text: "What changed things for you? Pick everything that actually shifted something.",
        hint: "Choose honestly — this goes straight into the heart of your story.",
        profileKey: "mindset",
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
        text: "Describe the first training session or game where you felt like yourself again.",
        prompts: ["What happened in it?", "What felt different about how you moved?", "What were you thinking?"],
      },
      {
        type: "voice-text",
        emoji: "🔭",
        text: "Looking back at the hardest part — what do you understand now that you couldn't see when you were in the middle of it?",
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
        text: "What are your strongest qualities — as a player AND as a person? Be proud and honest.",
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
        text: "What's something true about you — as a footballer or as a person — that took you a long time to say out loud?",
        prompts: ["Even just to yourself?", "Why was it hard to admit?", "What made you finally say it?"],
      },
      {
        type: "voice-text",
        emoji: "🛋️",
        text: "If your closest teammates described you in the changing room — not on the pitch, in the changing room — what would they say?",
        prompts: ["Be honest — the real version.", "What would surprise a coach?", "What's the nickname or running joke?"],
      },
      {
        type: "voice-text",
        emoji: "🏠",
        text: "What keeps you here — at this club, doing this work — when part of you wants to walk away?",
        prompts: ["Not the polished answer — the honest one.", "What do you think about when it's hardest?"],
      },
      {
        type: "voice-text",
        emoji: "🎁",
        text: "After everything you've been through — what do you know about yourself that you wouldn't trade for anything?",
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
        text: "What do you want to achieve this season — on the pitch and off it? Pick everything that matters to you.",
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
        text: "Where do you dream of playing one day? Pick every stage you want to stand on.",
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
        text: "Describe the specific moment — the ground, the game, the feeling in your body — when you'll know you've made it.",
        prompts: ["What's the stadium?", "Who's watching?", "What does your body feel like?", "What do you say to yourself?"],
      },
      {
        type: "voice-text",
        emoji: "🏆",
        text: "What do you want written about you that has nothing to do with goals, appearances, or trophies?",
        prompts: ["What kind of person do you want to be known as?", "What do you want teammates to say?"],
      },
      {
        type: "voice-text",
        emoji: "✉️",
        text: "If this chapter of your life had a title — right now, this season, this moment — what would it be?",
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
    isCoaching: true,
    questions: [
      {
        type: "staff-multiselect",
        emoji: "🏛️",
        text: "Which club values does this player already demonstrate — on the pitch and in their everyday behaviour?",
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
        emoji: "📚",
        text: "What story themes and life lessons do you want woven through this player's personalised book?",
        hint: "These guide the narrative arc — choose the messages you most want them to carry.",
        profileKey: "storyThemes",
        options: [
          "Resilience and bouncing back",
          "The power of hard work over talent",
          "The importance of family and support systems",
          "Identity — knowing who you are beyond football",
          "Leadership and responsibility",
          "Dealing with failure and learning from it",
          "The value of the team over the individual",
          "Mental strength and emotional control",
          "Staying grounded despite early success",
          "The long game — trusting the process",
          "Community, roots, and giving back",
          "Courage to speak up and be yourself",
        ],
      },
      {
        type: "staff-multiselect",
        emoji: "📈",
        text: "What are the priority development areas you're focusing on with this player this season?",
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
        text: "What makes this player genuinely special? Describe the quality that would never appear in a stats report or standard assessment document.",
        hint: "This is the heart of their story — what you see that most people miss.",
      },
      {
        type: "staff-text",
        emoji: "💡",
        text: "What is the one key lesson or message you most want this player to take from their book — something that will help shape who they become?",
        hint: "The single most important thing. The thing you'd say if you only had one sentence.",
      },
      {
        type: "staff-text",
        emoji: "🎭",
        text: "Describe a specific moment — in training or in a match — where this player showed real character. Paint the scene.",
        hint: "The more specific, the more powerful. A real story beats a general observation every time.",
      },
      {
        type: "staff-text",
        emoji: "🏁",
        text: "What does success look like for this player by the end of this season — on the pitch, off it, and as a developing person?",
        hint: "Paint the picture of where you want them to be. This becomes the story's closing chapter.",
      },
    ],
  },
];

export const PLAYER_STAGES = JOURNEY_STAGES.filter(s => !s.isCoaching);
export const COACHING_STAGE_INDEX = JOURNEY_STAGES.findIndex(s => s.isCoaching);

/** Compute a character profile summary from select/multiselect answers across all stages */
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
  const mindset1 = getByProfileKey("mindset");
  const goals = getByProfileKey("goals");
  const dreams = getByProfileKey("dreams");
  const clubValues = getByProfileKey("clubValues");
  const storyThemes = getByProfileKey("storyThemes");
  const developmentAreas = getByProfileKey("developmentAreas");

  const lines: string[] = ["=== CHARACTER & COACHING PROFILE SUMMATION ==="];
  if (traits) lines.push(`Personality traits: ${traits}`);
  if (strengths) lines.push(`Key strengths: ${strengths}`);
  if (workEthic) lines.push(`Resilience / what kept them going: ${workEthic}`);
  if (mindset1) lines.push(`Mindset & response patterns: ${mindset1}`);
  if (goals) lines.push(`Season goals: ${goals}`);
  if (dreams) lines.push(`Career dreams: ${dreams}`);
  if (clubValues) lines.push(`Club values demonstrated: ${clubValues}`);
  if (storyThemes) lines.push(`Story themes selected by coach: ${storyThemes}`);
  if (developmentAreas) lines.push(`Development priorities: ${developmentAreas}`);
  lines.push("==============================================");
  return lines.join("\n");
}
