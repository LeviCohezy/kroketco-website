// Post-export fixup for GitHub Pages project sites.
//
// Next applies basePath to its own managed URLs (next/link, next/image, _next
// assets), but NOT to raw HTML written by hand: <img src="/…">,
// <video><source src="/…">, poster="/…", <a href="/…">, srcset="/…".
// This walks the exported `out/` folder and prefixes those raw root-absolute
// paths with the repo base path — skipping ones Next already prefixed.
//
// Also drops a .nojekyll file so GitHub Pages serves the /_next folder.

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const BASE = "/kroketco-website";
const OUT = "out";

// prefix attribute paths that start with "/" but not "/kroketco-website"
const attrRe = new RegExp(
  `(\\b(?:src|href|poster|srcset)=")/(?!${BASE.slice(1)}\\b)`,
  "g"
);
// second+ url in a srcset list ("…, /foo 2x")
const srcsetExtraRe = new RegExp(`(,\\s*)/(?!${BASE.slice(1)}\\b)`, "g");

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (name.endsWith(".html")) fix(p);
  }
}

function fix(file) {
  let html = readFileSync(file, "utf8");
  const before = html;
  html = html.replace(attrRe, `$1${BASE}/`);
  html = html.replace(srcsetExtraRe, `$1${BASE}/`);
  if (html !== before) writeFileSync(file, html);
}

walk(OUT);
writeFileSync(join(OUT, ".nojekyll"), "");
console.log("fix-basepath: rewrote raw absolute paths + wrote .nojekyll");
