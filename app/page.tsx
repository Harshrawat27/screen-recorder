import { Faq, Features, FinalCta, Pricing, SiteFooter } from "@/components/home-sections";
import { SkyHero } from "@/components/sky-hero";

export default function Home() {
  return (
    <>
      <main>
        <SkyHero />
        <Features />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
