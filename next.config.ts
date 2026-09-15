import type { NextConfig } from "next";

// GitHub Pages project site is served from /<repo>/. The CI build sets
// GITHUB_PAGES=true so basePath/assetPrefix are applied only for the deploy,
// keeping local dev at the root.
const repo = "/kroketco-website";
const onPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: onPages ? repo : "",
  assetPrefix: onPages ? repo : "",
  env: { NEXT_PUBLIC_BASE_PATH: onPages ? repo : "" },
};

export default nextConfig;
