import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable, parentResponsesTable } from "@workspace/db/schema";
import { SubmitParentResponsesBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/parent/:parentCode", async (req, res) => {
  const { parentCode } = req.params;

  const [player] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.parentCode, parentCode))
    .limit(1);

  if (!player) {
    res.status(404).json({ error: "Invalid parent code" });
    return;
  }

  res.json({
    id: player.id,
    playerName: player.playerName,
    academyName: player.academyName,
    position: player.position,
  });
});

router.post("/parent/:parentCode", async (req, res) => {
  const { parentCode } = req.params;

  const parsed = SubmitParentResponsesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [player] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.parentCode, parentCode))
    .limit(1);

  if (!player) {
    res.status(404).json({ error: "Invalid parent code" });
    return;
  }

  // Delete existing and reinsert
  await db
    .delete(parentResponsesTable)
    .where(eq(parentResponsesTable.playerId, player.id));

  const rows = parsed.data.responses.map((r) => ({
    playerId: player.id,
    parentCode,
    questionNumber: r.questionNumber,
    questionText: r.questionText,
    answerText: r.answerText,
  }));

  if (rows.length > 0) {
    await db.insert(parentResponsesTable).values(rows);
  }

  res.status(201).json({ success: true, message: "Parent responses saved successfully" });
});

export default router;
