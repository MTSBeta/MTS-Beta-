import { Router } from "express";
import { db } from "@workspace/db";
import { meTimeStaffTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, signInternalToken } from "../lib/auth.js";
import { internalAuth } from "../middlewares/internalAuth.js";

const router = Router();

// POST /api/internal/auth/login
router.post("/internal/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const [staff] = await db
    .select()
    .from(meTimeStaffTable)
    .where(eq(meTimeStaffTable.email, email.toLowerCase().trim()))
    .limit(1);

  if (!staff || !staff.isActive) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await verifyPassword(password, staff.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signInternalToken({
    internalStaffId: staff.id,
    email: staff.email,
    role: staff.role,
  });

  res.json({
    token,
    user: {
      id: staff.id,
      email: staff.email,
      fullName: staff.fullName,
      role: staff.role,
    },
  });
});

// GET /api/internal/auth/me
router.get("/internal/auth/me", internalAuth, (req, res) => {
  res.json({ user: req.internalUser });
});

export default router;
