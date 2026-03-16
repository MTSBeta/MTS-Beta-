export interface JourneyQuestion {
  text: string;
  prompts?: string[];
}

export interface JourneyStage {
  id: string;
  title: string;
  emoji: string;
  subtitle: string;
  description: string;
  questions: JourneyQuestion[];
}

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "Your World",
    title: "Your World",
    emoji: "⚽",
    subtitle: "Before we talk about football, let's talk about you. The real version.",
    description: "The scene, the people, the daily world that shapes everything.",
    questions: [
      {
        text: "Close your eyes. Think of one game — one specific moment — that you keep going back to when you think about why you play. Tell me about it.",
        prompts: ["Where was it?", "What happened?", "What did you hear?", "How did it feel?"],
      },
      {
        text: "Describe how you actually play — not your position, your game. The way you move, how you think on the pitch.",
        prompts: ["What are you best at?", "What part of your game is still developing?", "How would a teammate describe you?"],
      },
      {
        text: "Who's the first person you tell when something great happens in football? What do they usually say?",
        prompts: ["Can you remember their exact words?", "Why do you always tell them first?"],
      },
      {
        text: "Walk me through your journey to training on a normal day.",
        prompts: ["What route do you take?", "What do you walk or travel past?", "What's going through your head on the way there?"],
      },
      {
        text: "Is there something at home that means something to you about football? A poster, notebook, old kit — anything.",
        prompts: ["What is it?", "Where did you get it?", "Why does it matter to you?"],
      },
    ],
  },
  {
    id: "The Invisible Days",
    title: "The Invisible Days",
    emoji: "👁️",
    subtitle: "Every player has periods where they feel unseen. Tell me about yours.",
    description: "The work no one sees. The moments you were overlooked.",
    questions: [
      {
        text: "Tell me about a time you didn't make the team. The actual moment you found out — where were you?",
        prompts: ["What did you do straight after?", "What did you not say out loud?", "How long did it take to shake off?"],
      },
      {
        text: "What do you do in training that nobody sees? The extra work — before or after everyone else goes home.",
        prompts: ["What do you practise on your own?", "Do you have any private routines?", "What do you do that no one gives you credit for?"],
      },
      {
        text: "Was there a time when a coach or someone at the club seemed to look straight through you?",
        prompts: ["What happened?", "How did it feel?", "What did you do with that feeling?"],
      },
      {
        text: "What is the thing about you as a player that goes unnoticed? The quality that people just don't see?",
        prompts: ["What do you wish people knew about your game?", "What would a camera miss about you?"],
      },
      {
        text: "Who at this club really knows what you're made of — not just your ability, but you as a person?",
        prompts: ["What do they do or say?", "How do you know they actually see you?"],
      },
    ],
  },
  {
    id: "When It Broke",
    title: "When It Broke",
    emoji: "🪨",
    subtitle: "The realest part. No highlights here — just what actually happened.",
    description: "Your lowest point. The hardest stretch. The real version.",
    questions: [
      {
        text: "Tell me about your worst stretch in football — not just a bad game, a bad period. What was going on?",
        prompts: ["How long did it last?", "What was happening around you?", "What was happening inside you?"],
      },
      {
        text: "Describe the moment when it all felt like too much. Where were you, what were you doing?",
        prompts: ["What were you thinking?", "What did your body feel like?", "Did anyone see it happen?"],
      },
      {
        text: "What does your body actually do when you're under real pressure in a game?",
        prompts: ["What happens to your breathing?", "Where do you feel it — stomach, legs, head?", "Does your thinking change?"],
      },
      {
        text: "Tell me about a game or session where you felt like you let yourself or someone else down.",
        prompts: ["What happened exactly?", "Who were you thinking about?", "What did you do in the days after?"],
      },
      {
        text: "Who found out you were really struggling — and how did they find out?",
        prompts: ["Did you tell them, or did they notice?", "What did they do with that knowledge?", "How did that make you feel?"],
      },
    ],
  },
  {
    id: "The Turn",
    title: "The Turn",
    emoji: "🔥",
    subtitle: "Something shifted. Let's find exactly where and how.",
    description: "What changed. The person, the moment, the private decision.",
    questions: [
      {
        text: "Was there one person whose words found you at exactly the right moment? Who were they, and what did they say?",
        prompts: ["Where were you when they said it?", "Were they a coach, parent, teammate?", "Why did those words land differently?"],
      },
      {
        text: "Tell me about the quiet moment before things changed — not the big game, the moment before it.",
        prompts: ["What were you doing?", "What did you suddenly understand?", "Were you alone?"],
      },
      {
        text: "What did you do differently that actually started to change things? The small private decision — not a big dramatic move.",
        prompts: ["When did you make that decision?", "Did anyone else know about it?", "How long before you felt it working?"],
      },
      {
        text: "Describe the first training session or game where you felt like yourself again.",
        prompts: ["What happened in it?", "What felt different about how you moved?", "What were you thinking?"],
      },
      {
        text: "Looking back at the hardest part — what do you understand now that you couldn't see when you were in the middle of it?",
        prompts: ["What would you tell yourself back then?", "What changed your perspective?"],
      },
    ],
  },
  {
    id: "Who You Are",
    title: "Who You Are",
    emoji: "🧠",
    subtitle: "This is the chapter where you stop performing and just tell the truth.",
    description: "What you know now. What you won't trade. The truth.",
    questions: [
      {
        text: "What's something true about you — as a footballer or as a person — that took you a long time to say out loud?",
        prompts: ["Even just to yourself?", "Why was it hard to admit?", "What made you finally say it?"],
      },
      {
        text: "If your closest teammates described you in the changing room — not on the pitch, in the changing room — what would they say?",
        prompts: ["Be honest — the real version.", "What would surprise a coach?", "What's the nickname or running joke?"],
      },
      {
        text: "What keeps you here — at this club, doing this work — when part of you wants to walk away?",
        prompts: ["Not the polished answer — the honest one.", "What do you think about when it's hardest?"],
      },
      {
        text: "How have you changed as a person since you joined this academy? Not your football — you, as a human being.",
        prompts: ["How do you handle things differently?", "What do people notice about you that's changed?"],
      },
      {
        text: "After everything you've been through — what do you know about yourself that you wouldn't trade for anything?",
        prompts: ["What has the hard stuff taught you?", "What strength came from the struggle?"],
      },
    ],
  },
  {
    id: "The Chapter Ahead",
    title: "The Chapter Ahead",
    emoji: "🚀",
    subtitle: "Your story isn't finished. Let's talk about what comes next.",
    description: "Where you're going. Your legacy. The next version of you.",
    questions: [
      {
        text: "Describe the specific moment — the ground, the game, the feeling in your body — when you'll know you've made it.",
        prompts: ["What's the stadium?", "Who's watching?", "What does your body feel like?", "What do you say to yourself?"],
      },
      {
        text: "What do you want written about you that has nothing to do with goals, appearances, or trophies?",
        prompts: ["What kind of person do you want to be known as?", "What do you want teammates to say?"],
      },
      {
        text: "What does your family need to see from you — in football and in life — to know all the sacrifice was worth it?",
        prompts: ["Who are you thinking about?", "What would they need to witness?", "Is there a moment you picture?"],
      },
      {
        text: "When you've made it — what's the first thing you want to do for someone else? Who is it, and why?",
        prompts: ["Is it a person you know?", "What would you give them?", "Why them specifically?"],
      },
      {
        text: "If this chapter of your life had a title — right now, this season, this moment — what would it be?",
        prompts: ["Don't overthink it.", "What word or phrase captures where you are right now?"],
      },
    ],
  },
];
