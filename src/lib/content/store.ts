import { connection } from "next/server";
import { getDb } from "../db";
import { REGISTRY, isSectionId, resolveSection, type ContentOf, type SectionId, type SiteContent } from "./registry";

// Server-side access to editable content. Reading opts the route into dynamic
// rendering (connection()) so edits in /admin show up on the next request.

type Row = { id: string; data: string };

function readStored(): Map<string, Record<string, unknown>> {
  const rows = getDb().prepare("SELECT id, data FROM site_content").all() as Row[];
  const map = new Map<string, Record<string, unknown>>();
  for (const r of rows) {
    try {
      const parsed = JSON.parse(r.data);
      if (parsed && typeof parsed === "object") map.set(r.id, parsed);
    } catch {
      // Corrupt row → ignore, defaults win.
    }
  }
  return map;
}

export async function getAllContent(): Promise<SiteContent> {
  await connection();
  const stored = readStored();
  const out: Record<string, unknown> = {};
  for (const id of Object.keys(REGISTRY) as SectionId[]) {
    out[id] = resolveSection(REGISTRY[id], stored.get(id) ?? null);
  }
  return out as SiteContent;
}

export async function getContent<K extends SectionId>(id: K): Promise<ContentOf<K>> {
  await connection();
  const row = getDb().prepare("SELECT data FROM site_content WHERE id = ?").get(id) as { data: string } | undefined;
  let stored: Record<string, unknown> | null = null;
  try {
    stored = row ? JSON.parse(row.data) : null;
  } catch {
    stored = null;
  }
  return resolveSection(REGISTRY[id], stored) as ContentOf<K>;
}

export function saveContent(id: string, data: unknown): Record<string, unknown> {
  if (!isSectionId(id)) throw new Error("Onbekende sectie");
  // Normalise through the schema so only known keys with the right types land in the DB.
  const clean = resolveSection(REGISTRY[id], (data ?? {}) as Record<string, unknown>);
  getDb()
    .prepare(
      `INSERT INTO site_content (id, data, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
    )
    .run(id, JSON.stringify(clean));
  return clean;
}

export function resetContent(id: string): Record<string, unknown> {
  if (!isSectionId(id)) throw new Error("Onbekende sectie");
  getDb().prepare("DELETE FROM site_content WHERE id = ?").run(id);
  return resolveSection(REGISTRY[id], null);
}

export function contentUpdatedAt(): Record<string, string> {
  const rows = getDb().prepare("SELECT id, updated_at FROM site_content").all() as { id: string; updated_at: string }[];
  return Object.fromEntries(rows.map((r) => [r.id, r.updated_at]));
}
