import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { academiesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { staffAuth } from "../middlewares/staffAuth.js";
import { requireRole } from "../middlewares/staffAuth.js";

const router: IRouter = Router();

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

router.get("/staff/academy", staffAuth, async (req, res) => {
  const staffUser = req.staffUser!;

  const [academy] = await db
    .select()
    .from(academiesTable)
    .where(eq(academiesTable.id, staffUser.academyId))
    .limit(1);

  if (!academy) {
    res.status(404).json({ error: "Academy not found" });
    return;
  }

  res.json({
    id: academy.id,
    name: academy.name,
    logoText: academy.logoText,
    primaryColor: academy.primaryColor,
    secondaryColor: academy.secondaryColor,
    accentColor: academy.accentColor ?? null,
    crestUrl: academy.crestUrl ?? null,
    welcomeMessage: academy.welcomeMessage,
    chantUrl: academy.chantUrl ?? null,
  });
});

router.patch("/staff/academy", staffAuth, requireRole("academy_admin"), async (req, res) => {
  const staffUser = req.staffUser!;
  const { primaryColor, secondaryColor, accentColor, crestUrl, logoText, welcomeMessage, chantUrl } = req.body;

  const updates: Record<string, unknown> = {};

  if (primaryColor !== undefined) {
    if (typeof primaryColor !== "string" || !HEX_COLOR_RE.test(primaryColor)) {
      res.status(400).json({ error: "primaryColor must be a valid hex color (e.g. #FF0000)" });
      return;
    }
    updates.primaryColor = primaryColor;
  }

  if (secondaryColor !== undefined) {
    if (typeof secondaryColor !== "string" || !HEX_COLOR_RE.test(secondaryColor)) {
      res.status(400).json({ error: "secondaryColor must be a valid hex color (e.g. #FFFFFF)" });
      return;
    }
    updates.secondaryColor = secondaryColor;
  }

  if (accentColor !== undefined) {
    if (accentColor !== null && accentColor !== "" && (typeof accentColor !== "string" || !HEX_COLOR_RE.test(accentColor))) {
      res.status(400).json({ error: "accentColor must be a valid hex color or empty" });
      return;
    }
    updates.accentColor = accentColor === "" ? null : accentColor;
  }

  if (crestUrl !== undefined) {
    if (crestUrl !== null && crestUrl !== "" && typeof crestUrl !== "string") {
      res.status(400).json({ error: "crestUrl must be a string URL or empty" });
      return;
    }
    updates.crestUrl = crestUrl === "" ? null : crestUrl;
  }

  if (logoText !== undefined) {
    if (typeof logoText !== "string" || logoText.length === 0 || logoText.length > 20) {
      res.status(400).json({ error: "logoText must be 1-20 characters" });
      return;
    }
    updates.logoText = logoText;
  }

  if (welcomeMessage !== undefined) {
    if (typeof welcomeMessage !== "string" || welcomeMessage.length === 0) {
      res.status(400).json({ error: "welcomeMessage cannot be empty" });
      return;
    }
    updates.welcomeMessage = welcomeMessage;
  }

  if (chantUrl !== undefined) {
    if (chantUrl !== null && chantUrl !== "" && typeof chantUrl !== "string") {
      res.status(400).json({ error: "chantUrl must be a string URL or empty" });
      return;
    }
    updates.chantUrl = chantUrl === "" ? null : chantUrl;
  }

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No valid fields provided" });
    return;
  }

  const [updated] = await db
    .update(academiesTable)
    .set(updates)
    .where(eq(academiesTable.id, staffUser.academyId))
    .returning();

  res.json({
    id: updated.id,
    name: updated.name,
    logoText: updated.logoText,
    primaryColor: updated.primaryColor,
    secondaryColor: updated.secondaryColor,
    accentColor: updated.accentColor ?? null,
    crestUrl: updated.crestUrl ?? null,
    welcomeMessage: updated.welcomeMessage,
    chantUrl: updated.chantUrl ?? null,
  });
});

export default router;
