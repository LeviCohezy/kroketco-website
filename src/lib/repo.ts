import { getDb, slugify } from "./db";
import type {
  Product,
  ProductInput,
  ProductCard,
  PrepMethod,
  Post,
  PostInput,
  Partner,
  PartnerInput,
  ContactRequest,
  ContactRequestInput,
} from "./types";

// ---------------------------------------------------------------------------
// Row <-> domain mapping. DB columns are snake_case; domain types are camelCase.
// ---------------------------------------------------------------------------

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  title: string;
  category: string;
  sub: string;
  description: string;
  image: string;
  prep_image: string;
  allergen_image: string;
  allergens: string;
  frame: string;
  veggie: number;
  price: number | null;
  tags: string;
  cards: string;
  ingredients: string;
  preparation: string;
  show_form: number;
  published: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// Safe JSON parse with a typed fallback — legacy/empty columns never throw.
function jparse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw);
    return v == null ? fallback : (v as T);
  } catch {
    return fallback;
  }
}

function normalizePrep(p: unknown): PrepMethod {
  const o = (p ?? {}) as Partial<PrepMethod>;
  return {
    enabled: !!o.enabled,
    temp: typeof o.temp === "string" ? o.temp : "",
    time: typeof o.time === "string" ? o.time : "",
    steps: Array.isArray(o.steps) ? o.steps.filter((s): s is string => typeof s === "string") : [],
  };
}

function toProduct(r: ProductRow): Product {
  const prep = jparse<{ oven?: unknown; frituur?: unknown }>(r.preparation, {});
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    title: r.title ?? "",
    category: r.category,
    sub: r.sub,
    description: r.description,
    image: r.image,
    prepImage: r.prep_image ?? "",
    allergenImage: r.allergen_image ?? "",
    allergens: r.allergens,
    frame: r.frame,
    veggie: r.veggie,
    tags: jparse<string[]>(r.tags, []).filter((t): t is string => typeof t === "string"),
    cards: jparse<ProductCard[]>(r.cards, []).filter(
      (c): c is ProductCard => !!c && typeof c === "object"
    ).map((c) => ({ title: String(c.title ?? ""), text: String(c.text ?? "") })),
    ingredients: jparse<string[]>(r.ingredients, []).filter((i): i is string => typeof i === "string"),
    preparation: { oven: normalizePrep(prep.oven), frituur: normalizePrep(prep.frituur) },
    showForm: r.show_form ?? 1,
    published: r.published,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

type PostRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover_image: string;
  author: string;
  date_label: string;
  show_form: number;
  published: number;
  published_at: string;
  created_at: string;
  updated_at: string;
};

function toPost(r: PostRow): Post {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    body: r.body,
    category: r.category,
    coverImage: r.cover_image,
    author: r.author,
    dateLabel: r.date_label,
    showForm: r.show_form,
    published: r.published,
    publishedAt: r.published_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// Ensures a slug is unique, appending -2, -3, … when needed. `exceptId` skips
// the row being updated so a product can keep its own slug.
function uniqueSlug(table: "products" | "posts" | "partners", base: string, exceptId?: number): string {
  const db = getDb();
  const root = slugify(base) || table.slice(0, -1);
  let candidate = root;
  let n = 2;
  const q = db.prepare(`SELECT id FROM ${table} WHERE slug = ?`);
  for (;;) {
    const hit = q.get(candidate) as { id: number } | undefined;
    if (!hit || hit.id === exceptId) return candidate;
    candidate = `${root}-${n++}`;
  }
}

// —— Products ——

export function listProducts(opts?: { publishedOnly?: boolean }): Product[] {
  const db = getDb();
  const where = opts?.publishedOnly ? "WHERE published = 1" : "";
  const rows = db
    .prepare(`SELECT * FROM products ${where} ORDER BY sort_order ASC, id ASC`)
    .all() as ProductRow[];
  return rows.map(toProduct);
}

export function getProduct(id: number): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow | undefined;
  return row ? toProduct(row) : null;
}

export function getProductBySlug(slug: string): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug) as ProductRow | undefined;
  return row ? toProduct(row) : null;
}

// Serialize the rich fields into JSON columns. `price` is intentionally left
// untouched (column kept but unused).
function richColumns(input: ProductInput) {
  return {
    title: input.title ?? "",
    prep_image: input.prepImage ?? "",
    allergen_image: input.allergenImage ?? "",
    tags: JSON.stringify(input.tags ?? []),
    cards: JSON.stringify(input.cards ?? []),
    ingredients: JSON.stringify(input.ingredients ?? []),
    preparation: JSON.stringify(input.preparation ?? {}),
    show_form: input.showForm ? 1 : 0,
  };
}

export function createProduct(input: ProductInput): Product {
  const db = getDb();
  const slug = uniqueSlug("products", input.slug || input.name);
  const info = db
    .prepare(
      `INSERT INTO products (slug, name, title, category, sub, description, image, prep_image, allergen_image, allergens, frame, veggie, tags, cards, ingredients, preparation, show_form, published, sort_order)
       VALUES (@slug, @name, @title, @category, @sub, @description, @image, @prep_image, @allergen_image, @allergens, @frame, @veggie, @tags, @cards, @ingredients, @preparation, @show_form, @published, @sort_order)`
    )
    .run({
      slug,
      name: input.name,
      category: input.category,
      sub: input.sub,
      description: input.description,
      image: input.image,
      allergens: input.allergens,
      frame: input.frame,
      veggie: input.veggie ? 1 : 0,
      published: input.published ? 1 : 0,
      sort_order: input.sortOrder,
      ...richColumns(input),
    });
  return getProduct(Number(info.lastInsertRowid))!;
}

export function updateProduct(id: number, input: ProductInput): Product | null {
  const db = getDb();
  if (!getProduct(id)) return null;
  const slug = uniqueSlug("products", input.slug || input.name, id);
  db.prepare(
    `UPDATE products SET slug=@slug, name=@name, title=@title, category=@category, sub=@sub, description=@description,
       image=@image, prep_image=@prep_image, allergen_image=@allergen_image, allergens=@allergens, frame=@frame, veggie=@veggie, tags=@tags, cards=@cards,
       ingredients=@ingredients, preparation=@preparation, show_form=@show_form, published=@published, sort_order=@sort_order,
       updated_at=datetime('now')
     WHERE id=@id`
  ).run({
    id,
    slug,
    name: input.name,
    category: input.category,
    sub: input.sub,
    description: input.description,
    image: input.image,
    allergens: input.allergens,
    frame: input.frame,
    veggie: input.veggie ? 1 : 0,
    published: input.published ? 1 : 0,
    sort_order: input.sortOrder,
    ...richColumns(input),
  });
  return getProduct(id);
}

export function deleteProduct(id: number): boolean {
  const db = getDb();
  return db.prepare("DELETE FROM products WHERE id = ?").run(id).changes > 0;
}

// —— Posts ——

export function listPosts(opts?: { publishedOnly?: boolean }): Post[] {
  const db = getDb();
  const where = opts?.publishedOnly ? "WHERE published = 1" : "";
  const rows = db
    .prepare(`SELECT * FROM posts ${where} ORDER BY published_at DESC, id DESC`)
    .all() as PostRow[];
  return rows.map(toPost);
}

export function getPost(id: number): Post | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as PostRow | undefined;
  return row ? toPost(row) : null;
}

export function getPostBySlug(slug: string): Post | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM posts WHERE slug = ?").get(slug) as PostRow | undefined;
  return row ? toPost(row) : null;
}

export function createPost(input: PostInput): Post {
  const db = getDb();
  const slug = uniqueSlug("posts", input.slug || input.title);
  const info = db
    .prepare(
      `INSERT INTO posts (slug, title, excerpt, body, category, cover_image, author, date_label, show_form, published, published_at)
       VALUES (@slug, @title, @excerpt, @body, @category, @cover_image, @author, @date_label, @show_form, @published, @published_at)`
    )
    .run({
      slug,
      title: input.title,
      excerpt: input.excerpt,
      body: input.body,
      category: input.category,
      cover_image: input.coverImage,
      author: input.author,
      date_label: input.dateLabel,
      show_form: input.showForm ? 1 : 0,
      published: input.published ? 1 : 0,
      published_at: input.publishedAt,
    });
  return getPost(Number(info.lastInsertRowid))!;
}

export function updatePost(id: number, input: PostInput): Post | null {
  const db = getDb();
  if (!getPost(id)) return null;
  const slug = uniqueSlug("posts", input.slug || input.title, id);
  db.prepare(
    `UPDATE posts SET slug=@slug, title=@title, excerpt=@excerpt, body=@body, category=@category,
       cover_image=@cover_image, author=@author, date_label=@date_label, show_form=@show_form,
       published=@published, published_at=@published_at, updated_at=datetime('now')
     WHERE id=@id`
  ).run({
    id,
    slug,
    title: input.title,
    excerpt: input.excerpt,
    body: input.body,
    category: input.category,
    cover_image: input.coverImage,
    author: input.author,
    date_label: input.dateLabel,
    show_form: input.showForm ? 1 : 0,
    published: input.published ? 1 : 0,
    published_at: input.publishedAt,
  });
  return getPost(id);
}

export function deletePost(id: number): boolean {
  const db = getDb();
  return db.prepare("DELETE FROM posts WHERE id = ?").run(id).changes > 0;
}

// —— Partners ——

type PartnerRow = {
  id: number;
  slug: string;
  name: string;
  logo: string;
  city: string;
  description: string;
  thumbnail: string;
  body: string;
  show_form: number;
  published: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function toPartner(r: PartnerRow): Partner {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    logo: r.logo,
    city: r.city,
    description: r.description,
    thumbnail: r.thumbnail,
    body: r.body,
    showForm: r.show_form ?? 1,
    published: r.published,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function listPartners(opts?: { publishedOnly?: boolean }): Partner[] {
  const db = getDb();
  const where = opts?.publishedOnly ? "WHERE published = 1" : "";
  const rows = db
    .prepare(`SELECT * FROM partners ${where} ORDER BY sort_order ASC, id ASC`)
    .all() as PartnerRow[];
  return rows.map(toPartner);
}

export function getPartner(id: number): Partner | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM partners WHERE id = ?").get(id) as PartnerRow | undefined;
  return row ? toPartner(row) : null;
}

export function getPartnerBySlug(slug: string): Partner | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM partners WHERE slug = ?").get(slug) as PartnerRow | undefined;
  return row ? toPartner(row) : null;
}

export function createPartner(input: PartnerInput): Partner {
  const db = getDb();
  const slug = uniqueSlug("partners", input.slug || input.name);
  const info = db
    .prepare(
      `INSERT INTO partners (slug, name, logo, city, description, thumbnail, body, show_form, published, sort_order)
       VALUES (@slug, @name, @logo, @city, @description, @thumbnail, @body, @show_form, @published, @sort_order)`
    )
    .run({
      slug,
      name: input.name,
      logo: input.logo,
      city: input.city,
      description: input.description,
      thumbnail: input.thumbnail,
      body: input.body,
      show_form: input.showForm ? 1 : 0,
      published: input.published ? 1 : 0,
      sort_order: input.sortOrder,
    });
  return getPartner(Number(info.lastInsertRowid))!;
}

export function updatePartner(id: number, input: PartnerInput): Partner | null {
  const db = getDb();
  if (!getPartner(id)) return null;
  const slug = uniqueSlug("partners", input.slug || input.name, id);
  db.prepare(
    `UPDATE partners SET slug=@slug, name=@name, logo=@logo, city=@city, description=@description,
       thumbnail=@thumbnail, body=@body, show_form=@show_form, published=@published, sort_order=@sort_order,
       updated_at=datetime('now')
     WHERE id=@id`
  ).run({
    id,
    slug,
    name: input.name,
    logo: input.logo,
    city: input.city,
    description: input.description,
    thumbnail: input.thumbnail,
    body: input.body,
    show_form: input.showForm ? 1 : 0,
    published: input.published ? 1 : 0,
    sort_order: input.sortOrder,
  });
  return getPartner(id);
}

export function deletePartner(id: number): boolean {
  const db = getDb();
  return db.prepare("DELETE FROM partners WHERE id = ?").run(id).changes > 0;
}

// —— Contact requests ——

type ContactRow = {
  id: number;
  name: string;
  email: string;
  message: string;
  post_slug: string;
  is_read: number;
  created_at: string;
};

function toContact(r: ContactRow): ContactRequest {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    message: r.message,
    postSlug: r.post_slug,
    isRead: r.is_read,
    createdAt: r.created_at,
  };
}

export function listContactRequests(): ContactRequest[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM contact_requests ORDER BY created_at DESC, id DESC")
    .all() as ContactRow[];
  return rows.map(toContact);
}

export function createContactRequest(input: ContactRequestInput): ContactRequest {
  const db = getDb();
  const info = db
    .prepare(
      `INSERT INTO contact_requests (name, email, message, post_slug)
       VALUES (@name, @email, @message, @post_slug)`
    )
    .run({
      name: input.name,
      email: input.email,
      message: input.message,
      post_slug: input.postSlug,
    });
  const row = db.prepare("SELECT * FROM contact_requests WHERE id = ?").get(Number(info.lastInsertRowid)) as ContactRow;
  return toContact(row);
}

export function setContactRead(id: number, read: boolean): boolean {
  const db = getDb();
  return db.prepare("UPDATE contact_requests SET is_read = ? WHERE id = ?").run(read ? 1 : 0, id).changes > 0;
}

export function deleteContactRequest(id: number): boolean {
  const db = getDb();
  return db.prepare("DELETE FROM contact_requests WHERE id = ?").run(id).changes > 0;
}
