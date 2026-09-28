import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPost, updatePost, deletePost } from "@/lib/repo";
import { parsePost } from "@/lib/validate";

export const dynamic = "force-dynamic";

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/blog/[id]">) {
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (id === null) return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  const post = getPost(id);
  if (!post) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, ctx: RouteContext<"/api/blog/[id]">) {
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (id === null) return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  const parsed = parsePost(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const updated = updatePost(id, parsed.value);
  if (!updated) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/blog/[id]">) {
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (id === null) return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  const ok = deletePost(id);
  if (!ok) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
