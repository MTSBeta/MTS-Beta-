import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable, academiesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// Legacy endpoint - redirects to staff submission flow
// This endpoint is deprecated but kept for backward compatibility
router.get("/coach/:coachCode", async (req, res) => {
  const { coachCode } = req.params;

  const [row] = await db
    .select({
      id: playersTable.id,
      playerName: playersTable.playerName,
      academyName: playersTable.academyName,
      position: playersTable.position,
      crestUrl: academiesTable.crestUrl,
    })
    .from(playersTable)
    .leftJoin(academiesTable, eq(academiesTable.key, playersTable.academyKey))
    .where(eq(playersTable.coachCode, coachCode))
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "Invalid staff access code" });
    return;
  }

  res.json({
    id: row.id,
    playerName: row.playerName,
    academyName: row.academyName,
    position: row.position,
    crestUrl: row.crestUrl ?? null,
  });
});

// Legacy endpoint - deprecated, use /staff/submissions instead
router.post("/coach/:coachCode", async (req, res) => {
  res.status(410).json({ 
    error: "This endpoint is deprecated. Please use the staff submission portal instead.",
    message: "Coach submissions have been unified under the staff submissions system."
  });
});

export default router;
