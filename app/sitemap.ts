import type { MetadataRoute } from "next";
import { alternatives } from "@/lib/alternatives";
import { site } from "@/lib/site";

// Public pages only. The dashboard, sign-in, recording and share pages are left out on purpose
// (they are noindex). Update a page's date when its content changes; Google ignores priority.
const pages: { path: string; updated: string }[] = [
  { path: "/", updated: "2026-11-10" },
  { path: "/pricing", updated: "2026-11-10" },
  { path: "/roadmap", updated: "2026-11-10" },
  { path: "/alternatives", updated: "2026-11-10" },
  { path: "/privacy", updated: "2026-11-09" },
  { path: "/terms", updated: "2026-11-09" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((page) => ({ url: `${site.url}${page.path === "/" ? "" : page.path}`, lastModified: page.updated })),
    ...alternatives.map((alt) => ({ url: `${site.url}/alternatives/${alt.slug}`, lastModified: alt.updated })),
  ];
}
