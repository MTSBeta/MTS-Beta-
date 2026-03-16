import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { staffSubmissionsTable, playersTable, academiesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { staffAuth } from "../middlewares/staffAuth.js";

const router: IRouter = Router();

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

const VALID_SUBMISSION_ROLES = ["coaching", "psychology", "education", "player_care"];

router.post("/staff/submissions", staffAuth, async (req, res) => {
  const staffUser = req.staffUser!;
  const { playerId, role, category, content, metadata } = req.body;

  if (!playerId || !role || !content) {
    res.status(400).json({ error: "playerId, role, and content are required" });
    return;
  }

  if (!VALID_SUBMISSION_ROLES.includes(role)) {
    res.status(400).json({ error: `Invalid role. Must be one of: ${VALID_SUBMISSION_ROLES.join(", ")}` });
    return;
  }

  const academyKey = await getAcademyKey(staffUser.academyId);
  if (!academyKey || !(await playerBelongsToAcademy(playerId, academyKey))) {
    res.status(403).json({ error: "Player does not belong to your academy" });
    return;
  }

  const [submission] = await db
    .insert(staffSubmissionsTable)
    .values({
      staffId: staffUser.id,
      playerId,
      role,
      category: category ?? null,
      content,
      metadata: metadata ?? {},
    })
    .returning();

  res.status(201).json(submission);
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
    res.status(403).json({ error: "You can only edit your own submissions" });
    return;
  }

  const { content, category, metadata } = req.body;
  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (content !== undefined) updateData.content = content;
  if (category !== undefined) updateData.category = category;
  if (metadata !== undefined) updateData.metadata = metadata;

  const [updated] = await db
    .update(staffSubmissionsTable)
    .set(updateData)
    .where(eq(staffSubmissionsTable.id, submissionId))
    .returning();

  res.json(updated);
});

export default router;
