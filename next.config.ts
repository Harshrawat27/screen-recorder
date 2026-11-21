import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "Add a card for R2" became part of "Turn on R2".
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
