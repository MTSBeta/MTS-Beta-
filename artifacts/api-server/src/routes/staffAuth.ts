import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { academyStaffTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken } from "../lib/auth.js";
import { staffAuth } from "../middlewares/staffAuth.js";

const router: IRouter = Router();

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

  const token = signToken({
    staffId: staff.id,
    academyId: staff.academyId,
    role: staff.systemRole,
  });

  res.json({
    token,
    staff: {
      id: staff.id,
      academyId: staff.academyId,
      email: staff.email,
      fullName: staff.fullName,
      systemRole: staff.systemRole,
      jobTitle: staff.jobTitle,
      teamName: staff.teamName,
      ageGroup: staff.ageGroup,
      isActive: staff.isActive,
    },
  });
});

router.get("/staff/me", staffAuth, async (req, res) => {
  res.json({ staff: req.staffUser });
});

export default router;
