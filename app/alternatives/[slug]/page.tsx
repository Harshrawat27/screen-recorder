import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta, SiteFooter } from "@/components/home-sections";
import { JsonLd } from "@/components/json-ld";
import { SiteNav } from "@/components/site-nav";
import { CheckIcon, buttonClass } from "@/components/ui";
import { alternatives, getAlternative } from "@/lib/alternatives";
import { currentOffer } from "@/lib/billing";
import { site } from "@/lib/site";

// Rendered per request so the price in the comparison is always the one on sale.
export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams() {
  return alternatives.map((alt) => ({ slug: alt.slug }));
}

export async function generateMetadata({ params }: PageProps<"/alternatives/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const alt = getAlternative(slug);
  if (!alt) return {};
  const url = `/alternatives/${alt.slug}`;
  return {
    title: alt.title,
    description: alt.description,
    alternates: { canonical: url },
    openGraph: { title: `${alt.title} | ${site.name}`, description: alt.description, url, type: "article" },
    twitter: { title: `${alt.title} | ${site.name}`, description: alt.description },
  };
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[30px] leading-tight sm:text-[36px]" style={{ letterSpacing: "-0.02em" }}>
      {children}
    </h2>
  );
}

export default async function AlternativePage({ params }: PageProps<"/alternatives/[slug]">) {
  const { slug } = await params;
  const alt = getAlternative(slug);
  if (!alt) notFound();

  const { price } = await currentOffer();
  const withPrice = (text: string) => text.replaceAll("{price}", `$${price}`);
  const others = alternatives.filter((a) => a.slug !== alt.slug);
  const pageUrl = `${site.url}/alternatives/${alt.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: site.name, item: site.url },
                { "@type": "ListItem", position: 2, name: "Alternatives", item: `${site.url}/alternatives` },
                { "@type": "ListItem", position: 3, name: `${alt.name} alternative`, item: pageUrl },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: alt.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />
      <div className="sky">
        <SiteNav />
      </div>

      <main className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
        <nav aria-label="Breadcrumb" className="pt-10 text-sm text-muted">
          <Link href="/" className="hover:text-text">
            Home
          </Link>
          <span className="px-2 text-faint">/</span>
          <Link href="/alternatives" className="hover:text-text">
            Alternatives
          </Link>
          <span className="px-2 text-faint">/</span>
          <span className="text-text">{alt.name}</span>
        </nav>

        <header className="pt-8">
          <h1 className="text-[40px] leading-[1.04] sm:text-[60px]" style={{ letterSpacing: "-0.03em" }}>
            {alt.h1}
          </h1>
          {alt.intro.map((p) => (
            <p key={p} className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted">
              {p}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/buy" className={buttonClass("primary", "lg", "rounded-full px-7")}>
              Buy for ${price}
            </a>
            <Link href="/#how" className={buttonClass("secondary", "lg", "rounded-full px-7")}>
              See how it works
            </Link>
          </div>
          <p className="mt-5 text-sm text-faint">
            {alt.name} prices checked on {alt.checked} from{" "}
            <a href={alt.pricingUrl} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2 hover:text-text">
              {alt.name}&rsquo;s pricing page
            </a>
            . Prices change; check there before you buy.
          </p>
        </header>

        <section className="mt-16">
          <H2>
            {alt.name} vs {site.name} at a glance
          </H2>
          <div className="mt-6 overflow-x-auto rounded-[16px] border border-line bg-surface">
            <table className="w-full min-w-[560px] text-left text-[15px]">
              <thead className="border-b border-line bg-sunken/60">
                <tr>
                  <th scope="col" className="w-[28%] px-5 py-3.5 font-semibold" />
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    {alt.name}
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    {site.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {alt.rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="px-5 py-3.5 align-top font-medium">
                      {row.label}
                    </th>
                    <td className="px-5 py-3.5 align-top text-muted">{row.them}</td>
                    <td className="px-5 py-3.5 align-top">{withPrice(row.us)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16">
          <H2>{alt.name} pricing</H2>
          <div className="mt-6 overflow-x-auto rounded-[16px] border border-line bg-surface">
            <table className="w-full min-w-[560px] text-left text-[15px]">
              <thead className="border-b border-line bg-sunken/60">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Plan
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Price
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    What you get
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {alt.pricing.map((plan) => (
                  <tr key={plan.plan}>
                    <th scope="row" className="px-5 py-3.5 align-top font-medium">
                      {plan.plan}
                    </th>
                    <td className="px-5 py-3.5 align-top">{plan.price}</td>
                    <td className="px-5 py-3.5 align-top text-muted">{plan.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {alt.pricingNote && <p className="mt-4 max-w-[62ch] leading-relaxed text-muted">{alt.pricingNote}</p>}
          <p className="mt-4 max-w-[62ch] leading-relaxed text-muted">
            {site.name} is one payment, currently ${price}. The only other cost is Cloudflare storage past its free 10 GB, billed by Cloudflare at
            about $0.015 per GB a month. Viewing is always free. <Link href="/pricing" className="underline underline-offset-2 hover:text-text">See pricing</Link>.
          </p>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-2">
          <div className="rounded-[24px] border border-line bg-surface p-7">
            <H2>Where {alt.name} is better</H2>
            <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted">
              {alt.theyWin.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-faint" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[24px] border border-line bg-surface p-7">
            <H2>Where {site.name} is better</H2>
            <ul className="mt-5 space-y-3 text-[15px] leading-relaxed">
              {alt.weWin.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-text text-canvas">
                    <CheckIcon className="size-3" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-16">
          <H2>Which one should you pick?</H2>
          <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted">{alt.pickThem}</p>
          <p className="mt-4 max-w-[62ch] text-lg leading-relaxed">{alt.pickUs}</p>
        </section>

        <section className="mt-16">
          <H2>
            Questions about {alt.name} and {site.name}
          </H2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {alt.faqs.map((item) => (
              <div key={item.q} className="py-5">
                <h3 className="text-lg font-semibold">{item.q}</h3>
                <p className="mt-2 max-w-[62ch] leading-relaxed text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <H2>More comparisons</H2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/alternatives/${other.slug}`}
                  className="block rounded-[16px] border border-line bg-surface p-5 transition-colors hover:border-line-strong hover:bg-sunken"
                >
                  <span className="font-semibold">{other.name} alternative</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{other.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <FinalCta price={price} />
      <SiteFooter />
    </>
  );
}
