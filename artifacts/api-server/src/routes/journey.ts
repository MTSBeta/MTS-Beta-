import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable, playerJourneyResponsesTable } from "@workspace/db/schema";
import { SaveJourneyResponsesBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";
import { logResponses, updateWorkflowStatus, syncPlayer } from "../lib/googleSheets.js";

const router: IRouter = Router();

router.post("/players/:playerId/journey", async (req, res) => {
  const { playerId } = req.params;

  const parsed = SaveJourneyResponsesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [player] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.id, playerId))
    .limit(1);

  if (!player) {
    res.status(404).json({ error: "Player not found" });
    return;
  }

  await db
    .delete(playerJourneyResponsesTable)
    .where(eq(playerJourneyResponsesTable.playerId, playerId));

  const rows = parsed.data.responses.map((r) => ({
    playerId,
    stage: r.stage,
    questionNumber: r.questionNumber,
    questionText: r.questionText,
    answerText: r.answerText ?? "",
    audioUrl: r.audioUrl ?? null,
    mediaUrls: r.mediaUrls ?? [],
  }));

  if (rows.length > 0) {
    await db.insert(playerJourneyResponsesTable).values(rows);
  }

  res.json({ saved: rows.length });

  // Sync to Google Sheets (fire-and-forget — never blocks the response)
  logResponses(
    rows.map((r) => ({
      playerId: player.accessCode,
      playerName: player.playerName,
      role: "player",
      questionId: `${r.stage}-Q${r.questionNumber}`,
      stage: r.stage,
      questionText: r.questionText,
      responseType: "long-text",
      responseValue: r.answerText,
      source: "portal",
    }))
  ).catch(e => console.error("[sheets] logResponses failed:", e));

  syncPlayer({
    id: player.id,
    playerName: player.playerName,
    academyKey: player.academyKey,
    academyName: player.academyName,
    ageGroup: player.ageGroup ?? null,
    position: player.position,
    secondPosition: player.secondPosition ?? null,
    shirtNumber: player.shirtNumber ?? null,
    accessCode: player.accessCode,
    parentCode: player.parentCode ?? null,
    status: player.status,
  }).catch(e => console.error("[sheets] syncPlayer failed:", e));
});

router.patch("/players/:playerId/journey/status", async (req, res) => {
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

  await db
    .update(playersTable)
    .set({ status: "journey_complete" })
    .where(eq(playersTable.id, playerId));

  res.json({ status: "journey_complete" });

  // Sync status to Sheets
  updateWorkflowStatus({
    accessCode: player.accessCode,
    playerName: player.playerName,
    status: "journey_complete",
    journeyStatus: "complete",
  }).catch(e => console.error("[sheets] updateWorkflowStatus failed:", e));
});

export default router;
