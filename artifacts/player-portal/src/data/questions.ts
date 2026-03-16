export interface JourneyStage {
  id: string;
  title: string;
  emoji: string;
  subtitle: string;
  questions: string[];
}

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "Your World",
    title: "Your World",
    emoji: "⚽",
    subtitle: "Before we talk about football, let's talk about you. The real version.",
    questions: [
      "Close your eyes for a second. There's one specific game — a pitch, a moment, a feeling — that you keep coming back to when you think about why you play. Describe that scene to me. What can you see, hear, feel?",
      "Describe yourself as a footballer — not your position, but how you actually play. What does your game genuinely look like? What are you best at, and what's still giving you trouble?",
      "Who's the first person you tell when something good happens in football? What do they usually say — their actual words, if you can remember them?",
      "Walk me through your journey to training on a normal day — the route, what you walk past, what goes through your head. What does that journey feel like right now in the season?",
      "Is there something at home — a poster, a notebook, a piece of kit, anything — that means something to you about football? Tell me about it and why it matters.",
    ],
  },
  {
    id: "The Invisible Days",
    title: "The Invisible Days",
    emoji: "👁️",
    subtitle: "Every player has periods where they feel unseen. Tell me about yours.",
    questions: [
      "Tell me about a specific time you didn't make the team — the actual moment you found out. Where were you? What did you do next? What did you not say out loud?",
      "What do you do in training or preparation that nobody sees? The extra work, the private routines, the things you do before or after everyone else has gone home.",
      "Was there a time when a coach, a teammate, or someone at the club just seemed to look straight through you? What happened, and what did you do with that feeling?",
      "What is the thing about you as a player that goes unnoticed or underestimated by the people who should see it? What do you wish they knew?",
      "Who at this club genuinely knows what you're made of — not just your ability, but you as a person? How do they show it?",
    ],
  },
  {
    id: "When It Broke",
    title: "When It Broke",
    emoji: "🪨",
    subtitle: "The realest part. No highlights here — just what actually happened.",
    questions: [
      "Tell me about your worst stretch in football — not just a bad game, but a bad period. What was going on around you, and what was going on inside you?",
      "Describe the specific moment when it all felt like too much. Where were you, what were you doing, what did you think? Give me the scene.",
      "What does your body do when you're under real pressure in a game? Walk me through it physically — what actually happens to you?",
      "Tell me about a game, a session, or a specific moment where you felt like you let yourself or someone else down. What happened? What did it do to you for the days after?",
      "Who found out you were really struggling, and how did they find out? Did you tell them, or did they notice? What did they do with that knowledge?",
    ],
  },
  {
    id: "The Turn",
    title: "The Turn",
    emoji: "🔥",
    subtitle: "Something shifted. Let's find exactly where and how.",
    questions: [
      "Was there one person — a coach, a parent, a teammate, someone you didn't expect — whose words found you at exactly the right moment? Tell me who, tell me where you were, and tell me what they said.",
      "Tell me about the quiet moment — not the big game, the moment before it — when you felt something shift inside you. What were you doing? What did you suddenly understand?",
      "What did you do differently that actually started to change things? Not a big dramatic move — the small thing, the private decision, the thing no one else saw you make.",
      "Describe the first training session or match where you felt like yourself again. What happened in it? What was different about how you moved, how you thought?",
      "Looking back at the hardest part of your journey — what do you understand now that you couldn't see when you were in the middle of it?",
    ],
  },
  {
    id: "Who You Are",
    title: "Who You Are",
    emoji: "🧠",
    subtitle: "This is the chapter where you stop performing and just tell the truth.",
    questions: [
      "What's something true about you — as a footballer or as a person — that took you a long time to be able to say out loud, even to yourself?",
      "If your closest teammates were asked to describe you in the changing room — not on the pitch, in the changing room — what would they actually say? Be honest.",
      "What's the thing that keeps you here — at this club, doing this work — when part of you wants to walk away? Not the polished answer. The real one.",
      "How have you changed as a person since you joined this academy? Not your football — you, as a human being. What's different about the way you think, talk, or handle things?",
      "After everything you've been through — the good and the hard — what do you know about yourself that you wouldn't trade for anything?",
    ],
  },
  {
    id: "The Chapter Ahead",
    title: "The Chapter Ahead",
    emoji: "🚀",
    subtitle: "Your story isn't finished. Let's talk about what comes next.",
    questions: [
      "Describe the specific moment — the ground, the game, the feeling in your body — when you'll know you've made it. Not a vague future. The actual scene you picture.",
      "What do you want written about you that has nothing to do with goals, appearances, or trophies? What's the non-football version of your legacy?",
      "What does your family need to see from you — in football and in life — to know that all the sacrifice was worth it?",
      "When you've made it and your story has a great ending — what's the first thing you want to do for someone else? Who is it, and why them?",
      "If this chapter of your life had a title — right now, this exact season, this exact moment — what would it be, and why?",
    ],
  },
];
