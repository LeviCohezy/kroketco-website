import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { setContactRead, deleteContactRequest } from "@/lib/repo";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// These mutate contact requests, so they require an admin session. /api/contact
// isn't covered by the proxy matcher (POST must stay public), so guard here.
function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Niet toegestaan" }, { status: 401 });
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (id === null) return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  const read = !!(body as { read?: unknown } | null)?.read;
  const ok = setContactRead(id, read);
  if (!ok) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json({ ok: true, read });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Niet toegestaan" }, { status: 401 });
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (id === null) return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  const ok = deleteContactRequest(id);
  if (!ok) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
