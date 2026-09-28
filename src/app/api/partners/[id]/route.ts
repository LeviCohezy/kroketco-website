import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPartner, updatePartner, deletePartner } from "@/lib/repo";
import { parsePartner } from "@/lib/validate";

export const dynamic = "force-dynamic";

// Inline params signature (not RouteContext<...>) because this is a fresh route
// not yet in the generated route registry — mirrors src/app/api/contact/[id].
function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (id === null) return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  const partner = getPartner(id);
  if (!partner) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json(partner);
}

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (id === null) return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  const parsed = parsePartner(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const updated = updatePartner(id, parsed.value);
  if (!updated) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (id === null) return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  const ok = deletePartner(id);
  if (!ok) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
