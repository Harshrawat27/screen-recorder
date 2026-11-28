import type { Metadata } from "next";
import { languageAlternates } from "@/lib/i18n";
import { Faq, Features, FinalCta, Pricing, SiteFooter, faqText } from "@/components/home-sections";
import { JsonLd } from "@/components/json-ld";
import { SkyHero } from "@/components/sky-hero";
import { currentOffer } from "@/lib/billing";
import { authorId, personSchema } from "@/lib/author";
import { softwareAppSchema } from "@/lib/schema";
import { site } from "@/lib/site";

// Rendered on every request so the prices and the countdown are always current.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { alternates: { canonical: "/", languages: languageAlternates("/") } };

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
              founder: { "@id": authorId },
              sameAs: ["https://x.com/Harshrwt27", site.chromeStoreUrl],
            },
            { "@type": "WebSite", "@id": `${site.url}/#website`, name: site.name, url: site.url, publisher: { "@id": `${site.url}/#organization` } },
            softwareAppSchema(price),
            personSchema(),
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
