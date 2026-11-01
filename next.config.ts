import type { NextConfig } from "next";

// Static export: `npm run build` writes plain HTML/CSS/JS to `out/`,
// which Cloudflare Pages (or Vercel) can serve as-is.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
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
