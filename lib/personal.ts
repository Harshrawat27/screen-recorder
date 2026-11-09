import { MEDIA_URL } from "@/lib/config";
import type { Workspace } from "@/lib/db";

// Recent and Watch later. Each person's lists are kept in their own workspace's D1 (Worker
// version 5+), keyed by their account, so team members each have their own. The videos in
// them can come from any workspace, so they're stored as space + id and their details are
// read from each video's public meta.json when the page is shown.

export type PersonalKind = "recent" | "watch_later";
export type PersonalItem = { space: string; videoId: string; at: number };

export const personalEnabled = (ws: Workspace | null): ws is Workspace => Boolean(ws && ws.worker_version >= 5);

async function call(ws: Workspace, init: { method: string; query?: string; body?: unknown }) {
  return fetch(`${ws.worker_url}/api/personal${init.query ?? ""}`, {
    method: init.method,
    headers: { authorization: `Bearer ${ws.upload_key}`, "content-type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });
}

export async function getPersonal(ws: Workspace, userId: string, kind: PersonalKind): Promise<PersonalItem[]> {
  try {
    const res = await call(ws, { method: "GET", query: `?user=${encodeURIComponent(userId)}&kind=${kind}` });
    if (!res.ok) return [];
    return ((await res.json()) as { items: PersonalItem[] }).items;
  } catch {
    return [];
  }
}

export async function addPersonal(ws: Workspace, userId: string, kind: PersonalKind, space: string, videoId: string) {
  const res = await call(ws, { method: "POST", body: { userId, kind, space, videoId } });
  if (!res.ok) throw new Error(`Could not save (${res.status})`);
}

export async function removePersonal(ws: Workspace, userId: string, kind: PersonalKind, space: string, videoId: string) {
  const res = await call(ws, { method: "DELETE", body: { userId, kind, space, videoId } });
  if (!res.ok) throw new Error(`Could not remove (${res.status})`);
}

export type SavedVideo = {
  space: string;
  id: string;
  title: string;
  href: string;
  thumb: string;
  length: string | null;
  at: number;
};

function duration(sec: unknown) {
  if (typeof sec !== "number" || !sec) return null;
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Details for each item from its meta.json. Videos that were deleted are left out. */
export async function resolveVideos(items: PersonalItem[]): Promise<SavedVideo[]> {
  const found = await Promise.all(
    items.map(async (item) => {
      const base = `${MEDIA_URL}/${item.space}/videos/${item.videoId}`;
      try {
        const res = await fetch(`${base}/meta.json`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) });
        if (!res.ok) return null;
        const meta = (await res.json()) as { title?: string; durationSec?: number };
        return {
          space: item.space,
          id: item.videoId,
          title: meta.title || "Untitled recording",
          href: `/v/${item.space}/${item.videoId}`,
          thumb: `${base}/thumb-small.jpg`,
          length: duration(meta.durationSec),
          at: item.at,
        };
      } catch {
        return null;
      }
    }),
  );
  return found.filter((v): v is SavedVideo => v !== null);
}
