// The price ladder. Safe to import anywhere (no secrets): the Dodo product IDs live in
// environment variables and are only read on the server, in lib/billing.ts.
//
//   $29  the first buyers (closed)
//   $49  until EARLY_ENDS, with every future update
//   $99  from the Product Hunt launch, without future updates (sales pause until then)
//
// The deadline is one fixed moment, so the countdown is the same on every device, and the
// price really changes when it reaches zero. (The tier ids keep their original names because
// they are stored on every purchase.)

export type TierId = "first20" | "first100" | "launch";

export const EARLY_ENDS = "2026-11-23T23:59:59+05:30";
export const EARLY_ENDS_LABEL = "23 November, 11:59 PM IST";
export const LAUNCH_LABEL = "30 November";

export type Tier = {
  id: TierId;
  name: string;
  price: number;
  updates: string;
  note: string;
};

export const tiers: Tier[] = [
  { id: "first20", name: "First buyers", price: 29, updates: "Lifetime updates", note: "For the people who found us before we found them." },
  { id: "first100", name: "Early", price: 49, updates: "Lifetime updates", note: `Until ${EARLY_ENDS_LABEL}.` },
  { id: "launch", name: "Launch", price: 99, updates: "No future updates", note: "After early pricing ends." },
];

export type TierState = "closed" | "open" | "ended" | "later";

export const earlyOpen = (now = Date.now()) => now < Date.parse(EARLY_ENDS);

/** The state of each tier at a moment in time. */
export function tierStates(now = Date.now()) {
  return tiers.map((tier) => {
    let state: TierState;
    if (tier.id === "first20") state = "closed";
    else if (tier.id === "first100") state = earlyOpen(now) ? "open" : "ended";
    else state = "later";
    return { tier, state };
  });
}

/** The tier on sale right now, or null while sales are paused before the launch. */
export function openTier(now = Date.now()): Tier | null {
  return tierStates(now).find((t) => t.state === "open")?.tier ?? null;
}
