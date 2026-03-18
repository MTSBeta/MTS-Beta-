import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable, academiesTable } from "@workspace/db/schema";
import { RegisterPlayerBody, GetPlayerResponse } from "@workspace/api-zod";
import { generateCode } from "../lib/codeGenerator.js";
import { eq, sql } from "drizzle-orm";
import { syncPlayer, updateWorkflowStatus } from "../lib/googleSheets.js";

const router: IRouter = Router();

function normalizeCode(s: string): string {
  return s.trim().toUpperCase().replace(/O/g, "0").replace(/[Il]/g, "1");
}

router.post("/players", async (req, res) => {
  const parsed = RegisterPlayerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { playerName, age, shirtNumber, academyKey, position, secondPosition, accessCode: submittedCode } = parsed.data;

  // Get academy with only existing columns
  const academyResult = await db.execute(
    sql`SELECT id, key, name, access_code FROM academies WHERE key = ${academyKey} LIMIT 1`
  );

  if (!academyResult.rows || academyResult.rows.length === 0) {
    res.status(400).json({ error: "Invalid academy key" });
    return;
  }

  const academy = academyResult.rows[0];

  // Validate coach access code matches academy
  if (!submittedCode || normalizeCode(submittedCode) !== normalizeCode(String(academy.access_code ?? ""))) {
    res.status(400).json({ error: "Invalid access code" });
    return;
  }

  const playerAccessCode = generateCode("PLY");
  const parentCode = generateCode("PAR");

  const [player] = await db
    .insert(playersTable)
    .values({
      playerName,
      age,
      shirtNumber,
      academyKey,
      academyName: academy.name,
      position,
      secondPosition: secondPosition || null,
      accessCode: playerAccessCode,
      parentCode,
      status: "registered",
    })
    .returning();

  res.status(201).json(
    GetPlayerResponse.parse({
      id: player.id,
      playerName: player.playerName,
      age: player.age,
      shirtNumber: player.shirtNumber,
      academyKey: player.academyKey,
      academyName: player.academyName,
      position: player.position,
      secondPosition: player.secondPosition ?? null,
      accessCode: player.accessCode,
      status: player.status,
      createdAt: player.createdAt.toISOString(),
    })
  );

  // Sync to Google Sheets (fire-and-forget)
  syncPlayer({
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
  }).catch(e => console.error("[sheets] syncPlayer failed:", e));

  updateWorkflowStatus({
    accessCode: player.accessCode,
    playerName: player.playerName,
    status: player.status,
  }).catch(e => console.error("[sheets] updateWorkflowStatus failed:", e));
});

router.get("/players/by-code/:code", async (req, res) => {
  const { code } = req.params;

  const normalizedInput = normalizeCode(code);
  const [player] = await db
    .select()
    .from(playersTable)
    .where(
      sql`UPPER(REPLACE(REPLACE(${playersTable.accessCode}, 'O', '0'), 'I', '1')) = ${normalizedInput}`
    )
    .limit(1);

  if (!player) {
    res.status(404).json({ error: "Access code not found" });
    return;
  }

  res.json(
    GetPlayerResponse.parse({
      id: player.id,
      playerName: player.playerName,
      age: player.age,
      shirtNumber: player.shirtNumber,
      academyKey: player.academyKey,
      academyName: player.academyName,
      position: player.position,
      secondPosition: player.secondPosition ?? null,
      accessCode: player.accessCode,
      status: player.status,
      createdAt: player.createdAt.toISOString(),
    })
  );
});

router.get("/players/:playerId", async (req, res) => {
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

  res.json(
    GetPlayerResponse.parse({
      id: player.id,
      playerName: player.playerName,
      age: player.age,
      shirtNumber: player.shirtNumber,
      academyKey: player.academyKey,
      academyName: player.academyName,
      position: player.position,
      accessCode: player.accessCode,
      status: player.status,
      createdAt: player.createdAt.toISOString(),
    })
  );
});

export default router;
