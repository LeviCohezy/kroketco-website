import crypto from "node:crypto";
import { cookies } from "next/headers";

// ---------------------------------------------------------------------------
// Minimal single-admin auth. There is no user table: the admin proves identity
// with ADMIN_PASSWORD and receives a signed, httpOnly session cookie.
//
// The cookie value is `<expiry>.<hmac>` where the HMAC is keyed on the admin
// password itself, so changing the password invalidates all sessions. This is
// verifiable in the Edge/Node proxy without a DB lookup.
// ---------------------------------------------------------------------------

export const SESSION_COOKIE = "kroketco_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "kroketco-dev";
}

function secret(): string {
  // Derive a signing key from the password. Kept server-side only.
  return crypto.createHash("sha256").update(`kroketco::${adminPassword()}`).digest("hex");
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
