import type { Workspace } from "@/lib/db";

// Profile photos. Each person's photo is kept in their workspace's own Cloudflare (Worker
// version 6+) as profile/<userId>.webp, so the extension can show it in place of the camera.

export type AvatarInfo = { version: number; url: string } | null;

export const AVATAR_MAX_BYTES = 400 * 1024;
export const avatarEnabled = (ws: Workspace | null): ws is Workspace => Boolean(ws && ws.worker_version >= 6);

const headers = (ws: Workspace) => ({ authorization: `Bearer ${ws.upload_key}` });

export async function getAvatar(ws: Workspace, userId: string): Promise<AvatarInfo> {
  try {
    const res = await fetch(`${ws.worker_url}/api/avatar?user=${encodeURIComponent(userId)}`, {
      headers: headers(ws),
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    return ((await res.json()) as { avatar: AvatarInfo }).avatar;
  } catch {
    return null;
  }
}

export async function saveAvatar(ws: Workspace, userId: string, webp: ArrayBuffer): Promise<AvatarInfo> {
  const res = await fetch(`${ws.worker_url}/api/avatar/${encodeURIComponent(userId)}`, {
    method: "PUT",
    headers: { ...headers(ws), "content-type": "image/webp" },
    body: webp,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Could not save the photo (${res.status})`);
  return ((await res.json()) as { avatar: AvatarInfo }).avatar;
}

export async function deleteAvatar(ws: Workspace, userId: string) {
  const res = await fetch(`${ws.worker_url}/api/avatar/${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: headers(ws),
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`Could not remove the photo (${res.status})`);
}
