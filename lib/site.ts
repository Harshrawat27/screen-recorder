// Everything that may change: name, domain, price, contact.
export const site = {
  name: "Showthrough",
  domain: "showthrough.com",
  url: "https://www.showthrough.com",
  tagline: "Screen recording you own.",
  description:
    "Free screen recording with no video limit and no time limit. Record your screen and share a link in seconds; videos live in your own free Cloudflare storage. Free forever, and paid is one payment, never per person, per month.",
  contactEmail: "harshrawat.dev@gmail.com",
  loom: {
    perUserPerMonth: 18,
    planName: "Loom Business, billed monthly",
    checked: "November 2026",
  },
  chromeStoreUrl: "https://chromewebstore.google.com/detail/showthrough-screen-record/ngiiiademidnkjamgbaoijmfiphlmlpe",
} as const;

