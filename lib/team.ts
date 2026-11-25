import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { type Workspace, getWorkspace, pool } from "@/lib/db";

// Teams. The admin is the account owner who connected Cloudflare; everyone they invite records
// into the same Cloudflare with their own Showthrough login. Teams are keyed by the admin's
// account (not their workspace), so a team survives the admin disconnecting and reconnecting.
//
// One person can be in several teams and have their own Cloudflare too (a freelancer working
// with two agencies). The dashboard shows one of them at a time: the "current team", kept in a
// cookie and changed with the switcher in the sidebar.
//
// Each member's extension gets its own key (team_member.member_key). The Worker only stores its
// hash, and that key can upload the member's own recordings and nothing else. Removing a member
// deletes their key in the Worker, so their extension stops working at once.

const globalForTeam = globalThis as unknown as { teamSchema?: Promise<void> };

const SCHEMA = `
create table if not exists team_member (
  user_id text not null references "user"(id) on delete cascade,
  owner_id text not null references "user"(id) on delete cascade,
  member_key text,
  extension_connected_at timestamptz,
  joined_at timestamptz not null default now(),
  primary key (user_id, owner_id)
);
-- An early build allowed one team per person (primary key on user_id alone).
do $$ begin
  if (select count(*) from information_schema.key_column_usage
      where table_name = 'team_member' and constraint_name = 'team_member_pkey') = 1 then
    alter table team_member drop constraint team_member_pkey;
    alter table team_member add primary key (user_id, owner_id);
  end if;
end $$;
create index if not exists team_member_owner on team_member (owner_id);
create table if not exists team_invite (
  token text primary key,
  owner_id text not null references "user"(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  accepted_by text
);
create index if not exists team_invite_owner on team_invite (owner_id);
`;

function ensureSchema() {
  globalForTeam.teamSchema ??= pool.query(SCHEMA).then(() => undefined);
  return globalForTeam.teamSchema.catch((err) => {
    globalForTeam.teamSchema = undefined;
    throw err;
  });
}

/** Teams need version 7 of the video backend (member keys and "recorded by"). */
export const TEAM_VERSION = 7;
export const teamsEnabled = (ws: Workspace | null): ws is Workspace => Boolean(ws && ws.worker_version >= TEAM_VERSION);

export type Person = { id: string; name: string; email: string; image: string | null };

/** Names and photos for a set of account ids (missing ids are left out). */
export async function people(ids: string[]): Promise<Map<string, Person>> {
  if (!ids.length) return new Map();
  const { rows } = await pool.query<Person>('select id, name, email, image from "user" where id = any($1)', [ids]);
  return new Map(rows.map((p) => [p.id, p]));
}

export async function getPerson(id: string): Promise<Person | null> {
  return (await people([id])).get(id) ?? null;
}

// ---- Where a signed-in person belongs ---------------------------------------------------------

export type TeamContext = {
  /** "owner": their own account (and Cloudflare, if connected). "member": recording into an admin's. */
  role: "owner" | "member";
  /** The admin's account id: their own id for owners. */
  ownerId: string;
  /** The admin, for showing "Harsh's team" to members. */
  owner: Person;
  /** The Cloudflare everyone in the team records into, if connected. */
  workspace: Workspace | null;
  /** Whether this person's own extension is connected (to this team). */
  extensionConnected: boolean;
};

type MemberRow = { user_id: string; owner_id: string; member_key: string | null; extension_connected_at: Date | null; joined_at: Date };

/** Every team someone is a member of (not counting their own), oldest first. */
export async function getMemberships(userId: string): Promise<MemberRow[]> {
  await ensureSchema();
  const { rows } = await pool.query<MemberRow>("select * from team_member where user_id = $1 order by joined_at", [userId]);
  return rows;
}

/** Their membership of one team, or null. */
export async function getMembership(userId: string, ownerId: string): Promise<MemberRow | null> {
  await ensureSchema();
  const { rows } = await pool.query<MemberRow>("select * from team_member where user_id = $1 and owner_id = $2", [userId, ownerId]);
  return rows[0] ?? null;
}

/** The cookie that remembers which team the dashboard shows. */
export const CURRENT_TEAM_COOKIE = "st_team";

async function chosenTeam(): Promise<string | null> {
  try {
    return (await cookies()).get(CURRENT_TEAM_COOKIE)?.value ?? null;
  } catch {
    return null; // outside a request
  }
}

/** A team someone can switch to: their own ("Personal") or one they're a member of. */
export type TeamChoice = { ownerId: string; label: string; personal: boolean };

/**
 * The teams in the switcher. Their own ("Personal") appears when they have their own
 * Cloudflare or bought Showthrough themselves (so they can connect one), or have no team.
 */
export async function teamChoices(user: { id: string; name: string; email: string }, ownPaid: boolean): Promise<TeamChoice[]> {
  const [own, memberships, ownMembers] = await Promise.all([getWorkspace(user.id), getMemberships(user.id), listMembers(user.id)]);
  const admins = await people(memberships.map((m) => m.owner_id));
  const teams = memberships.flatMap((m) => {
    const admin = admins.get(m.owner_id);
    return admin ? [{ ownerId: m.owner_id, label: `${firstName(admin)}'s team`, personal: false }] : [];
  });
  // Their own: "Your team" once they've invited people, otherwise "Personal".
  const personal = { ownerId: user.id, label: ownMembers.length ? "Your team" : "Personal", personal: true };
  return own || ownPaid || !teams.length ? [personal, ...teams] : teams;
}

/**
 * Where the dashboard is: the team chosen in the switcher if they still belong to it;
 * otherwise their own Cloudflare if they have one, else their oldest team.
 */
export async function getTeamContext(user: { id: string; name: string; email: string; image?: string | null }): Promise<TeamContext> {
  const [chosen, memberships, ownWorkspace] = await Promise.all([chosenTeam(), getMemberships(user.id), getWorkspace(user.id)]);
  let membership = chosen && chosen !== user.id ? memberships.find((m) => m.owner_id === chosen) ?? null : null;
  if (!membership && chosen !== user.id && !ownWorkspace) membership = memberships[0] ?? null;
  if (membership) {
    const [workspace, owner] = await Promise.all([getWorkspace(membership.owner_id), getPerson(membership.owner_id)]);
    return {
      role: "member",
      ownerId: membership.owner_id,
      owner: owner ?? { id: membership.owner_id, name: "Your admin", email: "", image: null },
      workspace,
      extensionConnected: Boolean(membership.extension_connected_at),
    };
  }
  return {
    role: "owner",
    ownerId: user.id,
    owner: { id: user.id, name: user.name, email: user.email, image: user.image ?? null },
    workspace: ownWorkspace,
    extensionConnected: Boolean(ownWorkspace?.extension_connected_at),
  };
}

/** First name for "Ask Harsh to update". */
export const firstName = (person: Person) => person.name.trim().split(/\s+/)[0] || person.email.split("@")[0] || "your admin";

// ---- The team ---------------------------------------------------------------------------------

export type Member = Person & { joinedAt: Date; extensionConnected: boolean };

export async function listMembers(ownerId: string): Promise<Member[]> {
  await ensureSchema();
  const { rows } = await pool.query<MemberRow>("select * from team_member where owner_id = $1 order by joined_at", [ownerId]);
  const found = await people(rows.map((r) => r.user_id));
  return rows.flatMap((r) => {
    const p = found.get(r.user_id);
    return p ? [{ ...p, joinedAt: r.joined_at, extensionConnected: Boolean(r.extension_connected_at) }] : [];
  });
}

/** Everyone in a team, admin first: for "who made this" and the sharing picker. */
export async function teamPeople(ownerId: string): Promise<Person[]> {
  const [owner, members] = await Promise.all([getPerson(ownerId), listMembers(ownerId)]);
  return [...(owner ? [owner] : []), ...members.map(({ id, name, email, image }) => ({ id, name, email, image }))];
}

export async function markMemberExtensionConnected(userId: string, ownerId: string) {
  await ensureSchema();
  await pool.query("update team_member set extension_connected_at = now() where user_id = $1 and owner_id = $2", [userId, ownerId]);
}

// ---- Invites ------------------------------------------------------------------------------------

export type Invite = { token: string; email: string; createdAt: Date };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validEmail = (email: string) => EMAIL.test(email) && email.length <= 200;

export async function listInvites(ownerId: string): Promise<Invite[]> {
  await ensureSchema();
  const { rows } = await pool.query<{ token: string; email: string; created_at: Date }>(
    "select token, email, created_at from team_invite where owner_id = $1 and accepted_at is null order by created_at desc",
    [ownerId],
  );
  return rows.map((r) => ({ token: r.token, email: r.email, createdAt: r.created_at }));
}

/** An invite link for this email. Inviting the same email again returns the same link. */
export async function createInvite(ownerId: string, rawEmail: string): Promise<Invite | "bad_email" | "already_member" | "self"> {
  await ensureSchema();
  const email = rawEmail.trim().toLowerCase();
  if (!validEmail(email)) return "bad_email";
  const { rows: me } = await pool.query<{ email: string }>('select email from "user" where id = $1', [ownerId]);
  if (me[0]?.email.toLowerCase() === email) return "self";
  const { rows: member } = await pool.query(
    'select 1 from team_member m join "user" u on u.id = m.user_id where m.owner_id = $1 and lower(u.email) = $2',
    [ownerId, email],
  );
  if (member.length) return "already_member";
  const { rows: existing } = await pool.query<{ token: string; created_at: Date }>(
    "select token, created_at from team_invite where owner_id = $1 and lower(email) = $2 and accepted_at is null limit 1",
    [ownerId, email],
  );
  if (existing[0]) return { token: existing[0].token, email, createdAt: existing[0].created_at };
  const token = randomBytes(18).toString("base64url");
  await pool.query("insert into team_invite (token, owner_id, email) values ($1, $2, $3)", [token, ownerId, email]);
  return { token, email, createdAt: new Date() };
}

export async function revokeInvite(ownerId: string, token: string) {
  await ensureSchema();
  await pool.query("delete from team_invite where owner_id = $1 and token = $2 and accepted_at is null", [ownerId, token]);
}

export type InviteDetails = { token: string; email: string; owner: Person; accepted: boolean };

export async function getInvite(token: string): Promise<InviteDetails | null> {
  await ensureSchema();
  if (!/^[A-Za-z0-9_-]{10,64}$/.test(token)) return null;
  const { rows } = await pool.query<{ token: string; email: string; owner_id: string; accepted_at: Date | null }>(
    "select token, email, owner_id, accepted_at from team_invite where token = $1",
    [token],
  );
  const row = rows[0];
  if (!row) return null;
  const owner = await getPerson(row.owner_id);
  if (!owner) return null;
  return { token: row.token, email: row.email, owner, accepted: Boolean(row.accepted_at) };
}

export type AcceptResult = "ok" | "not_found" | "used" | "wrong_email" | "own_invite" | "admin_needs_update" | "admin_not_connected";

/**
 * Joins the team behind an invite. The invite must be for this account's email. Being in
 * other teams, or having their own Cloudflare, is fine: the dashboard switches between them.
 */
export async function acceptInvite(token: string, user: { id: string; email: string }): Promise<AcceptResult> {
  const invite = await getInvite(token);
  if (!invite) return "not_found";
  if (await getMembership(user.id, invite.owner.id)) return "ok"; // already in this team
  if (invite.accepted) return "used";
  if (invite.owner.id === user.id) return "own_invite";
  if (invite.email.toLowerCase() !== user.email.toLowerCase()) return "wrong_email";
  const workspace = await getWorkspace(invite.owner.id);
  if (!workspace) return "admin_not_connected";
  if (!teamsEnabled(workspace)) return "admin_needs_update";

  const client = await pool.connect();
  try {
    await client.query("begin");
    const claimed = await client.query(
      "update team_invite set accepted_at = now(), accepted_by = $2 where token = $1 and accepted_at is null",
      [token, user.id],
    );
    if (!claimed.rowCount) {
      await client.query("rollback");
      return "used";
    }
    await client.query("insert into team_member (user_id, owner_id) values ($1, $2) on conflict (user_id, owner_id) do nothing", [user.id, invite.owner.id]);
    await client.query("commit");
    return "ok";
  } catch (err) {
    await client.query("rollback").catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}

// ---- Member keys (in the admin's video backend) -----------------------------------------------

async function workerMembers(ws: Workspace, init: { method: "POST" | "DELETE"; path?: string; body?: unknown }) {
  const res = await fetch(`${ws.worker_url}/api/members${init.path ?? ""}`, {
    method: init.method,
    headers: { authorization: `Bearer ${ws.upload_key}`, "content-type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`The video backend answered ${res.status}`);
}

/**
 * The member's own extension key, made on first use and registered (as a hash) with the
 * admin's video backend. The same key is reused, so the extension can be connected on
 * several computers.
 */
export async function memberKey(ws: Workspace, userId: string): Promise<string> {
  await ensureSchema();
  const membership = await getMembership(userId, ws.owner_id);
  if (!membership) throw new Error("Not a member of this team");
  const key = membership.member_key ?? randomBytes(32).toString("base64url");
  // Registering again is harmless, and repairs a backend that lost it.
  await workerMembers(ws, { method: "POST", body: { userId, keyHash: createHash("sha256").update(key).digest("hex") } });
  if (!membership.member_key) await pool.query("update team_member set member_key = $3 where user_id = $1 and owner_id = $2", [userId, ws.owner_id, key]);
  return key;
}

/** Takes someone out of a team and switches off their extension key. Their videos stay. */
export async function removeMember(ownerId: string, memberId: string): Promise<boolean> {
  await ensureSchema();
  const { rowCount } = await pool.query("delete from team_member where owner_id = $1 and user_id = $2", [ownerId, memberId]);
  if (!rowCount) return false;
  const ws = await getWorkspace(ownerId);
  if (ws && teamsEnabled(ws)) {
    await workerMembers(ws, { method: "DELETE", path: `/${encodeURIComponent(memberId)}` }).catch((err) =>
      console.error("Could not revoke the member's key", err),
    );
  }
  return true;
}
