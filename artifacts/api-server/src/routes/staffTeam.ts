import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { academyStaffTable, academiesTable } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { staffAuth, requireRole } from "../middlewares/staffAuth.js";
import { hashPassword } from "../lib/auth.js";

const router: IRouter = Router();

router.get("/staff/team", staffAuth, requireRole("academy_admin"), async (req, res) => {
  const staffUser = req.staffUser!;

  const rows = await db
    .select({
      id: academyStaffTable.id,
      academyId: academyStaffTable.academyId,
      email: academyStaffTable.email,
      fullName: academyStaffTable.fullName,
      systemRole: academyStaffTable.systemRole,
      jobTitle: academyStaffTable.jobTitle,
      teamName: academyStaffTable.teamName,
      ageGroup: academyStaffTable.ageGroup,
      isActive: academyStaffTable.isActive,
      createdAt: academyStaffTable.createdAt,
    })
    .from(academyStaffTable)
    .where(eq(academyStaffTable.academyId, staffUser.academyId))
    .orderBy(academyStaffTable.fullName);

  res.json(rows.map(r => ({
    ...r,
    name: r.fullName,
    role: r.systemRole,
  })));
});

router.post("/staff/team", staffAuth, requireRole("academy_admin"), async (req, res) => {
  const staffUser = req.staffUser!;
  const { email, password, fullName: fullNameField, name, systemRole, role, questionRole, jobTitle, teamName, ageGroup } = req.body;
  const fullName = fullNameField ?? name;

  if (!email || !password || !fullName) {
    res.status(400).json({ error: "email, password, and name are required" });
    return;
  }

  const createAcademyResult = await db.execute(
    sql`SELECT max_staff_accounts FROM academies WHERE id = ${staffUser.academyId} LIMIT 1`
  );
  const maxStaff = (createAcademyResult.rows?.[0] as any)?.max_staff_accounts ?? 8;

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(academyStaffTable)
    .where(
      and(
        eq(academyStaffTable.academyId, staffUser.academyId),
        eq(academyStaffTable.isActive, true)
      )
    );

  if (countResult.count >= maxStaff) {
    res.status(400).json({ error: `Maximum of ${maxStaff} active staff accounts reached` });
    return;
  }

  const existingEmail = await db
    .select({ id: academyStaffTable.id })
    .from(academyStaffTable)
    .where(eq(academyStaffTable.email, email.toLowerCase().trim()))
    .limit(1);

  if (existingEmail.length > 0) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }

  const authUserId = await hashPassword(password);

  const [newStaff] = await db
    .insert(academyStaffTable)
    .values({
      academyId: staffUser.academyId,
      email: email.toLowerCase().trim(),
      authUserId,
      fullName,
      systemRole: systemRole ?? "staff",
      questionRole: questionRole ?? null,
      jobTitle: jobTitle ?? null,
      teamName: teamName ?? null,
      ageGroup: ageGroup ?? null,
    })
    .returning({
      id: academyStaffTable.id,
      academyId: academyStaffTable.academyId,
      email: academyStaffTable.email,
      fullName: academyStaffTable.fullName,
      systemRole: academyStaffTable.systemRole,
      jobTitle: academyStaffTable.jobTitle,
      teamName: academyStaffTable.teamName,
      ageGroup: academyStaffTable.ageGroup,
      isActive: academyStaffTable.isActive,
      createdAt: academyStaffTable.createdAt,
    });

  res.status(201).json(newStaff);
});

router.put("/staff/team/:id", staffAuth, requireRole("academy_admin"), async (req, res) => {
  const staffId = parseInt(req.params.id as string, 10);
  const staffUser = req.staffUser!;

  if (isNaN(staffId)) {
    res.status(400).json({ error: "Invalid staff ID" });
    return;
  }

  const [existing] = await db
    .select()
    .from(academyStaffTable)
    .where(
      and(
        eq(academyStaffTable.id, staffId),
        eq(academyStaffTable.academyId, staffUser.academyId)
      )
    )
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Staff member not found" });
    return;
  }

  const { systemRole, role, questionRole, jobTitle, teamName, ageGroup, isActive, fullName, name } = req.body;
  const updateData: Record<string, unknown> = {};
  if (systemRole !== undefined) updateData.systemRole = systemRole;
  if (role !== undefined) updateData.systemRole = role;
  if (questionRole !== undefined) updateData.questionRole = questionRole;
  if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
  if (teamName !== undefined) updateData.teamName = teamName;
  if (ageGroup !== undefined) updateData.ageGroup = ageGroup;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (fullName !== undefined) updateData.fullName = fullName;
  if (name !== undefined) updateData.fullName = name;

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  if (isActive === true && !existing.isActive) {
    const updateAcademyResult = await db.execute(
      sql`SELECT max_staff_accounts FROM academies WHERE id = ${staffUser.academyId} LIMIT 1`
    );
    const maxStaff = (updateAcademyResult.rows?.[0] as any)?.max_staff_accounts ?? 8;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(academyStaffTable)
      .where(
        and(
          eq(academyStaffTable.academyId, staffUser.academyId),
          eq(academyStaffTable.isActive, true)
        )
      );

    if (countResult.count >= maxStaff) {
      res.status(400).json({ error: `Maximum of ${maxStaff} active staff accounts reached` });
      return;
    }
  }

  const [updated] = await db
    .update(academyStaffTable)
    .set(updateData)
    .where(eq(academyStaffTable.id, staffId))
    .returning({
      id: academyStaffTable.id,
      academyId: academyStaffTable.academyId,
      email: academyStaffTable.email,
      fullName: academyStaffTable.fullName,
      systemRole: academyStaffTable.systemRole,
      jobTitle: academyStaffTable.jobTitle,
      teamName: academyStaffTable.teamName,
      ageGroup: academyStaffTable.ageGroup,
      isActive: academyStaffTable.isActive,
      createdAt: academyStaffTable.createdAt,
    });

  res.json(updated);
});

router.patch("/staff/team/:id/toggle", staffAuth, requireRole("academy_admin"), async (req, res) => {
  const staffId = parseInt(req.params.id as string, 10);
  const staffUser = req.staffUser!;

  if (isNaN(staffId)) {
    res.status(400).json({ error: "Invalid staff ID" });
    return;
  }

  if (staffId === staffUser.id) {
    res.status(400).json({ error: "Cannot deactivate your own account" });
    return;
  }

  const [existing] = await db
    .select()
    .from(academyStaffTable)
    .where(and(eq(academyStaffTable.id, staffId), eq(academyStaffTable.academyId, staffUser.academyId)))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Staff member not found" });
    return;
  }

  const { isActive } = req.body;
  const newActive = typeof isActive === "boolean" ? isActive : !existing.isActive;

  if (newActive === true && !existing.isActive) {
    const toggleAcademyResult = await db.execute(
      sql`SELECT max_staff_accounts FROM academies WHERE id = ${staffUser.academyId} LIMIT 1`
    );
    const maxStaff = (toggleAcademyResult.rows?.[0] as any)?.max_staff_accounts ?? 8;
    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(academyStaffTable)
      .where(and(eq(academyStaffTable.academyId, staffUser.academyId), eq(academyStaffTable.isActive, true)));
    if (countResult.count >= maxStaff) {
      res.status(400).json({ error: `Maximum of ${maxStaff} active staff accounts reached` });
      return;
    }
  }

  await db.update(academyStaffTable).set({ isActive: newActive }).where(eq(academyStaffTable.id, staffId));
  res.json({ success: true, isActive: newActive });
});

router.delete("/staff/team/:id", staffAuth, requireRole("academy_admin"), async (req, res) => {
  const staffId = parseInt(req.params.id as string, 10);
  const staffUser = req.staffUser!;

  if (isNaN(staffId)) {
    res.status(400).json({ error: "Invalid staff ID" });
    return;
  }

  if (staffId === staffUser.id) {
    res.status(400).json({ error: "Cannot delete your own account" });
    return;
  }

  const [existing] = await db
    .select()
    .from(academyStaffTable)
    .where(
      and(
        eq(academyStaffTable.id, staffId),
        eq(academyStaffTable.academyId, staffUser.academyId)
      )
    )
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Staff member not found" });
    return;
  }

  await db.delete(academyStaffTable).where(eq(academyStaffTable.id, staffId));

  res.json({ success: true });
});

export default router;
