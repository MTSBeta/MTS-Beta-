export interface U9Question {
  text: string;
  hint: string;
  emoji: string;
}

export interface U9Stage {
  id: string;
  title: string;
  emoji: string;
  intro: string;
  colour: string;
  questions: U9Question[];
}

export const U9_STAGES: U9Stage[] = [
  {
    id: "All About Me",
    title: "All About Me",
    emoji: "🌟",
    intro: "Let's start with the most important person — YOU!",
    colour: "#f59e0b",
    questions: [
      {
        emoji: "😄",
        text: "What is your favourite thing about being you? Tell me something that makes you special!",
        hint: "Maybe you're really fast, or super kind, or always make people laugh…",
      },
      {
        emoji: "👨‍👩‍👧‍👦",
        text: "Tell me about your family. Who is at home with you, and what do they think of your football?",
        hint: "Do they come to your games? What do they shout when you score?",
      },
      {
        emoji: "🎮",
        text: "What do you love doing when you're not playing football? What makes you really happy?",
        hint: "Maybe a game, a TV show, something you do with your friends…",
      },
    ],
  },
  {
    id: "I Love Football",
    title: "I Love Football!",
    emoji: "⚽",
    intro: "Now let's talk about the best thing ever — football!",
    colour: "#10b981",
    questions: [
      {
        emoji: "💥",
        text: "Tell me about your best ever football moment. A goal, a save, a brilliant pass — anything you felt really proud of!",
        hint: "Close your eyes and remember it. Where were you? What happened?",
      },
      {
        emoji: "🧤",
        text: "What is your favourite position to play, and why do you love it?",
        hint: "Goalkeeper? Striker? Do you like scoring or stopping goals?",
      },
      {
        emoji: "⭐",
        text: "Who is your favourite footballer? What do you love about the way they play?",
        hint: "Is it the way they run? Their skills? How they celebrate?",
      },
    ],
  },
  {
    id: "My Big Dream",
    title: "My Big Dream",
    emoji: "🚀",
    intro: "Every great footballer started with a dream. What's yours?",
    colour: "#8b5cf6",
    questions: [
      {
        emoji: "🏟️",
        text: "What kind of footballer do you want to be when you grow up? Tell me your biggest dream!",
        hint: "Imagine it's a cup final and you're playing. What happens?",
      },
      {
        emoji: "❤️",
        text: "Who do you want to say a big THANK YOU to for helping you get to the academy?",
        hint: "A mum, dad, coach, friend — who believed in you first?",
      },
      {
        emoji: "✉️",
        text: "If you could send a message to yourself as a future professional footballer, what would you say?",
        hint: "What do you want your future self to remember about right now?",
      },
    ],
  },
];
