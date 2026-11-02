// Everything that may change: name, domain, price, contact.
export const site = {
  name: "Showthrough",
  domain: "showthrough.com",
  url: "https://www.showthrough.com",
  tagline: "Screen recording you own.",
  description:
    "Record your screen and share a link in seconds. Videos live in your own free Cloudflare storage, and you pay once instead of per person, per month.",
  contactEmail: "harsh.webflow@gmail.com",
  price: {
    amount: 39,
    label: "one time, for your whole team",
  },
  loom: {
    perUserPerMonth: 18,
    planName: "Loom Business, billed monthly",
    checked: "September 2026",
  },
  chromeStoreUrl: null as string | null,
} as const;

export const betaHref = `mailto:${site.contactEmail}?subject=${encodeURIComponent(`${site.name} beta`)}`;
