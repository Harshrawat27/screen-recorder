import type { Metadata } from "next";
import { Faq, Pricing, SiteFooter } from "@/components/home-sections";
import { JsonLd } from "@/components/json-ld";
import { SiteNav } from "@/components/site-nav";
import { currentOffer } from "@/lib/billing";
import { breadcrumbSchema, softwareAppSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing: one payment, whole team, no monthly fee",
  description: "Showthrough is a one-time purchase for your whole team, with team accounts coming soon. No per-seat fee, no subscription, and videos in your own Cloudflare.",
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
  if (params.locked !== undefined) notice = <Notice>Buy {"Showthrough"} to connect Cloudflare (one click, we handle the rest) and start recording. It&rsquo;s a one-time payment.</Notice>;
  if (params.error !== undefined) notice = <Notice>We couldn&rsquo;t open checkout just now. Try again in a minute.</Notice>;
  if (params.soldout !== undefined) notice = <Notice>Early pricing has ended. Sales open again at our Product Hunt launch on 30 November.</Notice>;

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [softwareAppSchema(price), breadcrumbSchema([["Pricing", "/pricing"]])] }} />
      <div className="sky">
        <SiteNav />
      </div>
      <main className="pt-6">
        <h1 className="sr-only">Showthrough pricing: pay once, use it forever</h1>
        <Pricing sold={sold} price={price} notice={notice} />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
