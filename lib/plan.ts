import { cache } from "react";
import { type Access, ownAccess } from "@/lib/billing";
import { pool } from "@/lib/db";
import { getPerson } from "@/lib/team";

// Free and paid plans.
//
// Free: record without limits into your own Cloudflare, share links, the library (rename, delete,
// search), Recent and Watch later, your photo instead of the camera, download as MP4, and the
// Usage page. Free share pages show "Recorded with Showthrough".
// Paid: everything in PAID_FEATURES below. Their buttons and screens still show for free accounts;
// using one opens the upgrade popup (components/upgrade.tsx) instead.
//
// Each paid feature lists the Worker version it arrived in. Customers whose purchase covers
// updates only up to a version (after the first 50 buyers) get the features from that version
// and older; newer ones stay locked until they buy that update, even if their Worker is newer
// (free accounts and new connections always install the latest Worker).
//
// What a workspace can do depends on its OWNER's own plan (whoever connected the Cloudflare): a
// team member uses the team's, a share page uses the sender's. The paid parts all go through
// this website (only it holds a Worker's main key), so checking here is enough to lock them.

export const PAID_FEATURES = {
  comments: { label: "Comments, reactions and view counts", since: 2 },
  folders: { label: "Folders", since: 4 },
  team: { label: "Team members", since: 7 },
  notifications: { label: "Live notifications", since: 7 },
  cta: { label: "Buttons under your videos", since: 0 },
  hideBadge: { label: "Hiding “Recorded with Showthrough”", since: 0 },
} as const;

export type PaidFeature = keyof typeof PAID_FEATURES;
export type Features = Record<PaidFeature, boolean>;
/** Why a feature is locked: on the free plan, or paid but this update isn't in their purchase. */
export type Lock = "plan" | "update";

export const planOf = (access: Access): "free" | "paid" => (access.paid ? "paid" : "free");

export function lockOf(access: Access, feature: PaidFeature): Lock | null {
  if (!access.paid) return "plan";
  const since = PAID_FEATURES[feature].since;
  if (access.free || !access.purchase || since === 0) return null;
  const until = access.purchase.updates_until;
  return until === null || until >= since ? null : "update";
}

export const can = (access: Access, feature: PaidFeature) => lockOf(access, feature) === null;

export function featuresFor(access: Access): Features {
  return Object.fromEntries((Object.keys(PAID_FEATURES) as PaidFeature[]).map((f) => [f, can(access, f)])) as Features;
}

const FREE: Access = { paid: false, purchase: null, free: false };

/** The plan of whoever owns a workspace (connected its Cloudflare). Once per request. */
export const ownerAccess = cache(async (ownerId: string): Promise<Access> => {
  const owner = await getPerson(ownerId).catch(() => null);
  return owner ? ownAccess(owner) : FREE;
});

export const ownerFeatures = async (ownerId: string) => featuresFor(await ownerAccess(ownerId));

// ---- Share page settings ----------------------------------------------------------------------
// Kept per workspace owner, in a table of its own. Paid owners can hide the badge.

const SETTINGS_SCHEMA = `
create table if not exists share_setting (
  owner_id text primary key,
  hide_badge boolean not null default false,
  updated_at timestamptz not null default now()
);`;

const globalForSettings = globalThis as unknown as { shareSettingReady?: Promise<void> };
function ensureSettings() {
  globalForSettings.shareSettingReady ??= pool.query(SETTINGS_SCHEMA).then(() => undefined);
  return globalForSettings.shareSettingReady.catch((err) => {
    globalForSettings.shareSettingReady = undefined;
    throw err;
  });
}

export async function getHideBadge(ownerId: string): Promise<boolean> {
  await ensureSettings();
  const { rows } = await pool.query<{ hide_badge: boolean }>("select hide_badge from share_setting where owner_id = $1", [ownerId]);
  return rows[0]?.hide_badge ?? false;
}

export async function setHideBadge(ownerId: string, hide: boolean) {
  await ensureSettings();
  await pool.query(
    `insert into share_setting (owner_id, hide_badge) values ($1, $2)
     on conflict (owner_id) do update set hide_badge = excluded.hide_badge, updated_at = now()`,
    [ownerId, hide],
  );
}

/** Whether a share page shows "Recorded with Showthrough": always on free; paid owners choose. */
export async function showsBadge(ownerId: string): Promise<boolean> {
  if (!(await ownerFeatures(ownerId)).hideBadge) return true;
  return !(await getHideBadge(ownerId).catch(() => false));
}
