# Kroketco CMS

A self-contained CMS for the Kroketco site. The client can manage **producten**
and **blogposts** from an admin dashboard; the public pages read from the same
database, so edits appear on the site immediately. Everything runs as a single
Next.js standalone server backed by SQLite — no external services.

## What's included

- **Admin dashboard** at `/admin` (sidebar with Overzicht, Producten, Blog).
- **CRUD** for products and blogposts with create/edit modals, delete confirms,
  toasts, loading and empty states, and image upload.
- **REST API** under `/api/products`, `/api/products/[id]`, `/api/blog`,
  `/api/blog/[id]`. Mutations are auth-protected.
- **SQLite** via `better-sqlite3`, auto-migrated and seeded on first run from the
  site's original hardcoded content.
- **Public pages** `/producten` and `/nieuws` (+ `/nieuws/[slug]`) now read from
  the DB. Their visual design is unchanged.

## Run locally (dev)

```bash
npm install
npm run dev
```

- Site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin> → redirects to `/admin/login`
- Default password: `kroketco-dev` (override with the `ADMIN_PASSWORD` env var)

On first run the DB is created at `./data/cms.db` and seeded with the existing
products and news items. `./data/` is gitignored.

> Note: `better-sqlite3` is a native module. If `npm install` can't compile it
> locally, install build tools (`python3`, `make`, a C++ compiler) — or just use
> Docker, where the toolchain is included.

## Run with Docker

```bash
ADMIN_PASSWORD=your-strong-password docker compose up --build
```

- App on <http://localhost:3000>, admin at `/admin`.
- Data (SQLite db + uploaded images) is stored in the named volume `cms-data`
  mounted at `/data`, so it survives rebuilds.

## Environment variables

| Variable         | Default            | Purpose                                        |
| ---------------- | ------------------ | ---------------------------------------------- |
| `ADMIN_PASSWORD` | `kroketco-dev`     | Single-admin login password. **Set this in prod.** |
| `CMS_DB_PATH`    | `./data/cms.db`    | SQLite file path (`/data/cms.db` in Docker).   |
| `UPLOAD_DIR`     | `./data/uploads`   | Where uploaded images are written.             |
| `PORT`           | `3000`             | Server port (standalone).                      |

## Auth

Single-admin password login. Posting the password to `/api/auth/login` sets an
httpOnly, HMAC-signed session cookie (7-day expiry). `src/proxy.ts` (the Next 16
successor to `middleware.ts`) guards `/admin/**` (redirect to login) and all
mutating `/api/{products,blog}` calls (401). Changing `ADMIN_PASSWORD`
invalidates existing sessions. Log out via the sidebar.

## Images

Image fields accept a path/URL (e.g. `/kroketten/prod-kaas.jpg`) **or** you can
upload a file — it's stored under `UPLOAD_DIR` and served from
`/api/uploads/<file>`. Files in `public/` keep working as before.

## Data model

- `products`: slug, name, category, sub, description, image, allergens (CSV of
  `G,M,E,N,S`), frame (card colour), veggie, price, sort_order, timestamps.
- `posts`: slug, title, excerpt, body (blank-line-separated paragraphs),
  category, cover_image, author, date_label, published, published_at, timestamps.

## Deploy modes

- **Default build** (`npm run build`) → `output: "standalone"` Node server for
  Docker. No basePath.
- **GitHub Pages** (legacy) → set `GITHUB_PAGES=true` for the old static export
  to `/kroketco-website`. The CMS/API/DB are server-only and are not available in
  that static mode.
