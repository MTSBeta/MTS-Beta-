import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// Legacy endpoint - redirects to staff submission flow
// This endpoint is deprecated but kept for backward compatibility
router.get("/coach/:coachCode", async (req, res) => {
  const { coachCode } = req.params;

  const [player] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.coachCode, coachCode))
    .limit(1);

  if (!player) {
    res.status(404).json({ error: "Invalid staff access code" });
    return;
  }

  res.json({
    id: player.id,
    playerName: player.playerName,
    academyName: player.academyName,
    position: player.position,
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
