export interface JourneyStage {
  id: string;
  title: string;
  emoji: string;
  subtitle: string;
  questions: string[];
}

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "Dream",
    title: "The Dream",
    emoji: "⚽",
    subtitle: "Let's start with the big picture — what's the dream?",
    questions: [
      "If you could live your perfect football life, what would it actually look like?",
      "Who's your football hero? What is it about them that just gets you?",
      "Picture your perfect game — describe exactly what's happening.",
      "Why do you love your position? What does it let you do that nothing else does?",
      "Tell me about a moment when you were totally in the zone and football just felt right.",
    ],
  },
  {
    id: "Storm",
    title: "The Storm",
    emoji: "⛈️",
    subtitle: "Every great player goes through tough times. Let's talk about yours.",
    questions: [
      "Think of a time when football was really hard — what was actually going on?",
      "What's the biggest challenge you've faced as a player so far?",
      "Tell me about a match or training session that went badly. What happened?",
      "How does it feel in your body when things aren't going well on the pitch?",
      "When everything's going wrong, what's the thing that makes you choose to keep going?",
    ],
  },
  {
    id: "Rock Bottom",
    title: "Rock Bottom",
    emoji: "🪨",
    subtitle: "This is the realest part. Be honest — it's just between us.",
    questions: [
      "Has there ever been a moment when you thought about quitting football? Tell me about it.",
      "What's been the most gutting thing that's happened to you in football?",
      "Was there a time when you felt like you just weren't good enough? What was that like?",
      "Tell me about a mistake in a game that really hit you hard.",
      "When you were at your lowest point — what was actually going through your head?",
    ],
  },
  {
    id: "Rise",
    title: "The Rise",
    emoji: "🔥",
    subtitle: "You got back up. How? This is the part that matters most.",
    questions: [
      "What got you through it? Where did you actually find the strength?",
      "Who showed up for you when things were tough? What did they do?",
      "Was there a moment when something just clicked and you thought 'I'm not done'?",
      "When did you start believing in yourself again — and what helped make that happen?",
      "How did something that felt like a weakness end up making you stronger?",
    ],
  },
  {
    id: "Elite Wisdom",
    title: "Elite Wisdom",
    emoji: "🧠",
    subtitle: "You've been through it. What have you learned about yourself?",
    questions: [
      "What's the biggest thing football has actually taught you about yourself?",
      "How has being a footballer changed the way you handle life — not just sport?",
      "What would you tell a 10-year-old who's just starting out?",
      "What does being part of a team actually mean to you — real talk?",
      "When setbacks hit, what do you actually do to stay on it?",
    ],
  },
  {
    id: "Next Level",
    title: "Next Level",
    emoji: "🚀",
    subtitle: "Where are you going? Let's talk about the future you're building.",
    questions: [
      "Where do you honestly see yourself in football in five years?",
      "What part of your game are you most excited to level up?",
      "How are you going to help the players around you get better too?",
      "What do you want people to remember about the way you played?",
      "Right now — what does success in football actually mean to you?",
    ],
  },
];
