import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";

// ---------------------------------------------------------------------------
// Minimal single-admin auth. There is no user table: the admin proves identity
// with the admin password and receives a signed, httpOnly session cookie.
//
// The password is ADMIN_PASSWORD (env) unless it was changed through the
// "Wachtwoord vergeten?" reset flow, which stores a scrypt hash in the DB
// (admin_settings). Changing ADMIN_PASSWORD on the host later overrides a
// reset password again: the stored hash remembers which env value it replaced.
//
// The cookie value is `<expiry>.<hmac>` where the HMAC is keyed on the active
// password (or its hash), so changing the password invalidates all sessions.
// ---------------------------------------------------------------------------

export const SESSION_COOKIE = "kroketco_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "kroketco-dev";
}

function sha256(v: string): string {
  return crypto.createHash("sha256").update(v).digest("hex");
}

function getSetting(key: string): string | null {
  const row = getDb().prepare("SELECT value FROM admin_settings WHERE key = ?").get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

// The reset-flow hash, but only while ADMIN_PASSWORD is still the value it
// replaced. Once the env password changes, the reset password is discarded for
// good (so switching the env back later doesn't revive it).
function storedHash(): string | null {
  const hash = getSetting("password_hash");
  if (!hash) return null;
  if (getSetting("env_fingerprint") === sha256(adminPassword())) return hash;
  getDb().prepare("DELETE FROM admin_settings WHERE key IN ('password_hash', 'env_fingerprint')").run();
  return null;
}

function scryptHash(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${key}`;
}

function scryptVerify(password: string, stored: string): boolean {
  const [scheme, salt, key] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !key) return false;
  const a = Buffer.from(key, "hex");
  const b = crypto.scryptSync(password, salt, a.length);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function checkPassword(password: string): boolean {
  const hash = storedHash();
  if (hash) return scryptVerify(password, hash);
  const a = Buffer.from(sha256(password));
  const b = Buffer.from(sha256(adminPassword()));
  return crypto.timingSafeEqual(a, b);
}

// Set a new admin password (reset flow). Invalidates every existing session.
export function setAdminPassword(password: string): void {
  const upsert = getDb().prepare(
    `INSERT INTO admin_settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  );
  getDb().transaction(() => {
    upsert.run("password_hash", scryptHash(password));
    upsert.run("env_fingerprint", sha256(adminPassword()));
  })();
}

function secret(): string {
  // Derive a signing key from the active password. Kept server-side only.
  return sha256(`kroketco::${storedHash() ?? adminPassword()}`);
}

export function signSession(now = Date.now()): string {
  const expiry = now + SESSION_TTL_MS;
  const mac = crypto.createHmac("sha256", secret()).update(String(expiry)).digest("hex");
  return `${expiry}.${mac}`;
}

export function verifySession(token: string | undefined | null): boolean {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const expiryStr = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  const expected = crypto.createHmac("sha256", secret()).update(expiryStr).digest("hex");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Server-side check for use inside Server Components / Route Handlers.
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
  secure: process.env.NODE_ENV === "production",
};
