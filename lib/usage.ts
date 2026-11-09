import type { Workspace } from "@/lib/db";

// Usage of the user's own Cloudflare, as counted by their Worker (version 3+), compared with
// Cloudflare's free plan. Limits and prices from developers.cloudflare.com, November 2026.

export const FREE = {
  storageBytes: 10 * 1e9, // R2: 10 GB-month
  classAPerMonth: 1_000_000, // R2 writes and lists
  classBPerMonth: 10_000_000, // R2 reads
  requestsPerDay: 100_000, // Workers
  databaseBytes: 5 * 1e9, // D1
};
export const PRICE = { storagePerGbMonth: 0.015, classAPerMillion: 4.5, classBPerMillion: 0.36 };

export type Usage = {
  storage: {
    bytes: number;
    objects: number;
    recordings: number;
    measuredAt: number;
    largest: { id: string; title: string | null; createdAt: number | null; bytes: number }[];
  };
  today: { day: string; requests: number; classA: number; classB: number };
  month: { month: string; requests: number; classA: number; classB: number; days: { day: string; requests: number; class_a: number; class_b: number }[] };
  database: { bytes: number | null };
  countingSince: string;
};

export async function getUsage(ws: Workspace, fresh = false): Promise<Usage | null> {
  try {
    const res = await fetch(`${ws.worker_url}/api/usage${fresh ? "?fresh=1" : ""}`, {
      headers: { authorization: `Bearer ${ws.upload_key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    return res.ok ? ((await res.json()) as Usage) : null;
  } catch {
    return null;
  }
}
