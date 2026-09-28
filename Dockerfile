# syntax=docker/dockerfile:1

# ---- Base -----------------------------------------------------------------
# Debian-slim (not alpine) so better-sqlite3's native module compiles cleanly.
FROM node:20-slim AS base
WORKDIR /app

# ---- Dependencies ---------------------------------------------------------
# Install build toolchain for better-sqlite3 (python3, make, g++), then npm ci.
FROM base AS deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Standalone server build (GITHUB_PAGES unset → output: "standalone").
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runner ---------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Data (SQLite db + uploads) lives in a mounted volume.
ENV CMS_DB_PATH=/data/cms.db
ENV UPLOAD_DIR=/data/uploads

# The standalone output bundles only the needed node_modules (incl. the
# compiled better-sqlite3 native addon).
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN mkdir -p /data && chown -R node:node /data /app
USER node

EXPOSE 3000
CMD ["node", "server.js"]
