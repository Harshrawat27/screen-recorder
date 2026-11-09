import type { Workspace } from "@/lib/db";

// Usage of the user's own Cloudflare, as counted by their Worker (version 4+), compared with
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
    /** Older recordings whose size hasn't been measured yet. */
    pending: number;
    recordings: number;
    measuredAt: number;
    largest: { id: string; title: string | null; createdAt: number | null; bytes: number }[];
  };
  today: { day: string; requests: number; classA: number; classB: number };
  month: { month: string; requests: number; classA: number; classB: number; days: { day: string; requests: number; class_a: number; class_b: number }[] };
  database: { bytes: number | null };
  countingSince: string;
};

/** The usage, or what went wrong (shown on the page so problems can be fixed, not guessed). */
export async function getUsage(ws: Workspace): Promise<{ usage: Usage } | { error: string }> {
  try {
    const res = await fetch(`${ws.worker_url}/api/usage`, {
      headers: { authorization: `Bearer ${ws.upload_key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      const body = (await res.text().catch(() => "")).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
      return { error: `Error ${res.status}${body ? `: ${body}` : ""}` };
    }
    return { usage: (await res.json()) as Usage };
  } catch (err) {
    return { error: err instanceof Error && err.name === "TimeoutError" ? "It took longer than 15 seconds to answer." : "It couldn’t be reached." };
  }
}
