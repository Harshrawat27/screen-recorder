import { Faq, Features, FinalCta, Pricing, SiteFooter } from "@/components/home-sections";
import { SkyHero } from "@/components/sky-hero";
import { currentOffer } from "@/lib/billing";

// Rendered on every request so the prices and spots left are always current.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { sold, price } = await currentOffer();
  return (
    <>
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
