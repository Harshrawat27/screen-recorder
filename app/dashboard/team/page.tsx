import type { Metadata } from "next";
import { EmptyState, PageHeader, emptyIcon } from "@/components/dashboard-ui";

export const metadata: Metadata = { title: "Manage team", robots: { index: false } };

export default function TeamPage() {
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      <PageHeader title="Manage team" description="Invite people to record into your shared library." />
      <EmptyState
        icon={emptyIcon(<><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" strokeWidth="1.7" /><circle cx="17" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" /><path d="M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5M15.5 14.6c2.4-.3 4.4 1.1 5 3.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></>)}
        title="Teams are on the way"
        body="Invite teammates by email, see who recorded what, and remove access anytime. Still one price for everyone."
      />
    </main>
  );
}
