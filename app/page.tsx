import type { Metadata } from "next";
import { Faq, Features, FinalCta, Pricing, SiteFooter, faqText } from "@/components/home-sections";
import { JsonLd } from "@/components/json-ld";
import { SkyHero } from "@/components/sky-hero";
import { currentOffer } from "@/lib/billing";
import { softwareAppSchema } from "@/lib/schema";
import { site } from "@/lib/site";

// Rendered on every request so the prices and the countdown are always current.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const { sold, price } = await currentOffer();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${site.url}/#organization`,
              name: site.name,
              url: site.url,
              logo: `${site.url}/apple-icon.png`,
              sameAs: ["https://x.com/Harshrwt27", site.chromeStoreUrl],
            },
            { "@type": "WebSite", "@id": `${site.url}/#website`, name: site.name, url: site.url, publisher: { "@id": `${site.url}/#organization` } },
            softwareAppSchema(price),
            {
              "@type": "FAQPage",
              mainEntity: faqText.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />
      <main>
        <SkyHero price={price} />
        <Features price={price} />
        <Pricing sold={sold} price={price} />
        <Faq />
        <FinalCta price={price} />
      </main>
      <SiteFooter />
    </>
  );
}
