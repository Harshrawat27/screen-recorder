import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard-ui";
import { CheckIcon, buttonClass } from "@/components/ui";
import { getAccess } from "@/lib/billing";
import { firstName, getTeamContext } from "@/lib/team";
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
  const { paid, purchase, free, viaTeam } = await getAccess(user);
  // Team members are covered by their admin's license.
  if (viaTeam) {
    const team = await getTeamContext(user);
    return (
      <main className="px-5 py-8 sm:px-10 sm:py-10">
        <PageHeader title={pages.billing.title} description={pages.billing.description} />
        <section className="mt-10 max-w-2xl rounded-panel border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-xl">Covered by your team</h2>
          <p className="mt-2 text-muted">
            You&rsquo;re on {firstName(team.owner)}&rsquo;s team, and their license covers everyone on it. There&rsquo;s nothing for you to pay.
          </p>
        </section>
      </main>
    );
  }
  const tier = purchase ? tiers.find((t) => t.id === purchase.tier) : null;
  const appsumo = purchase?.tier === "appsumo";

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
                    <Row
                      label="Plan"
                      value={appsumo ? "AppSumo lifetime deal" : tier ? `${tier.name}, $${tier.price} once` : "Lifetime"}
                    />
                    <Row label="Updates" value={tier?.updates ?? "Lifetime updates"} />
                    {!appsumo && <Row label="Paid" value={`${(purchase.amount / 100).toFixed(2)} ${purchase.currency}`} />}
                    <Row
                      label="Date"
                      value={new Date(purchase.created_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                    />
                  </>
                )
              )}
            </dl>
            {!free && (
              <p className="mt-5 text-sm text-faint">
                {appsumo ? "Redeemed with an AppSumo code. Your receipt is in your AppSumo account." : `Your receipt was emailed to ${user.email} by Dodo Payments.`}
              </p>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <h2 className="text-xl">Free plan</h2>
              <span className="rounded-full bg-text px-2.5 py-0.5 text-xs font-semibold text-canvas">Forever</span>
            </div>
            <p className="mt-2 text-muted">
              Unlimited recordings with no time limit, share links, search, Watch later and MP4 downloads. Free forever, no card needed.
            </p>
            <p className="mt-6 text-[15px] font-semibold">Upgrade once, keep it for life</p>
            <ul className="mt-3 space-y-2 text-[15px] text-muted">
              {[
                "Comments, reactions and view counts",
                "Live notifications",
                "Your whole team, no per-seat pricing",
                "Folders and buttons under your videos",
                "Share pages without “Recorded with Showthrough”",
              ].map((perk) => (
                <li key={perk} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-text text-canvas">
                    <CheckIcon className="size-3" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {/* /buy signs in if needed, then goes straight to checkout. */}
              <a href="/buy" className={buttonClass("primary", "md")}>
                Upgrade
              </a>
              <a href="/pricing" className={buttonClass("secondary", "md")}>
                See pricing
              </a>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
