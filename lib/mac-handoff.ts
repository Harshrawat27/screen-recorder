import { randomBytes } from "node:crypto";
import { MEDIA_URL } from "@/lib/config";
import { getWorkspace, pool } from "@/lib/db";
import { firstName, getMemberships, getPerson, listMembers, memberKey } from "@/lib/team";

// Connecting the Mac app. The browser page (signed in) collects every place this person can
// record into, stores it under a one-time code for a few minutes, and opens
// showthrough://connect?code=…. The app trades the code for the accounts with one POST, and
// the code is gone. Upload keys never travel in a URL.
//
// A table of its own, so it never touches the rest of the schema:
//   select code, user_id, created_at from mac_handoff;

const SCHEMA = `
create table if not exists mac_handoff (
  code text primary key,
  user_id text not null,
  accounts jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists mac_handoff_created on mac_handoff (created_at);
`;

const TTL_MINUTES = 10;

const globalForHandoff = globalThis as unknown as { macHandoffReady?: Promise<void> };

function ensureSchema() {
  globalForHandoff.macHandoffReady ??= pool.query(SCHEMA).then(() => undefined);
  return globalForHandoff.macHandoffReady.catch((err) => {
    globalForHandoff.macHandoffReady = undefined;
    throw err;
  });
}

/** One place the Mac app can save recordings to. Same fields as the extension's config. */
export type MacAccount = {
  email: string;
  userId: string;
  space: string;
  uploadUrl: string;
  uploadKey: string;
  ownerId: string;
  teamName: string;
  mediaBase: string;
  playerBase: string;
};

/**
 * Their own workspace (if they connected Cloudflare) and every team they're on. A team whose
 * backend is too old for member keys is skipped and reported, so the page can say so.
 */
export async function macAccounts(user: { id: string; email: string }, origin: string) {
  const accounts: MacAccount[] = [];
  const needsUpdate: string[] = [];
  const own = await getWorkspace(user.id);
  if (own) {
    const hasTeam = (await listMembers(user.id)).length > 0;
    accounts.push(account(user, own, own.upload_key, user.id, hasTeam ? "Your team" : "Personal", origin));
  }
  for (const membership of await getMemberships(user.id)) {
    const [ws, owner] = await Promise.all([getWorkspace(membership.owner_id), getPerson(membership.owner_id)]);
    if (!ws) continue;
    const name = owner ? `${firstName(owner)}'s team` : "Your team";
    // The same member key the extension uses, so connecting the Mac doesn't log the extension out.
    const key = await memberKey(ws, user.id).catch(() => null);
    if (key) accounts.push(account(user, ws, key, membership.owner_id, name, origin));
    else needsUpdate.push(name);
  }
  return { accounts, needsUpdate };
}

function account(
  user: { id: string; email: string },
  ws: { space: string; worker_url: string },
  uploadKey: string,
  ownerId: string,
  teamName: string,
  origin: string,
): MacAccount {
  return {
    email: user.email,
    userId: user.id,
    space: ws.space,
    uploadUrl: ws.worker_url,
    uploadKey,
    ownerId,
    teamName,
    mediaBase: `${MEDIA_URL}/${ws.space}`,
    playerBase: `${origin}/v/${ws.space}`,
  };
}

export async function createHandoff(userId: string, accounts: MacAccount[]) {
  await ensureSchema();
  const code = randomBytes(24).toString("base64url");
  await pool.query(`delete from mac_handoff where created_at < now() - interval '${TTL_MINUTES} minutes'`);
  await pool.query("insert into mac_handoff (code, user_id, accounts) values ($1, $2, $3)", [code, userId, JSON.stringify(accounts)]);
  return code;
}

/** Uses up a code: returns its accounts once, or null if it's unknown, used or expired. */
export async function redeemHandoff(code: string): Promise<MacAccount[] | null> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(code)) return null;
  await ensureSchema();
  const { rows } = await pool.query<{ accounts: MacAccount[] }>(
    `delete from mac_handoff where code = $1 and created_at > now() - interval '${TTL_MINUTES} minutes' returning accounts`,
    [code],
  );
  return rows[0]?.accounts ?? null;
}
