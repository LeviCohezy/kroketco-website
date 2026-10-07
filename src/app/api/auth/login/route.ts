import { NextResponse } from "next/server";
import { checkPassword, signSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  const password = typeof body === "object" && body !== null ? (body as Record<string, unknown>).password : undefined;

  if (typeof password !== "string" || !checkPassword(password)) {
    return NextResponse.json({ error: "Verkeerd wachtwoord" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, signSession(), sessionCookieOptions);
  return res;
}
