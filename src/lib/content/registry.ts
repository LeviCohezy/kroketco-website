import type { Field, Section, SectionValue } from "./schema";
import { globalSections } from "./sections/global";
import { homeSections } from "./sections/home";
import { overOnsSections } from "./sections/over-ons";
import { groendaalSections } from "./sections/groendaal";
import { productenSections } from "./sections/producten";
import { nieuwsPartnersSections } from "./sections/nieuws-partners";

// Every editable section on the site, keyed by id ("<page>.<block>").
export const REGISTRY = {
  ...globalSections,
  ...homeSections,
  ...overOnsSections,
  ...groendaalSections,
  ...productenSections,
  ...nieuwsPartnersSections,
};

export type Registry = typeof REGISTRY;
export type SectionId = keyof Registry;
export type ContentOf<K extends SectionId> = SectionValue<Registry[K]>;
export type SiteContent = { [K in SectionId]: ContentOf<K> };

export function isSectionId(id: string): id is SectionId {
  return Object.prototype.hasOwnProperty.call(REGISTRY, id);
}

// Merge a stored (possibly partial / outdated) value over the defaults. Unknown
// keys are dropped; wrong types fall back to the default. Lists replace the
// default wholesale so the client can add/remove items.
function resolveField(field: Field, stored: unknown): unknown {
  if (field.type === "list") {
    if (!Array.isArray(stored)) return field.default.map((d) => ({ ...d }));
    return stored
      .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
      .map((item) => {
        const out: Record<string, string> = {};
        for (const f of field.fields) out[f.key] = typeof item[f.key] === "string" ? (item[f.key] as string) : f.default;
        return out;
      });
  }
  return typeof stored === "string" ? stored : field.default;
}

export function resolveSection(section: Section, stored: Record<string, unknown> | null): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of section.fields) out[f.key] = resolveField(f, stored?.[f.key]);
  return out;
}
