"use client";

import { useState } from "react";
import { VideoThumb } from "@/components/video-thumb";
import type { SavedVideo } from "@/lib/personal";

// The Recent and Watch later grids. Videos can be anyone's, so cards only link to the share
// page; Watch later cards can also be removed.

function ago(ms: number) {
  const minutes = Math.round((Date.now() - ms) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function SavedVideos({ videos, kind }: { videos: SavedVideo[]; kind: "recent" | "watch_later" }) {
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [failed, setFailed] = useState<string | null>(null);
  const shown = videos.filter((v) => !removed.has(`${v.space}/${v.id}`));

  async function remove(video: SavedVideo) {
    const key = `${video.space}/${video.id}`;
    setRemoved((prev) => new Set(prev).add(key));
    setFailed(null);
    const res = await fetch("/api/watch-later", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ space: video.space, videoId: video.id }),
    }).catch(() => null);
    if (!res?.ok) {
      setRemoved((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      setFailed("Couldn’t remove that video. Please try again.");
    }
  }

  if (!shown.length) {
    return (
      <p className="mt-10 rounded-[18px] border border-dashed border-line-strong px-6 py-16 text-center text-muted">
        {kind === "recent" ? "Nothing watched yet." : "Nothing saved right now."}
      </p>
    );
  }

  return (
    <>
      {failed && (
        <p role="alert" className="mt-6 text-sm text-danger">
          {failed}
        </p>
      )}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {shown.map((video) => (
          <article key={`${video.space}/${video.id}`} className="group relative rounded-[18px] border border-line bg-surface p-2.5 transition-colors hover:border-line-strong">
            <a href={video.href} target="_blank" className="block">
              <span className="relative block aspect-video overflow-hidden rounded-[12px] bg-[#1c1c1e]">
                <VideoThumb src={video.thumb} />
                {video.length && (
                  <span className="tabular absolute bottom-2 left-2 rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-semibold text-white">
                    {video.length}
                  </span>
                )}
              </span>
              <span className="block px-1.5 pb-1.5 pt-3">
                <span className="block truncate font-semibold">{video.title}</span>
                <span className="mt-1 block text-sm text-muted">
                  {kind === "recent" ? "Watched" : "Saved"} {ago(video.at)}
                </span>
              </span>
            </a>
            {kind === "watch_later" && (
              <button
                type="button"
                onClick={() => remove(video)}
                aria-label={`Remove “${video.title}” from Watch later`}
                title="Remove from Watch later"
                className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 focus-visible:opacity-100 group-hover:opacity-100"
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
