// Shared CMS domain types. These mirror the DB schema (snake_case columns are
// mapped to camelCase in the db layer).

// A single preparation method (oven or frituur) on a product detail page.
export type PrepMethod = {
  enabled: boolean;
  temp: string; // e.g. "180°C"
  time: string; // e.g. "3–4 min"
  steps: string[]; // extra numbered steps
};

export type ProductCard = { title: string; text: string };

export type Product = {
  id: number;
  slug: string;
  name: string; // also the eyebrow on the detail page
  title: string; // detail-page H1 (separate from name)
  category: string;
  sub: string; // short line under the name, e.g. "4 stuks · romig"
  description: string;
  image: string;
  prepImage: string; // croquette cutout shown in the "Bereiding" section (falls back to image)
  allergenImage: string; // image shown left of the ingredients & allergens block (falls back to image)
  allergens: string; // comma-separated allergen codes: G,M,E,N,S
  frame: string; // CSS frame colour var, e.g. var(--frame-lime)
  veggie: number; // 0 | 1
  tags: string[]; // up to 4 short tags
  cards: ProductCard[]; // up to 4 feature cards
  ingredients: string[]; // ingredient list
  preparation: { oven: PrepMethod; frituur: PrepMethod };
  showForm: number; // 0 | 1 — render the contact form at the end of the detail page (default on)
  // `price` column still exists in the DB (nullable, unused) but is no longer
  // read or written by the app.
  published: number; // 0 | 1 — draft vs live on /producten
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export function emptyPrepMethod(): PrepMethod {
  return { enabled: false, temp: "", time: "", steps: [] };
}

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // TipTap JSON (stringified) or legacy plain text
  category: string;
  coverImage: string;
  author: string;
  dateLabel: string; // human date, e.g. "20 augustus 2026"
  showForm: number; // 0 | 1 — render a contact form at the end of the post
  published: number; // 0 | 1
  publishedAt: string; // ISO date used for <time datetime>
  createdAt: string;
  updatedAt: string;
};

export type Partner = {
  id: number;
  slug: string;
  name: string;
  logo: string; // logo image path
  city: string;
  description: string;
  thumbnail: string; // landscape/cover image path
  body: string; // TipTap JSON (stringified) or legacy plain text
  showForm: number; // 0 | 1 — render the contact form at the end of the detail page (default on)
  published: number; // 0 | 1
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ContactRequest = {
  id: number;
  name: string;
  email: string;
  message: string;
  postSlug: string;
  isRead: number; // 0 | 1
  createdAt: string;
};

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type PostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;
export type PartnerInput = Omit<Partner, "id" | "createdAt" | "updatedAt">;
export type ContactRequestInput = Pick<ContactRequest, "name" | "email" | "message" | "postSlug">;
