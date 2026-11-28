import { site } from "@/lib/site";

// Structured data shared by the homepage and /pricing, so both describe the same product
// and the same offer: the lifetime price in lib/pricing.ts, on sale now.

export const orgId = `${site.url}/#organization`;
export const appId = `${site.url}/#software`;

export function offerSchema(price: number) {
  const base = { "@type": "Offer", price: String(price), priceCurrency: "USD", url: `${site.url}/pricing` };
  return { ...base, availability: "https://schema.org/InStock" };
}

export function softwareAppSchema(price: number) {
  return {
    "@type": "SoftwareApplication",
    "@id": appId,
    name: site.name,
    url: site.url,
    image: `${site.url}/opengraph-image.png`,
    description:
      "A free Chrome screen recorder with no video limit and no time limit: record your screen, camera and voice and share the link the moment you stop. Videos are stored in your own Cloudflare account. Free forever; the paid plan is one payment, no subscription.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Windows, macOS, Linux, ChromeOS",
    browserRequirements: "Requires Google Chrome",
    installUrl: site.chromeStoreUrl,
    publisher: { "@id": orgId },
    // The free plan, then the paid one.
    offers: [{ "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", url: `${site.url}/pricing`, availability: "https://schema.org/InStock" }, offerSchema(price)],
  };
}

/** BreadcrumbList from [name, path] pairs, starting after Home. */
export function breadcrumbSchema(items: [string, string][]) {
  const all: [string, string][] = [["Home", "/"], ...items];
  return {
    "@type": "BreadcrumbList",
    itemListElement: all.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${site.url}${path === "/" ? "" : path}`,
    })),
  };
}
