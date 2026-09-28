import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

// Image upload. Files are written to the uploads dir (default ./data/uploads,
// override with UPLOAD_DIR) and served back via GET /api/uploads/<file>.
// Protected by the proxy? No — uploads live under /api/uploads which the proxy
// does not match, so we auth here explicitly for POST.
import { isAuthenticated } from "@/lib/auth";

function uploadDir(): string {
  const dir = process.env.UPLOAD_DIR || path.join(process.cwd(), "data", "uploads");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

const IMAGES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif", "image/svg+xml"];
const VIDEOS = ["video/mp4", "video/webm"];
const ALLOWED = new Set([...IMAGES, ...VIDEOS]);
const EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Geen bestand" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Alleen afbeeldingen (png/jpg/webp/gif/avif/svg) of video (mp4/webm)" }, { status: 400 });
  }
  const isVideo = VIDEOS.includes(file.type);
  const maxMb = isVideo ? 60 : 12;
  if (file.size > maxMb * 1024 * 1024) {
    return NextResponse.json({ error: `Bestand te groot (max ${maxMb}MB)` }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const name = crypto.randomBytes(8).toString("hex") + (EXT[file.type] || "");
  fs.writeFileSync(path.join(uploadDir(), name), buf);

  return NextResponse.json({ url: `/api/uploads/${name}` }, { status: 201 });
}
