import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// SQLite connection (singleton).
//
// The connection is created lazily and cached on globalThis so Next.js dev
// hot-reload doesn't open a new handle on every module re-evaluation. It must
// never be opened at import time — `next build` imports modules while there may
// be no writable data dir — so callers go through getDb().
// ---------------------------------------------------------------------------

type DB = Database.Database;

const g = globalThis as unknown as { __cmsDb?: DB };

function dbPath(): string {
  return process.env.CMS_DB_PATH || path.join(process.cwd(), "data", "cms.db");
}

function open(): DB {
  const file = dbPath();
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  seed(db);
  backfillProductImages(db);
  return db;
}

export function getDb(): DB {
  if (!g.__cmsDb) g.__cmsDb = open();
  return g.__cmsDb;
}

function migrate(db: DB) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      slug        TEXT NOT NULL UNIQUE,
      name        TEXT NOT NULL,
      title       TEXT NOT NULL DEFAULT '',
      category    TEXT NOT NULL DEFAULT '',
      sub         TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      image       TEXT NOT NULL DEFAULT '',
      allergens   TEXT NOT NULL DEFAULT '',
      frame       TEXT NOT NULL DEFAULT 'var(--frame-lime)',
      veggie      INTEGER NOT NULL DEFAULT 0,
      price       REAL,
      tags        TEXT NOT NULL DEFAULT '[]',
      cards       TEXT NOT NULL DEFAULT '[]',
      ingredients TEXT NOT NULL DEFAULT '[]',
      preparation TEXT NOT NULL DEFAULT '{}',
      published   INTEGER NOT NULL DEFAULT 1,
      sort_order  INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      slug         TEXT NOT NULL UNIQUE,
      title        TEXT NOT NULL,
      excerpt      TEXT NOT NULL DEFAULT '',
      body         TEXT NOT NULL DEFAULT '',
      category     TEXT NOT NULL DEFAULT '',
      cover_image  TEXT NOT NULL DEFAULT '',
      author       TEXT NOT NULL DEFAULT '',
      date_label   TEXT NOT NULL DEFAULT '',
      show_form    INTEGER NOT NULL DEFAULT 0,
      published    INTEGER NOT NULL DEFAULT 1,
      published_at TEXT NOT NULL DEFAULT (date('now')),
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_requests (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      message    TEXT NOT NULL DEFAULT '',
      post_slug  TEXT NOT NULL DEFAULT '',
      is_read    INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Editable site content (texts, links, images) per section; JSON blob
    -- merged over the defaults declared in src/lib/content/sections/*.
    CREATE TABLE IF NOT EXISTS site_content (
      id         TEXT PRIMARY KEY,
      data       TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS partners (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      slug        TEXT NOT NULL UNIQUE,
      name        TEXT NOT NULL,
      logo        TEXT NOT NULL DEFAULT '',
      city        TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      thumbnail   TEXT NOT NULL DEFAULT '',
      body        TEXT NOT NULL DEFAULT '',
      published   INTEGER NOT NULL DEFAULT 1,
      sort_order  INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Idempotent column adds so an EXISTING db volume upgrades cleanly. SQLite has
  // no "ADD COLUMN IF NOT EXISTS", so we check the table_info first.
  addColumnIfMissing(db, "posts", "show_form", "INTEGER NOT NULL DEFAULT 0");
  // date_label already exists in fresh schema; guard for older volumes too.
  addColumnIfMissing(db, "posts", "date_label", "TEXT NOT NULL DEFAULT ''");
  // products.published added later — existing product rows default to live.
  addColumnIfMissing(db, "products", "published", "INTEGER NOT NULL DEFAULT 1");
  // Rich product detail fields (stored as JSON TEXT). Existing volumes get
  // empty defaults; the detail page renders gracefully with empty values.
  addColumnIfMissing(db, "products", "title", "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(db, "products", "tags", "TEXT NOT NULL DEFAULT '[]'");
  addColumnIfMissing(db, "products", "cards", "TEXT NOT NULL DEFAULT '[]'");
  addColumnIfMissing(db, "products", "ingredients", "TEXT NOT NULL DEFAULT '[]'");
  addColumnIfMissing(db, "products", "preparation", "TEXT NOT NULL DEFAULT '{}'");
  addColumnIfMissing(db, "products", "prep_image", "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(db, "products", "allergen_image", "TEXT NOT NULL DEFAULT ''");
  // Contact-form toggle on CMS detail pages — default on; the CMS can turn it off.
  addColumnIfMissing(db, "products", "show_form", "INTEGER NOT NULL DEFAULT 1");
  addColumnIfMissing(db, "partners", "show_form", "INTEGER NOT NULL DEFAULT 1");
}

function addColumnIfMissing(db: DB, table: string, column: string, definition: string) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

function seed(db: DB) {
  const productCount = (db.prepare("SELECT COUNT(*) AS c FROM products").get() as { c: number }).c;
  if (productCount === 0) seedProducts(db);

  const postCount = (db.prepare("SELECT COUNT(*) AS c FROM posts").get() as { c: number }).c;
  if (postCount === 0) seedPosts(db);

  const partnerCount = (db.prepare("SELECT COUNT(*) AS c FROM partners").get() as { c: number }).c;
  if (partnerCount === 0) seedPartners(db);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// —— Seed data extracted from the original hardcoded pages ——

type SeedPrep = { temp: string; time: string; steps: string[] };
type SeedProduct = {
  name: string;
  title: string;
  sub: string;
  description: string;
  allergens: string[];
  src: string;
  frame: string;
  category: string;
  veggie?: boolean;
  tags: string[];
  cards: { title: string; text: string }[];
  ingredients: string[];
  frituur?: SeedPrep;
  oven?: SeedPrep;
};

const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: "Kaaskroket", title: "De romige Belgische kaaskroket", sub: "12 stuks · romig",
    description: "Onze klassieker: een goudbruin, krokant korstje rond een smeuïge vulling van volle kaas. Vers gedraaid en met de hand gepaneerd in ons atelier.",
    category: "Kroketten", src: "/products/kaaskroket.png", frame: "var(--frame-gold)", veggie: true,
    allergens: ["G", "M", "E"],
    tags: ["Ambachtelijk", "Vegetarisch", "100% Belgisch", "Vers gedraaid"],
    ingredients: ["Kaas (28%)", "Melk", "Boter", "Bloem (tarwe)", "Eieren", "Paneermeel (tarwe)", "Nootmuskaat", "Peper & zout"],
    cards: [{"title": "Vers gedraaid", "text": "Elke dag vers bereid in ons atelier in Roeselare."}, {"title": "Met de hand gepaneerd", "text": "Voor dat onweerstaanbaar krokante korstje."}, {"title": "Volle kaassmaak", "text": "Rijkelijk gevuld met echte kaas."}, {"title": "100% Belgisch", "text": "Ambachtelijk vakmanschap, dagvers geproduceerd."}],
    frituur: { temp: "175°C", time: "3 à 4 min", steps: ["Verwarm de friteuse voor op 175°C.", "Bak de bevroren kroketten 3 à 4 minuten tot ze goudbruin zijn.", "Laat kort uitlekken op keukenpapier en dien meteen op."] },
    oven: { temp: "220°C", time: "12 à 15 min", steps: ["Verwarm de oven voor op 220°C.", "Leg de kroketten op een bakplaat met bakpapier.", "Bak 12 à 15 minuten, draai halverwege, tot ze goudbruin en krokant zijn."] },
  },
  {
    name: "Groendal kaaskroket", title: "Kaaskroket met Groendal-kaas", sub: "4 stuks · premium",
    description: "Onze premium kaaskroket, gemaakt met bekroonde kaas van onze partner Groendal. Extra vol van smaak en heerlijk romig van binnen.",
    category: "Kroketten", src: "/products/groendal-kaaskroket.jpg", frame: "var(--frame-lime)", veggie: true,
    allergens: ["G", "M", "E"],
    tags: ["Premium", "Met Groendal-kaas", "Vegetarisch", "Bekroonde kaas"],
    ingredients: ["Groendal-kaas (30%)", "Melk", "Boter", "Bloem (tarwe)", "Eieren", "Paneermeel (tarwe)", "Nootmuskaat"],
    cards: [{"title": "Bekroonde kaas", "text": "Gemaakt met kaas van partner Groendal."}, {"title": "Extra romig", "text": "Een volle, rijke kaasvulling."}, {"title": "Ambachtelijk", "text": "Met de hand gepaneerd, vers gedraaid."}, {"title": "Dagvers", "text": "Elke dag vers geproduceerd in ons atelier in Roeselare."}],
    frituur: { temp: "175°C", time: "3 à 4 min", steps: ["Verwarm de friteuse voor op 175°C.", "Bak de kroketten 3 à 4 minuten goudbruin.", "Laat uitlekken en serveer direct."] },
    oven: { temp: "220°C", time: "12 à 15 min", steps: ["Verwarm de oven voor op 220°C.", "Leg op een bakplaat met bakpapier.", "Bak 12 à 15 minuten, draai halverwege."] },
  },
  {
    name: "Garnaalkroket", title: "De echte Noordzee-garnaalkroket", sub: "4 stuks · Noordzee",
    description: "Boordevol grijze Noordzeegarnalen in een romige bisque. Een Belgische klassieker op zijn best — feestelijk en vol van smaak.",
    category: "Kroketten", src: "/products/garnaalkroket.jpg", frame: "var(--frame-pink)",
    allergens: ["G", "M", "E"],
    tags: ["Noordzeegarnalen", "Ambachtelijk", "Feestelijk", "Vers gedraaid"],
    ingredients: ["Grijze garnalen (25%)", "Garnalenbisque", "Melk", "Boter", "Bloem (tarwe)", "Eieren", "Paneermeel (tarwe)", "Peterselie"],
    cards: [{"title": "Vol van garnalen", "text": "Royaal gevuld met grijze Noordzeegarnalen."}, {"title": "Romige bisque", "text": "Voor die diepe, volle zeesmaak."}, {"title": "Feestklassieker", "text": "Perfect als voor- of hoofdgerecht."}, {"title": "100% Belgisch", "text": "Ambachtelijk vakmanschap, van bij ons."}],
    frituur: { temp: "175°C", time: "3 à 4 min", steps: ["Verwarm de friteuse voor op 175°C.", "Bak de kroketten 3 à 4 minuten tot ze goudbruin zijn.", "Laat kort uitlekken en serveer met een partje citroen en gefrituurde peterselie."] },
    oven: { temp: "220°C", time: "12 à 15 min", steps: ["Verwarm de oven voor op 220°C.", "Leg op een bakplaat met bakpapier.", "Bak 12 à 15 minuten, draai halverwege."] },
  },
  {
    name: "Superano hamkroket", title: "Hamkroket met Superano-ham", sub: "6 stuks · hartig",
    description: "Een hartige kroket met stukjes Superano-ham in een fijne bechamel. Krokant van buiten, smeuïg van binnen en heerlijk vullend.",
    category: "Kroketten", src: "/products/hamkroket.jpg", frame: "var(--frame-orange)",
    allergens: ["G", "M", "E"],
    tags: ["Met Superano-ham", "Hartig", "Ambachtelijk", "Vers gedraaid"],
    ingredients: ["Superano-ham (25%)", "Melk", "Boter", "Bloem (tarwe)", "Eieren", "Paneermeel (tarwe)", "Mosterd", "Peper & nootmuskaat"],
    cards: [{"title": "Echte ham", "text": "Met stukjes gedroogde Superano-ham."}, {"title": "Fijne bechamel", "text": "Romig, hartig en vol van smaak."}, {"title": "Met de hand gepaneerd", "text": "Voor een krokant korstje."}, {"title": "Stevig & vullend", "text": "Een hartige klassieker voor de trek."}],
    frituur: { temp: "175°C", time: "3 à 4 min", steps: ["Verwarm de friteuse voor op 175°C.", "Bak de kroketten 3 à 4 minuten goudbruin.", "Laat uitlekken op keukenpapier."] },
    oven: { temp: "220°C", time: "12 à 15 min", steps: ["Verwarm de oven voor op 220°C.", "Leg op een bakplaat met bakpapier.", "Bak 12 à 15 minuten, draai halverwege."] },
  },
  {
    name: "Aardappelkroket", title: "De klassieke aardappelkroket", sub: "1 kg · garnituur",
    description: "Onze goudgele aardappelkroket met een luchtige binnenkant en een krokant korstje. Het perfecte garnituur bij vlees, vis of gevogelte.",
    category: "Aardappel", src: "/products/aardappelkroket.jpg", frame: "var(--frame-gold)", veggie: true,
    allergens: ["G", "M", "E"],
    tags: ["Vegetarisch", "Klassiek garnituur", "Krokant", "Belgisch"],
    ingredients: ["Aardappel (85%)", "Boter", "Eieren", "Paneermeel (tarwe)", "Nootmuskaat", "Zout"],
    cards: [{"title": "Luchtig van binnen", "text": "Een zachte, smeuïge aardappelvulling."}, {"title": "Goudbruin & krokant", "text": "Perfect knapperig korstje."}, {"title": "Veelzijdig garnituur", "text": "Bij vlees, vis of gevogelte."}, {"title": "100% Belgisch", "text": "Ambachtelijk bereid met echte aardappelen."}],
    frituur: { temp: "175°C", time: "3 à 4 min", steps: ["Verwarm de friteuse voor op 175°C.", "Bak de bevroren kroketten 3 à 4 minuten tot ze goudbruin zijn.", "Laat kort uitlekken en breng op smaak met een snuf zout."] },
    oven: { temp: "220°C", time: "15 à 18 min", steps: ["Verwarm de oven voor op 220°C.", "Verdeel de kroketten over een bakplaat met bakpapier.", "Bak 15 à 18 minuten, draai halverwege, tot ze goudbruin zijn."] },
  },
  {
    name: "Aardappelkroket (blok)", title: "Aardappelkroket in blokvorm", sub: "1 kg · voor de horeca",
    description: "Dezelfde smeuïge aardappelvulling, nu in een handig blokmodel — makkelijk te portioneren en ideaal voor de horeca.",
    category: "Aardappel", src: "/products/aardappelkroket-blok.jpg", frame: "var(--frame-purple)", veggie: true,
    allergens: ["G", "M", "E"],
    tags: ["Vegetarisch", "Voor de horeca", "Handig formaat", "Krokant"],
    ingredients: ["Aardappel (85%)", "Boter", "Eieren", "Paneermeel (tarwe)", "Nootmuskaat", "Zout"],
    cards: [{"title": "Handig blokmodel", "text": "Makkelijk te portioneren op het bord."}, {"title": "Voor de horeca", "text": "Consistent formaat, constante kwaliteit."}, {"title": "Krokant korstje", "text": "Goudbruin uit friteuse of oven."}, {"title": "Constante kwaliteit", "text": "Elke kroket even mooi en gelijk geportioneerd."}],
    frituur: { temp: "175°C", time: "3 à 4 min", steps: ["Verwarm de friteuse voor op 175°C.", "Bak 3 à 4 minuten tot goudbruin.", "Laat uitlekken op keukenpapier."] },
    oven: { temp: "220°C", time: "15 à 18 min", steps: ["Verwarm de oven voor op 220°C.", "Leg op een bakplaat met bakpapier.", "Bak 15 à 18 minuten, draai halverwege."] },
  },
  {
    name: "Aardappelkroket (licht gepaneerd)", title: "Licht gepaneerde aardappelkroket", sub: "1 kg · fijne panering",
    description: "Een fijnere, lichtere panering rond onze klassieke aardappelvulling — subtiel krokant en elegant op het bord.",
    category: "Aardappel", src: "/products/aardappelkroket-licht.jpg", frame: "var(--frame-blue)", veggie: true,
    allergens: ["G", "M", "E"],
    tags: ["Vegetarisch", "Fijne panering", "Elegant", "Belgisch"],
    ingredients: ["Aardappel (85%)", "Boter", "Eieren", "Paneermeel (tarwe)", "Nootmuskaat", "Zout"],
    cards: [{"title": "Fijne panering", "text": "Een subtieler, lichter korstje."}, {"title": "Elegant op het bord", "text": "Verfijnd garnituur voor fijne gerechten."}, {"title": "Luchtige vulling", "text": "Zacht en smeuïg van binnen."}, {"title": "Verfijnd", "text": "Elegant garnituur voor fijne gerechten."}],
    frituur: { temp: "175°C", time: "3 à 4 min", steps: ["Verwarm de friteuse voor op 175°C.", "Bak 3 à 4 minuten tot goudbruin.", "Laat uitlekken op keukenpapier."] },
    oven: { temp: "220°C", time: "15 à 18 min", steps: ["Verwarm de oven voor op 220°C.", "Leg op een bakplaat met bakpapier.", "Bak 15 à 18 minuten, draai halverwege."] },
  },
  {
    name: "Mini kaaskroket", title: "Mini kaaskroketjes voor de borrel", sub: "24 stuks · borrel",
    description: "Kleine, ronde kaasbolletjes met een krokant korstje — ideaal als hapje bij de borrel of het aperitief.",
    category: "Mini's & borrelhapjes", src: "/products/mini-kaaskroket.jpg", frame: "var(--frame-gold)", veggie: true,
    allergens: ["G", "M", "E"],
    tags: ["Borrelhapje", "Vegetarisch", "Om te delen", "Ambachtelijk"],
    ingredients: ["Kaas (28%)", "Melk", "Boter", "Bloem (tarwe)", "Eieren", "Paneermeel (tarwe)", "Nootmuskaat"],
    cards: [{"title": "Perfect hapformaat", "text": "In één keer te eten."}, {"title": "Recht uit de frituur", "text": "Warm en krokant serveren."}, {"title": "Voor elk feest", "text": "Onmisbaar op de borrelplank."}, {"title": "Vegetarisch", "text": "Zonder vlees, boordevol kaassmaak."}],
    frituur: { temp: "175°C", time: "2 à 3 min", steps: ["Verwarm de friteuse voor op 175°C.", "Bak de mini's 2 à 3 minuten goudbruin.", "Laat kort uitlekken en serveer meteen."] },
    oven: { temp: "220°C", time: "10 à 12 min", steps: ["Verwarm de oven voor op 220°C.", "Verdeel over een bakplaat met bakpapier.", "Bak 10 à 12 minuten, draai halverwege."] },
  },
  {
    name: "Mini garnaalkroket", title: "Mini garnaalkroketjes", sub: "24 stuks · borrel",
    description: "De volle smaak van onze garnaalkroket in een klein borrelformaat. Boordevol grijze garnalen — een luxe hapje voor bij het aperitief.",
    category: "Mini's & borrelhapjes", src: "/products/mini-garnaalkroket.jpg", frame: "var(--frame-pink)",
    allergens: ["G", "M", "E"],
    tags: ["Borrelhapje", "Noordzeegarnalen", "Feestelijk", "Om te delen"],
    ingredients: ["Grijze garnalen (25%)", "Garnalenbisque", "Melk", "Boter", "Bloem (tarwe)", "Eieren", "Paneermeel (tarwe)"],
    cards: [{"title": "Luxe hapje", "text": "Boordevol grijze garnalen."}, {"title": "Borrelformaat", "text": "Ideaal voor het aperitief."}, {"title": "Feestelijk", "text": "Maakt elke receptie compleet."}, {"title": "Ambachtelijk", "text": "Met de hand bereid, vers gedraaid."}],
    frituur: { temp: "175°C", time: "2 à 3 min", steps: ["Verwarm de friteuse voor op 175°C.", "Bak de mini's 2 à 3 minuten goudbruin.", "Laat uitlekken en serveer direct."] },
    oven: { temp: "220°C", time: "10 à 12 min", steps: ["Verwarm de oven voor op 220°C.", "Verdeel over een bakplaat met bakpapier.", "Bak 10 à 12 minuten, draai halverwege."] },
  },
  {
    name: "Mini aardappelkroketjes", title: "Mini aardappelkroketjes", sub: "24 stuks · garnituur",
    description: "Knapperige aardappelbolletjes, goudbruin gebakken. Het ideale garnituur bij een feestmenu of als hapje bij de borrel.",
    category: "Mini's & borrelhapjes", src: "/products/mini-aardappelkroket.jpg", frame: "var(--frame-blue)", veggie: true,
    allergens: ["G", "M", "E"],
    tags: ["Vegetarisch", "Krokant", "Garnituur", "Om te delen"],
    ingredients: ["Aardappel (85%)", "Boter", "Eieren", "Paneermeel (tarwe)", "Nootmuskaat", "Zout"],
    cards: [{"title": "Knapperige bolletjes", "text": "Goudbruin en krokant."}, {"title": "Feestgarnituur", "text": "Perfect bij een feestmenu."}, {"title": "Ook als hapje", "text": "Lekker met een dipsausje."}, {"title": "Vegetarisch", "text": "Krokant garnituur of een vlot hapje."}],
    frituur: { temp: "175°C", time: "2 à 3 min", steps: ["Verwarm de friteuse voor op 175°C.", "Bak 2 à 3 minuten tot goudbruin.", "Laat uitlekken op keukenpapier."] },
    oven: { temp: "220°C", time: "10 à 12 min", steps: ["Verwarm de oven voor op 220°C.", "Verdeel over een bakplaat met bakpapier.", "Bak 10 à 12 minuten, draai halverwege."] },
  },
  {
    name: "Aardappelpuree", title: "Ambachtelijke aardappelpuree", sub: "1 kg · roomboter",
    description: "Verse puree van échte aardappelen, roomboter en een snuf nootmuskaat. Geen poeder, geen shortcuts — zoals thuis, maar dan zonder het werk.",
    category: "Puree", src: "/products/aardappelpuree.jpg", frame: "var(--frame-lime)", veggie: true,
    allergens: ["M"],
    tags: ["Vegetarisch", "Verse aardappelen", "Roomboter", "Zonder poeder"],
    ingredients: ["Aardappelen (90%)", "Melk", "Roomboter", "Nootmuskaat", "Zout"],
    cards: [{"title": "Echte aardappelen", "text": "Geen poeder, enkel verse aardappelen."}, {"title": "Met roomboter", "text": "Vol en romig van smaak."}, {"title": "Zoals thuis", "text": "Ambachtelijk bereid, klaar in een handomdraai."}, {"title": "Zo warm je op", "text": "Verwarm zachtjes in een pannetje met een scheutje melk, of in de microgolf."}],
  },
];

// Per-product photos for the two detail-page sections: the loose croquette
// next to "Bereiding" (prep) and the large photo next to "Ingrediënten &
// allergenen" (allergen). Keyed by product slug; files live in public/ so they
// ship with every deploy.
const PREP = "/kroketten-voor-bereidingssectie";
const INGR = "/products/ingredienten";
const PRODUCT_SECTION_IMAGES: Record<string, { prep: string; allergen: string }> = {
  "kaaskroket": { prep: `${PREP}/kaas.png`, allergen: `${INGR}/kaaskroket.webp` },
  "groendal-kaaskroket": { prep: `${PREP}/kaas.png`, allergen: `${INGR}/groendal-kaaskroket.webp` },
  "garnaalkroket": { prep: `${PREP}/garnaal.png`, allergen: `${INGR}/garnaalkroket.webp` },
  "superano-hamkroket": { prep: `${PREP}/vlees.png`, allergen: `${INGR}/superano-hamkroket.webp` },
  "aardappelkroket": { prep: `${PREP}/aardappel-1.png`, allergen: `${INGR}/aardappelkroket.webp` },
  "aardappelkroket-geel-gepaneerd": { prep: `${PREP}/aardappel-2.png`, allergen: `${INGR}/aardappelkroket-geel-gepaneerd.webp` },
  // Same product under its seed name ("Aardappelkroket (blok)").
  "aardappelkroket-blok": { prep: `${PREP}/aardappel-2.png`, allergen: `${INGR}/aardappelkroket-geel-gepaneerd.webp` },
  "aardappelkroket-licht-gepaneerd": { prep: `${PREP}/aardappel-3.png`, allergen: `${INGR}/aardappelkroket-licht-gepaneerd.webp` },
  "mini-kaaskroket": { prep: `${PREP}/mini-kaas.png`, allergen: `${INGR}/mini-kaaskroket.webp` },
  "mini-garnaalkroket": { prep: `${PREP}/mini-garnaal.png`, allergen: `${INGR}/mini-garnaalkroket.webp` },
  "mini-aardappelkroketjes": { prep: `${PREP}/mini-mix.png`, allergen: `${INGR}/mini-aardappelkroketjes.webp` },
  "aardappelpuree": { prep: "/products/aardappelpuree.jpg", allergen: `${INGR}/aardappelpuree.webp` },
};

// Give existing databases the section photos too. Only fills what is missing:
// an empty field, or an /api/uploads/ photo whose file no longer exists (e.g.
// the uploads folder was lost in a redeploy). Anything the client set in the
// CMS is left alone.
function backfillProductImages(db: DB) {
  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "data", "uploads");
  const missing = (v: string) => {
    if (!v) return true;
    const m = /^\/api\/uploads\/([^/]+)$/.exec(v);
    return !!m && !fs.existsSync(/*turbopackIgnore: true*/ path.join(uploadDir, m[1]));
  };
  const rows = db.prepare("SELECT id, slug, prep_image, allergen_image FROM products").all() as {
    id: number;
    slug: string;
    prep_image: string;
    allergen_image: string;
  }[];
  const update = db.prepare("UPDATE products SET prep_image = ?, allergen_image = ? WHERE id = ?");
  for (const r of rows) {
    const img = PRODUCT_SECTION_IMAGES[r.slug];
    if (!img) continue;
    const prep = missing(r.prep_image) ? img.prep : r.prep_image;
    const allergen = missing(r.allergen_image) ? img.allergen : r.allergen_image;
    if (prep !== r.prep_image || allergen !== r.allergen_image) update.run(prep, allergen, r.id);
  }
}

function seedProducts(db: DB) {
  const insert = db.prepare(`
    INSERT INTO products (slug, name, title, category, sub, description, image, prep_image, allergen_image, allergens, frame, veggie, price, tags, cards, ingredients, preparation, sort_order)
    VALUES (@slug, @name, @title, @category, @sub, @description, @image, @prep_image, @allergen_image, @allergens, @frame, @veggie, @price, @tags, @cards, @ingredients, @preparation, @sort_order)
  `);
  const tx = db.transaction((rows: SeedProduct[]) => {
    rows.forEach((p, i) => {
      const preparation = {
        oven: { enabled: !!p.oven, temp: p.oven?.temp ?? "", time: p.oven?.time ?? "", steps: p.oven?.steps ?? [] },
        frituur: { enabled: !!p.frituur, temp: p.frituur?.temp ?? "", time: p.frituur?.time ?? "", steps: p.frituur?.steps ?? [] },
      };
      const slug = slugify(p.name);
      insert.run({
        slug,
        name: p.name,
        title: p.title,
        category: p.category,
        sub: p.sub,
        description: p.description,
        image: p.src,
        prep_image: PRODUCT_SECTION_IMAGES[slug]?.prep ?? "",
        allergen_image: PRODUCT_SECTION_IMAGES[slug]?.allergen ?? "",
        allergens: p.allergens.join(","),
        frame: p.frame,
        veggie: p.veggie ? 1 : 0,
        price: null,
        tags: JSON.stringify(p.tags),
        cards: JSON.stringify(p.cards),
        ingredients: JSON.stringify(p.ingredients),
        preparation: JSON.stringify(preparation),
        sort_order: i,
      });
    });
  });
  tx(SEED_PRODUCTS);
}

// News items become blogposts. Body/info/quote/table from the original rich
// news-data are flattened into a single markdown-ish body string, so the CMS
// stays a simple title/excerpt/body editor.
type SeedPost = {
  slug: string;
  title: string;
  publishedAt: string;
  dateLabel: string;
  category: string;
  excerpt: string;
  coverImage: string;
  body: string;
};

const SEED_POSTS: SeedPost[] = [
  {
    slug: "verse-puree-nieuwe-smaken",
    title: "Verse puree in nieuwe smaken",
    publishedAt: "2026-08-20",
    dateLabel: "20 augustus 2026",
    category: "Product",
    excerpt: "Onze verse puree krijgt gezelschap: drie nieuwe smaken, klaar voor thuis, de traiteur en de horeca.",
    coverImage: "/promo/eten.png",
    body: [
      "Sinds 2023 maken we naast onze kroketten ook verse puree. Vandaag breiden we het gamma uit met drie nieuwe smaken — telkens vertrokken van échte aardappelen.",
      "We blijven onze puree opnieuw uitvinden: in andere smaken, formaten en verpakkingen. Geen poeder, geen shortcuts — enkel verse aardappelen, roomboter en een snuf nootmuskaat, zoals thuis.",
      "De nieuwe smaken zijn ontwikkeld samen met een aantal traiteurs en chefs, zodat ze meteen klaar zijn voor de professionele keuken én voor op tafel thuis.",
      "De nieuwe smaken zijn beschikbaar in tubes van 2 kg en 475 g, en in potjes van 450 g. Vraag stalen aan via onze kanalen.",
    ].join("\n\n"),
  },
  {
    slug: "atelier-roeselare-uitgebreid",
    title: "Ons atelier in Roeselare uitgebreid",
    publishedAt: "2026-06-10",
    dateLabel: "10 juni 2026",
    category: "Bedrijf",
    excerpt: "Meer ruimte, dezelfde zorg. We investeerden in ons atelier om nog verser en constanter te kunnen werken.",
    coverImage: "/about/atelier.png",
    body: [
      "Wat klein begon in een schuurtje, is vandaag een moderne voedingsproducent. Deze zomer breidden we ons atelier in Roeselare verder uit.",
      "Meer ruimte betekent kortere lijnen, strakkere hygiëne en nog meer aandacht voor kwaliteit. Onze kroketten blijven met de hand gepaneerd — de uitbreiding zorgt er vooral voor dat we die zorg op grotere schaal kunnen volhouden.",
      "We blijven een familiebedrijf: klein team, korte beslissingslijnen, en iedereen kent elke stap van het proces.",
      "25+ jaar vakmanschap, 100% Belgisch ambacht en dagverse productie — nu met extra capaciteit in Roeselare.",
    ].join("\n\n"),
  },
  {
    slug: "kroketco-op-horeca-expo",
    title: "Kroketco op Horeca Expo",
    publishedAt: "2026-05-02",
    dateLabel: "2 mei 2026",
    category: "Event",
    excerpt: "Kom proeven! We stonden op Horeca Expo met onze kroketten, mini's en verse puree.",
    coverImage: "/ugc/ugc-2.png",
    body: [
      "Niets zo fijn als mensen live laten proeven. Op Horeca Expo lieten we onze klassiekers en nieuwe smaken ontdekken aan chefs, traiteurs en fijnproevers.",
      "Van garnaalkroket tot kaas-prei en mini's voor de borrel: onze stand draaide op volle toeren. Bedankt aan iedereen die langskwam voor een babbel en een krokante beet.",
      "Kon je er niet bij zijn? Geen zorgen — we plannen dit najaar nieuwe proefmomenten bij onze partners.",
    ].join("\n\n"),
  },
  {
    slug: "samen-met-groendal",
    title: "Samen met Groendal voor de beste kaas",
    publishedAt: "2026-03-15",
    dateLabel: "15 maart 2026",
    category: "Partners",
    excerpt: "Onze kaaskroketten danken hun volle smaak aan lokale kaas van Groendal. Een samenwerking om trots op te zijn.",
    coverImage: "/ugc/ugc-4.png",
    body: [
      "Voor onze kaaskroketten werken we samen met Groendal — bekroond voor 's werelds beste kaas. Lokaal, eerlijk en met een neus voor smaak.",
      "Echte Belgische kazen, geen kunstmatige smaakjes. Die keuze maakt het verschil in elke romige vulling. Groendal levert ons kaas én boter, en blijft een vaste partner in het verhaal.",
      "Lokale producten, korte ketens en respect voor het product — dat is waar Kroketco voor staat, en waar we onze partners op uitkiezen.",
    ].join("\n\n"),
  },
];

function seedPosts(db: DB) {
  const insert = db.prepare(`
    INSERT INTO posts (slug, title, excerpt, body, category, cover_image, author, date_label, published, published_at)
    VALUES (@slug, @title, @excerpt, @body, @category, @cover_image, @author, @date_label, 1, @published_at)
  `);
  const tx = db.transaction((rows: SeedPost[]) => {
    for (const p of rows) {
      insert.run({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        body: p.body,
        category: p.category,
        cover_image: p.coverImage,
        author: "Team Kroketco",
        date_label: p.dateLabel,
        published_at: p.publishedAt,
      });
    }
  });
  tx(SEED_POSTS);
}

// —— Partners seed (from the old hardcoded partners-data) ——
type SeedPartner = {
  slug: string;
  name: string;
  city: string;
  logo: string;
  thumbnail: string;
  description: string;
  body: string[]; // paragraphs → TipTap doc JSON
};

const SEED_PARTNERS: SeedPartner[] = [
  {
    slug: "steen-food-masters",
    name: "Steen Food Masters",
    city: "Food & non-food",
    logo: "/partners/logo-steen.3bac4d420028.svg",
    thumbnail: "/partners/cards/steen.png",
    description: "Versgroothandel in food en non-food voor de professionele keuken.",
    body: [
      "Steen Food Masters is een versgroothandel met een breed gamma food- én non-foodproducten.",
      "Van vlees en vis tot droge voeding, bereide maaltijden, zuivel, diepvries, salades, aardappelproducten, sauzen, kruiden, tapas en desserts — aangevuld met non-food zoals verpakkingen en reinigingsmiddelen. Bij Steen Food Masters vind je alles wat je zoekt, en meer.",
    ],
  },
  {
    slug: "huppa",
    name: "Huppa",
    city: "Oostende & Wortegem-Petegem",
    logo: "/partners/HUPPA_Logo_Screen_Black_RGB.svg",
    thumbnail: "/partners/cards/huppa.png",
    description: "Versgroothandel met een breed assortiment voor horeca en traiteur.",
    body: [
      "Zeg 'vers' en je denkt aan Huppa. Meer dan een groothandel: een toonaangevend, innovatief versplatform voor lokale, nationale én internationale merken.",
      "Een platform waarop ze duurzaam samenwerken met klanten, leveranciers, medewerkers en partners — op lange termijn, met groei voor alle partijen. Dat zijn ze vandaag, en dat willen ze morgen blijven. Met vestigingen in Oostende en Wortegem-Petegem.",
    ],
  },
  {
    slug: "rafina",
    name: "Rafina",
    city: "Lauwe · sinds 1954",
    logo: "/partners/rafina.svg",
    thumbnail: "/partners/cards/rafina.png",
    description: "Belgische versgroothandel, al meer dan 70 jaar een vaste waarde.",
    body: [
      "Rafina is een gevestigde Belgische versgroothandel uit Lauwe, actief sinds 1954. Het bedrijf levert een zeer breed gamma aan onder meer slagers, kaaswinkels, traiteurs en versspeciaalzaken. Vandaag telt het aanbod meer dan 7.000 producten: charcuterie, kazen, salades, bereide maaltijden, diepvries en andere verse producten.",
      "Rafina onderscheidt zich met eigen transport, een vaste vertegenwoordiger per klant, een uitgebreide aankoopafdeling en een sterke focus op lokale en ambachtelijke producten. De voorbije jaren groeide het bedrijf verder via overnames zoals Triporteur (2017) en ARCA en Deketelaere-Maes Viswaren (2024).",
    ],
  },
  {
    slug: "duva-fruit",
    name: "Duva Fruit",
    city: "Gistel",
    logo: "/partners/logo.svg",
    thumbnail: "/partners/cards/duva.png",
    description: "Groenten, fruit en verse producten, dagvers geleverd.",
    body: [
      "Duva Fruit NV is een West-Vlaamse groothandel in verse groenten, fruit en aanverwante voedingsproducten, gevestigd in Gistel. Het bedrijf werd opgericht in 1992 en bevoorraadt vandaag honderden voedingsprofessionals in West- en Oost-Vlaanderen.",
      "Duva richt zich vooral op horeca, slagers, traiteurs, grootkeukens, bakkers en versspeciaalzaken. Naast groenten en fruit is er een breed complementair assortiment: voorgesneden groenten, aardappelproducten, puree, kroketten, noten, gedroogd fruit, fruitsappen, scheuten en microgroenten.",
      "Een sterke troef is de logistiek: eigen koeltransport en honderden dagelijkse leveringen in de regio, met levering dezelfde dag voor horeca.",
    ],
  },
  {
    slug: "vlaemynck-natuurlijk",
    name: "Vlaemynck Natuurlijk",
    city: "Veurne",
    logo: "/partners/VlaemynckNatuurlijk_logo_header.svg",
    thumbnail: "/partners/cards/vlaemynck.png",
    description: "Specialist in verse aardappelproducten en versgroenten.",
    body: [
      "Vlaemynck Natuurlijk is een familiebedrijf en professionele groothandel in verse groenten, fruit en aardappelproducten uit Veurne. Het bedrijf overspant intussen vier generaties en levert aan professionele keukens in West- en Oost-Vlaanderen.",
      "Vlaemynck combineert een breed versassortiment met een eigen snijafdeling en wagenpark. Klanten zijn onder meer horeca, grootkeukens, zorginstellingen, traiteurs en voedingsbedrijven. Naast groenten en fruit leveren ze verwerkte aardappelen, kruiden, sappen, noten en gekookte groenten.",
      "Een grote troef is de snelle en flexibele logistiek: laat bestellen kan, en Vlaemynck verzorgt dagelijkse leveringen met eigen transport, volgens de IFS-kwaliteitsnormen.",
    ],
  },
  {
    slug: "biervliet-freez-center",
    name: "Biervliet Freez Center",
    city: "Diksmuide",
    logo: "/partners/logo-freezcenter.png",
    thumbnail: "/partners/cards/freezcenter.png",
    description: "Vers- en diepvriesgroothandel voor horeca en retail.",
    body: [
      "Biervliet Freez Center is een West-Vlaamse voedingsgroothandel uit Diksmuide, gespecialiseerd in diepvriesproducten en een breed assortiment voor professionele klanten: horeca, slagers, traiteurs, bakkers, grootkeukens, catering, verenigingen en bedrijven.",
      "Het aanbod is uitgebreid: diepvriesgroenten en -fruit, frieten, aardappelproducten, gefrituurde snacks, ambachtelijke kroketten, vlees, gevogelte, vis, desserts, ijs en droge voeding.",
      "Een grote sterkte is de regionale distributie: dagelijkse leveringen aan de kust en in West-Vlaanderen, met een snel bestel- en leverproces. Het bedrijf is aangesloten bij AZ Food Horecagrossiers.",
    ],
  },
  {
    slug: "fresh-by-vero",
    name: "Fresh by Vero",
    city: "Poperinge",
    logo: "/partners/xfreshbyvero-logo.png.pagespeed.ic.tV35_7rs2f.webp",
    thumbnail: "",
    description: "Groenten en fruit, met zorg geselecteerd en vers geleverd.",
    body: [
      "Fresh by Vero is een West-Vlaamse versgroothandel uit Poperinge, actief in de groenten- en fruitsector.",
      "Het bedrijf is gevestigd aan de Beneluxlaan 21 in Poperinge en staat geregistreerd als groente- en fruitonderneming.",
    ],
  },
];

// Convert paragraph strings to a TipTap ProseMirror doc JSON string, so seeded
// partner bodies use the same rich format the editor produces.
function paragraphsToDoc(paras: string[]): string {
  const content = paras
    .filter((p) => p.trim())
    .map((p) => ({ type: "paragraph", content: [{ type: "text", text: p }] }));
  return JSON.stringify({ type: "doc", content: content.length ? content : [{ type: "paragraph" }] });
}

function seedPartners(db: DB) {
  const insert = db.prepare(`
    INSERT INTO partners (slug, name, logo, city, description, thumbnail, body, published, sort_order)
    VALUES (@slug, @name, @logo, @city, @description, @thumbnail, @body, 1, @sort_order)
  `);
  const tx = db.transaction((rows: SeedPartner[]) => {
    rows.forEach((p, i) => {
      insert.run({
        slug: p.slug,
        name: p.name,
        logo: p.logo,
        city: p.city,
        description: p.description,
        thumbnail: p.thumbnail,
        body: paragraphsToDoc(p.body),
        sort_order: i,
      });
    });
  });
  tx(SEED_PARTNERS);
}

export { slugify };
