import { createHmac, timingSafeEqual } from "node:crypto";
import { pool } from "@/lib/db";
import { type Tier, type TierId, openTier, tiers } from "@/lib/pricing";

// Payments with Dodo. A purchase row means the account has paid; that is what unlocks the
// dashboard and "Connect Cloudflare". Rows are written by the Dodo webhook, and also when the
// buyer comes back from checkout (so access opens even if the webhook is a few seconds late).

const globalForBilling = globalThis as unknown as { billingSchema?: Promise<void> };

const SCHEMA = `
create table if not exists purchase (
  payment_id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  tier text not null,
  product_id text not null,
  amount integer not null,
  currency text not null,
  status text not null default 'paid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists purchase_user_idx on purchase (user_id);
`;

function ensureSchema() {
  globalForBilling.billingSchema ??= pool.query(SCHEMA).then(() => undefined);
  return globalForBilling.billingSchema.catch((err) => {
    globalForBilling.billingSchema = undefined;
    throw err;
  });
}

const apiBase = () =>
  (process.env.DODO_PAYMENTS_ENVIRONMENT ?? "").toLowerCase().startsWith("live") ? "https://live.dodopayments.com" : "https://test.dodopayments.com";

const productIds: Record<TierId, string | undefined> = {
  first20: process.env.DODO_FIRSTTWENTY_PRODUCT,
  first100: process.env.DODO_FIRSTHUNDRED_PRODUCT,
  // Not on sale yet.
  launch: undefined,
};

function tierForProduct(productId: string): TierId | null {
  return (Object.keys(productIds) as TierId[]).find((id) => productIds[id] === productId) ?? null;
}

export type Purchase = {
  payment_id: string;
  user_id: string;
  tier: TierId;
  product_id: string;
  amount: number;
  currency: string;
  status: "paid" | "refunded";
  created_at: Date;
};

/** How many accounts have bought so far (refunds give the spot back). */
export async function soldCount(): Promise<number> {
  await ensureSchema();
  const { rows } = await pool.query<{ n: string }>("select count(distinct user_id) as n from purchase where status = 'paid'");
  return Number(rows[0]?.n ?? 0);
}

export async function getPurchase(userId: string): Promise<Purchase | null> {
  await ensureSchema();
  const { rows } = await pool.query<Purchase>(
    "select * from purchase where user_id = $1 and status = 'paid' order by created_at asc limit 1",
    [userId],
  );
  return rows[0] ?? null;
}

/** Accounts that get full access without paying (comma-separated emails in FREE_ACCESS_EMAILS), e.g. your own. */
function hasFreeAccess(email: string) {
  return (process.env.FREE_ACCESS_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}

export type Access = { paid: boolean; purchase: Purchase | null; free: boolean };

export async function getAccess(user: { id: string; email: string }): Promise<Access> {
  if (hasFreeAccess(user.email)) return { paid: true, purchase: null, free: true };
  const purchase = await getPurchase(user.id);
  return { paid: Boolean(purchase), purchase, free: false };
}

async function dodo<T>(path: string, init?: RequestInit): Promise<T> {
  const key = process.env.DODO_PAYMENTS_API_KEY;
  if (!key) throw new Error("DODO_PAYMENTS_API_KEY is not set");
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Dodo ${path} failed: ${res.status} ${await res.text().catch(() => "")}`);
  return (await res.json()) as T;
}

/** Starts a Dodo checkout for whichever tier is on sale. Returns null when nothing is on sale. */
export async function createCheckout(user: { id: string; email: string; name: string }, origin: string): Promise<{ url: string; tier: Tier } | null> {
  const tier = openTier(await soldCount());
  if (!tier) return null;
  const productId = productIds[tier.id];
  if (!productId) throw new Error(`No Dodo product ID set for the ${tier.id} tier`);

  const session = await dodo<{ session_id: string; checkout_url: string | null }>("/checkouts", {
    method: "POST",
    body: JSON.stringify({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: { email: user.email, name: user.name || user.email },
      return_url: `${origin}/dashboard?checkout=done`,
      cancel_url: `${origin}/pricing`,
      metadata: { user_id: user.id, tier: tier.id },
    }),
  });
  if (!session.checkout_url) throw new Error("Dodo returned no checkout URL");
  return { url: session.checkout_url, tier };
}

type DodoPayment = {
  payment_id: string;
  status?: string | null;
  total_amount?: number;
  currency?: string;
  metadata?: Record<string, unknown> | null;
  product_cart?: { product_id: string; quantity: number }[] | null;
  customer?: { email?: string | null } | null;
};

/** Saves a successful payment as a purchase. Ignores payments that aren't for Showthrough access. */
export async function recordPayment(payment: DodoPayment) {
  await ensureSchema();
  let userId = typeof payment.metadata?.user_id === "string" ? payment.metadata.user_id : null;
  // Fallback: match the account by the email used at checkout.
  if (!userId && payment.customer?.email) {
    const { rows } = await pool.query<{ id: string }>('select id from "user" where lower(email) = lower($1) limit 1', [payment.customer.email]);
    userId = rows[0]?.id ?? null;
  }
  const productId = payment.product_cart?.[0]?.product_id ?? "";
  const tier = tierForProduct(productId) ?? (typeof payment.metadata?.tier === "string" ? (payment.metadata.tier as TierId) : null);
  if (!userId || !tier || !tiers.some((t) => t.id === tier)) {
    console.warn("Dodo payment without a Showthrough user or product", payment.payment_id);
    return false;
  }
  await pool.query(
    `insert into purchase (payment_id, user_id, tier, product_id, amount, currency)
     values ($1, $2, $3, $4, $5, $6)
     on conflict (payment_id) do nothing`,
    [payment.payment_id, userId, tier, productId, payment.total_amount ?? 0, payment.currency ?? "USD"],
  );
  return true;
}

export async function markRefunded(paymentId: string) {
  await ensureSchema();
  await pool.query("update purchase set status = 'refunded', updated_at = now() where payment_id = $1", [paymentId]);
}

/**
 * When a buyer lands back from checkout, ask Dodo directly whether their payment went
 * through, so access opens straight away instead of waiting for the webhook.
 */
export async function syncPayment(paymentId: string, userId: string) {
  const payment = await dodo<DodoPayment>(`/payments/${encodeURIComponent(paymentId)}`);
  if (payment.metadata?.user_id !== userId) return false;
  if (payment.status !== "succeeded") return false;
  return recordPayment(payment);
}

/** Checks a Dodo webhook signature (Standard Webhooks format). */
export function verifyWebhook(body: string, headers: Headers): boolean {
  const secret = process.env.DODO_WEBHOOK_KEY;
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatures = headers.get("webhook-signature");
  if (!secret || !id || !timestamp || !signatures) return false;

  // Reject old or future-dated deliveries (5 minutes either way).
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const key = Buffer.from(secret.startsWith("whsec_") ? secret.slice(6) : secret, "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();
  return signatures.split(" ").some((part) => {
    const [version, value] = part.split(",");
    if (version !== "v1" || !value) return false;
    const given = Buffer.from(value, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

/** For the marketing pages: how many have sold and what's on sale now. Never throws. */
export async function currentOffer(): Promise<{ sold: number; tier: Tier | null; price: number }> {
  let sold = 0;
  try {
    sold = await soldCount();
  } catch (err) {
    console.error("Could not count purchases", err);
  }
  const tier = openTier(sold);
  return { sold, tier, price: tier?.price ?? tiers[tiers.length - 1].price };
}
