import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import {
  playersTable,
  playerJourneyResponsesTable,
  stakeholderLinksTable,
  stakeholderResponsesTable,
  staffSubmissionsTable,
  academyStaffTable,
} from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";

const DEMO_MARKER_CODE = "PLY-DEMO-001";
const DEMO_ACADEMY_KEY = "arsenal";

const DEMO_PLAYERS = [
  {
    playerName: "Marcus Webb",
    age: 16,
    shirtNumber: 9,
    position: "Striker",
    ageGroup: "U16",
    accessCode: "PLY-DEMO-001",
    parentCode: "PAR-DEMO-001",
    status: "story_complete",
  },
  {
    playerName: "Jamie Torres",
    age: 15,
    shirtNumber: 8,
    position: "Central Midfielder",
    ageGroup: "U15",
    accessCode: "PLY-DEMO-002",
    parentCode: "PAR-DEMO-002",
    status: "story_complete",
  },
  {
    playerName: "Ethan Clarke",
    age: 14,
    shirtNumber: 5,
    position: "Centre Back",
    ageGroup: "U14",
    accessCode: "PLY-DEMO-003",
    parentCode: "PAR-DEMO-003",
    status: "journey_complete",
  },
  {
    playerName: "Noah Patel",
    age: 17,
    shirtNumber: 11,
    position: "Right Winger",
    ageGroup: "U17",
    accessCode: "PLY-DEMO-004",
    parentCode: "PAR-DEMO-004",
    status: "journey_complete",
  },
  {
    playerName: "Callum Hughes",
    age: 13,
    shirtNumber: 1,
    position: "Goalkeeper",
    ageGroup: "U13",
    accessCode: "PLY-DEMO-005",
    parentCode: "PAR-DEMO-005",
    status: "journey_started",
  },
  {
    playerName: "Declan Murphy",
    age: 16,
    shirtNumber: 3,
    position: "Left Back",
    ageGroup: "U16",
    accessCode: "PLY-DEMO-006",
    parentCode: "PAR-DEMO-006",
    status: "journey_started",
  },
  {
    playerName: "Luca Ferrari",
    age: 14,
    shirtNumber: 10,
    position: "Attacking Midfielder",
    ageGroup: "U14",
    accessCode: "PLY-DEMO-007",
    parentCode: "PAR-DEMO-007",
    status: "registered",
  },
  {
    playerName: "Tyler Brooks",
    age: 15,
    shirtNumber: 6,
    position: "Defensive Midfielder",
    ageGroup: "U15",
    accessCode: "PLY-DEMO-008",
    parentCode: "PAR-DEMO-008",
    status: "registered",
  },
  {
    playerName: "Archie Mills",
    age: 8,
    shirtNumber: 7,
    position: "Forward",
    ageGroup: "U9",
    accessCode: "PLY-DEM0U9",
    parentCode: "PAR-DEM0U9",
    status: "registered",
  },
  {
    playerName: "Finley Grant",
    age: 13,
    shirtNumber: 4,
    position: "Centre Midfielder",
    ageGroup: "U13",
    accessCode: "PLY-DEMU13",
    parentCode: "PAR-DEMU13",
    status: "registered",
  },
];

function journeyResponsesFor(
  playerId: string,
  playerName: string,
  position: string,
  variant: "full" | "partial"
) {
  const [first] = playerName.split(" ");
  const fullStages = [
    {
      stage: "Your World",
      responses: [
        {
          questionNumber: 1,
          questionText:
            "Close your eyes. Think of one game — one specific moment — that you keep going back to when you think about why you play. Tell me about it.",
          answerText: `There was a game away at Brentford, about two years ago. We were 2-0 down with ten minutes left. I picked the ball up on the halfway line, drove past two players and finished low into the corner. The way the crowd went quiet — our own lads going absolutely mad — I still feel it now. That's why I play.`,
        },
        {
          questionNumber: 2,
          questionText:
            "Pick the words that best describe you — not as a footballer, but as a person.",
          answerText: "Determined, Competitive, Resilient, Hard-working, Bold",
        },
        {
          questionNumber: 3,
          questionText:
            "Describe how you actually play — not your position, your game. The way you move, how you think on the pitch.",
          answerText: `I play fast. I like to get the ball and commit to runs before the defender can set. My best moments come when I'm pressing high — I can sense when a goalkeeper or centre-back is about to make a mistake and I'm already moving. What I'm still working on is holding the ball up better when the game slows down.`,
        },
        {
          questionNumber: 4,
          questionText:
            "Who's the first person you tell when something great happens in football? What do they usually say?",
          answerText: `My mum. Always. She's at every game, even the ones that are an hour away. She always says the same thing: "I knew before you did." I think she means she could tell from how I was walking out. She's always been like that.`,
        },
        {
          questionNumber: 5,
          questionText:
            "Is there something at home that means something to you about football? A poster, notebook, old kit — anything.",
          answerText: `I've got a framed photo from when I was seven — first time I played for a proper club. Massive kit, boots too big, grinning like an idiot. I put it on the wall myself when I was about twelve. Reminds me what it was actually about before all the pressure started.`,
        },
      ],
    },
    {
      stage: "The Invisible Days",
      responses: [
        {
          questionNumber: 1,
          questionText:
            "Tell me about a time you didn't make the team. The actual moment you found out — where were you?",
          answerText: `Coach read out the squad in the car park after Thursday training. I just stood there while everyone else started talking about the game. Drove home in silence. I didn't cry, I just felt numb. Took me about a week to actually think straight about it — why I wasn't picked, what I needed to change.`,
        },
        {
          questionNumber: 2,
          questionText:
            "What do you do in training that nobody sees? The extra work — before or after everyone else goes home.",
          answerText: `I stay behind at least twice a week after the session ends. It's usually finishing drills — I set cones up and run the same patterns until the groundsman kicks me out. Nobody asks me to. I just know that's where my goals come from.`,
        },
        {
          questionNumber: 3,
          questionText:
            "When you feel overlooked or undervalued at the club, you tend to…",
          answerText: "Put my head down and work harder to prove myself 💪",
        },
        {
          questionNumber: 4,
          questionText:
            "What is the thing about you as a player that goes unnoticed? The quality that people just don't see?",
          answerText: `My pressing triggers. I'm already scanning three moves ahead — I know when to go and when to hold off. Stats don't show that. Coaches notice goals and assists, but the number of times I've forced a mistake that led to something, that never gets written down anywhere.`,
        },
        {
          questionNumber: 5,
          questionText:
            "Who at this club really knows what you're made of — not just your ability, but you as a person?",
          answerText: `Steve, the U16s lead. He pulled me aside after a bad run of games last December and said: "I'm not worried about your form. I'm watching how you carry yourself in training. That tells me everything." He never just sees the results.`,
        },
      ],
    },
    {
      stage: "When It Broke",
      responses: [
        {
          questionNumber: 1,
          questionText:
            "Tell me about your worst stretch in football — not just a bad game, a bad period. What was going on?",
          answerText: `Last winter. I pulled my hamstring in November and missed eight weeks. When I came back I was half a yard slower than I thought I'd be, and my confidence just collapsed. I went four months without scoring. Four months. People started to question whether I was the same player.`,
        },
        {
          questionNumber: 2,
          questionText:
            "Describe the moment when it all felt like too much. Where were you, what were you doing?",
          answerText: `Sitting in the car after a match where I'd been taken off at half time. My dad didn't say anything. I didn't say anything. We sat there for about ten minutes before he drove off. I remember staring at my boots thinking: maybe they're right. Maybe this isn't it for me.`,
        },
        {
          questionNumber: 3,
          questionText:
            "When things were at their hardest, what kept you going? Pick everything that rings true.",
          answerText:
            "My family and the sacrifices they'd made, My own stubborn refusal to quit, The love of the game that never left",
        },
        {
          questionNumber: 4,
          questionText:
            "What does your body actually do when you're under real pressure in a game?",
          answerText: `My legs go tight. There's a thing that happens in my stomach before a big chance — like it drops. I've learned to breathe into it rather than fight it. If I try to rush past it, I'm already out of sync before I've hit the ball.`,
        },
        {
          questionNumber: 5,
          questionText:
            "Who found out you were really struggling — and how did they find out?",
          answerText: `My mum saw it before I told her anything. She said I'd stopped eating properly after training — just picking at food — and I was going to bed earlier than usual. She sat me down and just asked straight: what's actually happening? I didn't plan to say it. It just came out.`,
        },
      ],
    },
    {
      stage: "The Turn",
      responses: [
        {
          questionNumber: 1,
          questionText:
            "Was there one person whose words found you at exactly the right moment? Who were they, and what did they say?",
          answerText: `Steve. He texted me on a Sunday morning — I hadn't played the day before. Just said: "You're not someone who waits to be rescued. You already know what to do." That was it. No pep talk. I don't know why, but that landed differently than anything else.`,
        },
        {
          questionNumber: 2,
          questionText:
            "Tell me about the quiet moment before things changed — not the big game, the moment before it.",
          answerText: `The morning of my first start back after injury. I went to the pitch an hour before anyone else. Just stood in the centre circle for a few minutes. Reminded myself: I've done this before. I know who I am here. Something settled.`,
        },
        {
          questionNumber: 3,
          questionText:
            "What changed things for you? Pick everything that actually shifted something.",
          answerText:
            "A private decision I made on my own, A mental shift in how I thought about mistakes, A performance that reminded me who I was",
        },
        {
          questionNumber: 4,
          questionText:
            "Describe the first training session or game where you felt like yourself again.",
          answerText: `It was a Tuesday morning session in February. We were doing high-press drills and I went in on a 50-50 that I would have backed away from two months before. I won it, played the ball through, and just — laughed. First time I'd laughed in training in months.`,
        },
        {
          questionNumber: 5,
          questionText:
            "Looking back at the hardest part — what do you understand now that you couldn't see when you were in the middle of it?",
          answerText: `That the doubt was part of it. That it's not real ambition if you only show up when things are going well. I thought I was falling behind. I was actually figuring out what I was made of.`,
        },
      ],
    },
    {
      stage: "Who You Are",
      responses: [
        {
          questionNumber: 1,
          questionText:
            "What are your strongest qualities — as a player AND as a person? Be proud and honest.",
          answerText:
            "Never gives up no matter what, Works twice as hard as anyone, Passionate and emotionally connected, Mentally strong after setbacks",
        },
        {
          questionNumber: 2,
          questionText:
            "What's something true about you — as a footballer or as a person — that took you a long time to say out loud?",
          answerText: `That I'm scared of being average. Not scared of failing — scared of just being fine. It's driven a lot of things I'm not always proud of. I'm still working out what to do with it.`,
        },
        {
          questionNumber: 3,
          questionText:
            "If your closest teammates described you in the changing room — not on the pitch, in the changing room — what would they say?",
          answerText: `They'd say I'm loud. Always music on, always the one sorting the team playlist. They'd say I'm the first to hype someone up but also the first to call someone out if they're not at it. One of the lads calls me "The Standard" — not sure if it's a compliment or not.`,
        },
        {
          questionNumber: 4,
          questionText:
            "What keeps you here — at this club, doing this work — when part of you wants to walk away?",
          answerText: `Honestly? The lads. The staff. The feeling on a Thursday afternoon when training goes well and everyone's at it. That feeling doesn't happen anywhere else in my life.`,
        },
        {
          questionNumber: 5,
          questionText:
            "After everything you've been through — what do you know about yourself that you wouldn't trade for anything?",
          answerText: `That I come back. Every time. I don't always come back quickly or gracefully — but I come back. The injury, the bad run, the being dropped — none of it finished me. That's mine. No one can take that.`,
        },
      ],
    },
    {
      stage: "The Chapter Ahead",
      responses: [
        {
          questionNumber: 1,
          questionText:
            "What do you want to achieve this season — on the pitch and off it? Pick everything that matters to you.",
          answerText:
            "Score more goals / create more assists, Break into the first team / get more minutes, Stay injury-free all season, Become more consistent week to week",
        },
        {
          questionNumber: 2,
          questionText:
            "Where do you dream of playing one day? Pick every stage you want to stand on.",
          answerText: "Premier League, Champions League, World Cup, Wembley Stadium",
        },
        {
          questionNumber: 3,
          questionText:
            "Describe the specific moment — the ground, the game, the feeling in your body — when you'll know you've made it.",
          answerText: `Running out at the Emirates for my first senior home game. Hearing the crowd before I can see them. That's the image I keep coming back to. I've been to games there. I know what that noise does to you.`,
        },
        {
          questionNumber: 4,
          questionText:
            "What do you want written about you that has nothing to do with goals, appearances, or trophies?",
          answerText: `That I was someone younger players could look at and think: he went through it and kept going. That I was honest about the hard parts. That the lads actually wanted to play with me.`,
        },
        {
          questionNumber: 5,
          questionText:
            "If this chapter of your life had a title — right now, this season, this moment — what would it be?",
          answerText: `"The Return." Everything I'm doing right now is about coming back better.`,
        },
      ],
    },
  ];

  if (variant === "partial") {
    return fullStages.slice(0, 3).flatMap((stage) =>
      stage.responses.map((r) => ({ ...r, stage: stage.stage, playerId }))
    );
  }

  return fullStages.flatMap((stage) =>
    stage.responses.map((r) => ({ ...r, stage: stage.stage, playerId }))
  );
}

function parentResponsesFor(playerId: string, playerName: string, linkId: number) {
  const [first] = playerName.split(" ");
  return [
    {
      stakeholderLinkId: linkId,
      playerId,
      questionNumber: 1,
      questionText:
        "Describe a specific moment — at home, at a match, travelling back from training — when you saw something in your child that made you genuinely proud. What happened, and what did you observe in them?",
      answerText: `It wasn't a match moment, it was a Tuesday night in January. ${first} had been dropped from the squad that weekend and hadn't said much about it. I saw him in the garden at half six in the morning, just kicking a ball against the fence in the dark. Not angry — just working. I stood at the window for about five minutes before I let him know I was there. I didn't say anything. I didn't need to.`,
    },
    {
      stakeholderLinkId: linkId,
      playerId,
      questionNumber: 2,
      questionText:
        "What does your child look like at home when things aren't going well in football? What do they do, what do they say — and how do you usually notice they're struggling before they've said anything?",
      answerText: `He goes quiet at the table. Normally he talks through everything — games, training, teammates. When something's wrong, there's just silence. He still eats, still does everything, but the noise drops out of him. I've learned to leave about 24 hours before I try to open a conversation.`,
    },
    {
      stakeholderLinkId: linkId,
      playerId,
      questionNumber: 3,
      questionText:
        "Tell me about a conversation you've had with your child about football that has stayed with you. Where were you, what came up, and what was actually said?",
      answerText: `Driving home from a game he'd started and then been taken off. He finally said: "What if I'm just not good enough?" I didn't give him a pep talk. I said: "I don't know yet. But I know you're finding out." He was quiet for a while, then said: "That's fair." We didn't talk about football for the rest of the drive.`,
    },
    {
      stakeholderLinkId: linkId,
      playerId,
      questionNumber: 4,
      questionText:
        "What has this football journey asked of your family — the time, the commitment, the difficult moments? And what has kept you going through the harder periods?",
      answerText: `It's three or four evenings a week, weekends away, school holidays rearranged around fixtures. My partner and I have had to be very deliberate about making sure the other kids don't feel like everything revolves around football. What keeps us going is watching ${first} choose it — every single time, he chooses it. That's not us pushing. That comes from somewhere inside him.`,
    },
    {
      stakeholderLinkId: linkId,
      playerId,
      questionNumber: 5,
      questionText:
        "If you had to describe this player's journey to someone who has never met them, what would you want them to understand? What moments, habits, or qualities tell their truest story?",
      answerText: `That the game is not the whole story. The person who turns up at training the day after being dropped — that's who ${first} really is. He's not the easiest to live with when things are hard. But he never, ever quits. That's the thing I most want anyone working with him to understand.`,
    },
  ];
}

function staffSubmissionsFor(
  playerId: string,
  staffId: number,
  playerName: string
) {
  const [first] = playerName.split(" ");
  return [
    {
      staffId,
      playerId,
      role: "football_coaching",
      content: "Football coaching observations",
      metadata: {
        responses: [
          {
            questionNumber: 1,
            questionText:
              "Describe a specific moment in training or a match where this player demonstrated a key technical strength. What did you observe?",
            answerText: `In a possession drill last Thursday, ${first} pressed the ball three times in quick succession — each press was timed to the weight of the pass, not just the position of the ball. That's learned behaviour. He's reading the game two steps ahead of the press trigger. Outstanding technical awareness.`,
          },
          {
            questionNumber: 2,
            questionText:
              "What is this player's most consistent tactical behaviour that stands out during sessions?",
            answerText: `His runs in behind are always timed to the third man. He's not running to get the ball himself — he's creating space for someone else, and then arriving late into that space. Most players at this age are running for themselves.`,
          },
          {
            questionNumber: 3,
            questionText:
              "How does this player respond to coaching instructions during live play? Give a recent example.",
            answerText: `Last week I asked him to hold his run and play the wall pass instead of going alone. He got it first time and ran it perfectly the next three occasions. No ego, just application.`,
          },
          {
            questionNumber: 4,
            questionText:
              "What are the priority areas of technical or tactical development for this player over the next 3-6 months?",
            answerText: `His link-up play in tight areas when the game slows. When pressed high he sometimes tries the direct ball when there's a better option centrally. We're working on his patience and his ability to use his body to shield and turn.`,
          },
          {
            questionNumber: 5,
            questionText:
              "Describe this player's work rate, intensity, and commitment during a typical training week.",
            answerText: `Consistently at the top end of the group. He finishes sessions and stays. I've arrived to open up the training pitch twice this month and he's already been there — kicking against the side wall. That's not something we asked him to do.`,
          },
          {
            questionNumber: 6,
            questionText:
              "How does this player perform in competitive match situations compared to training environments?",
            answerText: `He raises his level for match day. There's a focus and a presence that you don't always see in training. He's one of those players who needs the stakes to be real before he's fully switched on. That's actually a good quality — he'll handle bigger pressure situations.`,
          },
          {
            questionNumber: 7,
            questionText:
              "What leadership qualities or team behaviours have you observed from this player?",
            answerText: `He sets the tone when things get tight. If we go behind, he's the one stepping up — geeing teammates up, taking responsibility for the next moment. The lads respond to him without being asked to.`,
          },
        ],
      },
    },
    {
      staffId,
      playerId,
      role: "psychology",
      content: "Psychology assessment",
      metadata: {
        responses: [
          {
            questionNumber: 1,
            questionText:
              "How does this player typically respond to pressure situations? Describe a specific observed pattern.",
            answerText: `${first} physically shuts down in the first five minutes of high-pressure, then recalibrates and comes through the other side of it better than most. The shutdown is brief — you can see it in his body language — but he self-manages back to the task. That's a real psychological skill.`,
          },
          {
            questionNumber: 2,
            questionText:
              "What is this player's approach to setbacks and mistakes during training or matches?",
            answerText: `He holds onto errors for about thirty seconds too long — you can see it in the jaw and the shoulders. But he has a self-reset mechanism: he deliberately makes a physical effort (a run, a press) right after a mistake. He's built that in himself. I've not seen many players at this level do that instinctively.`,
          },
          {
            questionNumber: 3,
            questionText:
              "Describe the player's self-awareness and emotional regulation. How do they manage their emotions?",
            answerText: `High self-awareness, which is unusual. He knows when he's spiralling — he's told me directly. His regulation strategy is external (movement, activity) rather than internal (thought). That makes him better suited to high-intensity environments where you can't stop and think.`,
          },
          {
            questionNumber: 4,
            questionText:
              "What motivational patterns have you observed? What drives this player and what diminishes their engagement?",
            answerText: `He's strongly mastery-motivated — he wants to be better than he was, not better than others. What diminishes him is feeling invisible. Not being told he's done well — being not spoken to at all. The silence reads as rejection to him. Worth being aware of.`,
          },
          {
            questionNumber: 5,
            questionText:
              "How does this player interact with peers during challenging group situations?",
            answerText: `He takes up space in a positive way — organises, encourages, sometimes challenges. Can be too loud when others need to think. Learning to modulate that is the development edge for him socially.`,
          },
          {
            questionNumber: 6,
            questionText:
              "What mental skills or psychological areas would most benefit this player's development?",
            answerText: `Quietening the internal commentator during slower phases of games. He over-analyzes between moments. Teaching him to stay present rather than narrate what just happened would free up significant mental resource.`,
          },
          {
            questionNumber: 7,
            questionText:
              "Describe any notable growth or changes you've observed in this player's psychological development.",
            answerText: `The most significant shift has been post-injury. He came back from his hamstring layoff with a demonstrably different relationship to setback. He's stopped fighting the feeling and started using it. That's a meaningful maturation.`,
          },
        ],
      },
    },
  ];
}

/**
 * The four club support roles for the demo.
 * Education Lead doubles as Super Admin (system_role = 'academy_admin').
 * Each of the other three leads has system_role = 'staff' and a specific question_role.
 */
const DEMO_LEADS = [
  {
    email: "edu@arsenal.co.uk",
    fullName: "Sarah Mitchell",
    password: "edu123",
    systemRole: "academy_admin",
    questionRole: "education",
    jobTitle: "Education Lead",
  },
  {
    email: "psych@arsenal.co.uk",
    fullName: "Dr. Sarah Evans",
    password: "psych123",
    systemRole: "staff",
    questionRole: "psychology",
    jobTitle: "Psychology Lead",
  },
  {
    email: "welfare@arsenal.co.uk",
    fullName: "James Crawford",
    password: "welfare123",
    systemRole: "staff",
    questionRole: "player_care",
    jobTitle: "Player Care & Welfare Lead",
  },
  {
    email: "football@arsenal.co.uk",
    fullName: "Marcus Reid",
    password: "football123",
    systemRole: "staff",
    questionRole: "football_coaching",
    jobTitle: "Football Development Lead",
  },
];

async function seedDemoStaffAccounts(academyId: number) {
  for (const member of DEMO_LEADS) {
    const existing = await db.execute(
      sql`SELECT id, question_role FROM academy_staff WHERE email = ${member.email} LIMIT 1`
    );
    const rows = existing.rows as any[];
    if (rows.length > 0) {
      // If account exists but missing question_role, patch it
      if (!rows[0].question_role) {
        await db.execute(
          sql`UPDATE academy_staff SET question_role = ${member.questionRole}, job_title = ${member.jobTitle}
              WHERE email = ${member.email}`
        );
        console.log(`[demo-seed] Updated question_role for: ${member.email}`);
      }
      continue;
    }
    const hash = await bcrypt.hash(member.password, 10);
    await db.execute(
      sql`INSERT INTO academy_staff (academy_id, full_name, email, auth_user_id, system_role, question_role, job_title, is_active)
          VALUES (${academyId}, ${member.fullName}, ${member.email}, ${hash}, ${member.systemRole}, ${member.questionRole}, ${member.jobTitle}, true)`
    );
    console.log(`[demo-seed] Created ${member.jobTitle}: ${member.email}`);
  }
}

export async function seedDemoData() {
  try {
    const academyResult = await db.execute(
      sql`SELECT id, key, name FROM academies WHERE key = ${DEMO_ACADEMY_KEY} LIMIT 1`
    );

    if (!academyResult.rows || academyResult.rows.length === 0) {
      console.log("[demo-seed] Arsenal academy not found — run academy seed first.");
      return;
    }

    const academy = academyResult.rows[0] as { id: number; key: string; name: string };

    await seedDemoStaffAccounts(academy.id);

    const adminResult = await db
      .select()
      .from(academyStaffTable)
      .where(eq(academyStaffTable.academyId, academy.id))
      .limit(1);

    if (adminResult.length === 0) {
      console.log("[demo-seed] No admin account for Arsenal found — run admin seed first.");
      return;
    }

    const adminStaff = adminResult[0];

    for (const playerData of DEMO_PLAYERS) {
      const alreadyExists = await db
        .select({ id: playersTable.id })
        .from(playersTable)
        .where(eq(playersTable.accessCode, playerData.accessCode))
        .limit(1);

      if (alreadyExists.length > 0) {
        continue;
      }

      console.log(`[demo-seed] Inserting missing demo player: ${playerData.playerName}`);

      const [player] = await db
        .insert(playersTable)
        .values({
          playerName: playerData.playerName,
          age: playerData.age,
          shirtNumber: playerData.shirtNumber,
          academyKey: academy.key,
          academyName: academy.name,
          position: playerData.position,
          ageGroup: playerData.ageGroup,
          accessCode: playerData.accessCode,
          parentCode: playerData.parentCode,
          status: playerData.status,
        })
        .returning();

      console.log(`[demo-seed] Created player: ${player.playerName} (${player.accessCode})`);

      const needsFullJourney = ["story_complete", "journey_complete"].includes(playerData.status);
      const needsPartialJourney = playerData.status === "journey_started";

      if (needsFullJourney || needsPartialJourney) {
        const responses = journeyResponsesFor(
          player.id,
          player.playerName,
          player.position,
          needsPartialJourney ? "partial" : "full"
        );

        if (responses.length > 0) {
          await db.insert(playerJourneyResponsesTable).values(responses);
          console.log(`[demo-seed] Inserted ${responses.length} journey responses for ${player.playerName}`);
        }
      }

      if (playerData.status === "story_complete") {
        const [parentLink] = await db
          .insert(stakeholderLinksTable)
          .values({
            playerId: player.id,
            type: "parent",
            label: "Parent / Guardian",
            code: `SH-${playerData.parentCode}`,
            submitted: true,
          })
          .returning();

        const parentResps = parentResponsesFor(player.id, player.playerName, parentLink.id);
        await db.insert(stakeholderResponsesTable).values(parentResps);
        console.log(`[demo-seed] Inserted parent submission for ${player.playerName}`);

        const staffSubs = staffSubmissionsFor(player.id, adminStaff.id, player.playerName);
        for (const sub of staffSubs) {
          await db.insert(staffSubmissionsTable).values(sub);
        }
        console.log(`[demo-seed] Inserted ${staffSubs.length} staff submissions for ${player.playerName}`);
      }
    }

    console.log("[demo-seed] Demo data seeded successfully.");
  } catch (err) {
    console.error("[demo-seed] Failed to seed demo data:", err);
  }
}
