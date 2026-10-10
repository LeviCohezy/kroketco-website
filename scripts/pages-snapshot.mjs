// Crawl the running PAGES_SNAPSHOT build into a static site for GitHub Pages.
//
//   PAGES_SNAPSHOT=true npm run build
//   PAGES_SNAPSHOT=true npx next start -p 3222 &
//   node scripts/pages-snapshot.mjs http://localhost:3222 /kroketco-website out
//
// Every public page becomes <path>/index.html; public/ and .next/static are
// copied next to it; root-absolute URLs get the base path. Forms and other
// /api calls do not work on Pages — the result is a visual preview only.
import fs from "node:fs/promises";
import path from "node:path";

const [, , origin = "http://localhost:3222", base = "/kroketco-website", outDir = "out"] = process.argv;
const SKIP = /^\/(admin|api|login-admin|_next)(\/|$)/;
const FILE = /\.[a-z0-9]+$/i; // paths with an extension are saved as files (e.g. manifest.webmanifest)

const seen = new Set();
const queue = ["/"];
const uploads = new Set();

const strip = (h) => {
  h = h.split("#")[0].split("?")[0];
  if (h === base || h.startsWith(base + "/")) h = h.slice(base.length) || "/";
  return h;
};
const prefix = (v) => (v.startsWith("/") && !v.startsWith("//") && v !== base && !v.startsWith(base + "/") ? base + v : v);

function rewrite(html) {
  // attribute URLs
  html = html.replace(/(\s(?:src|href|poster|content|data-src)=")([^"]*)(")/g, (_, a, v, z) => a + prefix(v) + z);
  html = html.replace(/(\ssrcset=")([^"]*)(")/g, (_, a, v, z) =>
    a + v.split(",").map((c) => { const [u, ...d] = c.trim().split(/\s+/); return [prefix(u), ...d].join(" "); }).join(", ") + z);
  // inline style url(/...)
  html = html.replace(/url\((['"]?)(\/(?!\/)[^'")]*)\1\)/g, (m, q, v) => `url(${q}${prefix(v)}${q})`);
  return html;
}

async function save(rel, body) {
  const file = path.join(outDir, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body);
}

await fs.rm(outDir, { recursive: true, force: true });

while (queue.length) {
  const p = queue.shift();
  if (seen.has(p)) continue;
  seen.add(p);
  const res = await fetch(origin + base + (p === "/" ? "" : p), { redirect: "manual" }); // Next 308s a trailing slash
  if (!res.ok) { console.warn("skip", p, res.status); continue; }
  const html = await res.text();
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const h = m[1];
    if (!h.startsWith("/") || h.startsWith("//")) continue;
    const s = strip(h);
    if (SKIP.test(s) || (FILE.test(s) && !s.endsWith(".webmanifest")) || seen.has(s)) continue;
    queue.push(s);
  }
  for (const m of html.matchAll(/\/api\/uploads\/[A-Za-z0-9._-]+/g)) uploads.add(m[0]);
  await save(p === "/" ? "index.html" : FILE.test(p) ? p.slice(1) : p.slice(1) + "/index.html", rewrite(html));
  console.log("page", p);
}

// 404 page (GitHub Pages serves 404.html for unknown paths)
const nf = await fetch(origin + base + "/__missing__");
await save("404.html", rewrite(await nf.text()));

// CMS uploads referenced by pages
for (const u of uploads) {
  const r = await fetch(origin + base + u);
  if (r.ok) { await save(u.replace(/^\//, ""), Buffer.from(await r.arrayBuffer())); console.log("upload", u); }
}

// static assets
await fs.cp("public", outDir, { recursive: true, filter: (src) => !/\.DS_Store$|Kroketco-brandbook\.pdf$/.test(src) });
await fs.cp(".next/static", path.join(outDir, "_next/static"), { recursive: true });
await save(".nojekyll", "");
console.log(`done: ${seen.size} pages, ${uploads.size} uploads → ${outDir}/`);
