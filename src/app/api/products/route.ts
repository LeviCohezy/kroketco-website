import { NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/repo";
import { parseProduct } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(listProducts());
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  const parsed = parseProduct(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const product = createProduct(parsed.value);
  return NextResponse.json(product, { status: 201 });
}
