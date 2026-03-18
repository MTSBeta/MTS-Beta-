import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import {
  testConnection,
  syncPlayer,
  isSheetsConfigured,
  getRecentResponseLogs,
  TABS,
} from "../lib/googleSheets.js";
import { staffAuth } from "../middlewares/staffAuth.js";

const router: IRouter = Router();

// Test connection
router.get("/admin/sheets/test", staffAuth, async (req, res) => {
  const staffUser = req.staffUser!;
  if (staffUser.systemRole !== "academy_admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  const result = await testConnection();
  res.json(result);
});

// Get config status
router.get("/admin/sheets/status", staffAuth, async (req, res) => {
  const staffUser = req.staffUser!;
  if (staffUser.systemRole !== "academy_admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  res.json({
    configured: isSheetsConfigured(),
    sheetId: process.env["GOOGLE_SHEET_ID"] ?? null,
    serviceAccountEmail: process.env["GOOGLE_SERVICE_ACCOUNT_EMAIL"] ?? null,
    hasPrivateKey: !!(process.env["GOOGLE_PRIVATE_KEY"]),
    tabs: Object.values(TABS),
  });
});

// Manually sync all demo players to the sheet
router.post("/admin/sheets/sync-players", staffAuth, async (req, res) => {
  const staffUser = req.staffUser!;
  if (staffUser.systemRole !== "academy_admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  const players = await db.select().from(playersTable);
  const errors: string[] = [];
  let synced = 0;

  for (const player of players) {
    try {
      await syncPlayer({
        id: player.id,
        playerName: player.playerName,
        academyKey: player.academyKey,
        academyName: player.academyName,
        ageGroup: player.ageGroup ?? null,
        position: player.position,
        secondPosition: player.secondPosition ?? null,
        shirtNumber: player.shirtNumber ?? null,
        accessCode: player.accessCode,
        parentCode: player.parentCode ?? null,
        status: player.status,
      });
      synced++;
    } catch (e: any) {
      errors.push(`${player.playerName}: ${e?.message ?? String(e)}`);
    }
  }

  res.json({ synced, total: players.length, errors });
});

// Get recent Response_Log rows
router.get("/admin/sheets/recent-logs", staffAuth, async (req, res) => {
  const staffUser = req.staffUser!;
  if (staffUser.systemRole !== "academy_admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  const rows = await getRecentResponseLogs(30);
  res.json({ rows });
});

export default router;
