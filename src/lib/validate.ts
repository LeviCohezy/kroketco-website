import type { ProductInput, PostInput, PartnerInput, ContactRequestInput, PrepMethod } from "./types";

// Lightweight runtime validation + coercion for API bodies. Returns either a
// normalized input or an error message. No external deps.

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : v == null ? fallback : String(v);
}

// Coerce an unknown into an array of non-empty trimmed strings, capped at `max`.
function strArray(v: unknown, max = Infinity): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => str(x).trim())
    .filter(Boolean)
    .slice(0, max);
}

function parseCards(v: unknown): { title: string; text: string }[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
    .map((c) => ({ title: str(c.title).trim(), text: str(c.text).trim() }))
    .filter((c) => c.title || c.text)
    .slice(0, 4);
}

function parsePrep(v: unknown): PrepMethod {
  const o = (v ?? {}) as Record<string, unknown>;
  return {
    enabled: !!o.enabled,
    temp: str(o.temp).trim(),
    time: str(o.time).trim(),
    steps: strArray(o.steps, 3),
  };
}

export function parseProduct(data: unknown): Result<ProductInput> {
  if (typeof data !== "object" || data === null) return { ok: false, error: "Ongeldige body" };
  const d = data as Record<string, unknown>;
  const name = str(d.name).trim();
  if (!name) return { ok: false, error: "Naam is verplicht" };

  const prep = (d.preparation ?? {}) as Record<string, unknown>;

  return {
    ok: true,
    value: {
      slug: str(d.slug).trim(),
      name,
      title: str(d.title).trim(),
      category: str(d.category).trim(),
      sub: str(d.sub).trim(),
      description: str(d.description),
      image: str(d.image).trim(),
      prepImage: str(d.prepImage).trim(),
      allergenImage: str(d.allergenImage).trim(),
      allergens: str(d.allergens)
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
        .join(","),
      frame: str(d.frame).trim() || "var(--frame-lime)",
      veggie: d.veggie ? 1 : 0,
      tags: strArray(d.tags, 4),
      cards: parseCards(d.cards),
      ingredients: strArray(d.ingredients),
      preparation: { oven: parsePrep(prep.oven), frituur: parsePrep(prep.frituur) },
      showForm: d.showForm === undefined ? 1 : d.showForm ? 1 : 0,
      published: d.published === undefined ? 1 : d.published ? 1 : 0,
      sortOrder: Number.isFinite(Number(d.sortOrder)) ? Number(d.sortOrder) : 0,
    },
  };
}

export function parsePost(data: unknown): Result<PostInput> {
  if (typeof data !== "object" || data === null) return { ok: false, error: "Ongeldige body" };
  const d = data as Record<string, unknown>;
  const title = str(d.title).trim();
  if (!title) return { ok: false, error: "Titel is verplicht" };

  const publishedAt = str(d.publishedAt).trim() || new Date().toISOString().slice(0, 10);

  return {
    ok: true,
    value: {
      slug: str(d.slug).trim(),
      title,
      excerpt: str(d.excerpt),
      body: str(d.body),
      category: str(d.category).trim(),
      coverImage: str(d.coverImage).trim(),
      author: str(d.author).trim() || "Team Kroketco",
      dateLabel: str(d.dateLabel).trim(),
      showForm: d.showForm ? 1 : 0,
      published: d.published ? 1 : 0,
      publishedAt,
    },
  };
}

export function parsePartner(data: unknown): Result<PartnerInput> {
  if (typeof data !== "object" || data === null) return { ok: false, error: "Ongeldige body" };
  const d = data as Record<string, unknown>;
  const name = str(d.name).trim();
  if (!name) return { ok: false, error: "Naam is verplicht" };

  return {
    ok: true,
    value: {
      slug: str(d.slug).trim(),
      name,
      logo: str(d.logo).trim(),
      city: str(d.city).trim(),
      description: str(d.description),
      thumbnail: str(d.thumbnail).trim(),
      body: str(d.body), // kept as-is (TipTap JSON), same as posts
      showForm: d.showForm === undefined ? 1 : d.showForm ? 1 : 0,
      published: d.published === undefined ? 1 : d.published ? 1 : 0,
      sortOrder: Number.isFinite(Number(d.sortOrder)) ? Number(d.sortOrder) : 0,
    },
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseContact(data: unknown): Result<ContactRequestInput> {
  if (typeof data !== "object" || data === null) return { ok: false, error: "Ongeldige body" };
  const d = data as Record<string, unknown>;
  const name = str(d.name).trim();
  const email = str(d.email).trim();
  const message = str(d.message).trim();

  if (!name) return { ok: false, error: "Naam is verplicht" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Geldig e-mailadres is verplicht" };
  if (!message) return { ok: false, error: "Bericht is verplicht" };
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return { ok: false, error: "Invoer is te lang" };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      message,
      postSlug: str(d.postSlug).trim().slice(0, 200),
    },
  };
}
