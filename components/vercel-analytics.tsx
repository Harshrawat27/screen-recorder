"use client";

import { Analytics } from "@vercel/analytics/next";

// Vercel Analytics, minus embeds: those load on other people's websites and would use up the
// page-view quota without telling us anything about our own site.
export function VercelAnalytics() {
  return <Analytics beforeSend={(event) => (new URL(event.url).pathname.startsWith("/embed/") ? null : event)} />;
}
