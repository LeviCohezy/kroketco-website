import { NextResponse } from "next/server";
import { listPosts, createPost } from "@/lib/repo";
import { parsePost } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const publishedOnly = new URL(request.url).searchParams.get("published") === "1";
  return NextResponse.json(listPosts({ publishedOnly }));
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  const parsed = parsePost(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const post = createPost(parsed.value);
  return NextResponse.json(post, { status: 201 });
}
