import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/home-sections";
import { SiteNav } from "@/components/site-nav";
import { RootShell, baseMetadata } from "@/app/root-shell";

// The 404 page for any URL that matches no route. The site has two root layouts (English and the
// other languages), so this page brings its own <html> (see experimental.globalNotFound).
export const metadata: Metadata = { ...baseMetadata, title: "Page not found", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <RootShell lang="en">
      <div className="sky">
        <SiteNav />
      </div>
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-20 text-center sm:px-8 sm:pt-28">
        <p className="text-sm font-medium text-muted">404</p>
        <h1 className="mt-3 text-[40px] leading-[1.05] sm:text-[56px]" style={{ letterSpacing: "-0.03em" }}>
          This page doesn&rsquo;t exist
        </h1>
        <p className="mx-auto mt-5 max-w-[48ch] text-lg leading-relaxed text-muted">
          The link may be old or mistyped. These are good places to start:
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-3 text-[15px]">
          {[
            ["/", "Home"],
            ["/pricing", "Pricing"],
            ["/guide", "Setup guide"],
            ["/blog", "Blog"],
            ["/alternatives", "Loom alternatives"],
          ].map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="inline-block rounded-full border border-line bg-surface px-4 py-2 hover:border-line-strong">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </RootShell>
  );
}
