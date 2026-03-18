import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.STAFF_JWT_SECRET ?? (process.env.NODE_ENV === "production" ? (() => { throw new Error("STAFF_JWT_SECRET must be set in production"); })() : "dev-jwt-secret-change-me");
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── Academy staff tokens ───────────────────────────────────────────────────

export interface TokenPayload {
  staffId: number;
  academyId: number;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign({ ...payload, type: "academy" }, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

// ── MeTime Stories internal staff tokens ──────────────────────────────────

export interface InternalTokenPayload {
  internalStaffId: number;
  email: string;
  role: string;
  type: "internal";
}

export function signInternalToken(payload: Omit<InternalTokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "internal" }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyInternalToken(token: string): InternalTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as InternalTokenPayload;
  if (decoded.type !== "internal") {
    throw new Error("Invalid token type");
  }
  return decoded;
}
