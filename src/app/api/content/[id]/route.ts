import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { resetContent, saveContent } from "@/lib/content/store";
import { isSectionId } from "@/lib/content/registry";

export const dynamic = "force-dynamic";

// Save / reset one editable content section. The proxy already guards
// mutations under /api/content; we re-check here as defense in depth.

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  const { id } = await ctx.params;
  if (!isSectionId(id)) return NextResponse.json({ error: "Onbekende sectie" }, { status: 404 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  return NextResponse.json(saveContent(id, body));
}

// Reset = forget the edits and fall back to the original site texts.
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  const { id } = await ctx.params;
  if (!isSectionId(id)) return NextResponse.json({ error: "Onbekende sectie" }, { status: 404 });
  return NextResponse.json(resetContent(id));
}
