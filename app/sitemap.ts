import type { MetadataRoute } from "next";
import { alternatives } from "@/lib/alternatives";
import { guidePages, guidePath, teamGuidePages } from "@/lib/guide";
import { posts } from "@/lib/blog";
import { site } from "@/lib/site";

// Public pages only. The dashboard, sign-in, recording and share pages are left out on purpose
// (they are noindex). Update a page's date when its content changes; Google ignores priority.
const pages: { path: string; updated: string }[] = [
  { path: "/", updated: "2026-11-22" },
  { path: "/pricing", updated: "2026-11-22" },
  { path: "/roadmap", updated: "2026-11-21" },
  { path: "/support", updated: "2026-11-10" },
  { path: "/about", updated: "2026-11-22" },
  { path: "/alternatives", updated: "2026-11-22" },
  { path: "/blog", updated: "2026-11-22" },
  { path: "/privacy", updated: "2026-11-21" },
  { path: "/terms", updated: "2026-11-21" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((page) => ({ url: `${site.url}${page.path === "/" ? "" : page.path}`, lastModified: page.updated })),
    ...alternatives.map((alt) => ({ url: `${site.url}/alternatives/${alt.slug}`, lastModified: alt.updated })),
    ...guidePages.map((page) => ({ url: `${site.url}${guidePath(page.slug)}`, lastModified: "2026-11-21" })),
    ...teamGuidePages.map((page) => ({ url: `${site.url}${guidePath(page.slug, "/guide/team")}`, lastModified: "2026-11-25" })),
    { url: `${site.url}/guide/update`, lastModified: "2026-11-26" },
    ...posts.map((post) => ({ url: `${site.url}/blog/${post.slug}`, lastModified: post.updated })),
  ];
}
