import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createResetToken } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

// "Wachtwoord vergeten?" — e-mails a one-time reset link to info@kroketco.be.
// Always answers the same way, so it reveals nothing to whoever clicks it.
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "onbekend";
  const token = createResetToken(ip);
  if (token) {
    // Prefer the configured public URL so a spoofed Host header can't redirect the link.
    const base = process.env.SITE_URL?.replace(/\/+$/, "") || siteOrigin(request);
    const link = `${base}/login-admin/reset?token=${encodeURIComponent(token)}`;
    await sendPasswordResetEmail({ link, ip, at: new Date() });
  }
  return NextResponse.json({ ok: true });
}

function siteOrigin(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");
  return host ? `${proto}://${host}` : request.nextUrl.origin;
}
