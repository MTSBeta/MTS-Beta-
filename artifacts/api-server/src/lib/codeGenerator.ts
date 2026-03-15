import crypto from "crypto";

export function generateCode(prefix: string): string {
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${rand}`;
}
