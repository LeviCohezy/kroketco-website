import type { JSONContent } from "@tiptap/core";

// Body storage helpers, shared by the editor and the public page.
//
// `posts.body` holds a STRINGIFIED ProseMirror/TipTap JSON document. Legacy
// seeded posts have plain-text bodies (blank-line separated paragraphs); those
// are detected and converted to an equivalent TipTap doc so nothing breaks.

export function isTiptapDoc(value: unknown): value is JSONContent {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as JSONContent).type === "doc" &&
    Array.isArray((value as JSONContent).content)
  );
}

// Turn plain text into a TipTap doc: blank-line separated blocks become
// paragraphs; single newlines within a block become hard breaks.
export function plainTextToDoc(text: string): JSONContent {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }

  return {
    type: "doc",
    content: blocks.map((block) => {
      const lines = block.split(/\n/);
      const inline: JSONContent[] = [];
      lines.forEach((line, i) => {
        if (i > 0) inline.push({ type: "hardBreak" });
        if (line) inline.push({ type: "text", text: line });
      });
      return { type: "paragraph", content: inline.length ? inline : undefined };
    }),
  };
}

// Parse a stored body string into a TipTap doc, handling both JSON and legacy
// plain text. Never throws.
export function parseBody(body: string | null | undefined): JSONContent {
  const raw = (body ?? "").trim();
  if (!raw) return { type: "doc", content: [{ type: "paragraph" }] };
  try {
    const parsed = JSON.parse(raw);
    if (isTiptapDoc(parsed)) return parsed;
  } catch {
    // not JSON → treat as legacy plain text
  }
  return plainTextToDoc(raw);
}
