import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { academyStaffTable, academiesTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import { verifyPassword, signToken, hashPassword } from "../lib/auth.js";
import { staffAuth } from "../middlewares/staffAuth.js";

const router: IRouter = Router();

function normalizeCode(s: string): string {
  return s.trim().toUpperCase().replace(/O/g, "0").replace(/[Il]/g, "1");
}

function buildUser(staff: typeof academyStaffTable.$inferSelect, academy: typeof academiesTable.$inferSelect) {
  return {
    id: staff.id,
    academyId: staff.academyId,
    academyName: academy.name,
    academyPrimaryColor: academy.primaryColor,
    academySecondaryColor: academy.secondaryColor,
    academyAccentColor: academy.accentColor ?? null,
    academyCrestUrl: academy.crestUrl ?? null,
    academyLogoText: academy.logoText,
    academyWelcomeMessage: academy.welcomeMessage,
    academyChantUrl: academy.chantUrl ?? null,
    name: staff.fullName,
    fullName: staff.fullName,
    email: staff.email,
    role: staff.systemRole,
    systemRole: staff.systemRole,
    questionRole: staff.questionRole ?? null,
    jobTitle: staff.jobTitle ?? "",
    teamName: staff.teamName ?? null,
    ageGroup: staff.ageGroup ?? null,
    isActive: staff.isActive,
  };
}

// Look up which academy a coach access code belongs to
router.get("/staff/lookup-academy", async (req, res) => {
  const code = String(req.query["code"] ?? "").trim();
  if (!code) { res.status(400).json({ error: "code required" }); return; }

  const result = await db.execute(
    sql`SELECT key, name FROM academies WHERE UPPER(REPLACE(access_code,' ','')) = UPPER(REPLACE(${code},' ','')) LIMIT 1`
  );
  if (!result.rows || result.rows.length === 0) {
    res.status(404).json({ error: "No academy found for this code" });
    return;
  }
  res.json({ key: result.rows[0].key, name: result.rows[0].name });
});

router.post("/staff/register", async (req, res) => {
  const { fullName, email, password, academyKey: rawAcademyKey, accessCode } = req.body;

  if (!fullName || !email || !password || !accessCode) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  // Look up academy by access code (academyKey is now optional — code is enough)
  const academyResult = await db.execute(
    sql`SELECT id, key, name, logo_text, primary_color, secondary_color, welcome_message, access_code
        FROM academies
        WHERE UPPER(REPLACE(access_code,' ','')) = UPPER(REPLACE(${accessCode.trim()},' ',''))
        ${rawAcademyKey ? sql`AND key = ${rawAcademyKey.trim().toLowerCase()}` : sql``}
        LIMIT 1`
  );

  if (!academyResult.rows || academyResult.rows.length === 0) {
    res.status(401).json({ error: "Invalid access code. Please check your code and try again." });
    return;
  }

  const academyRow = academyResult.rows[0];

  const [existing] = await db
    .select({ id: academyStaffTable.id })
    .from(academyStaffTable)
    .where(eq(academyStaffTable.email, email.toLowerCase().trim()))
    .limit(1);

  if (existing) {
    res.status(400).json({ error: "An account with this email already exists" });
    return;
  }

  const authUserId = await hashPassword(password);

  const [newStaff] = await db
    .insert(academyStaffTable)
    .values({
      academyId: academyRow.id as number,
      email: email.toLowerCase().trim(),
      authUserId,
      fullName: fullName.trim(),
      systemRole: "academy_admin",
      questionRole: null,
      jobTitle: "Academy Admin",
      teamName: null,
      ageGroup: null,
    })
    .returning();

  const academy = {
    id: academyRow.id,
    key: academyRow.key,
    name: academyRow.name,
    logoText: academyRow.logo_text,
    primaryColor: academyRow.primary_color,
    secondaryColor: academyRow.secondary_color,
    accentColor: null,
    crestUrl: null,
    welcomeMessage: academyRow.welcome_message,
    chantUrl: null,
  } as any;

  const token = signToken({
    staffId: newStaff.id,
    academyId: newStaff.academyId,
    role: "academy_admin",
  });

  const user = buildUser(newStaff, academy);
  res.status(201).json({ token, user, staff: user });
});

router.post("/staff/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const [staff] = await db
    .select()
    .from(academyStaffTable)
    .where(eq(academyStaffTable.email, email.toLowerCase().trim()))
    .limit(1);

  if (!staff) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  if (!staff.isActive) {
    res.status(401).json({ error: "Account is deactivated" });
    return;
  }

  const valid = await verifyPassword(password, staff.authUserId);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  // Get academy - use only columns that exist in the database
  const academyResult = await db.execute(
    sql`SELECT id, key, name, logo_text, primary_color, secondary_color, welcome_message 
        FROM academies WHERE id = ${staff.academyId} LIMIT 1`
  );

  if (!academyResult.rows || academyResult.rows.length === 0) {
    res.status(500).json({ error: "Academy not found" });
    return;
  }

  const academyRow = academyResult.rows[0];
  const academy = {
    id: academyRow.id,
    key: academyRow.key,
    name: academyRow.name,
    logoText: academyRow.logo_text,
    primaryColor: academyRow.primary_color,
    secondaryColor: academyRow.secondary_color,
    accentColor: null,
    crestUrl: null,
    welcomeMessage: academyRow.welcome_message,
    chantUrl: null,
  };

  const token = signToken({
    staffId: staff.id,
    academyId: staff.academyId,
    role: staff.systemRole,
  });

  const user = buildUser(staff, academy as any);
  res.json({ token, user, staff: user });
});

router.get("/staff/me", staffAuth, async (req, res) => {
  const rawStaff = req.staffUser!;

  const [staff] = await db
    .select()
    .from(academyStaffTable)
    .where(eq(academyStaffTable.id, rawStaff.id))
    .limit(1);

  if (!staff) {
    res.status(404).json({ error: "Staff not found" });
    return;
  }

  const academyResult = await db.execute(
    sql`SELECT id, key, name, logo_text, primary_color, secondary_color, welcome_message 
        FROM academies WHERE id = ${staff.academyId} LIMIT 1`
  );

  if (!academyResult.rows || academyResult.rows.length === 0) {
    res.status(404).json({ error: "Academy not found" });
    return;
  }

  const academyRow = academyResult.rows[0];
  const academy = {
    id: academyRow.id,
    key: academyRow.key,
    name: academyRow.name,
    logoText: academyRow.logo_text,
    primaryColor: academyRow.primary_color,
    secondaryColor: academyRow.secondary_color,
    accentColor: null,
    crestUrl: null,
    welcomeMessage: academyRow.welcome_message,
    chantUrl: null,
  } as any;

  const user = buildUser(staff, academy);
  res.json({ staff: user, user });
});

export default router;
