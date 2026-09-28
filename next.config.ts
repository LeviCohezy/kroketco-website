import type { NextConfig } from "next";

// Two deploy modes:
//  1) GITHUB_PAGES=true  → legacy static export to /kroketco-website (kept for
//     the old GitHub Pages deploy only). No server, no DB.
//  2) default            → standalone Node server (Docker). Serves the CMS,
//     API routes and DB-backed pages. Runs at the root, no basePath.
const repo = "/kroketco-website";
const onPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = onPages
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
      basePath: repo,
      assetPrefix: repo,
      env: { NEXT_PUBLIC_BASE_PATH: repo },
    }
  : {
      output: "standalone",
      images: { unoptimized: true },
      env: { NEXT_PUBLIC_BASE_PATH: "" },
    };

export default nextConfig;
