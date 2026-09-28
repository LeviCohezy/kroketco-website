// Client-side slugify, mirrors the server's slugify in src/lib/db.ts so the
// auto-generated slug preview matches what the API would produce.
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
