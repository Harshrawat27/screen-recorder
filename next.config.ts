import type { NextConfig } from "next";
import { POSTHOG_ASSETS, POSTHOG_HOST } from "./lib/analytics";

const nextConfig: NextConfig = {
  // "Add a card for R2" became part of "Turn on R2".
  // PostHog through our own domain (/ingest), so ad blockers don't hide visits.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `${POSTHOG_ASSETS}/static/:path*` },
      { source: "/ingest/array/:path*", destination: `${POSTHOG_ASSETS}/array/:path*` },
      { source: "/ingest/:path*", destination: `${POSTHOG_HOST}/:path*` },
    ];
  },
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [{ source: "/guide/add-card", destination: "/guide/turn-on-r2", permanent: true }];
  },
  // The video Worker source is read at runtime and uploaded to the user's Cloudflare.
  outputFileTracingIncludes: {
    "/api/cloudflare/connect": ["./worker/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
