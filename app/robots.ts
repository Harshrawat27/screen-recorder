import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Only block routes that are APIs or redirects. Pages such as /login, /record and share links
// stay crawlable so Google can read their noindex tag; blocking them here would hide that tag.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/buy", "/start"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
