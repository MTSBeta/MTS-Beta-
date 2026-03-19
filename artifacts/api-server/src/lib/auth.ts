import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function resolveJwtSecret(): string {
  if (process.env.STAFF_JWT_SECRET) return process.env.STAFF_JWT_SECRET;
  if (process.env.NODE_ENV === "production") {
    console.error(
      "[auth] STAFF_JWT_SECRET is not set in production. " +
      "JWT signing will use an insecure fallback — set this secret immediately."
    );
  }
  return "dev-jwt-secret-change-me";
}

const JWT_SECRET = resolveJwtSecret();
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
