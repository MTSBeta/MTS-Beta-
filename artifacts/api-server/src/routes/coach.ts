import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable, coachResponsesTable } from "@workspace/db/schema";
import { SubmitCoachResponsesBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/coach/:coachCode", async (req, res) => {
  const { coachCode } = req.params;

  const [player] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.coachCode, coachCode))
    .limit(1);

  if (!player) {
    res.status(404).json({ error: "Invalid coach code" });
    return;
  }

  res.json({
    id: player.id,
    playerName: player.playerName,
    academyName: player.academyName,
    position: player.position,
  });
});

router.post("/coach/:coachCode", async (req, res) => {
  const { coachCode } = req.params;

  const parsed = SubmitCoachResponsesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [player] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.coachCode, coachCode))
    .limit(1);

  if (!player) {
    res.status(404).json({ error: "Invalid coach code" });
    return;
  }

  // Delete existing and reinsert
  await db
    .delete(coachResponsesTable)
    .where(eq(coachResponsesTable.playerId, player.id));

  const rows = parsed.data.responses.map((r) => ({
    playerId: player.id,
    coachCode,
    questionNumber: r.questionNumber,
    questionText: r.questionText,
    answerText: r.answerText,
  }));

  if (rows.length > 0) {
    await db.insert(coachResponsesTable).values(rows);
  }

  res.status(201).json({ success: true, message: "Coach responses saved successfully" });
});

export default router;
