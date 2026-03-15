import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable, playerJourneyResponsesTable } from "@workspace/db/schema";
import { SaveJourneyResponsesBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

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

  // Delete any existing journey responses before saving (allows resubmission)
  await db
    .delete(playerJourneyResponsesTable)
    .where(eq(playerJourneyResponsesTable.playerId, playerId));

  const rows = parsed.data.responses.map((r) => ({
    playerId,
    stage: r.stage,
    questionNumber: r.questionNumber,
    questionText: r.questionText,
    answerText: r.answerText,
  }));

  if (rows.length > 0) {
    await db.insert(playerJourneyResponsesTable).values(rows);
  }

  res.json({ saved: rows.length });
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

  res.json({
    parentCode: player.parentCode,
    coachCode: player.coachCode,
    status: "journey_complete",
  });
});

export default router;
