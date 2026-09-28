import { NextResponse } from "next/server";
import { createContactRequest } from "@/lib/repo";
import { parseContact } from "@/lib/validate";

export const dynamic = "force-dynamic";

// Public endpoint — the contact form at the end of a blog post posts here.
// No auth (visitors submit it); input is validated + length-capped in parseContact.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  const parsed = parseContact(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  createContactRequest(parsed.value);
  return NextResponse.json({ ok: true }, { status: 201 });
}
