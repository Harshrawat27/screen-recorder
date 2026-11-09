import { WORKER_VERSION } from "@/lib/cloudflare";
import type { Access } from "@/lib/billing";
import type { Workspace } from "@/lib/db";

// What each version of the user's Worker adds. Shown in the "New version available" box.
export const WORKER_RELEASES: Record<number, string> = {
  2: "Comments, reactions and view counts on your videos.",
  3: "Instant search, a faster library and a Usage page. Deleting a video also removes its comments and views.",
};

/** Whether this account's purchase includes a given Worker version. */
export function includesVersion(access: Access, version = WORKER_VERSION) {
  if (access.free) return true;
  if (!access.purchase) return false;
  return access.purchase.updates_until === null || access.purchase.updates_until >= version;
}

export type UpdateInfo = { version: number; notes: string; included: boolean } | null;

/** A newer Worker than the one this workspace runs, if there is one. */
export function availableUpdate(workspace: Workspace | null, access: Access): UpdateInfo {
  if (!workspace || !access.paid || workspace.worker_version >= WORKER_VERSION) return null;
  return {
    version: WORKER_VERSION,
    notes: WORKER_RELEASES[WORKER_VERSION] ?? "Improvements to your video backend.",
    included: includesVersion(access),
  };
}
