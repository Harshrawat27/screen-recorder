// Headings for the dashboard pages. Both the pages and their loading screens use these,
// so the real title and description show instantly while the rest loads.
export const pages = {
  library: { title: "My library", description: "All your recordings, stored in your own Cloudflare." },
  recent: { title: "Recent", description: "Videos you recorded or watched lately." },
  watchLater: { title: "Watch later", description: "Videos you saved to come back to." },
  team: { title: "Manage team", description: "Invite people to record into your shared library." },
  billing: { title: "Billing", description: "Your plan, receipts and updates." },
  usage: { title: "Usage", description: "How much of Cloudflare's free plan your videos use." },
} as const;

export type DashboardPage = keyof typeof pages;
