import type { Workspace } from "@/lib/db";

// Folders live in the user's D1 (Worker version 4+). These helpers call their Worker.

export const FOLDER_ID = /^[a-z0-9]{8,64}$/;
export const FOLDER_NAME_MAX = 80;

export type Folder = { id: string; name: string; createdAt: number; updatedAt: number; videos: number };

export const foldersEnabled = (ws: Workspace | null) => Boolean(ws && ws.worker_version >= 4);

async function call<T>(ws: Workspace, path: string, method = "GET", body?: unknown): Promise<{ status: number; data: T | null }> {
  const res = await fetch(`${ws.worker_url}/api/folders${path}`, {
    method,
    headers: { authorization: `Bearer ${ws.upload_key}`, "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  return { status: res.status, data: (await res.json().catch(() => null)) as T | null };
}

/** Every folder, or an empty list when the Worker doesn't have folders yet or can't be reached. */
export async function listFolders(ws: Workspace | null): Promise<Folder[]> {
  if (!ws || !foldersEnabled(ws)) return [];
  try {
    const { data } = await call<{ folders: Folder[] }>(ws, "");
    return data?.folders ?? [];
  } catch {
    return [];
  }
}

export async function createFolder(ws: Workspace, name: string) {
  return call<{ folder: Folder }>(ws, "", "POST", { name });
}

export async function renameFolder(ws: Workspace, id: string, name: string) {
  return call<{ name: string }>(ws, `/${id}`, "PATCH", { name });
}

export async function deleteFolder(ws: Workspace, id: string) {
  return call<{ ok: true }>(ws, `/${id}`, "DELETE");
}
