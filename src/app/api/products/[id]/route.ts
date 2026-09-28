import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProduct, updateProduct, deleteProduct } from "@/lib/repo";
import { parseProduct } from "@/lib/validate";

export const dynamic = "force-dynamic";

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/products/[id]">) {
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (id === null) return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  const product = getProduct(id);
  if (!product) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, ctx: RouteContext<"/api/products/[id]">) {
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (id === null) return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  const parsed = parseProduct(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const updated = updateProduct(id, parsed.value);
  if (!updated) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/products/[id]">) {
  const { id: raw } = await ctx.params;
  const id = parseId(raw);
  if (id === null) return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  const ok = deleteProduct(id);
  if (!ok) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
