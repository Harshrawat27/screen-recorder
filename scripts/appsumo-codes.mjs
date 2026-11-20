// AppSumo codes, run from the web folder on your own computer (it reads DATABASE_URL from .env.local):
//
//   node scripts/appsumo-codes.mjs generate 1000 launch
//       Creates 1000 new codes in the database (batch "launch") and writes them to
//       ../appsumo/appsumo-codes-launch.csv, ready to upload to AppSumo.
//
//   node scripts/appsumo-codes.mjs deactivate ST-ABCD-EFGH-JKLM [more codes...]
//       For refunds: switches the code off and removes the access it gave.
//
// The CSV is a list of valid licenses: keep it out of git and don't share it.

import { randomInt } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const webDir = join(dirname(fileURLToPath(import.meta.url)), "..");

for (const line of readFileSync(join(webDir, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing from .env.local");

// Same as APPSUMO_SCHEMA in lib/appsumo.ts.
const SCHEMA = `
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

// No 0/O, 1/I/L, so codes are easy to read and type.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const group = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
const newCode = () => `ST-${group()}-${group()}-${group()}`;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 });

async function generate(count, batch) {
  if (!Number.isInteger(count) || count < 1 || count > 10000) throw new Error("Count must be between 1 and 10000");
  if (!/^[a-z0-9-]{1,40}$/.test(batch)) throw new Error("Batch name: lowercase letters, numbers and dashes only");
  const codes = new Set();
  while (codes.size < count) codes.add(newCode());

  await pool.query(SCHEMA);
  const { rows } = await pool.query(
    "insert into appsumo_code (code, batch) select unnest($1::text[]), $2 on conflict (code) do nothing returning code",
    [[...codes], batch],
  );
  const outDir = join(webDir, "..", "appsumo");
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `appsumo-codes-${batch}.csv`);
  // AppSumo's upload form asks for one column and no header row: just the codes, one per line.
  writeFileSync(file, rows.map((r) => r.code).join("\n") + "\n");
  console.log(`Saved ${rows.length} codes to the database and to ${file}`);
}

async function deactivate(list) {
  if (!list.length) throw new Error("Give at least one code");
  const codes = list.map((c) => c.trim().toUpperCase().replace(/\s+/g, ""));
  await pool.query(SCHEMA);
  const { rows } = await pool.query("update appsumo_code set status = 'refunded' where code = any($1) returning code", [codes]);
  await pool.query("update purchase set status = 'refunded', updated_at = now() where payment_id = any($1)", [codes.map((c) => `appsumo_${c}`)]);
  console.log(`Deactivated ${rows.length} of ${codes.length} codes`);
}

const [command, ...args] = process.argv.slice(2);
try {
  if (command === "generate") await generate(Number(args[0] ?? 1000), args[1] ?? "launch");
  else if (command === "deactivate") await deactivate(args);
  else console.log("Usage: node scripts/appsumo-codes.mjs generate [count] [batch] | deactivate CODE...");
} finally {
  await pool.end();
}
