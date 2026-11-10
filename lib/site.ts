// Everything that may change: name, domain, price, contact.
export const site = {
  name: "Showthrough",
  domain: "showthrough.com",
  url: "https://www.showthrough.com",
  tagline: "Screen recording you own.",
  description:
    "Record your screen and share a link in seconds. Videos live in your own free Cloudflare storage, and you pay once instead of per person, per month.",
  contactEmail: "harshrawat.dev@gmail.com",
  loom: {
    perUserPerMonth: 18,
    planName: "Loom Business, billed monthly",
    checked: "November 2026",
  },
  chromeStoreUrl: "https://chromewebstore.google.com/detail/showthrough-screen-record/ngiiiademidnkjamgbaoijmfiphlmlpe",
} as const;

