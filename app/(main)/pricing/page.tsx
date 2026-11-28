import type { Metadata } from "next";
import { Faq, Pricing, SiteFooter } from "@/components/home-sections";
import { JsonLd } from "@/components/json-ld";
import { SiteNav } from "@/components/site-nav";
import { currentOffer } from "@/lib/billing";
import { breadcrumbSchema, softwareAppSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing: free forever, or pay once for your whole team",
  description: "Showthrough is free forever: unlimited screen recordings with no time limit. Pay once to add comments, notifications and your whole team. No per-seat fee, no subscription.",
  alternates: { canonical: "/pricing" },
};

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="rounded-control border border-line bg-surface px-5 py-4 text-center text-[15px]">
      {children}
    </p>
  );
}

export default async function PricingPage({ searchParams }: PageProps<"/pricing">) {
  const { sold, price } = await currentOffer();
  const params = await searchParams;

  let notice: React.ReactNode = null;
  if (params.locked !== undefined) notice = <Notice>That&rsquo;s part of the paid plan. Recording and sharing stay free forever.</Notice>;
  if (params.error !== undefined) notice = <Notice>We couldn&rsquo;t open checkout just now. Try again in a minute.</Notice>;
  if (params.soldout !== undefined) notice = <Notice>That price has ended. Here&rsquo;s the current price.</Notice>;

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [softwareAppSchema(price), breadcrumbSchema([["Pricing", "/pricing"]])] }} />
      <div className="sky">
        <SiteNav />
      </div>
      <main className="pt-6">
        <h1 className="sr-only">Showthrough pricing: free forever, or pay once for more</h1>
        <Pricing sold={sold} price={price} notice={notice} />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
