import type { ReactNode } from "react";
import { SiteFooter } from "@/components/home-sections";
import { SiteNav } from "@/components/site-nav";

// The English privacy and terms pages. Same navbar and footer as the rest of the site (and as the
// translated versions in components/localized-pages.tsx), so the language menu is there too.
export function LegalPage({ title, updated, path, children }: { title: string; updated: string; path: string; children: ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-10 sm:px-8">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated {updated}</p>
        <div className="prose-legal mt-8">{children}</div>
      </main>
      <SiteFooter path={path} />
    </>
  );
}
