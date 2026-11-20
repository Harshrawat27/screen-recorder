import { pool } from "@/lib/db";

// AppSumo lifetime-deal codes. We generate the codes (scripts/appsumo-codes.mjs), upload the
// same list to AppSumo as a CSV, and AppSumo hands one to each buyer. Redeeming a code at
// /appsumo writes a purchase row, which unlocks the dashboard exactly like a Dodo payment.

const globalForAppsumo = globalThis as unknown as { appsumoSchema?: Promise<void> };

// Same table the codes script creates. Created on first use, like the other tables.
export const APPSUMO_SCHEMA = `
create table if not exists appsumo_code (
  code text primary key,
  batch text not null,
  status text not null default 'active',
  redeemed_by text references "user"(id) on delete set null,
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists appsumo_code_user_idx on appsumo_code (redeemed_by);
`;

function ensureSchema() {
  globalForAppsumo.appsumoSchema ??= pool.query(APPSUMO_SCHEMA).then(() => undefined);
  return globalForAppsumo.appsumoSchema.catch((err) => {
    globalForAppsumo.appsumoSchema = undefined;
    throw err;
  });
}

/** Codes are stored upper-case without spaces, so pasted codes match however they were copied. */
export function normalizeCode(raw: string) {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

const CODE_SHAPE = /^[A-Z0-9_-]{3,200}$/;

export type RedeemResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "not_found" | "used" | "refunded" | "failed" };

/** Redeems a code for this user. Safe to call twice with the same code by the same user. */
export async function redeemCode(userId: string, raw: string): Promise<RedeemResult> {
  const code = normalizeCode(raw);
  if (!CODE_SHAPE.test(code)) return { ok: false, reason: "invalid" };
  await ensureSchema();

  const client = await pool.connect();
  try {
    await client.query("begin");
    const { rows } = await client.query<{ status: string; redeemed_by: string | null }>(
      "select status, redeemed_by from appsumo_code where code = $1 for update",
      [code],
    );
    const row = rows[0];
    if (!row) {
      await client.query("rollback");
      return { ok: false, reason: "not_found" };
    }
    if (row.status !== "active") {
      await client.query("rollback");
      return { ok: false, reason: "refunded" };
    }
    if (row.redeemed_by && row.redeemed_by !== userId) {
      await client.query("rollback");
      return { ok: false, reason: "used" };
    }

    await client.query("update appsumo_code set redeemed_by = $2, redeemed_at = coalesce(redeemed_at, now()) where code = $1", [code, userId]);
    // AppSumo buyers get every future update (updates_until = null). The amount is unknown to
    // us (AppSumo takes the payment), so it is stored as 0 and the tier says where it came from.
    await client.query(
      `insert into purchase (payment_id, user_id, tier, product_id, amount, currency, updates_until)
       values ($1, $2, 'appsumo', 'appsumo', 0, 'USD', null)
       on conflict (payment_id) do update set status = 'paid', updated_at = now()`,
      [`appsumo_${code}`, userId],
    );
    await client.query("commit");
    return { ok: true };
  } catch (err) {
    await client.query("rollback").catch(() => undefined);
    console.error("Could not redeem AppSumo code", err);
    return { ok: false, reason: "failed" };
  } finally {
    client.release();
  }
}
