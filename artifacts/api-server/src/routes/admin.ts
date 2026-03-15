import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  playersTable,
  playerJourneyResponsesTable,
  stakeholderLinksTable,
  stakeholderResponsesTable,
} from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import { desc } from "drizzle-orm";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE ?? "metime2024";

const router: IRouter = Router();

router.get("/admin/players", async (req, res) => {
  const { passcode } = req.query;
  if (passcode !== ADMIN_PASSCODE) {
    res.status(401).json({ error: "Invalid passcode" });
    return;
  }

  const players = await db
    .select()
    .from(playersTable)
    .orderBy(desc(playersTable.createdAt));

  // Count stakeholder links and submissions per player
  const linkCounts = players.length
    ? await db
        .select({
          playerId: stakeholderLinksTable.playerId,
          total: sql<number>`count(*)::int`,
          submitted: sql<number>`count(*) FILTER (WHERE submitted = true)::int`,
        })
        .from(stakeholderLinksTable)
        .groupBy(stakeholderLinksTable.playerId)
    : [];

  const countMap = new Map(linkCounts.map((r) => [r.playerId, r]));

  const result = players.map((p) => {
    const counts = countMap.get(p.id) ?? { total: 0, submitted: 0 };
    return {
      id: p.id,
      playerName: p.playerName,
      academyName: p.academyName,
      age: p.age,
      position: p.position,
      status: p.status,
      stakeholderCounts: {
        total: counts.total,
        submitted: counts.submitted,
      },
      createdAt: p.createdAt.toISOString(),
    };
  });

  res.json(result);
});

router.get("/admin/players/:playerId", async (req, res) => {
  const { passcode } = req.query;
  if (passcode !== ADMIN_PASSCODE) {
    res.status(401).json({ error: "Invalid passcode" });
    return;
  }

  const { playerId } = req.params;

  const [player] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.id, playerId))
    .limit(1);

  if (!player) {
    res.status(404).json({ error: "Player not found" });
    return;
  }

  const journeyResponses = await db
    .select()
    .from(playerJourneyResponsesTable)
    .where(eq(playerJourneyResponsesTable.playerId, playerId))
    .orderBy(playerJourneyResponsesTable.questionNumber);

  const stakeholderLinks = await db
    .select()
    .from(stakeholderLinksTable)
    .where(eq(stakeholderLinksTable.playerId, playerId))
    .orderBy(stakeholderLinksTable.id);

  const stakeholderResponseRows = await db
    .select()
    .from(stakeholderResponsesTable)
    .where(eq(stakeholderResponsesTable.playerId, playerId))
    .orderBy(stakeholderResponsesTable.questionNumber);

  // Group responses by stakeholder link
  const responsesByLink = new Map<number, typeof stakeholderResponseRows>();
  for (const r of stakeholderResponseRows) {
    const arr = responsesByLink.get(r.stakeholderLinkId) ?? [];
    arr.push(r);
    responsesByLink.set(r.stakeholderLinkId, arr);
  }

  const stakeholderResponses = stakeholderLinks
    .filter((l) => l.submitted)
    .map((l) => ({
      stakeholderLinkId: l.id,
      type: l.type,
      label: l.label,
      responses: (responsesByLink.get(l.id) ?? []).map((r) => ({
        questionNumber: r.questionNumber,
        questionText: r.questionText,
        answerText: r.answerText,
        audioUrl: r.audioUrl,
        mediaUrls: (r.mediaUrls as string[]) ?? [],
      })),
    }));

  res.json({
    player: {
      id: player.id,
      playerName: player.playerName,
      age: player.age,
      shirtNumber: player.shirtNumber,
      academyKey: player.academyKey,
      academyName: player.academyName,
      position: player.position,
      accessCode: player.accessCode,
      status: player.status,
      createdAt: player.createdAt.toISOString(),
    },
    journeyResponses: journeyResponses.map((r) => ({
      stage: r.stage,
      questionNumber: r.questionNumber,
      questionText: r.questionText,
      answerText: r.answerText,
      audioUrl: r.audioUrl,
      mediaUrls: (r.mediaUrls as string[]) ?? [],
    })),
    stakeholderLinks: stakeholderLinks.map((l) => ({
      id: l.id,
      playerId: l.playerId,
      type: l.type,
      label: l.label,
      code: l.code,
      submitted: l.submitted,
      createdAt: l.createdAt.toISOString(),
    })),
    stakeholderResponses,
  });
});

export default router;
