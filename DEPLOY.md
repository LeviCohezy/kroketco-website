# Deploying Kroketco

This app is a Next.js server (not a static site). It stores everything on disk:

- SQLite database → `cms.db`
- Uploaded images → `uploads/`

**The one hard rule for any host:** the database + uploads must live in a location
that **survives redeploys**. Otherwise all products / partners / posts / images are
lost every time you deploy. Where those files go is controlled by two env vars:

- `CMS_DB_PATH` — full path to the SQLite file
- `UPLOAD_DIR` — folder for uploaded images

There are two ways to host it:

- **Option A — Hostinger Business "Web Apps"** (deploy from Git). Free if you already
  have a Business plan. Try this first.
- **Option B — VPS + Coolify** (runs the Docker image). Paid, but guaranteed to work
  and can host many sites on one box. Use this if Option A fails.

---

# Option A — Hostinger Business (Web Apps, deploy from Git)

Available on Hostinger **Business plans and up**. It connects your GitHub repo and
runs `npm install → build → start` on Hostinger's Node runtime (it does **not** use
the `Dockerfile`).

### Before you start — two things that can break this app here

1. **`better-sqlite3` is a native (C++) module.** It compiles cleanly in the Docker
   image (which installs `python3/make/g++`), but on shared hosting it depends on
   whether their Node build allows native compilation. If the build log errors on
   `better-sqlite3`, Option A won't work → use Option B.
2. **Persistence.** A Git redeploy replaces the app folder, so the DB/uploads must be
   stored **outside** the project directory (see the env vars below).

### Steps

1. **hPanel → Websites → "Deploy your Web App" → Get started.**
2. **Connect GitHub / GitLab**, pick this repository and the branch you deploy
   (e.g. `v3`). Let it detect **Next.js**.
3. Ensure the **Node.js version is 20+** (Next 16 requires it).
4. Set **Environment Variables** (use your real home path — hPanel shows it, it looks
   like `/home/uXXXXXXXXX`):

   | Key | Value |
   |---|---|
   | `ADMIN_PASSWORD` | a long, random password (**not** the dev default) |
   | `CMS_DB_PATH` | `/home/uXXXXXXXXX/cms-data/cms.db` |
   | `UPLOAD_DIR` | `/home/uXXXXXXXXX/cms-data/uploads` |

   The key point: `cms-data` sits **outside** the deployed project folder, so it
   isn't wiped on redeploy. Create that folder if the panel doesn't auto-create it.
5. **Deploy** and watch the build log:
   - Builds + site loads + `/admin` works → done. Free hosting. 🎉
   - Errors on `better-sqlite3`, or the DB isn't writable/persistent → switch to
     **Option B** below.
6. Point your domain at the site in hPanel (HTTPS is handled by Hostinger).

> Note: this path bundles content into the same account as your other Business
> sites. To confirm persistence, add a test product in `/admin`, redeploy, and check
> it's still there.

---

# Option B — VPS + Coolify

Runs your Docker image as-is, with a real persistent volume. Guaranteed to work
(native module + persistence are handled by the `Dockerfile`), and one small VPS can
host many sites. Good hosts: **Hostinger KVM 2** (pick the Coolify template at
checkout) or a **Hetzner CX22** (EU location, cheapest).

On this route the data lives in a volume mounted at **`/data`** (matching the
`Dockerfile` defaults `CMS_DB_PATH=/data/cms.db`, `UPLOAD_DIR=/data/uploads`).

## 1. Create the server (Hetzner Cloud)

1. Sign up at https://console.hetzner.cloud and create a **Project**.
2. **Add Server**:
   - Location: closest to your visitors (e.g. Nuremberg/Falkenstein for EU).
   - Image: **Ubuntu 24.04**.
   - Type: **CX22** (2 vCPU / 4 GB RAM) — ~€4.5/mo, plenty for several small sites.
   - Add your SSH key (or set a root password).
3. Create it and note the server's **public IP**.

## 2. Install Coolify

SSH into the server and run the official installer:

```bash
ssh root@YOUR_SERVER_IP
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

When it finishes, open `http://YOUR_SERVER_IP:8000` in your browser and create the
admin account. (Coolify installs Docker + a Traefik reverse proxy for you.)

## 3. Point your domain

In your domain registrar's DNS, add an **A record** for the hostname you want
(e.g. `kroketco.be` and/or `www`) pointing to `YOUR_SERVER_IP`. DNS can take a
few minutes to propagate. HTTPS certificates are issued automatically by Coolify
once the domain resolves.

## 4. Add this app in Coolify

1. In Coolify: **Project → + New → Application**.
2. **Source**: connect your Git repo (GitHub/GitLab) and pick this repository +
   branch, **or** choose "Public/Private Repository" with the clone URL.
3. **Build Pack**: **Dockerfile** (Coolify auto-detects the `Dockerfile` in the repo root).
4. **Port**: `3000` (auto-detected from `EXPOSE 3000`).
5. **Domain**: enter your domain (e.g. `https://kroketco.be`). Coolify handles HTTPS.

## 5. Add the persistent volume (critical)

In the app's **Storages** tab, add a **Volume Mount**:

- Name: `cms-data`
- Destination Path (in container): `/data`

This is the equivalent of the `cms-data` volume in `docker-compose.yml`.

## 6. Set environment variables

In the app's **Environment Variables** tab (see `.env.example`):

| Key | Value |
|---|---|
| `ADMIN_PASSWORD` | a long, random password (**change from the dev default!**) |
| `CMS_DB_PATH` | `/data/cms.db` |
| `UPLOAD_DIR` | `/data/uploads` |

(`PORT=3000`, `HOSTNAME=0.0.0.0` are already baked into the Dockerfile.)

## 7. Deploy

Click **Deploy**. On first boot the app creates the SQLite schema and seeds the
initial content automatically. Visit your domain — the site is live, and
`https://your-domain/admin` is the CMS (log in with `ADMIN_PASSWORD`).

Future deploys: push to the branch (enable **Auto Deploy** / webhook) or hit
**Redeploy**. Your `/data` volume — DB and uploads — persists across deploys.

---

## Hosting more sites on the same server

Repeat steps 4–7 for each new site (new Application in Coolify, its own domain,
its own volume). One CX22 comfortably runs a dozen or so small sites; bump to a
larger Hetzner type if you outgrow it.

## Backups

Your content lives in the `/data` volume. Back it up regularly, e.g. a nightly
cron on the VPS that copies the volume's DB + uploads off-box:

```bash
# Example: dump the volume to a timestamped tarball
docker run --rm -v cms-data:/data -v /root/backups:/backup alpine \
  tar czf /backup/cms-$(date +%F).tar.gz -C /data .
```

Then sync `/root/backups` to object storage (Hetzner Storage Box, S3, etc.).
Coolify also offers scheduled backups in its UI.
