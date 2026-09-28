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
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

export async function GET(req: NextRequest, ctx: RouteContext<"/api/uploads/[file]">) {
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
  const headers: Record<string, string> = {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
  };
  // Uploaded SVGs must never run scripts if opened directly.
  if (ext === ".svg") headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'; img-src data:";

  const size = fs.statSync(/*turbopackIgnore: true*/ full).size;
  // Byte ranges so browsers (Safari especially) can stream uploaded videos.
  const range = req.headers.get("range");
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range);
  if (m && (m[1] || m[2])) {
    let start = m[1] ? Number(m[1]) : size - Number(m[2]);
    let end = m[1] && m[2] ? Number(m[2]) : size - 1;
    start = Math.max(0, start);
    end = Math.min(end, size - 1);
    if (start > end) {
      return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    const buf = Buffer.alloc(end - start + 1);
    const fd = fs.openSync(/*turbopackIgnore: true*/ full, "r");
    try {
      fs.readSync(fd, buf, 0, buf.length, start);
    } finally {
      fs.closeSync(fd);
    }
    return new NextResponse(new Uint8Array(buf), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(buf.length) },
    });
  }

  const data = fs.readFileSync(/*turbopackIgnore: true*/ full);
  return new NextResponse(new Uint8Array(data), { headers: { ...headers, "Content-Length": String(size) } });
}
