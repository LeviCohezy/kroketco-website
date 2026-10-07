import { NextResponse } from "next/server";
import { MIN_PASSWORD_LENGTH, resetPasswordWithToken } from "@/lib/password-reset";

export const dynamic = "force-dynamic";

// Sets the new admin password from a valid reset link. All existing sessions
// are signed out (the session key derives from the password).
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  const token = typeof body.token === "string" ? body.token : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json({ error: `Kies minstens ${MIN_PASSWORD_LENGTH} tekens` }, { status: 400 });
  }
  if (!resetPasswordWithToken(token, password)) {
    return NextResponse.json({ error: "Deze link is verlopen of al gebruikt. Vraag een nieuwe aan." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
