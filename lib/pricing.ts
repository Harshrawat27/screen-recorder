// The price ladder. Safe to import anywhere (no secrets): the Dodo product IDs live in
// environment variables and are only read on the server, in lib/billing.ts.
//
//   $29  the first buyers (closed)
//   $39  the Black Friday sale, until EARLY_ENDS, with every future update
//   $99  from LAUNCH_LABEL, without future updates (sales pause until then)
//
// The deadline is one fixed moment, so the countdown is the same on every device, and the
// price really changes when it reaches zero. (The tier ids keep their original names because
// they are stored on every purchase.)

export type TierId = "first20" | "first100" | "launch";

// The end of Black Friday in US Pacific time (most visitors are in the US).
export const EARLY_ENDS = "2026-11-27T23:59:59-08:00";
export const EARLY_ENDS_LABEL = "Black Friday, 27 November, 11:59 PM PT";
export const EARLY_ENDS_SHORT = "27 Nov";
/** The price after the sale; shown crossed out next to the sale price. */
export const LAUNCH_PRICE = 99;
/** The Black Friday price, for copy that mentions it. */
export const SALE_PRICE = 39;
export const LAUNCH_LABEL = "30 November";
/** The launch day, for structured data (sales reopen then). */
export const LAUNCH_DATE = "2026-11-30";

export type Tier = {
  id: TierId;
  name: string;
  price: number;
  updates: string;
  note: string;
};

export const tiers: Tier[] = [
  { id: "first20", name: "First buyers", price: 29, updates: "Lifetime updates", note: "For the people who found us before we found them." },
  { id: "first100", name: "Black Friday", price: SALE_PRICE, updates: "Lifetime updates", note: `Until ${EARLY_ENDS_LABEL}.` },
  { id: "launch", name: "Launch", price: 99, updates: "No future updates", note: "After early pricing ends." },
];

/** Discount codes a "Buy" link may pre-apply at checkout (/buy?code=...). Create each one in Dodo. */
export const PUBLIC_CODES = ["INDIA50"] as const;
export const INDIA_CODE = "INDIA50";

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
