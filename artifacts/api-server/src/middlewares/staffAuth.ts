import { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { academyStaffTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken, type TokenPayload } from "../lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      staffUser?: {
        id: number;
        academyId: number;
        email: string;
        fullName: string;
        systemRole: string;
        jobTitle: string | null;
        teamName: string | null;
        ageGroup: string | null;
        isActive: boolean;
      };
    }
  }
}

export async function staffAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.slice(7);

  let payload: TokenPayload;
  try {
    payload = verifyToken(token);
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  const [staff] = await db
    .select()
    .from(academyStaffTable)
    .where(eq(academyStaffTable.id, payload.staffId))
    .limit(1);

  if (!staff || !staff.isActive) {
    res.status(401).json({ error: "Staff account not found or inactive" });
    return;
  }

  req.staffUser = {
    id: staff.id,
    academyId: staff.academyId,
    email: staff.email,
    fullName: staff.fullName,
    systemRole: staff.systemRole,
    jobTitle: staff.jobTitle,
    teamName: staff.teamName,
    ageGroup: staff.ageGroup,
    isActive: staff.isActive,
  };

  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.staffUser) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    if (!roles.includes(req.staffUser.systemRole)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
}
