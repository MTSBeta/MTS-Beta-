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
  storyProjectsTable,
  storyBlueprintsTable,
  storyScenesTable,
  illustrationAssetsTable,
  detailTrackerTable,
  productionNotesTable,
  meTimeStaffTable,
  DEFAULT_TRACKER_ITEMS,
} from "@workspace/db/schema";
import { eq, and, ilike, or, desc } from "drizzle-orm";
import { internalAuth } from "../middlewares/internalAuth.js";

const router: IRouter = Router();

// All internal routes require MeTime Stories internal staff auth
router.use("/internal", internalAuth);

// ─────────────────────────────────────────────────────────
// HELPER: ensure a story project exists for a player
// ─────────────────────────────────────────────────────────
async function ensureProject(playerId: string) {
  const existing = await db
    .select()
    .from(storyProjectsTable)
    .where(eq(storyProjectsTable.playerId, playerId))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [project] = await db
    .insert(storyProjectsTable)
    .values({ playerId, status: "intake_in_progress" })
    .returning();

  // Seed 6 scenes
  const sceneInserts = [1, 2, 3, 4, 5, 6].map((n) => ({
    projectId: project.id,
    sceneNumber: n,
    title: null,
    manuscript: null,
    sceneNotes: null,
    emotionalBeat: null,
  }));
  await db.insert(storyScenesTable).values(sceneInserts);

  // Seed detail tracker items
  const trackerInserts = DEFAULT_TRACKER_ITEMS.map((item) => ({
    projectId: project.id,
    itemKey: item.key,
    itemLabel: item.label,
    itemValue: null,
    usageStatus: "unused",
  }));
  await db.insert(detailTrackerTable).values(trackerInserts);

  return project;
}

// ─────────────────────────────────────────────────────────
// GET /api/internal/projects
// All story projects with player data (cross-academy)
// ─────────────────────────────────────────────────────────
router.get("/internal/projects", async (req, res) => {
  const search = req.query.search as string | undefined;
  const academy = req.query.academy as string | undefined;
  const status = req.query.status as string | undefined;
  const author = req.query.author as string | undefined;

  const allPlayers = await db
    .select()
    .from(playersTable)
    .orderBy(playersTable.playerName);

  const projects = await db
    .select()
    .from(storyProjectsTable)
    .orderBy(desc(storyProjectsTable.updatedAt));

  const projectMap = new Map(projects.map((p) => [p.playerId, p]));

  // Auto-ensure projects for all players
  const playerIds = allPlayers.map((p) => p.id);
  const existingProjectPlayerIds = new Set(projects.map((p) => p.playerId));
  const missing = playerIds.filter((id) => !existingProjectPlayerIds.has(id));
  for (const pid of missing) {
    await ensureProject(pid);
  }

  // Re-fetch updated projects after seeding
  const allProjects = await db
    .select()
    .from(storyProjectsTable)
    .orderBy(desc(storyProjectsTable.updatedAt));
  const allProjectMap = new Map(allProjects.map((p) => [p.playerId, p]));

  // Check journey response counts for completeness
  const allResponses = await db
    .select()
    .from(playerJourneyResponsesTable);

  const responsesByPlayer = new Map<string, number>();
  for (const r of allResponses) {
    responsesByPlayer.set(r.playerId, (responsesByPlayer.get(r.playerId) ?? 0) + 1);
  }

  // Check stakeholder links
  const allStakeholderLinks = await db
    .select()
    .from(stakeholderLinksTable);

  const stakeholdersByPlayer = new Map<string, { total: number; submitted: number }>();
  for (const sl of allStakeholderLinks) {
    const cur = stakeholdersByPlayer.get(sl.playerId) ?? { total: 0, submitted: 0 };
    cur.total += 1;
    if (sl.submitted) cur.submitted += 1;
    stakeholdersByPlayer.set(sl.playerId, cur);
  }

  // Check staff submissions
  const allStaffSubs = await db.select().from(staffSubmissionsTable);
  const staffSubsByPlayer = new Map<string, number>();
  for (const s of allStaffSubs) {
    staffSubsByPlayer.set(s.playerId, (staffSubsByPlayer.get(s.playerId) ?? 0) + 1);
  }

  let rows = allPlayers.map((player) => {
    const project = allProjectMap.get(player.id);
    const journeyCount = responsesByPlayer.get(player.id) ?? 0;
    const stakeholders = stakeholdersByPlayer.get(player.id);
    const staffSubs = staffSubsByPlayer.get(player.id) ?? 0;

    const completeness = {
      intakeComplete: player.status === "journey_complete" || player.status === "links_generated" || journeyCount > 0,
      coachInputPresent: staffSubs > 0,
      stakeholderPresent: (stakeholders?.submitted ?? 0) > 0,
      journeyResponseCount: journeyCount,
    };

    const completenessScore = Object.values(completeness).filter((v) => v === true).length;

    return {
      playerId: player.id,
      playerName: player.playerName,
      accessCode: player.accessCode,
      academy: player.academyName,
      academyKey: player.academyKey,
      ageGroup: player.ageGroup,
      position: player.position,
      playerStatus: player.status,
      storyStatus: project?.status ?? "intake_in_progress",
      assignedAuthor: project?.assignedAuthor ?? null,
      assignedIllustrator: project?.assignedIllustrator ?? null,
      updatedAt: project?.updatedAt?.toISOString() ?? player.createdAt.toISOString(),
      academyPreviewEnabled: project?.academyPreviewEnabled ?? false,
      finalApproved: project?.finalApproved ?? false,
      projectId: project?.id ?? null,
      completeness,
      completenessScore,
      createdAt: player.createdAt.toISOString(),
    };
  });

  // Apply filters
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.playerName.toLowerCase().includes(q) ||
        r.accessCode.toLowerCase().includes(q) ||
        r.academy.toLowerCase().includes(q)
    );
  }
  if (academy) rows = rows.filter((r) => r.academyKey === academy || r.academy.toLowerCase().includes(academy.toLowerCase()));
  if (status) rows = rows.filter((r) => r.storyStatus === status);
  if (author) rows = rows.filter((r) => r.assignedAuthor?.toLowerCase().includes(author.toLowerCase()));

  // Get unique academies for filter options
  const academiesList = [...new Set(allPlayers.map((p) => ({ key: p.academyKey, name: p.academyName }))
    .map(JSON.stringify))].map((s) => JSON.parse(s as string));

  res.json({ projects: rows, academies: academiesList });
});

// ─────────────────────────────────────────────────────────
// GET /api/internal/projects/:playerId
// Get a single project (ensure it exists)
// ─────────────────────────────────────────────────────────
router.get("/internal/projects/:playerId", async (req, res) => {
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

  const project = await ensureProject(playerId);

  res.json({ project, player });
});

// ─────────────────────────────────────────────────────────
// PUT /api/internal/projects/:playerId
// Update project status / assignments / notes
// ─────────────────────────────────────────────────────────
router.put("/internal/projects/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const staffUser = req.internalUser!;
  const {
    status,
    assignedAuthor,
    assignedIllustrator,
    academyPreviewEnabled,
    academyApproved,
    finalApproved,
    editorNotes,
    revisionNotes,
  } = req.body;

  const project = await ensureProject(playerId);

  const updates: Record<string, unknown> = {
    updatedAt: new Date(),
    lastEditedBy: staffUser.fullName,
  };
  if (status !== undefined) updates.status = status;
  if (assignedAuthor !== undefined) updates.assignedAuthor = assignedAuthor;
  if (assignedIllustrator !== undefined) updates.assignedIllustrator = assignedIllustrator;
  if (academyPreviewEnabled !== undefined) updates.academyPreviewEnabled = academyPreviewEnabled;
  if (academyApproved !== undefined) updates.academyApproved = academyApproved;
  if (finalApproved !== undefined) updates.finalApproved = finalApproved;
  if (editorNotes !== undefined) updates.editorNotes = editorNotes;
  if (revisionNotes !== undefined) updates.revisionNotes = revisionNotes;

  const [updated] = await db
    .update(storyProjectsTable)
    .set(updates)
    .where(eq(storyProjectsTable.id, project.id))
    .returning();

  // Log activity
  if (status !== undefined && status !== project.status) {
    await db.insert(productionNotesTable).values({
      projectId: project.id,
      noteType: "activity",
      content: `Status changed to "${status}"`,
      createdBy: staffUser.fullName,
    });
  }

  res.json({ project: updated });
});

// ─────────────────────────────────────────────────────────
// GET /api/internal/projects/:playerId/profile
// Assembled player story profile
// ─────────────────────────────────────────────────────────
router.get("/internal/projects/:playerId/profile", async (req, res) => {
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

  const project = await ensureProject(playerId);

  const [journeyResponses, stakeholderLinks, staffSubmissions] = await Promise.all([
    db
      .select()
      .from(playerJourneyResponsesTable)
      .where(eq(playerJourneyResponsesTable.playerId, playerId))
      .orderBy(playerJourneyResponsesTable.stage, playerJourneyResponsesTable.questionNumber),
    db
      .select()
      .from(stakeholderLinksTable)
      .where(eq(stakeholderLinksTable.playerId, playerId)),
    db
      .select()
      .from(staffSubmissionsTable)
      .where(eq(staffSubmissionsTable.playerId, playerId))
      .orderBy(staffSubmissionsTable.createdAt),
  ]);

  // Fetch stakeholder responses for submitted links
  const submittedLinks = stakeholderLinks.filter((l) => l.submitted);
  const stakeholderResponses: Record<number, typeof stakeholderLinks[0] & { responses: any[] }> = {};

  for (const link of submittedLinks) {
    const responses = await db
      .select()
      .from(stakeholderResponsesTable)
      .where(eq(stakeholderResponsesTable.stakeholderLinkId, link.id))
      .orderBy(stakeholderResponsesTable.questionNumber);

    stakeholderResponses[link.id] = { ...link, responses };
  }

  // Group journey responses by stage
  const journeyByStage = journeyResponses.reduce<Record<string, typeof journeyResponses>>((acc, r) => {
    acc[r.stage] = acc[r.stage] ?? [];
    acc[r.stage].push(r);
    return acc;
  }, {});

  // Group staff submissions by role
  const staffByRole = staffSubmissions.reduce<Record<string, typeof staffSubmissions>>((acc, s) => {
    acc[s.role] = acc[s.role] ?? [];
    acc[s.role].push(s);
    return acc;
  }, {});

  // Collect all media URLs from journey
  const allImages = journeyResponses.flatMap((r) => (r.mediaUrls as string[]) ?? []);
  const allVoiceNotes = journeyResponses
    .filter((r) => r.audioUrl)
    .map((r) => ({ questionText: r.questionText, url: r.audioUrl!, stage: r.stage }));

  // Stakeholder voice notes
  const stakeholderVoiceNotes = Object.values(stakeholderResponses).flatMap((sl) =>
    sl.responses
      .filter((r) => r.audio_url)
      .map((r) => ({ questionText: r.question_text, url: r.audio_url, type: (sl as any).type }))
  );

  res.json({
    player: {
      id: player.id,
      playerName: player.playerName,
      age: player.age,
      ageGroup: player.ageGroup,
      position: player.position,
      secondPosition: player.secondPosition,
      shirtNumber: player.shirtNumber,
      academyKey: player.academyKey,
      academyName: player.academyName,
      accessCode: player.accessCode,
      status: player.status,
      createdAt: player.createdAt,
    },
    project: {
      id: project.id,
      status: project.status,
      assignedAuthor: project.assignedAuthor,
      assignedIllustrator: project.assignedIllustrator,
      editorNotes: project.editorNotes,
      updatedAt: project.updatedAt,
    },
    journeyByStage,
    journeyResponses,
    staffByRole,
    staffSubmissions,
    stakeholderLinks,
    stakeholderResponses: Object.values(stakeholderResponses),
    media: {
      images: allImages,
      voiceNotes: allVoiceNotes,
      stakeholderVoiceNotes,
    },
  });
});

// ─────────────────────────────────────────────────────────
// GET /api/internal/projects/:playerId/blueprint
// ─────────────────────────────────────────────────────────
router.get("/internal/projects/:playerId/blueprint", async (req, res) => {
  const { playerId } = req.params;
  const project = await ensureProject(playerId);

  const [blueprint] = await db
    .select()
    .from(storyBlueprintsTable)
    .where(eq(storyBlueprintsTable.projectId, project.id))
    .limit(1);

  res.json({ blueprint: blueprint ?? null, projectId: project.id });
});

// ─────────────────────────────────────────────────────────
// PUT /api/internal/projects/:playerId/blueprint
// ─────────────────────────────────────────────────────────
router.put("/internal/projects/:playerId/blueprint", async (req, res) => {
  const { playerId } = req.params;
  const staffUser = req.internalUser!;
  const project = await ensureProject(playerId);

  const fields = req.body;
  const allowedFields = [
    "coreIdentity",
    "emotionalChallenge",
    "falseBelief",
    "hiddenStrength",
    "supportFigure",
    "academyValues",
    "keyFootballTest",
    "turningPoint",
    "lessonTheme",
    "endingTransformation",
    "symbolicObject",
    "parentResonanceNote",
    "coachResonanceNote",
  ];

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (const f of allowedFields) {
    if (fields[f] !== undefined) updates[f] = fields[f];
  }

  const [existing] = await db
    .select()
    .from(storyBlueprintsTable)
    .where(eq(storyBlueprintsTable.projectId, project.id))
    .limit(1);

  let blueprint;
  if (existing) {
    [blueprint] = await db
      .update(storyBlueprintsTable)
      .set(updates)
      .where(eq(storyBlueprintsTable.id, existing.id))
      .returning();
  } else {
    [blueprint] = await db
      .insert(storyBlueprintsTable)
      .values({ projectId: project.id, ...updates })
      .returning();
  }

  // Update project status if needed
  await db
    .update(storyProjectsTable)
    .set({
      updatedAt: new Date(),
      lastEditedBy: staffUser.fullName,
      status: "blueprint_in_progress",
    })
    .where(eq(storyProjectsTable.id, project.id));

  res.json({ blueprint });
});

// ─────────────────────────────────────────────────────────
// GET /api/internal/projects/:playerId/scenes
// All 6 story scenes
// ─────────────────────────────────────────────────────────
router.get("/internal/projects/:playerId/scenes", async (req, res) => {
  const { playerId } = req.params;
  const project = await ensureProject(playerId);

  const scenes = await db
    .select()
    .from(storyScenesTable)
    .where(eq(storyScenesTable.projectId, project.id))
    .orderBy(storyScenesTable.sceneNumber);

  res.json({ scenes, projectId: project.id });
});

// ─────────────────────────────────────────────────────────
// PUT /api/internal/projects/:playerId/scenes/:sceneNum
// Update a single scene
// ─────────────────────────────────────────────────────────
router.put("/internal/projects/:playerId/scenes/:sceneNum", async (req, res) => {
  const { playerId, sceneNum } = req.params;
  const staffUser = req.internalUser!;
  const sceneNumber = parseInt(sceneNum, 10);

  if (isNaN(sceneNumber) || sceneNumber < 1 || sceneNumber > 6) {
    res.status(400).json({ error: "Invalid scene number (1–6)" });
    return;
  }

  const project = await ensureProject(playerId);
  const { manuscript, sceneNotes, emotionalBeat, title } = req.body;

  const [existing] = await db
    .select()
    .from(storyScenesTable)
    .where(
      and(
        eq(storyScenesTable.projectId, project.id),
        eq(storyScenesTable.sceneNumber, sceneNumber)
      )
    )
    .limit(1);

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (manuscript !== undefined) updates.manuscript = manuscript;
  if (sceneNotes !== undefined) updates.sceneNotes = sceneNotes;
  if (emotionalBeat !== undefined) updates.emotionalBeat = emotionalBeat;
  if (title !== undefined) updates.title = title;

  let scene;
  if (existing) {
    [scene] = await db
      .update(storyScenesTable)
      .set(updates)
      .where(eq(storyScenesTable.id, existing.id))
      .returning();
  } else {
    [scene] = await db
      .insert(storyScenesTable)
      .values({ projectId: project.id, sceneNumber, ...updates })
      .returning();
  }

  await db
    .update(storyProjectsTable)
    .set({
      updatedAt: new Date(),
      lastEditedBy: staffUser.fullName,
      status: "draft_in_progress",
    })
    .where(eq(storyProjectsTable.id, project.id));

  res.json({ scene });
});

// ─────────────────────────────────────────────────────────
// GET /api/internal/projects/:playerId/tracker
// ─────────────────────────────────────────────────────────
router.get("/internal/projects/:playerId/tracker", async (req, res) => {
  const { playerId } = req.params;
  const project = await ensureProject(playerId);

  const items = await db
    .select()
    .from(detailTrackerTable)
    .where(eq(detailTrackerTable.projectId, project.id))
    .orderBy(detailTrackerTable.id);

  res.json({ items, projectId: project.id });
});

// ─────────────────────────────────────────────────────────
// PUT /api/internal/projects/:playerId/tracker/:itemKey
// ─────────────────────────────────────────────────────────
router.put("/internal/projects/:playerId/tracker/:itemKey", async (req, res) => {
  const { playerId, itemKey } = req.params;
  const { usageStatus, itemValue } = req.body;

  const project = await ensureProject(playerId);

  const [existing] = await db
    .select()
    .from(detailTrackerTable)
    .where(
      and(
        eq(detailTrackerTable.projectId, project.id),
        eq(detailTrackerTable.itemKey, itemKey)
      )
    )
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Tracker item not found" });
    return;
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (usageStatus !== undefined) updates.usageStatus = usageStatus;
  if (itemValue !== undefined) updates.itemValue = itemValue;

  const [updated] = await db
    .update(detailTrackerTable)
    .set(updates)
    .where(eq(detailTrackerTable.id, existing.id))
    .returning();

  res.json({ item: updated });
});

// ─────────────────────────────────────────────────────────
// GET /api/internal/projects/:playerId/notes
// ─────────────────────────────────────────────────────────
router.get("/internal/projects/:playerId/notes", async (req, res) => {
  const { playerId } = req.params;
  const project = await ensureProject(playerId);

  const notes = await db
    .select()
    .from(productionNotesTable)
    .where(eq(productionNotesTable.projectId, project.id))
    .orderBy(desc(productionNotesTable.createdAt));

  res.json({ notes, projectId: project.id });
});

// ─────────────────────────────────────────────────────────
// POST /api/internal/projects/:playerId/notes
// ─────────────────────────────────────────────────────────
router.post("/internal/projects/:playerId/notes", async (req, res) => {
  const { playerId } = req.params;
  const staffUser = req.internalUser!;
  const { content, noteType = "general" } = req.body;

  if (!content?.trim()) {
    res.status(400).json({ error: "content is required" });
    return;
  }

  const project = await ensureProject(playerId);

  const [note] = await db
    .insert(productionNotesTable)
    .values({
      projectId: project.id,
      noteType,
      content: content.trim(),
      createdBy: staffUser.fullName,
    })
    .returning();

  res.status(201).json({ note });
});

// ─────────────────────────────────────────────────────────
// GET /api/internal/projects/:playerId/illustrations
// ─────────────────────────────────────────────────────────
router.get("/internal/projects/:playerId/illustrations", async (req, res) => {
  const { playerId } = req.params;
  const project = await ensureProject(playerId);

  const assets = await db
    .select()
    .from(illustrationAssetsTable)
    .where(eq(illustrationAssetsTable.projectId, project.id))
    .orderBy(illustrationAssetsTable.createdAt);

  res.json({ assets, projectId: project.id });
});

// ─────────────────────────────────────────────────────────
// POST /api/internal/projects/:playerId/illustrations
// Add illustration asset record
// ─────────────────────────────────────────────────────────
router.post("/internal/projects/:playerId/illustrations", async (req, res) => {
  const { playerId } = req.params;
  const { fileName, driveFileId, driveLink, assetType, sceneNumber, illustratorNotes } = req.body;

  const project = await ensureProject(playerId);

  const [asset] = await db
    .insert(illustrationAssetsTable)
    .values({
      projectId: project.id,
      fileName: fileName ?? null,
      driveFileId: driveFileId ?? null,
      driveLink: driveLink ?? null,
      assetType: assetType ?? "reference_image",
      sceneNumber: sceneNumber ?? null,
      illustratorNotes: illustratorNotes ?? null,
      approved: false,
    })
    .returning();

  res.status(201).json({ asset });
});

// ─────────────────────────────────────────────────────────
// PUT /api/internal/projects/:playerId/illustrations/:assetId
// Approve / update notes
// ─────────────────────────────────────────────────────────
router.put("/internal/projects/:playerId/illustrations/:assetId", async (req, res) => {
  const { assetId } = req.params;
  const { approved, illustratorNotes, sceneNumber, assetType } = req.body;

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (approved !== undefined) updates.approved = approved;
  if (illustratorNotes !== undefined) updates.illustratorNotes = illustratorNotes;
  if (sceneNumber !== undefined) updates.sceneNumber = sceneNumber;
  if (assetType !== undefined) updates.assetType = assetType;

  const [updated] = await db
    .update(illustrationAssetsTable)
    .set(updates)
    .where(eq(illustrationAssetsTable.id, parseInt(assetId, 10)))
    .returning();

  res.json({ asset: updated });
});

// ─────────────────────────────────────────────────────────
// POST /api/internal/projects/:playerId/blueprint/approve
// Editor approves a blueprint — unlocks Story Builder
// ─────────────────────────────────────────────────────────
router.post("/internal/projects/:playerId/blueprint/approve", async (req, res) => {
  const { playerId } = req.params;
  const staffUser = req.internalUser!;

  if (staffUser.role !== "editor" && staffUser.role !== "admin") {
    res.status(403).json({ error: "Only editors can approve blueprints" });
    return;
  }

  const project = await ensureProject(playerId);

  const [existing] = await db
    .select()
    .from(storyBlueprintsTable)
    .where(eq(storyBlueprintsTable.projectId, project.id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "No blueprint found — author must save blueprint first" });
    return;
  }

  const [blueprint] = await db
    .update(storyBlueprintsTable)
    .set({
      blueprintApproved: true,
      blueprintApprovedBy: staffUser.fullName,
      blueprintApprovedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(storyBlueprintsTable.id, existing.id))
    .returning();

  await db
    .update(storyProjectsTable)
    .set({ status: "draft_in_progress", updatedAt: new Date() })
    .where(eq(storyProjectsTable.id, project.id));

  res.json({ blueprint });
});

// ─────────────────────────────────────────────────────────
// POST /api/internal/projects/:playerId/blueprint/revoke
// Editor revokes blueprint approval
// ─────────────────────────────────────────────────────────
router.post("/internal/projects/:playerId/blueprint/revoke", async (req, res) => {
  const { playerId } = req.params;
  const staffUser = req.internalUser!;

  if (staffUser.role !== "editor" && staffUser.role !== "admin") {
    res.status(403).json({ error: "Only editors can revoke blueprint approval" });
    return;
  }

  const project = await ensureProject(playerId);

  const [existing] = await db
    .select()
    .from(storyBlueprintsTable)
    .where(eq(storyBlueprintsTable.projectId, project.id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "No blueprint found" });
    return;
  }

  const [blueprint] = await db
    .update(storyBlueprintsTable)
    .set({
      blueprintApproved: false,
      blueprintApprovedBy: null,
      blueprintApprovedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(storyBlueprintsTable.id, existing.id))
    .returning();

  await db
    .update(storyProjectsTable)
    .set({ status: "blueprint_in_progress", updatedAt: new Date() })
    .where(eq(storyProjectsTable.id, project.id));

  res.json({ blueprint });
});

// ─────────────────────────────────────────────────────────
// PUT /api/internal/projects/:playerId/assign
// Assign author/editor to a project
// ─────────────────────────────────────────────────────────
router.put("/internal/projects/:playerId/assign", async (req, res) => {
  const { playerId } = req.params;
  const staffUser = req.internalUser!;
  const { assignedAuthor, assignedIllustrator, assignedAuthorId, assignedEditorId, bookFormat } = req.body;

  if (staffUser.role !== "editor" && staffUser.role !== "admin") {
    res.status(403).json({ error: "Only editors can assign staff to projects" });
    return;
  }

  const project = await ensureProject(playerId);

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (assignedAuthor !== undefined) updates.assignedAuthor = assignedAuthor;
  if (assignedIllustrator !== undefined) updates.assignedIllustrator = assignedIllustrator;
  if (assignedAuthorId !== undefined) updates.assignedAuthorId = assignedAuthorId;
  if (assignedEditorId !== undefined) updates.assignedEditorId = assignedEditorId;
  if (bookFormat !== undefined) updates.bookFormat = bookFormat;

  const [updated] = await db
    .update(storyProjectsTable)
    .set(updates)
    .where(eq(storyProjectsTable.id, project.id))
    .returning();

  res.json({ project: updated });
});

// ─────────────────────────────────────────────────────────
// PUT /api/internal/projects/:playerId/book-format
// Update book format/size
// ─────────────────────────────────────────────────────────
router.put("/internal/projects/:playerId/book-format", async (req, res) => {
  const { playerId } = req.params;
  const { bookFormat } = req.body;

  const project = await ensureProject(playerId);

  const [updated] = await db
    .update(storyProjectsTable)
    .set({ bookFormat, updatedAt: new Date() })
    .where(eq(storyProjectsTable.id, project.id))
    .returning();

  res.json({ project: updated });
});

// ─────────────────────────────────────────────────────────
// GET /api/internal/staff
// List all MeTime Stories staff (editor/admin only)
// ─────────────────────────────────────────────────────────
router.get("/internal/staff", async (req, res) => {
  const staffUser = req.internalUser!;

  if (staffUser.role !== "editor" && staffUser.role !== "admin") {
    res.status(403).json({ error: "Only editors can manage staff" });
    return;
  }

  const staff = await db
    .select({
      id: meTimeStaffTable.id,
      email: meTimeStaffTable.email,
      fullName: meTimeStaffTable.fullName,
      role: meTimeStaffTable.role,
      isActive: meTimeStaffTable.isActive,
      createdAt: meTimeStaffTable.createdAt,
    })
    .from(meTimeStaffTable)
    .orderBy(meTimeStaffTable.createdAt);

  res.json({ staff });
});

// ─────────────────────────────────────────────────────────
// POST /api/internal/staff
// Add a new MeTime Stories staff member (editor/admin only)
// ─────────────────────────────────────────────────────────
router.post("/internal/staff", async (req, res) => {
  const staffUser = req.internalUser!;

  if (staffUser.role !== "editor" && staffUser.role !== "admin") {
    res.status(403).json({ error: "Only editors can add staff" });
    return;
  }

  const { email, fullName, role, password } = req.body;
  if (!email || !fullName || !role || !password) {
    res.status(400).json({ error: "email, fullName, role, and password are required" });
    return;
  }

  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.default.hash(password, 10);

  try {
    const [newStaff] = await db
      .insert(meTimeStaffTable)
      .values({ email: email.toLowerCase().trim(), passwordHash, fullName, role, isActive: true })
      .returning({
        id: meTimeStaffTable.id,
        email: meTimeStaffTable.email,
        fullName: meTimeStaffTable.fullName,
        role: meTimeStaffTable.role,
        isActive: meTimeStaffTable.isActive,
      });

    res.json({ staff: newStaff });
  } catch (e: any) {
    if (e.code === "23505") {
      res.status(409).json({ error: "Email already exists" });
    } else {
      throw e;
    }
  }
});

// ─────────────────────────────────────────────────────────
// PUT /api/internal/staff/:id
// Update a staff member (editor/admin only)
// ─────────────────────────────────────────────────────────
router.put("/internal/staff/:id", async (req, res) => {
  const staffUser = req.internalUser!;

  if (staffUser.role !== "editor" && staffUser.role !== "admin") {
    res.status(403).json({ error: "Only editors can update staff" });
    return;
  }

  const { id } = req.params;
  const { fullName, role, isActive, password } = req.body;

  const updates: Record<string, unknown> = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (role !== undefined) updates.role = role;
  if (isActive !== undefined) updates.isActive = isActive;
  if (password) {
    const bcrypt = await import("bcryptjs");
    updates.passwordHash = await bcrypt.default.hash(password, 10);
  }

  const [updated] = await db
    .update(meTimeStaffTable)
    .set(updates)
    .where(eq(meTimeStaffTable.id, parseInt(id, 10)))
    .returning({
      id: meTimeStaffTable.id,
      email: meTimeStaffTable.email,
      fullName: meTimeStaffTable.fullName,
      role: meTimeStaffTable.role,
      isActive: meTimeStaffTable.isActive,
    });

  if (!updated) {
    res.status(404).json({ error: "Staff member not found" });
    return;
  }

  res.json({ staff: updated });
});

// ─────────────────────────────────────────────────────────
// DELETE /api/internal/staff/:id
// Deactivate (soft-delete) a staff member
// ─────────────────────────────────────────────────────────
router.delete("/internal/staff/:id", async (req, res) => {
  const staffUser = req.internalUser!;

  if (staffUser.role !== "editor" && staffUser.role !== "admin") {
    res.status(403).json({ error: "Only editors can deactivate staff" });
    return;
  }

  const { id } = req.params;
  const numId = parseInt(id, 10);

  if (numId === staffUser.id) {
    res.status(400).json({ error: "You cannot deactivate your own account" });
    return;
  }

  const [updated] = await db
    .update(meTimeStaffTable)
    .set({ isActive: false })
    .where(eq(meTimeStaffTable.id, numId))
    .returning({
      id: meTimeStaffTable.id,
      email: meTimeStaffTable.email,
      fullName: meTimeStaffTable.fullName,
      role: meTimeStaffTable.role,
      isActive: meTimeStaffTable.isActive,
    });

  if (!updated) {
    res.status(404).json({ error: "Staff member not found" });
    return;
  }

  res.json({ staff: updated });
});

// ─────────────────────────────────────────────────────────
// GET /api/internal/editor/stats
// Dashboard stats for editor view
// ─────────────────────────────────────────────────────────
router.get("/internal/editor/stats", async (req, res) => {
  const staffUser = req.internalUser!;

  if (staffUser.role !== "editor" && staffUser.role !== "admin") {
    res.status(403).json({ error: "Editor access required" });
    return;
  }

  const [allProjects, allStaff, allBlueprints] = await Promise.all([
    db.select().from(storyProjectsTable),
    db.select({
      id: meTimeStaffTable.id,
      email: meTimeStaffTable.email,
      fullName: meTimeStaffTable.fullName,
      role: meTimeStaffTable.role,
      isActive: meTimeStaffTable.isActive,
    }).from(meTimeStaffTable),
    db.select().from(storyBlueprintsTable),
  ]);

  const authors = allStaff.filter((s) => s.role === "author" && s.isActive);
  const blueprintsPendingApproval = allBlueprints.filter((b) => !b.blueprintApproved);
  const blueprintsApproved = allBlueprints.filter((b) => b.blueprintApproved);
  const inDraft = allProjects.filter((p) => p.status === "draft_in_progress" || p.status === "internal_review");
  const complete = allProjects.filter((p) => p.status === "final_ready" || p.status === "approved");

  res.json({
    stats: {
      totalProjects: allProjects.length,
      activeAuthors: authors.length,
      totalAuthors: authors.length,
      blueprintsPendingApproval: blueprintsPendingApproval.length,
      blueprintsApproved: blueprintsApproved.length,
      storiesInDraft: inDraft.length,
      storiesComplete: complete.length,
    },
    staff: allStaff,
    recentBlueprints: allBlueprints.slice(0, 20),
  });
});

export default router;
