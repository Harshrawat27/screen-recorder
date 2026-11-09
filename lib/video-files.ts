import type { Workspace } from "@/lib/db";

// Renaming and deleting recordings. Version 3 Workers do both themselves (and keep D1 in
// step). Older ones are handled through the upload endpoints every Worker has (PUT and
// DELETE a file with the upload key), so they work without a Worker update.

export const VIDEO_ID = /^[a-z0-9]{8,64}$/;
const FILE_NAME = /^[A-Za-z0-9._-]{1,100}$/;
export const TITLE_MAX = 120;

const fileUrl = (ws: Workspace, id: string, name: string) => `${ws.worker_url}/videos/${id}/${name}`;
const uploadUrl = (ws: Workspace, id: string, name: string) => `${ws.worker_url}/api/upload/videos/${id}/${name}`;
const auth = (ws: Workspace) => ({ authorization: `Bearer ${ws.upload_key}` });

async function readText(ws: Workspace, id: string, name: string): Promise<string | null> {
  const res = await fetch(fileUrl(ws, id, name), { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Could not read ${name} (${res.status})`);
  return res.text();
}

async function workerCall(ws: Workspace, id: string, method: "PATCH" | "DELETE", body?: unknown) {
  return fetch(`${ws.worker_url}/api/videos/${id}`, {
    method,
    headers: { ...auth(ws), "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
}

/** Changes the title saved in the video's meta.json. Returns false if the video doesn't exist. */
export async function renameVideo(ws: Workspace, id: string, title: string): Promise<boolean> {
  if (ws.worker_version >= 3) {
    const res = await workerCall(ws, id, "PATCH", { title });
    if (res.status === 404) return false;
    if (!res.ok) throw new Error(`Could not save the title (${res.status})`);
    return true;
  }
  const text = await readText(ws, id, "meta.json");
  if (text === null) return false;
  const meta = { ...(JSON.parse(text) as Record<string, unknown>), title };
  const res = await fetch(uploadUrl(ws, id, "meta.json"), {
    method: "PUT",
    headers: { ...auth(ws), "content-type": "application/json", "cache-control": "no-cache" },
    body: JSON.stringify(meta),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Could not save the title (${res.status})`);
  return true;
}

/** File names a playlist points to: segments, and its init file (EXT-X-MAP). */
function playlistFiles(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) {
      const uri = /URI="([^"]+)"/.exec(line)?.[1];
      if (uri) out.push(uri);
    } else out.push(line);
  }
  return out.filter((name) => FILE_NAME.test(name));
}

/** Deletes every file of a recording from the user's bucket. */
export async function deleteVideo(ws: Workspace, id: string): Promise<void> {
  if (ws.worker_version >= 3) {
    const res = await workerCall(ws, id, "DELETE");
    if (!res.ok) throw new Error(`Could not delete the video (${res.status})`);
    return;
  }
  // Work out the file list from the playlists before removing anything.
  const master = await readText(ws, id, "master.m3u8");
  const playlists = master ? playlistFiles(master).filter((n) => n.endsWith(".m3u8")) : [];
  const media = new Set<string>(["meta.json", "thumb.jpg", "thumb-small.jpg"]);
  for (const playlist of playlists) {
    const text = await readText(ws, id, playlist);
    if (text) for (const name of playlistFiles(text)) media.add(name);
  }

  const remove = async (name: string) => {
    const res = await fetch(uploadUrl(ws, id, name), { method: "DELETE", headers: auth(ws), signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`Could not delete ${name} (${res.status})`);
  };
  const removeAll = async (names: string[]) => {
    for (let i = 0; i < names.length; i += 25) await Promise.all(names.slice(i, i + 25).map(remove));
  };
  // Segments first and the playlists last, so a failed attempt can simply be run again.
  await removeAll([...media]);
  await removeAll(playlists);
  await remove("master.m3u8");
}
