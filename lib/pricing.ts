// The price ladder. Safe to import anywhere (no secrets): the Dodo product IDs live in
// environment variables and are only read on the server, in lib/billing.ts.
//
// Spots are counted across tiers: the first 10 buyers pay $29, buyers 11 to 50 pay $59,
// and after that the launch price applies. (The tier ids keep their original names because
// they are stored on every purchase.)

export type TierId = "first20" | "first100" | "launch";

export type Tier = {
  id: TierId;
  name: string;
  price: number;
  /** Buyers up to and including this number get this tier. */
  upTo: number | null;
  updates: string;
  note: string;
};

export const tiers: Tier[] = [
  { id: "first20", name: "First 10", price: 29, upTo: 10, updates: "Lifetime updates", note: "For the first 10 customers." },
  { id: "first100", name: "Early", price: 59, upTo: 50, updates: "Lifetime updates", note: "For customers 11 to 50." },
  { id: "launch", name: "Launch", price: 99, upTo: null, updates: "No future updates", note: "After the first 50." },
];

export type TierState = "sold-out" | "open" | "next" | "later";

/** Which tier is on sale given how many purchases there are, and the state of each tier. */
export function tierStates(sold: number) {
  // The launch tier isn't on sale yet, so once 50 are gone nothing is open.
  const openIndex = sold < 10 ? 0 : sold < 50 ? 1 : -1;
  return tiers.map((tier, i) => {
    const start = i === 0 ? 0 : (tiers[i - 1].upTo ?? 0);
    const left = tier.upTo === null ? null : Math.max(0, tier.upTo - Math.max(sold, start));
    let state: TierState;
    if (tier.id === "launch") state = "later";
    else if (i === openIndex) state = "open";
    else if (openIndex !== -1 && i < openIndex) state = "sold-out";
    else if (openIndex === -1) state = "sold-out";
    else state = "next";
    return { tier, state, left, size: tier.upTo === null ? null : tier.upTo - start };
  });
}

export function openTier(sold: number): Tier | null {
  return tierStates(sold).find((t) => t.state === "open")?.tier ?? null;
}
