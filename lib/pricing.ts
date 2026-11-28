// The price ladder. Safe to import anywhere (no secrets): the Dodo product IDs live in
// environment variables and are only read on the server, in lib/billing.ts.
//
//   $29  the first buyers (closed, not shown)
//   $39  lifetime: one payment with every future update (on sale now; same Dodo product as
//        the Black Friday sale)
//   $79  once the Mac app is live; future updates may be paid (not on sale yet)
//
// The tier ids keep their original names because they are stored on every purchase.

export type TierId = "first20" | "first100" | "launch";

// The end of Black Friday in US Pacific time. Only the India offer still reads it (it ended with the sale).
export const EARLY_ENDS = "2026-11-27T23:59:59-08:00";
export const EARLY_ENDS_LABEL = "Black Friday, 27 November, 11:59 PM PT";
export const EARLY_ENDS_SHORT = "27 Nov";
/** The lifetime price on sale now, with every future update. */
export const LIFETIME_PRICE = 39;
/** The price once the Mac app is live. */
export const MAC_PRICE = 79;

export type Tier = {
  id: TierId;
  name: string;
  price: number;
  updates: string;
  note: string;
};

export const tiers: Tier[] = [
  { id: "first20", name: "First buyers", price: 29, updates: "Lifetime updates", note: "Closed." },
  { id: "first100", name: "Lifetime", price: LIFETIME_PRICE, updates: "Lifetime updates", note: "One payment. Every future update included." },
  { id: "launch", name: "After the Mac app", price: MAC_PRICE, updates: "Future updates may be paid", note: "The price once the Mac app is live." },
];

/** Discount codes a "Buy" link may pre-apply at checkout (/buy?code=...). Create each one in Dodo. */
export const PUBLIC_CODES = ["INDIA50"] as const;
export const INDIA_CODE = "INDIA50";

export type TierState = "closed" | "open" | "ended" | "later";

export const earlyOpen = (now = Date.now()) => now < Date.parse(EARLY_ENDS);

/** The state of each tier. The $39 lifetime tier is on sale until the Mac app ships. */
export function tierStates() {
  return tiers.map((tier) => {
    let state: TierState;
    if (tier.id === "first20") state = "closed";
    else if (tier.id === "first100") state = "open";
    else state = "later";
    return { tier, state };
  });
}

/** The tiers shown on the pricing section: the closed first-buyer price is left out. */
export function shownTiers() {
  return tierStates().filter((t) => t.tier.id !== "first20");
}

/** The tier on sale right now. */
export function openTier(): Tier | null {
  return tierStates().find((t) => t.state === "open")?.tier ?? null;
}
