import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { staffSubmissionsTable, playersTable, academiesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { staffAuth } from "../middlewares/staffAuth.js";

const router: IRouter = Router();

const VALID_ROLES = ["football_coaching", "psychology", "education", "player_care"];

async function getAcademyKey(academyId: number): Promise<string | null> {
  const [academy] = await db
    .select({ key: academiesTable.key })
    .from(academiesTable)
    .where(eq(academiesTable.id, academyId))
    .limit(1);
  return academy?.key ?? null;
}

async function playerBelongsToAcademy(playerId: string, academyKey: string): Promise<boolean> {
  const [player] = await db
    .select({ id: playersTable.id })
    .from(playersTable)
    .where(and(eq(playersTable.id, playerId), eq(playersTable.academyKey, academyKey)))
    .limit(1);
  return !!player;
}

router.post("/staff/submissions", staffAuth, async (req, res) => {
  const staffUser = req.staffUser!;
  const { playerId, role: bodyRole, responses } = req.body;

  if (!playerId) {
    res.status(400).json({ error: "playerId is required" });
    return;
  }
  if (!Array.isArray(responses) || responses.length === 0) {
    res.status(400).json({ error: "responses array is required" });
    return;
  }

  const role = bodyRole ?? staffUser.questionRole;
  if (!role || !VALID_ROLES.includes(role)) {
    res.status(400).json({ error: `Invalid or missing role. Must be one of: ${VALID_ROLES.join(", ")}` });
    return;
  }

  // Non-admin staff can only submit for their assigned pillar
  if (staffUser.systemRole !== "academy_admin") {
    if (staffUser.questionRole !== role) {
      res.status(403).json({ error: "Insufficient permissions. You can only submit observations for your assigned pillar" });
      return;
    }
  }

  const academyKey = await getAcademyKey(staffUser.academyId);
  if (!academyKey || !(await playerBelongsToAcademy(playerId, academyKey))) {
    res.status(403).json({ error: "Access denied. Player does not belong to your academy" });
    return;
  }

  const content = (responses as { questionNumber: number; questionText: string; answerText: string }[])
    .map(r => `Q${r.questionNumber}: ${r.answerText}`)
    .join("\n");

  const [submission] = await db
    .insert(staffSubmissionsTable)
    .values({ staffId: staffUser.id, playerId, role, content, metadata: { responses } })
    .returning();

  res.status(201).json({ id: submission.id });
});

router.put("/staff/submissions/:id", staffAuth, async (req, res) => {
  const submissionId = parseInt(req.params.id as string, 10);
  const staffUser = req.staffUser!;

  if (isNaN(submissionId)) {
    res.status(400).json({ error: "Invalid submission ID" });
    return;
  }

  const [existing] = await db
    .select()
    .from(staffSubmissionsTable)
    .where(eq(staffSubmissionsTable.id, submissionId))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }

  const academyKey = await getAcademyKey(staffUser.academyId);
  if (!academyKey || !(await playerBelongsToAcademy(existing.playerId, academyKey))) {
    res.status(403).json({ error: "Submission does not belong to your academy" });
    return;
  }

  if (existing.staffId !== staffUser.id && staffUser.systemRole !== "academy_admin") {
    res.status(403).json({ error: "Insufficient permissions. You can only edit your own submissions" });
    return;
  }

  const { responses } = req.body;
  if (!Array.isArray(responses) || responses.length === 0) {
    res.status(400).json({ error: "responses array is required" });
    return;
  }

  const content = (responses as { questionNumber: number; questionText: string; answerText: string }[])
    .map(r => `Q${r.questionNumber}: ${r.answerText}`)
    .join("\n");

  const [updated] = await db
    .update(staffSubmissionsTable)
    .set({ content, metadata: { responses }, updatedAt: new Date() })
    .where(eq(staffSubmissionsTable.id, submissionId))
    .returning();

  res.json({ id: updated.id });
});

export default router;
