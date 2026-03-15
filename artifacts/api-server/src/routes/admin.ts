import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  playersTable,
  playerJourneyResponsesTable,
  parentResponsesTable,
  coachResponsesTable,
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

  // Check which players have parent/coach responses
  const playerIds = players.map((p) => p.id);

  const parentCounts = playerIds.length
    ? await db
        .select({
          playerId: parentResponsesTable.playerId,
          count: sql<number>`count(*)::int`,
        })
        .from(parentResponsesTable)
        .groupBy(parentResponsesTable.playerId)
    : [];

  const coachCounts = playerIds.length
    ? await db
        .select({
          playerId: coachResponsesTable.playerId,
          count: sql<number>`count(*)::int`,
        })
        .from(coachResponsesTable)
        .groupBy(coachResponsesTable.playerId)
    : [];

  const parentSet = new Set(parentCounts.filter((r) => r.count > 0).map((r) => r.playerId));
  const coachSet = new Set(coachCounts.filter((r) => r.count > 0).map((r) => r.playerId));

  const result = players.map((p) => ({
    id: p.id,
    playerName: p.playerName,
    academyName: p.academyName,
    age: p.age,
    position: p.position,
    status: p.status,
    parentSubmitted: parentSet.has(p.id),
    coachSubmitted: coachSet.has(p.id),
    createdAt: p.createdAt.toISOString(),
  }));

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

  const parentResponses = await db
    .select()
    .from(parentResponsesTable)
    .where(eq(parentResponsesTable.playerId, playerId))
    .orderBy(parentResponsesTable.questionNumber);

  const coachResponses = await db
    .select()
    .from(coachResponsesTable)
    .where(eq(coachResponsesTable.playerId, playerId))
    .orderBy(coachResponsesTable.questionNumber);

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
      parentCode: player.parentCode,
      coachCode: player.coachCode,
      status: player.status,
      createdAt: player.createdAt.toISOString(),
    },
    journeyResponses: journeyResponses.map((r) => ({
      stage: r.stage,
      questionNumber: r.questionNumber,
      questionText: r.questionText,
      answerText: r.answerText,
    })),
    parentResponses: parentResponses.map((r) => ({
      questionNumber: r.questionNumber,
      questionText: r.questionText,
      answerText: r.answerText,
    })),
    coachResponses: coachResponses.map((r) => ({
      questionNumber: r.questionNumber,
      questionText: r.questionText,
      answerText: r.answerText,
    })),
  });
});

export default router;
