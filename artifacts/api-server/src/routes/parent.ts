import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable, parentResponsesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/parent/:parentCode", async (req, res) => {
  const parentCode = req.params.parentCode as string;

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
  const parentCode = req.params.parentCode as string;
  const { responses } = req.body;

  if (!Array.isArray(responses) || responses.length === 0) {
    res.status(400).json({ error: "responses array is required" });
    return;
  }

  for (const r of responses) {
    if (typeof r.questionNumber !== "number" || typeof r.questionText !== "string" || typeof r.answerText !== "string") {
      res.status(400).json({ error: "Each response must have questionNumber (number), questionText (string), and answerText (string)" });
      return;
    }
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

  await db
    .delete(parentResponsesTable)
    .where(eq(parentResponsesTable.playerId, player.id));

  const rows = responses.map((r: { questionNumber: number; questionText: string; answerText: string }) => ({
    playerId: player.id,
    parentCode,
    questionNumber: r.questionNumber,
    questionText: r.questionText,
    answerText: r.answerText,
  }));

  await db.insert(parentResponsesTable).values(rows);

  res.status(201).json({ success: true, message: "Parent responses saved successfully" });
});

export default router;
