export interface Position {
  id: string;
  displayName: string;
  archetype: string;
  challenge: string;
  storyHook: string;
}

export const POSITIONS: Position[] = [
  {
    id: "GK",
    displayName: "Goalkeeper",
    archetype: "The Last Line",
    challenge: "Carrying the weight of every mistake alone — and coming back anyway.",
    storyHook: "One error. Thousands of eyes. How do you get back up when you can't hide?"
  },
  {
    id: "CB",
    displayName: "Centre Back",
    archetype: "The Defensive Pillar",
    challenge: "Leading under pressure when no one is watching you unless something goes wrong.",
    storyHook: "You keep everything together. But who's keeping you together?"
  },
  {
    id: "LB",
    displayName: "Left Back",
    archetype: "The Wingback Warrior",
    challenge: "Proving your value in a role that rarely gets the credit it deserves.",
    storyHook: "You do the work in the shadows. The question is: how long before someone turns the lights on?"
  },
  {
    id: "RB",
    displayName: "Right Back",
    archetype: "The Wingback Warrior",
    challenge: "Proving your value in a role that rarely gets the credit it deserves.",
    storyHook: "You do the work in the shadows. The question is: how long before someone turns the lights on?"
  },
  {
    id: "CDM",
    displayName: "Defensive Midfielder",
    archetype: "The Engine Room",
    challenge: "Being the player nobody notices until you're missing — and living with that.",
    storyHook: "The team runs on you. So why does it sometimes feel like you're invisible?"
  },
  {
    id: "CM",
    displayName: "Central Midfielder",
    archetype: "The Heartbeat",
    challenge: "Controlling the tempo when everything around you is chaos.",
    storyHook: "You see the game differently. The challenge is making everyone else see what you see."
  },
  {
    id: "CAM",
    displayName: "Attacking Midfielder",
    archetype: "The Playmaker",
    challenge: "Carrying the creative burden — and not crumbling when the ideas don't come.",
    storyHook: "You're expected to unlock everything. What happens when you feel locked out yourself?"
  },
  {
    id: "LW",
    displayName: "Left Winger",
    archetype: "The Wide Magician",
    challenge: "Taking risks in front of everyone — and not letting fear of failure shrink your game.",
    storyHook: "You live and die by moments. How you respond to the bad ones tells the whole story."
  },
  {
    id: "RW",
    displayName: "Right Winger",
    archetype: "The Wide Magician",
    challenge: "Taking risks in front of everyone — and not letting fear of failure shrink your game.",
    storyHook: "You live and die by moments. How you respond to the bad ones tells the whole story."
  },
  {
    id: "CF",
    displayName: "Centre Forward",
    archetype: "The Target Man",
    challenge: "Holding the line alone at the top — physically, mentally, relentlessly.",
    storyHook: "You take the hits so others can score. When do you get to be the story?"
  },
  {
    id: "ST",
    displayName: "Striker",
    archetype: "The Predator",
    challenge: "Staying ruthless when the goals dry up — and the doubts get loud.",
    storyHook: "Strikers are judged by one thing. What defines you when that thing won't come?"
  },
];
