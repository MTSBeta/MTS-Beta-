/**
 * Hybrid question banks for specific position combinations.
 *
 * Key format: two position IDs sorted alphabetically, joined with "-".
 * e.g. CB + RB → "CB-RB"  |  CDM + CM → "CDM-CM"
 *
 * These questions are written specifically for players who operate
 * across both roles and should surface before the standard single-position banks.
 */

import type { JourneyQuestion } from "./questions";

export type HybridBank = JourneyQuestion[];

export const HYBRID_QUESTION_BANKS: Record<string, HybridBank> = {

  // ── CB / RB ──────────────────────────────────────────────────────────────
  "CB-RB": [
    {
      type: "select",
      emoji: "🔀",
      text: "You're asked to play right back today after spending most of the season at centre back. A quick winger is running at you from wide. What's different about how you defend this compared to defending centrally?",
      hint: "Coaches want to know you can adapt — not just copy your usual style in a different spot.",
      options: [
        "I'm conscious I can't get tight too early — I need to jockey and stay goal-side rather than going to ground",
        "The main difference is I have to think about the touchline as a tool — I can use it to my advantage",
        "I rely on the same principles as centrally but I'm more aware of the space behind me on the outside",
      ],
      followUps: [
        {
          triggerOption: "I'm conscious I can't get tight too early — I need to jockey and stay goal-side rather than going to ground",
          question: "The winger cuts back inside onto their left foot. You're goal-side but they've created half a yard. Do you stay compact or try to block the cross? What does your body do?",
          prompts: ["Where are your hands?", "What are you reading in their movement?", "What's your first priority?"],
        },
      ],
    },
    {
      type: "voice-text",
      emoji: "🧭",
      text: "When you play right back, how do you decide when to push up and join the attack versus staying in a deeper defensive cover position?",
      prompts: ["What are you reading in the game?", "Does the score change it?", "What tells you it's safe to go?"],
    },
  ],

  // ── CB / CDM ─────────────────────────────────────────────────────────────
  "CB-CDM": [
    {
      type: "select",
      emoji: "🔁",
      text: "Your team is in a deep defensive shape and you're playing the holding midfield role today. The opponents are building patiently and one of their central midfielders keeps dropping between your lines. Do you step to them or hold your position?",
      hint: "This is the exact dilemma that breaks defensive structures — how you handle it defines the team's stability.",
      options: [
        "I step to them — I can't let them receive comfortably and face goal in the pocket",
        "I hold my position and force my striker to press — I trust the shape will deal with it",
        "I move towards them without fully stepping — I show them back and stay connected to both lines",
      ],
      followUps: [
        {
          triggerOption: "I step to them — I can't let them receive comfortably and face goal in the pocket",
          question: "You step and they play it past you first time into the space you've vacated. What happens next and what do you communicate?",
          prompts: ["Who needs to cover?", "What do you shout?", "How quickly can you recover?"],
        },
      ],
    },
  ],

  // ── CDM / CM ─────────────────────────────────────────────────────────────
  "CDM-CM": [
    {
      type: "select",
      emoji: "⚙️",
      text: "You're playing in a double pivot with one other central midfielder. The ball is with your centre backs. How do you position yourself to give the clearest picture of what to do next?",
      hint: "The way you move without the ball decides whether the build-up stalls or flows.",
      options: [
        "I stay deep — I want to offer the simple option and keep possession moving",
        "I split wide to overload the half-space and take their press out of shape",
        "I work to be between the lines — I want them to play into me even if it's risky",
      ],
      followUps: [
        {
          triggerOption: "I work to be between the lines — I want them to play into me even if it's risky",
          question: "The centre back plays it into your feet and you're immediately pressed from behind and in front. What's your priority — protect, turn, or release?",
          prompts: ["What's your body shape as the ball arrives?", "What have you already scanned for?", "How do you buy yourself time?"],
        },
      ],
    },
    {
      type: "voice-text",
      emoji: "🔄",
      text: "How do you manage the balance between screening the backline and getting forward yourself? When do you stay and when do you go?",
      prompts: ["What cues tell you it's safe to push?", "How do you communicate your intention to the other midfielder?", "What changes when your team is chasing the game?"],
    },
  ],

  // ── CM / CAM ─────────────────────────────────────────────────────────────
  "CAM-CM": [
    {
      type: "select",
      emoji: "🎯",
      text: "Your team has the ball in a central area and the opposition is well-organised in a mid-block. You're playing the 8 today but you've also played the 10. What do you do to unlock them?",
      hint: "This is the question top midfielders ask themselves every time the game slows down.",
      options: [
        "I look to receive between the lines and drive at them — force them to commit to me",
        "I play the give-and-go with the striker to break the line quickly with combinations",
        "I go wide to create overloads and drag the block sideways to open space in behind",
      ],
      followUps: [
        {
          triggerOption: "I play the give-and-go with the striker to break the line quickly with combinations",
          question: "The striker lays it off to you but you're closed down immediately from two angles. You've got half a second to decide. What do you do?",
          prompts: ["Do you play first time or take a touch?", "Where's your body facing?", "What's the reward if you get it right versus the risk if you get it wrong?"],
        },
      ],
    },
    {
      type: "voice-text",
      emoji: "🧠",
      text: "When you play as an 8 versus a 10, what changes about how you see your job without the ball? Walk me through the difference.",
      prompts: ["Where do you press from?", "What responsibilities shift?", "Does it change how you read transitions?"],
    },
  ],

  // ── LW / ST or RW / ST ───────────────────────────────────────────────────
  "LW-ST": [
    {
      type: "select",
      emoji: "⚡",
      text: "You're in behind the defensive line and the ball is coming over the top for you. The angle means you'll receive it slightly wide. Do you take it on and shoot, cut back to a striker's run, or hold and wait for support?",
      hint: "How you read the scenario off the ball is the difference between a half-chance and a real one.",
      options: [
        "Take the ball early and drive at goal — I want to attack the angle before the keeper sets",
        "Check the striker's run first — if they're arriving late, a cut-back or pull-back is the best percentage ball",
        "Take a touch to set my body — get it out of my feet and pick the option that gives us the best outcome",
      ],
      followUps: [
        {
          triggerOption: "Check the striker's run first — if they're arriving late, a cut-back or pull-back is the best percentage ball",
          question: "You see the striker arriving. The defender is goal-side. Where exactly do you put the ball and what happens if it's overhit by a yard?",
          prompts: ["Near post pull-back or far post?", "Do you have time to look up again?", "What does the angle of the run tell you?"],
        },
      ],
    },
  ],

  "RW-ST": [
    {
      type: "select",
      emoji: "⚡",
      text: "You're in behind the defensive line and the ball is coming over the top for you. The angle means you'll receive it slightly wide. Do you take it on and shoot, cut back to a striker's run, or hold and wait for support?",
      hint: "How you read the scenario off the ball is the difference between a half-chance and a real one.",
      options: [
        "Take the ball early and drive at goal — I want to attack the angle before the keeper sets",
        "Check the striker's run first — if they're arriving late, a cut-back or pull-back is the best percentage ball",
        "Take a touch to set my body — get it out of my feet and pick the option that gives us the best outcome",
      ],
      followUps: [
        {
          triggerOption: "Check the striker's run first — if they're arriving late, a cut-back or pull-back is the best percentage ball",
          question: "You see the striker arriving. The defender is goal-side. Where exactly do you put the ball and what happens if it's overhit by a yard?",
          prompts: ["Near post pull-back or far post?", "Do you have time to look up again?", "What does the angle of the run tell you?"],
        },
      ],
    },
  ],

  // ── CAM / ST ─────────────────────────────────────────────────────────────
  "CAM-ST": [
    {
      type: "select",
      emoji: "🎯",
      text: "You and the striker are the combination at the top of the team. The ball arrives to you in the pocket behind their striker. What do you want from the striker in that moment?",
      hint: "The best 10–9 combinations work without words because they already know.",
      options: [
        "I want them to run in behind immediately — I'll play it first time through the line",
        "I want them to come short so we can combine and break the press together",
        "I want them to stay where they are — their run has pulled the centre-back and I'm going myself",
      ],
      followUps: [
        {
          triggerOption: "I want them to run in behind immediately — I'll play it first time through the line",
          question: "You play the through ball. The striker's run is perfect but the pass is a yard behind them. They can only just reach it. What's the quality of that pass telling the coaches about this combination?",
          prompts: ["Is a yard behind good enough?", "What would a perfect weight on the ball have done differently?", "How do you and the striker work on this?"],
        },
      ],
    },
  ],

  // ── LW / RW ──────────────────────────────────────────────────────────────
  "LW-RW": [
    {
      type: "voice-text",
      emoji: "🔀",
      text: "You play both wings comfortably. What actually changes about your game when you switch sides — and is there one side where you feel genuinely more dangerous?",
      prompts: ["What do you do differently 1v1 on each side?", "Does the direction of your cut change how you're defended?", "What does each side give you that the other doesn't?"],
    },
  ],

  // ── LB / LW ──────────────────────────────────────────────────────────────
  "LB-LW": [
    {
      type: "select",
      emoji: "🏃",
      text: "You're playing left back and the opposition have a narrow shape. Your left winger has drifted inside. Now there's a huge space in the channel on your side. How much do you commit to exploiting it?",
      hint: "This is the modern left back dilemma. Your answer shows how well you understand positional risk.",
      options: [
        "I push high and wide — I want to be an extra attacker in that space and put crosses in",
        "I advance but stay ready to recover quickly — half a push, not a full gamble",
        "I stay disciplined and let our winger drift back out — I don't want to leave the channel exposed",
      ],
      followUps: [
        {
          triggerOption: "I push high and wide — I want to be an extra attacker in that space and put crosses in",
          question: "You've pushed up. We lose the ball and they're counter-attacking into the space you've left. What's your sprint priority and what do you need from the centre back?",
          prompts: ["Do you chase or recover to a zone?", "Who's covering while you get back?", "What do you shout?"],
        },
      ],
    },
  ],

  // ── RB / RW ──────────────────────────────────────────────────────────────
  "RB-RW": [
    {
      type: "select",
      emoji: "🏃",
      text: "You're playing right back and the opposition have a narrow shape. Your right winger has drifted inside. Now there's a huge space in the channel on your side. How much do you commit to exploiting it?",
      hint: "This is the modern full-back dilemma. Your answer shows how well you understand positional risk.",
      options: [
        "I push high and wide — I want to be an extra attacker in that space and put crosses in",
        "I advance but stay ready to recover quickly — half a push, not a full gamble",
        "I stay disciplined and let our winger drift back out — I don't want to leave the channel exposed",
      ],
      followUps: [
        {
          triggerOption: "I push high and wide — I want to be an extra attacker in that space and put crosses in",
          question: "You've pushed up. We lose the ball and they're counter-attacking into the space you've left. What's your sprint priority and what do you need from the centre back?",
          prompts: ["Do you chase or recover to a zone?", "Who's covering while you get back?", "What do you shout?"],
        },
      ],
    },
  ],

  // ── CF / ST ──────────────────────────────────────────────────────────────
  "CF-ST": [
    {
      type: "voice-text",
      emoji: "🎯",
      text: "You play both the target forward and the striker roles. When you're asked to hold the ball up rather than run in behind, what changes about how you prepare for and receive the ball?",
      prompts: ["How does your body shape change?", "What do you want from the pass?", "What are you scanning for before it arrives?"],
    },
  ],
};
