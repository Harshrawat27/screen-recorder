// Headings for the dashboard pages. Both the pages and their loading screens use these,
// so the real title and description show instantly while the rest loads.
export const pages = {
  library: { title: "My library", description: "All your recordings, stored in your own Cloudflare." },
  recent: { title: "Recent", description: "The last 25 videos you watched, newest first." },
  watchLater: { title: "Watch later", description: "Videos you saved to come back to." },
  team: { title: "Manage team", description: "Invite people to record into your shared library." },
  billing: { title: "Billing", description: "Your plan, receipts and updates." },
  profile: { title: "Profile", description: "The photo viewers see when you record without your camera." },
  usage: { title: "Usage", description: "How much of Cloudflare's free plan your videos use." },
} as const;

export type DashboardPage = keyof typeof pages;
