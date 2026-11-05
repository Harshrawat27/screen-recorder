import type { Metadata } from "next";
import { EmptyState, PageHeader, emptyIcon } from "@/components/dashboard-ui";

export const metadata: Metadata = { title: "Recent", robots: { index: false } };

export default function RecentPage() {
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      <PageHeader title="Recent" description="Videos you recorded or watched lately." />
      <EmptyState
        icon={emptyIcon(<><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" /><path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></>)}
        title="Nothing here yet"
        body="Videos you record or open will show up here, newest first, so you can get back to them quickly."
      />
    </main>
  );
}
