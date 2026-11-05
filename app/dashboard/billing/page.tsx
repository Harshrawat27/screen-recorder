import type { Metadata } from "next";
import { EmptyState, PageHeader, emptyIcon } from "@/components/dashboard-ui";

export const metadata: Metadata = { title: "Billing", robots: { index: false } };

export default function BillingPage() {
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      <PageHeader title="Billing" description="Your plan, receipts and updates." />
      <EmptyState
        icon={emptyIcon(<><rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.7" /><path d="M3 9.5h18M6.5 14.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></>)}
        title="Billing details will live here"
        body="Your lifetime license, receipts and update status will show up here after you buy."
      />
    </main>
  );
}
