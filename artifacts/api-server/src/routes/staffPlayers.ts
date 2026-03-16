import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  playersTable,
  playerJourneyResponsesTable,
  parentResponsesTable,
  staffSubmissionsTable,
  academyStaffTable,
  academiesTable,
} from "@workspace/db/schema";
import { eq, and, ilike } from "drizzle-orm";
import { staffAuth } from "../middlewares/staffAuth.js";

const router: IRouter = Router();

router.get("/staff/players", staffAuth, async (req, res) => {
  const ageGroup = req.query.age_group as string | undefined;
  const status = req.query.status as string | undefined;
  const search = req.query.search as string | undefined;

  const staffUser = req.staffUser!;

  const conditions = [];

  const [academy] = await db
    .select()
    .from(academiesTable)
    .where(eq(academiesTable.id, staffUser.academyId))
    .limit(1);

  if (!academy) {
    res.status(400).json({ error: "Staff academy not found" });
    return;
  }

  conditions.push(eq(playersTable.academyKey, academy.key));

  if (ageGroup) {
    conditions.push(eq(playersTable.ageGroup, ageGroup));
  }
  if (status) {
    conditions.push(eq(playersTable.status, status));
  }
  if (search) {
    conditions.push(ilike(playersTable.playerName, `%${search}%`));
  }

  const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);

  const players = await db
    .select()
    .from(playersTable)
    .where(whereClause)
    .orderBy(playersTable.playerName);

  res.json(
    players.map((p) => ({
      id: p.id,
      accessCode: p.accessCode,
      playerName: p.playerName,
      age: p.age,
      shirtNumber: p.shirtNumber,
      academyKey: p.academyKey,
      academyName: p.academyName,
      position: p.position,
      ageGroup: p.ageGroup,
      parentCode: p.parentCode,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    }))
  );
});

router.get("/staff/players/:id", staffAuth, async (req, res) => {
  const id = req.params.id as string;
  const staffUser = req.staffUser!;

  const [academy] = await db
    .select()
    .from(academiesTable)
    .where(eq(academiesTable.id, staffUser.academyId))
    .limit(1);

  if (!academy) {
    res.status(400).json({ error: "Staff academy not found" });
    return;
  }

  const [player] = await db
    .select()
    .from(playersTable)
    .where(and(eq(playersTable.id, id), eq(playersTable.academyKey, academy.key)))
    .limit(1);

  if (!player) {
    res.status(404).json({ error: "Player not found" });
    return;
  }

  const journeyResponses = await db
    .select()
    .from(playerJourneyResponsesTable)
    .where(eq(playerJourneyResponsesTable.playerId, id))
    .orderBy(playerJourneyResponsesTable.questionNumber);

  const parentResponses = await db
    .select()
    .from(parentResponsesTable)
    .where(eq(parentResponsesTable.playerId, id))
    .orderBy(parentResponsesTable.questionNumber);

  const submissions = await db
    .select({
      id: staffSubmissionsTable.id,
      staffId: staffSubmissionsTable.staffId,
      playerId: staffSubmissionsTable.playerId,
      role: staffSubmissionsTable.role,
      category: staffSubmissionsTable.category,
      content: staffSubmissionsTable.content,
      metadata: staffSubmissionsTable.metadata,
      createdAt: staffSubmissionsTable.createdAt,
      updatedAt: staffSubmissionsTable.updatedAt,
      staffName: academyStaffTable.fullName,
    })
    .from(staffSubmissionsTable)
    .leftJoin(academyStaffTable, eq(staffSubmissionsTable.staffId, academyStaffTable.id))
    .where(eq(staffSubmissionsTable.playerId, id))
    .orderBy(staffSubmissionsTable.createdAt);

  const submissionsByRole: Record<string, typeof submissions> = {};
  for (const s of submissions) {
    if (!submissionsByRole[s.role]) {
      submissionsByRole[s.role] = [];
    }
    submissionsByRole[s.role].push(s);
  }

  res.json({
    player: {
      id: player.id,
      playerName: player.playerName,
      age: player.age,
      shirtNumber: player.shirtNumber,
      academyKey: player.academyKey,
      academyName: player.academyName,
      position: player.position,
      ageGroup: player.ageGroup,
      parentCode: player.parentCode,
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
    parentResponses: parentResponses.map((r) => ({
      questionNumber: r.questionNumber,
      questionText: r.questionText,
      answerText: r.answerText,
      submittedAt: r.submittedAt.toISOString(),
    })),
    staffSubmissions: submissionsByRole,
  });
});

export default router;
