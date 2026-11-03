import { Pool } from "pg";

// One pool per server instance (and one across hot reloads in development).
const globalForDb = globalThis as unknown as { pgPool?: Pool; schemaReady?: Promise<void> };

export const pool = globalForDb.pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
if (process.env.NODE_ENV !== "production") globalForDb.pgPool = pool;

// Our own tables (Better Auth manages user/session/account/verification separately).
// Created on first use so there's no extra migration step.
const SCHEMA = `
create table if not exists workspace (
  id text primary key,
  owner_id text not null unique references "user"(id) on delete cascade,
  cf_account_id text not null,
  cf_account_name text,
  space text not null,
  worker_url text not null,
  bucket text not null,
  upload_key text not null,
  worker_version integer not null default 1,
  extension_connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
`;

export function ensureSchema() {
  globalForDb.schemaReady ??= pool.query(SCHEMA).then(() => undefined);
  return globalForDb.schemaReady.catch((err) => {
    globalForDb.schemaReady = undefined;
    throw err;
  });
}

export type Workspace = {
  id: string;
  owner_id: string;
  cf_account_id: string;
  cf_account_name: string | null;
  space: string;
  worker_url: string;
  bucket: string;
  upload_key: string;
  worker_version: number;
  extension_connected_at: Date | null;
  created_at: Date;
};

export async function getWorkspace(userId: string): Promise<Workspace | null> {
  await ensureSchema();
  const { rows } = await pool.query<Workspace>("select * from workspace where owner_id = $1", [userId]);
  return rows[0] ?? null;
}

export async function saveWorkspace(w: Omit<Workspace, "id" | "created_at" | "extension_connected_at">) {
  await ensureSchema();
  await pool.query(
    `insert into workspace (id, owner_id, cf_account_id, cf_account_name, space, worker_url, bucket, upload_key, worker_version)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     on conflict (owner_id) do update set
       cf_account_id = excluded.cf_account_id, cf_account_name = excluded.cf_account_name, space = excluded.space,
       worker_url = excluded.worker_url, bucket = excluded.bucket, upload_key = excluded.upload_key,
       worker_version = excluded.worker_version, extension_connected_at = null, updated_at = now()`,
    [crypto.randomUUID(), w.owner_id, w.cf_account_id, w.cf_account_name, w.space, w.worker_url, w.bucket, w.upload_key, w.worker_version],
  );
}

export async function markExtensionConnected(userId: string) {
  await ensureSchema();
  await pool.query("update workspace set extension_connected_at = now(), updated_at = now() where owner_id = $1", [userId]);
}
