// Everything that may change once the product name and pricing are final.
export const site = {
  name: "BYO Recorder",
  domain: "videos.harshraw.at",
  url: "https://videos.harshraw.at",
  description:
    "A screen recorder like Loom that keeps your videos in your own free Cloudflare account. Pay once instead of paying per person, per month.",
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
