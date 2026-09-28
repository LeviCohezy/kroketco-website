import { generateHTML } from "@tiptap/html";
import { sharedExtensions } from "./extensions";
import { parseBody } from "./content";

// Server-side rendering of a stored post body to HTML, using the SAME extension
// set as the editor so output matches the "Preview" pane exactly.
//
// Safety: generateHTML only emits nodes/marks defined by our schema (no raw
// HTML passthrough), so the attack surface is essentially attribute values.
// We defensively neutralise dangerous URL schemes on links and images.

const SAFE_URL = /^(https?:|mailto:|tel:|\/|#)/i;

function sanitize(html: string): string {
  // Strip event-handler attributes (defense in depth — the schema shouldn't
  // produce them, but be safe).
  let out = html.replace(/\son\w+="[^"]*"/gi, "").replace(/\son\w+='[^']*'/gi, "");

  // Neutralise unsafe href/src values (e.g. javascript:).
  out = out.replace(/\b(href|src)="([^"]*)"/gi, (m, attr, url) => {
    const trimmed = String(url).trim();
    if (SAFE_URL.test(trimmed) || trimmed.startsWith("data:image/")) return m;
    return `${attr}="#"`;
  });

  return out;
}

export function renderPostBody(body: string | null | undefined): string {
  const doc = parseBody(body);
  const html = generateHTML(doc, sharedExtensions);
  return sanitize(html);
}
