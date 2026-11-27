import Link from "next/link";
import { buttonClass } from "@/components/ui";
import { type Lock, PAID_FEATURES, type PaidFeature } from "@/lib/plan";

// What a dashboard page shows in place of a paid feature the account doesn't have.
export function LockedFeature({ feature, lock, member = false }: { feature: PaidFeature; lock: Lock; member?: boolean }) {
  const label = PAID_FEATURES[feature].label;
  return (
    <section className="mt-10 max-w-2xl rounded-panel border border-line bg-surface p-6 sm:p-8">
      <p className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-muted">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3">
          <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {lock === "plan" ? "Paid plan" : "Paid update"}
      </p>
      <h2 className="mt-4 text-xl">{lock === "plan" ? `${label}: paid plan` : `${label}: paid update`}</h2>
      <p className="mt-2 text-muted">
        {lock === "plan"
          ? member
            ? "Your team's admin is on the free plan. Once they upgrade, this turns on for the whole team."
            : "You're on the free plan: record and share as much as you like. Upgrading adds this and every other paid feature, for your whole team."
          : "Your purchase includes the updates from before this one. Buying later updates is coming soon."}
      </p>
      {!member && (
        <Link href={lock === "plan" ? "/pricing" : "/support"} className={buttonClass("primary", "md", "mt-6")}>
          {lock === "plan" ? "See pricing" : "Contact support"}
        </Link>
      )}
    </section>
  );
}
