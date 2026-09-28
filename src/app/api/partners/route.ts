import { NextResponse } from "next/server";
import { listPartners, createPartner } from "@/lib/repo";
import { parsePartner } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const publishedOnly = new URL(request.url).searchParams.get("published") === "1";
  return NextResponse.json(listPartners({ publishedOnly }));
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  const parsed = parsePartner(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const partner = createPartner(parsed.value);
  return NextResponse.json(partner, { status: 201 });
}
