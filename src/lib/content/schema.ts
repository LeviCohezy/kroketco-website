// ---------------------------------------------------------------------------
// Editable site content — schema types.
//
// Every piece of text, link, image or video a visitor sees is declared once as
// a field on a "section". The declaration carries the current (default) value,
// a label and a help text for the admin form. Stored edits (site_content table)
// are merged over these defaults at read time, so an empty database simply
// renders the site exactly as it was designed.
// ---------------------------------------------------------------------------

export type ScalarType =
  | "text" //     single-line text
  | "textarea" // multi-line text (line breaks are kept)
  | "url" //      link target: /pagina, /#anker, https://…, mailto:…, tel:…
  | "image" //    image path or uploaded image
  | "video"; //   video path or uploaded video

export type ScalarField = {
  key: string;
  type: ScalarType;
  label: string;
  /** Shown under the field in the admin: what it does / where it appears. */
  help?: string;
  default: string;
};

export type ListField = {
  key: string;
  type: "list";
  label: string;
  help?: string;
  /** Singular name for one item, e.g. "Link" or "Kaart". */
  itemLabel: string;
  fields: readonly ScalarField[];
  default: readonly Record<string, string>[];
};

export type Field = ScalarField | ListField;

export type Section = {
  /** Admin page this section is grouped under (see PAGES). */
  page: PageSlug;
  label: string;
  help?: string;
  fields: readonly Field[];
};

// Admin grouping + the public path used for the live preview.
export const PAGES = [
  { slug: "algemeen", label: "Algemeen (menu & footer)", path: "/" },
  { slug: "home", label: "Home", path: "/" },
  { slug: "producten", label: "Producten", path: "/producten" },
  { slug: "product", label: "Productpagina", path: "/producten" },
  { slug: "partners", label: "Partners", path: "/partners" },
  { slug: "groendaal", label: "Groendal", path: "/groendaal" },
  { slug: "over-ons", label: "Over ons", path: "/over-ons" },
  { slug: "nieuws", label: "Nieuws", path: "/nieuws" },
] as const;

export type PageSlug = (typeof PAGES)[number]["slug"];

// —— Type-level: turn a section declaration into the shape components read ——

type ItemOf<Fs extends readonly ScalarField[]> = { [F in Fs[number] as F["key"]]: string };

type ValueOf<F> = F extends { type: "list"; fields: infer I extends readonly ScalarField[] }
  ? ItemOf<I>[]
  : string;

export type SectionValue<S extends Section> = { [F in S["fields"][number] as F["key"]]: ValueOf<F> };

/** Identity helper that keeps literal keys so section values are fully typed. */
export function defineSections<const T extends Record<string, Section>>(sections: T): T {
  return sections;
}
