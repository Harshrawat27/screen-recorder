import type { Metadata } from "next";
import { EmptyState, PageHeader, emptyIcon } from "@/components/dashboard-ui";

export const metadata: Metadata = { title: "Watch later", robots: { index: false } };

export default function WatchLaterPage() {
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      <PageHeader title="Watch later" description="Videos you saved to come back to." />
      <EmptyState
        icon={emptyIcon(<path d="M7 4h10a1.2 1.2 0 0 1 1.2 1.2V20L12 16l-6.2 4V5.2A1.2 1.2 0 0 1 7 4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />)}
        title="No saved videos"
        body="Save any video for later and it will wait for you here, so nothing important gets lost in a busy week."
      />
    </main>
  );
}
