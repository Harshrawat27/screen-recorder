import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta, SiteFooter } from "@/components/home-sections";
import { JsonLd } from "@/components/json-ld";
import { SiteNav } from "@/components/site-nav";
import { alternatives } from "@/lib/alternatives";
import { currentOffer } from "@/lib/billing";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Loom alternatives and screen recorders compared",
  description:
    "Loom, Vidyard, Screencastify, Snagit, Tella, Zight, ScreenPal and Cap compared on price, free-plan limits and who each one suits, with prices from their own pages.",
  alternates: { canonical: "/alternatives" },
};

export default async function AlternativesPage() {
  const { price } = await currentOffer();
  const checked = alternatives[0].checked;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Screen recorder alternatives",
          itemListElement: alternatives.map((alt, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${alt.name} alternative`,
            url: `${site.url}/alternatives/${alt.slug}`,
          })),
        }}
      />
      <div className="sky">
        <SiteNav />
      </div>

      <main className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
        <header className="mx-auto max-w-3xl pt-16 text-center sm:pt-24">
          <h1 className="text-[40px] leading-[1.04] sm:text-[64px]" style={{ letterSpacing: "-0.03em" }}>
            Loom alternatives and other screen recorders, compared
          </h1>
          <p className="mx-auto mt-6 max-w-[58ch] text-lg leading-relaxed text-muted">
            Eight screen recorders side by side: what each costs, where its free plan stops, and who it suits. We make {site.name}, so each
            page also says plainly where the other tool is the better choice.
          </p>
        </header>

        <section className="mt-14">
          <div className="overflow-x-auto rounded-[16px] border border-line bg-surface">
            <table className="w-full min-w-[720px] text-left text-[15px]">
              <thead className="border-b border-line bg-sunken/60">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Tool
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Free plan
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Paid from
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Best for
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr className="bg-sunken/30">
                  <th scope="row" className="px-5 py-3.5 align-top font-semibold">
                    {site.name}
                  </th>
                  <td className="px-5 py-3.5 align-top text-muted">No free plan</td>
                  <td className="px-5 py-3.5 align-top">${price} once, for the whole team</td>
                  <td className="px-5 py-3.5 align-top text-muted">Quick videos with no limits, stored in your own Cloudflare</td>
                </tr>
                {alternatives.map((alt) => (
                  <tr key={alt.slug}>
                    <th scope="row" className="px-5 py-3.5 align-top font-medium">
                      <Link href={`/alternatives/${alt.slug}`} className="underline underline-offset-2 hover:text-muted">
                        {alt.name}
                      </Link>
                    </th>
                    <td className="px-5 py-3.5 align-top text-muted">{alt.freePlan}</td>
                    <td className="px-5 py-3.5 align-top">{alt.paidFrom}</td>
                    <td className="px-5 py-3.5 align-top text-muted">{alt.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-faint">
            Prices checked on {checked} on each vendor&rsquo;s own pricing page. Each comparison links to its source.
          </p>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          {alternatives.map((alt) => (
            <Link
              key={alt.slug}
              href={`/alternatives/${alt.slug}`}
              className="flex flex-col rounded-[24px] border border-line bg-surface p-7 transition-colors hover:border-line-strong hover:bg-sunken"
            >
              <h2 className="text-[26px] leading-tight" style={{ letterSpacing: "-0.02em" }}>
                {alt.name} alternative
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{alt.summary}</p>
              <span className="mt-5 text-sm font-semibold">
                {alt.name} vs {site.name}
              </span>
            </Link>
          ))}
        </section>
      </main>

      <FinalCta price={price} />
      <SiteFooter />
    </>
  );
}
