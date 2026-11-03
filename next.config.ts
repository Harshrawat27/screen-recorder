import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
