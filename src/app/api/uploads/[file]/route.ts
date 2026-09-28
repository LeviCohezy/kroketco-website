import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

// Serves uploaded images from the (non-public) uploads dir. Public GET so the
// site can render them.
function uploadDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "data", "uploads");
}

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/uploads/[file]">) {
  const { file } = await ctx.params;
  // Prevent path traversal: only a bare filename is allowed.
  if (file.includes("/") || file.includes("\\") || file.includes("..")) {
    return NextResponse.json({ error: "Ongeldig pad" }, { status: 400 });
  }
  const full = path.join(uploadDir(), file);
  // Runtime-only read from a mounted volume; keep it out of the build trace.
  if (!fs.existsSync(/*turbopackIgnore: true*/ full)) {
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  }
  const ext = path.extname(file).toLowerCase();
  const data = fs.readFileSync(/*turbopackIgnore: true*/ full);
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
