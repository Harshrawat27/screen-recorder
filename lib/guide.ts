// The setup guide (/guide): one short page per step, in this order. The sidebar, the
// "Step x of y" line and the Previous / Next links all come from this list.

export type GuidePage = {
  slug: string; // "" is the guide's first page, at /guide
  title: string; // the page's heading
  nav: string; // its name in the sidebar
  description: string; // for search engines and link previews
};

export const guidePages: GuidePage[] = [
  {
    slug: "",
    title: "Set up Showthrough",
    nav: "Before you start",
    description: "Connect Showthrough to your own Cloudflare and record your first video. About two minutes, and you only do it once.",
  },
  {
    slug: "create-cloudflare-account",
    title: "Create a Cloudflare account",
    nav: "Create a Cloudflare account",
    description: "Sign up for a free Cloudflare account, where your Showthrough videos will be stored.",
  },
  {
    slug: "turn-on-r2",
    title: "Turn on R2",
    nav: "Turn on R2",
    description: "Turn on Cloudflare R2, the storage that keeps your Showthrough videos. It asks for a card, but your first 10 GB each month are free.",
  },
  {
    slug: "connect-cloudflare",
    title: "Connect Cloudflare",
    nav: "Connect Cloudflare",
    description: "Connect your Cloudflare account to Showthrough with one click.",
  },
  {
    slug: "wait-for-setup",
    title: "Wait about 30 seconds",
    nav: "Wait for setup",
    description: "Showthrough sets up storage and a video backend in your Cloudflare. It takes about 30 seconds.",
  },
  {
    slug: "add-extension",
    title: "Add the Chrome extension",
    nav: "Add the Chrome extension",
    description: "Install the Showthrough extension from the Chrome Web Store.",
  },
  {
    slug: "connect-extension",
    title: "Connect the extension",
    nav: "Connect the extension",
    description: "Connect the Showthrough extension so it knows where to save your recordings.",
  },
  {
    slug: "record",
    title: "Record your first video",
    nav: "Record your first video",
    description: "Start your first Showthrough recording and share its link.",
  },
  {
    slug: "troubleshooting",
    title: "If something goes wrong",
    nav: "If something goes wrong",
    description: "Quick fixes for the problems people hit while setting up Showthrough.",
  },
];

export const guidePath = (slug: string) => (slug ? `/guide/${slug}` : "/guide");
