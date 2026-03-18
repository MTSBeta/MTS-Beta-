import { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { meTimeStaffTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { verifyInternalToken, type InternalTokenPayload } from "../lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      internalUser?: {
        id: number;
        email: string;
        fullName: string;
        role: string;
        isActive: boolean;
      };
    }
  }
}

export async function internalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.slice(7);

  let payload: InternalTokenPayload;
  try {
    payload = verifyInternalToken(token);
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  const [staff] = await db
    .select()
    .from(meTimeStaffTable)
    .where(eq(meTimeStaffTable.id, payload.internalStaffId))
    .limit(1);

  if (!staff || !staff.isActive) {
    res.status(401).json({ error: "Account not found or inactive" });
    return;
  }

  req.internalUser = {
    id: staff.id,
    email: staff.email,
    fullName: staff.fullName,
    role: staff.role,
    isActive: staff.isActive,
  };

  next();
}
