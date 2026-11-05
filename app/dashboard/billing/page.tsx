import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard-ui";
import { buttonClass } from "@/components/ui";
import { getAccess } from "@/lib/billing";
import { pages } from "@/lib/dashboard-pages";
import { tiers } from "@/lib/pricing";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: pages.billing.title, robots: { index: false } };

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

export default async function BillingPage() {
  const { user } = await requireSession();
  const { paid, purchase, free } = await getAccess(user);
  const tier = purchase ? tiers.find((t) => t.id === purchase.tier) : null;

  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      <PageHeader title={pages.billing.title} description={pages.billing.description} />

      <section className="mt-10 max-w-2xl rounded-panel border border-line bg-surface p-6 sm:p-8">
        {paid ? (
          <>
            <h2 className="text-xl">Lifetime license</h2>
            <dl className="mt-4 divide-y divide-line border-t border-line text-[15px]">
              <Row label="Status" value="Active" />
              {free ? (
                <Row label="Plan" value="Complimentary access" />
              ) : (
                purchase && (
                  <>
                    <Row label="Plan" value={tier ? `${tier.name}, $${tier.price} once` : "Lifetime"} />
                    <Row label="Updates" value={tier?.updates ?? "Lifetime updates"} />
                    <Row label="Paid" value={`${(purchase.amount / 100).toFixed(2)} ${purchase.currency}`} />
                    <Row
                      label="Date"
                      value={new Date(purchase.created_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                    />
                  </>
                )
              )}
            </dl>
            {!free && <p className="mt-5 text-sm text-faint">Your receipt was emailed to {user.email} by Dodo Payments.</p>}
          </>
        ) : (
          <>
            <h2 className="text-xl">No purchase yet</h2>
            <p className="mt-2 text-muted">Showthrough is a one-time payment for your whole team. Buy it to connect Cloudflare and start recording.</p>
            <a href="/pricing" className={buttonClass("primary", "md", "mt-6")}>
              See pricing
            </a>
          </>
        )}
      </section>
    </main>
  );
}
