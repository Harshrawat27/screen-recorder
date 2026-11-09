import { listVideos } from "@/lib/cloudflare";
import { MEDIA_URL } from "@/lib/config";
import type { Workspace } from "@/lib/db";

// Search for the dashboard's command palette. The answer is grouped by kind so more kinds
// (comments, team members) can be added later without changing the palette.
//
// From Worker version 3, titles are in the user's D1 with a full-text index and the Worker
// runs the query. Older Workers keep titles only in each recording's meta.json, so the list is
// read through the Worker and filtered here, kept for a few seconds per workspace so a burst
// of keystrokes reads it once.

export type SearchVideo = {
  id: string;
  title: string;
  href: string;
  thumb: string;
  createdAt: number | null;
  durationSec: number | null;
};
export type SearchResults = { videos: SearchVideo[] };

const CACHE_MS = 15_000;
const cache = new Map<string, { at: number; videos: SearchVideo[] }>();

async function allVideos(ws: Workspace): Promise<SearchVideo[]> {
  const hit = cache.get(ws.id);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.videos;
  const { videos, reachable } = await listVideos(ws.worker_url, ws.upload_key);
  if (!reachable) throw new Error("Video backend unreachable");
  const out = videos.map((v) => ({
    id: v.id,
    title: v.title || "Untitled recording",
    href: `/v/${ws.space}/${v.id}`,
    thumb: `${MEDIA_URL}/${ws.space}/videos/${v.id}/thumb-small.jpg`,
    createdAt: v.createdAt,
    durationSec: v.durationSec,
  }));
  cache.set(ws.id, { at: Date.now(), videos: out });
  return out;
}

/** Forget the cached list, e.g. after a rename or delete. */
export function clearSearchCache(workspaceId: string) {
  cache.delete(workspaceId);
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");

/** Every word of the query must appear. Titles that start with it, or have a word starting with it, rank first. */
function score(title: string, words: string[], phrase: string): number {
  const t = normalize(title);
  if (!words.every((w) => t.includes(w))) return -1;
  if (t.startsWith(phrase)) return 3;
  if (t.includes(` ${phrase}`)) return 2;
  return words.every((w) => t.startsWith(w) || t.includes(` ${w}`)) ? 1 : 0;
}

/** Version 3 Workers search their own D1. */
async function searchInD1(ws: Workspace, query: string, limit: number): Promise<SearchResults> {
  const url = `${ws.worker_url}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${ws.upload_key}` }, cache: "no-store", signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const data = (await res.json()) as { videos: { id: string; title: string | null; createdAt: number | null; durationSec: number | null }[] };
  return {
    videos: data.videos
      .filter((v) => !v.id.startsWith("stcheck"))
      .map((v) => ({
        id: v.id,
        title: v.title || "Untitled recording",
        href: `/v/${ws.space}/${v.id}`,
        thumb: `${MEDIA_URL}/${ws.space}/videos/${v.id}/thumb-small.jpg`,
        createdAt: v.createdAt,
        durationSec: v.durationSec,
      })),
  };
}

export async function search(ws: Workspace, query: string, limit = 8): Promise<SearchResults> {
  if (ws.worker_version >= 3) return searchInD1(ws, query.trim() ? query : "", query.trim() ? limit : Math.min(limit, 5));
  const videos = await allVideos(ws);
  const phrase = normalize(query).replace(/\s+/g, " ").trim();
  if (!phrase) return { videos: videos.slice(0, Math.min(limit, 5)) }; // newest first
  const words = phrase.split(" ");
  const ranked = videos
    .map((v) => ({ v, s: score(v.title, words, phrase) }))
    .filter((r) => r.s >= 0)
    .sort((a, b) => b.s - a.s || (b.v.createdAt ?? 0) - (a.v.createdAt ?? 0));
  return { videos: ranked.slice(0, limit).map((r) => r.v) };
}
