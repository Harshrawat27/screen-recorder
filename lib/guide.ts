// The setup guide (/guide): one short page per step, in this order. The sidebar, the
// "Step x of y" line and the Previous / Next links all come from this list.

export type GuidePage = {
  slug: string; // "" is the guide's first page, at /guide
  title: string; // the page's heading
  nav: string; // its name in the sidebar
  description: string; // for search engines and link previews
  group?: string; // optional heading above this page in the sidebar (team guide)
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

// The team guide (/guide/team): inviting people, joining, recording for a team.
export const teamGuidePages: GuidePage[] = [
  {
    slug: "",
    title: "Set up your team",
    nav: "How teams work",
    description: "Invite your team to Showthrough. Everyone records with their own login, videos go to one Cloudflare, and one purchase covers everyone.",
  },
  {
    slug: "update-showthrough",
    title: "Update Showthrough",
    nav: "Update Showthrough",
    description: "Teams need the latest version of your Showthrough video backend. Updating takes about 10 seconds.",
    group: "For the admin",
  },
  {
    slug: "invite-teammates",
    title: "Invite your teammates",
    nav: "Invite teammates",
    description: "Create an invite for each teammate and send them the link.",
    group: "For the admin",
  },
  {
    slug: "manage-your-team",
    title: "See and manage your team",
    nav: "Manage your team",
    description: "See everything each teammate has recorded, and remove people who leave.",
    group: "For the admin",
  },
  {
    slug: "join-a-team",
    title: "Join a team",
    nav: "Join a team",
    description: "Open your invite link, sign in with the invited email and join the team.",
    group: "For teammates",
  },
  {
    slug: "connect-extension",
    title: "Connect the extension",
    nav: "Connect the extension",
    description: "Connect the Showthrough extension so your recordings go to your team.",
    group: "For teammates",
  },
  {
    slug: "record-for-your-team",
    title: "Record for your team",
    nav: "Record for your team",
    description: "Record as usual. On more than one team? Pick where each recording is saved.",
    group: "For teammates",
  },
  {
    slug: "who-can-see",
    title: "Choose who can see a video",
    nav: "Who can see a video",
    description: "Share a recording with the whole team, or only with the people you choose.",
    group: "For teammates",
  },
  {
    slug: "switch-teams",
    title: "Switch between teams",
    nav: "Switch between teams",
    description: "On more than one team, or have your own Showthrough too? Switch libraries in one click.",
    group: "For teammates",
  },
  {
    slug: "leave-a-team",
    title: "Leave a team",
    nav: "Leave a team",
    description: "Leave a team you no longer work with. Your recordings stay with the team.",
    group: "For teammates",
  },
  {
    slug: "troubleshooting",
    title: "If something goes wrong",
    nav: "If something goes wrong",
    description: "Quick fixes for the problems people hit when setting up a Showthrough team.",
  },
];

export type Guide = { name: string; base: string; pages: GuidePage[] };
export const setupGuide: Guide = { name: "Setup guide", base: "/guide", pages: guidePages };
export const teamGuide: Guide = { name: "Team guide", base: "/guide/team", pages: teamGuidePages };

export const guidePath = (slug: string, base = "/guide") => (slug ? `${base}/${slug}` : base);
