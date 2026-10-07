import crypto from "node:crypto";
import { getDb } from "./db";
import { setAdminPassword } from "./auth";

// ---------------------------------------------------------------------------
// One-time admin password reset tokens. Only the SHA-256 of a token is stored;
// the token itself only exists in the e-mailed link. Tokens live 15 minutes,
// work once, and a successful reset burns every other open token.
// ---------------------------------------------------------------------------

export const RESET_TTL_MS = 15 * 60 * 1000;
const MIN_INTERVAL_MS = 60 * 1000; // at most one reset mail per minute
export const MIN_PASSWORD_LENGTH = 8;

const hash = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

type Row = { id: number; expires_at: number; used_at: number | null };

/** Create a token, or null when one was requested less than a minute ago. */
export function createResetToken(ip: string, now = Date.now()): string | null {
  const db = getDb();
  const recent = db.prepare("SELECT 1 FROM password_resets WHERE created_at > ?").get(now - MIN_INTERVAL_MS);
  if (recent) return null;
  // Housekeeping: drop tokens that expired over a day ago.
  db.prepare("DELETE FROM password_resets WHERE expires_at < ?").run(now - 24 * 60 * 60 * 1000);
  const token = crypto.randomBytes(32).toString("base64url");
  db.prepare("INSERT INTO password_resets (token_hash, ip, created_at, expires_at) VALUES (?, ?, ?, ?)").run(
    hash(token),
    ip,
    now,
    now + RESET_TTL_MS
  );
  return token;
}

function findValid(token: string, now: number): Row | null {
  if (!token) return null;
  const row = getDb()
    .prepare("SELECT id, expires_at, used_at FROM password_resets WHERE token_hash = ?")
    .get(hash(token)) as Row | undefined;
  if (!row || row.used_at !== null || row.expires_at < now) return null;
  return row;
}

export function isResetTokenValid(token: string, now = Date.now()): boolean {
  return findValid(token, now) !== null;
}

/** Use a token to set a new admin password. Returns false if the token is invalid/used/expired. */
export function resetPasswordWithToken(token: string, newPassword: string, now = Date.now()): boolean {
  const db = getDb();
  return db.transaction(() => {
    if (!findValid(token, now)) return false;
    db.prepare("UPDATE password_resets SET used_at = ? WHERE used_at IS NULL").run(now);
    setAdminPassword(newPassword);
    return true;
  })();
}
