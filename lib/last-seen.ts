import { pool } from "@/lib/db";

// When each person last opened the dashboard, for the local admin panel's "opened today".
// One row per person in a table of its own. Written at most once an hour per person, so a
// busy dashboard doesn't write on every page.
//   select * from user_last_seen order by last_seen_at desc;

const SCHEMA = `
create table if not exists user_last_seen (
  user_id text primary key,
  last_seen_at timestamptz not null default now()
);
`;

const globalForSeen = globalThis as unknown as { lastSeenReady?: Promise<void> };

function ensureSchema() {
  globalForSeen.lastSeenReady ??= pool.query(SCHEMA).then(() => undefined);
  return globalForSeen.lastSeenReady.catch((err) => {
    globalForSeen.lastSeenReady = undefined;
    throw err;
  });
}

export async function markSeen(userId: string) {
  await ensureSchema();
  await pool.query(
    `insert into user_last_seen (user_id, last_seen_at) values ($1, now())
     on conflict (user_id) do update set last_seen_at = now()
     where user_last_seen.last_seen_at < now() - interval '1 hour'`,
    [userId],
  );
}
