import { NextResponse } from "next/server";
import { renderPostBody } from "../../../admin/_editor/render";

// Renders a draft body (TipTap JSON string, or legacy plain text) to the same
// sanitized HTML the public page produces, so the editor's Preview tab is
// pixel-accurate. Auth-protected via proxy (matches /api/blog/*, POST).
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  const raw = typeof body === "object" && body !== null ? (body as Record<string, unknown>).body : "";
  const html = renderPostBody(typeof raw === "string" ? raw : "");
  return NextResponse.json({ html });
}
