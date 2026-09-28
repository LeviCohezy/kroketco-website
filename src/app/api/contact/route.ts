import { NextResponse } from "next/server";
import { createContactRequest } from "@/lib/repo";
import { parseContact } from "@/lib/validate";
import { sendContactNotification } from "@/lib/mailer";

export const dynamic = "force-dynamic";

// Public endpoint — every contact form on the site posts here.
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

  // Always persist to the CRM first, then send the email notification.
  // Email is best-effort — it must not fail the request if SMTP is down/unset.
  const saved = createContactRequest(parsed.value);
  await sendContactNotification(saved);

  return NextResponse.json({ ok: true }, { status: 201 });
}
