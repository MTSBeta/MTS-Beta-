import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  playersTable,
  stakeholderLinksTable,
  stakeholderResponsesTable,
} from "@workspace/db/schema";
import {
  CreateStakeholderLinksBody,
  SubmitStakeholderResponsesBody,
} from "@workspace/api-zod";
import { generateCode } from "../lib/codeGenerator.js";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const ACADEMY_STAFF_TYPES = [
  { type: "football_coach", label: "Football Coach" },
  { type: "education", label: "Education Staff" },
  { type: "psychology", label: "Psychology Staff" },
  { type: "player_care", label: "Player Care" },
];

// GET stakeholder links for a player
router.get("/players/:playerId/stakeholder-links", async (req, res) => {
  const { playerId } = req.params;
  const links = await db
    .select()
    .from(stakeholderLinksTable)
    .where(eq(stakeholderLinksTable.playerId, playerId))
    .orderBy(stakeholderLinksTable.id);

  res.json(
    links.map((l) => ({
      id: l.id,
      playerId: l.playerId,
      type: l.type,
      label: l.label,
      code: l.code,
      submitted: l.submitted,
      createdAt: l.createdAt.toISOString(),
    }))
  );
});

// POST create stakeholder links
router.post("/players/:playerId/stakeholder-links", async (req, res) => {
  const { playerId } = req.params;

  const parsed = CreateStakeholderLinksBody.safeParse(req.body);
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

  const { parentCount, friendCount } = parsed.data;

  const linksToCreate: { playerId: string; type: string; label: string; code: string; submitted: boolean }[] = [];

  // Parent links
  for (let i = 1; i <= parentCount; i++) {
    linksToCreate.push({
      playerId,
      type: "parent",
      label: parentCount === 1 ? "Parent / Guardian" : `Parent ${i}`,
      code: generateCode("PAR"),
      submitted: false,
    });
  }

  // Friend links
  for (let i = 1; i <= friendCount; i++) {
    linksToCreate.push({
      playerId,
      type: "friend",
      label: `Friend ${i}`,
      code: generateCode("FRD"),
      submitted: false,
    });
  }

  // Academy staff (always 4 types)
  for (const staff of ACADEMY_STAFF_TYPES) {
    linksToCreate.push({
      playerId,
      type: staff.type,
      label: staff.label,
      code: generateCode(staff.type.slice(0, 3).toUpperCase()),
      submitted: false,
    });
  }

  // Remove existing links before creating new ones (allow regeneration)
  await db
    .delete(stakeholderLinksTable)
    .where(eq(stakeholderLinksTable.playerId, playerId));

  const created = await db.insert(stakeholderLinksTable).values(linksToCreate).returning();

  // Mark player as links_generated
  await db
    .update(playersTable)
    .set({ status: "links_generated" })
    .where(eq(playersTable.id, playerId));

  res.status(201).json(
    created.map((l) => ({
      id: l.id,
      playerId: l.playerId,
      type: l.type,
      label: l.label,
      code: l.code,
      submitted: l.submitted,
      createdAt: l.createdAt.toISOString(),
    }))
  );
});

// GET stakeholder info by code
router.get("/stakeholder/:code", async (req, res) => {
  const { code } = req.params;

  const [link] = await db
    .select()
    .from(stakeholderLinksTable)
    .where(eq(stakeholderLinksTable.code, code))
    .limit(1);

  if (!link) {
    res.status(404).json({ error: "Invalid code" });
    return;
  }

  const [player] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.id, link.playerId))
    .limit(1);

  if (!player) {
    res.status(404).json({ error: "Player not found" });
    return;
  }

  res.json({
    linkId: link.id,
    playerId: player.id,
    playerName: player.playerName,
    academyName: player.academyName,
    position: player.position,
    type: link.type,
    label: link.label,
    submitted: link.submitted,
  });
});

// POST submit stakeholder responses
router.post("/stakeholder/:code", async (req, res) => {
  const { code } = req.params;

  const parsed = SubmitStakeholderResponsesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [link] = await db
    .select()
    .from(stakeholderLinksTable)
    .where(eq(stakeholderLinksTable.code, code))
    .limit(1);

  if (!link) {
    res.status(404).json({ error: "Invalid code" });
    return;
  }

  // Delete existing responses before inserting (allow resubmission)
  await db
    .delete(stakeholderResponsesTable)
    .where(eq(stakeholderResponsesTable.stakeholderLinkId, link.id));

  const rows = parsed.data.responses.map((r) => ({
    stakeholderLinkId: link.id,
    playerId: link.playerId,
    questionNumber: r.questionNumber,
    questionText: r.questionText,
    answerText: r.answerText ?? "",
    audioUrl: r.audioUrl ?? null,
    mediaUrls: r.mediaUrls ?? [],
  }));

  if (rows.length > 0) {
    await db.insert(stakeholderResponsesTable).values(rows);
  }

  await db
    .update(stakeholderLinksTable)
    .set({ submitted: true })
    .where(eq(stakeholderLinksTable.id, link.id));

  res.status(201).json({ success: true, message: "Responses saved successfully" });
});

export default router;
