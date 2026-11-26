import { randomUUID } from "node:crypto";
import { pool } from "@/lib/db";

// Sign-ups from /service-as-a-software: people interested in the $20/month plan for every tool we
// build. A table of its own, not linked to accounts or purchases. Read them in the Neon console:
//   select * from saas_interest order by created_at desc;

const SCHEMA = `
create table if not exists saas_interest (
  id text primary key,
  name text not null,
  email text not null,
  company text,
  team_size text,
  replace_tools jsonb not null default '[]'::jsonb,
  note text,
  source text,
  created_at timestamptz not null default now()
);
create index if not exists saas_interest_created on saas_interest (created_at desc);
`;

const globalForInterest = globalThis as unknown as { interestReady?: Promise<void> };

function ensureSchema() {
  globalForInterest.interestReady ??= pool.query(SCHEMA).then(() => undefined);
  return globalForInterest.interestReady.catch((err) => {
    globalForInterest.interestReady = undefined;
    throw err;
  });
}

export const TEAM_SIZES = ["Just me", "2–5", "6–15", "16–50", "51+"] as const;

export type Interest = {
  name: string;
  email: string;
  company: string | null;
  teamSize: string | null;
  replaceTools: string[];
  note: string | null;
  source: string | null;
};

export async function saveInterest(entry: Interest) {
  await ensureSchema();
  await pool.query(
    `insert into saas_interest (id, name, email, company, team_size, replace_tools, note, source)
     values ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)`,
    [randomUUID(), entry.name, entry.email, entry.company, entry.teamSize, JSON.stringify(entry.replaceTools), entry.note, entry.source],
  );
}
