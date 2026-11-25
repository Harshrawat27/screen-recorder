import type { LibraryVideo } from "@/components/library-ui";
import type { VideoSummary } from "@/lib/cloudflare";
import { MEDIA_URL } from "@/lib/config";
import type { Workspace } from "@/lib/db";
import { canManage, canSee, recorderOf } from "@/lib/team-access";

// Turns what the Worker returns into the library's cards. Shared by the library and folder pages.

function duration(sec: number | null) {
  if (!sec) return null;
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function when(ms: number | null) {
  if (!ms) return "";
  const minutes = Math.round((Date.now() - ms) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/**
 * Library cards for a viewer. `viewerId` decides what they may change (their own recordings, or
 * everything for the admin); leave it out for the admin's own pages.
 */
export function toLibraryVideos(videos: VideoSummary[], ws: Workspace, viewerId: string = ws.owner_id): LibraryVideo[] {
  return videos.map((video) => ({
    id: video.id,
    title: video.title || "Untitled recording",
    href: `/v/${ws.space}/${video.id}`,
    thumb: `${MEDIA_URL}/${ws.space}/videos/${video.id}/thumb-small.jpg`,
    src: `${MEDIA_URL}/${ws.space}/videos/${video.id}/master.m3u8`,
    length: duration(video.durationSec),
    when: when(video.createdAt),
    ready: video.ready,
    // From the Worker's database (version 2+); 0 on older Workers.
    views: video.views ?? 0,
    comments: video.comments ?? 0,
    reactions: video.reactions ?? 0,
    folderId: video.folderId ?? null,
    recordedBy: recorderOf(video, ws.owner_id),
    canManage: canManage(video, viewerId, ws.owner_id),
    visibility: video.visibility ?? "team",
    sharedWith: video.sharedWith ?? [],
  }));
}

/** One person's recordings that a viewer is allowed to find in the dashboard. */
export function videosBy(videos: VideoSummary[], ws: Workspace, personId: string, viewerId: string): VideoSummary[] {
  return videos.filter((v) => recorderOf(v, ws.owner_id) === personId && canSee(v, viewerId, ws.owner_id));
}

/** Every recording a viewer is allowed to find (search, folders). */
export function visibleTo(videos: VideoSummary[], ws: Workspace, viewerId: string): VideoSummary[] {
  return videos.filter((v) => canSee(v, viewerId, ws.owner_id));
}
