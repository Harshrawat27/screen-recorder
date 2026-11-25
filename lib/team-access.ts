// Who can see and change which recordings in a team. Plain functions (no server code), so the
// dashboard's server pages and its client components share the same rules.
//
//   The admin (the account owner, who connected Cloudflare) sees and manages everything.
//   Members see their own recordings, plus teammates' recordings shared with the team, plus
//   any shared with them by name. They manage only their own.
//   Share links are separate: anyone with a video's link can watch it.

export type Visibility = "team" | "chosen";

export type TeamVideo = {
  recordedBy?: string | null;
  visibility?: Visibility;
  sharedWith?: string[];
};

/** Who made a recording. Recordings without a recorder were made by the admin. */
export const recorderOf = (video: TeamVideo, ownerId: string) => video.recordedBy || ownerId;

export function canSee(video: TeamVideo, viewerId: string, ownerId: string) {
  if (viewerId === ownerId || recorderOf(video, ownerId) === viewerId) return true;
  if (video.visibility !== "chosen") return true;
  return (video.sharedWith ?? []).includes(viewerId);
}

export function canManage(video: TeamVideo, viewerId: string, ownerId: string) {
  return viewerId === ownerId || recorderOf(video, ownerId) === viewerId;
}
