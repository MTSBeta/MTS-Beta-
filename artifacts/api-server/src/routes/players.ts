import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable, academiesTable } from "@workspace/db/schema";
import { RegisterPlayerBody, GetPlayerResponse } from "@workspace/api-zod";
import { generateCode } from "../lib/codeGenerator.js";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/players", async (req, res) => {
  const parsed = RegisterPlayerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { playerName, age, shirtNumber, academyKey, position, accessCode: submittedCode } = parsed.data;

  const [academy] = await db
    .select()
    .from(academiesTable)
    .where(eq(academiesTable.key, academyKey))
    .limit(1);

  if (!academy) {
    res.status(400).json({ error: "Invalid academy key" });
    return;
  }

  // Validate coach access code matches academy
  if (!submittedCode || submittedCode.toUpperCase() !== academy.accessCode?.toUpperCase()) {
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
      accessCode: player.accessCode,
      status: player.status,
      createdAt: player.createdAt.toISOString(),
    })
  );
});

router.get("/players/by-code/:code", async (req, res) => {
  const { code } = req.params;

  const [player] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.accessCode, code.toUpperCase()))
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
