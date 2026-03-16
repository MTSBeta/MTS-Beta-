import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  playersTable,
  playerJourneyResponsesTable,
  stakeholderLinksTable,
  stakeholderResponsesTable,
  staffSubmissionsTable,
  academyStaffTable,
  academiesTable,
} from "@workspace/db/schema";
import { eq, and, ilike } from "drizzle-orm";
import { staffAuth, requireRole } from "../middlewares/staffAuth.js";
import { generateCode } from "../lib/codeGenerator.js";

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

router.post("/staff/players", staffAuth, requireRole("academy_admin"), async (req, res) => {
  const staffUser = req.staffUser!;
  const { playerName, age, shirtNumber, position } = req.body;

  if (!playerName?.trim() || !age || !position) {
    res.status(400).json({ error: "playerName, age, and position are required" });
    return;
  }
  if (age < 6 || age > 21) {
    res.status(400).json({ error: "Age must be between 6 and 21" });
    return;
  }

  const [academy] = await db
    .select()
    .from(academiesTable)
    .where(eq(academiesTable.id, staffUser.academyId))
    .limit(1);

  if (!academy) {
    res.status(400).json({ error: "Academy not found" });
    return;
  }

  // Derive age group string from age
  const ageGroup = age <= 9 ? "U9" : `U${age <= 10 ? 10 : age <= 11 ? 11 : age <= 12 ? 12 : age <= 13 ? 13 : age <= 14 ? 14 : age <= 15 ? 15 : age <= 16 ? 16 : age <= 17 ? 17 : age <= 18 ? 18 : "U21"}`;

  const accessCode = generateCode("PLY");
  const parentCode = generateCode("PAR");

  const [player] = await db
    .insert(playersTable)
    .values({
      playerName: playerName.trim(),
      age,
      shirtNumber: shirtNumber ?? 0,
      academyKey: academy.key,
      academyName: academy.name,
      position,
      accessCode,
      parentCode,
      ageGroup,
      status: "registered",
    })
    .returning();

  res.status(201).json({
    id: player.id,
    accessCode: player.accessCode,
    parentCode: player.parentCode,
    playerName: player.playerName,
    age: player.age,
    shirtNumber: player.shirtNumber,
    position: player.position,
    ageGroup: player.ageGroup,
    academyKey: player.academyKey,
    academyName: player.academyName,
    status: player.status,
    createdAt: player.createdAt.toISOString(),
  });
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

  // Load all stakeholder links for this player with their responses
  const stakeholderLinks = await db
    .select()
    .from(stakeholderLinksTable)
    .where(eq(stakeholderLinksTable.playerId, id));

  const stakeholderResponses = await db
    .select()
    .from(stakeholderResponsesTable)
    .where(eq(stakeholderResponsesTable.playerId, id))
    .orderBy(stakeholderResponsesTable.questionNumber);

  // Build parentSubmission from the 'parent' stakeholder link
  const parentLink = stakeholderLinks.find((l) => l.type === "parent");
  const parentResponses = parentLink
    ? stakeholderResponses.filter((r) => r.stakeholderLinkId === parentLink.id)
    : [];

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

  type ResponseItem = { questionNumber: number; questionText: string; answerText: string };
  const flatSubmissions = submissions.map(s => {
    const meta = (s.metadata ?? {}) as Record<string, unknown>;
    const responses: ResponseItem[] = Array.isArray(meta.responses)
      ? (meta.responses as ResponseItem[])
      : [];
    return {
      id: s.id,
      staffId: s.staffId,
      staffName: s.staffName ?? "Unknown",
      role: s.role,
      responses,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt?.toISOString(),
    };
  });

  const rolesWithSubmissions = new Set(flatSubmissions.map(s => s.role));
  const completionStatus = {
    journey: journeyResponses.length > 0,
    parent: parentResponses.length > 0,
    footballCoaching: rolesWithSubmissions.has("football_coaching"),
    psychology: rolesWithSubmissions.has("psychology"),
    education: rolesWithSubmissions.has("education"),
    playerCare: rolesWithSubmissions.has("player_care"),
  };

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
    parentSubmission: parentResponses.length > 0
      ? {
          submitted: true,
          responses: parentResponses.map((r) => ({
            questionNumber: r.questionNumber,
            questionText: r.questionText,
            answerText: r.answerText,
          })),
        }
      : null,
    staffSubmissions: flatSubmissions,
    completionStatus,
  });
});

export default router;
