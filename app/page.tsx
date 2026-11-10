import type { Metadata } from "next";
import { Faq, Features, FinalCta, Pricing, SiteFooter, faqText } from "@/components/home-sections";
import { JsonLd } from "@/components/json-ld";
import { SkyHero } from "@/components/sky-hero";
import { currentOffer } from "@/lib/billing";
import { site } from "@/lib/site";

// Rendered on every request so the prices and spots left are always current.
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
            {
              "@type": "SoftwareApplication",
              name: site.name,
              url: site.url,
              description:
                "A Chrome screen recorder: record your screen, camera and voice and share the link the moment you stop. Videos are stored in your own Cloudflare account. One payment, no subscription.",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Chrome on Windows, macOS, Linux and ChromeOS",
              installUrl: site.chromeStoreUrl,
              publisher: { "@id": `${site.url}/#organization` },
              offers: { "@type": "Offer", price: String(price), priceCurrency: "USD", url: `${site.url}/pricing` },
            },
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
