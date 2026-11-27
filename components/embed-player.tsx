"use client";

import { useCallback, useRef } from "react";
import { Player } from "@/components/player";
import { LogoMark } from "@/components/ui";

// The video on someone else's website. Edge to edge, nothing else around it. Free accounts show a
// small Showthrough tag in the corner (paid ones choose, like "Recorded with Showthrough" on share
// pages). Plays count as views, the same as on the share page.
export function EmbedPlayer({ space, id, src, poster, badge }: { space: string; id: string; src: string; poster: string; badge: boolean }) {
  const counted = useRef(false);
  const onVideo = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video) return;
      video.addEventListener("play", () => {
        if (counted.current) return;
        counted.current = true;
        fetch(`/api/v/${space}/${id}/social`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "view" }),
        }).catch(() => {});
      });
    },
    [space, id],
  );

  return (
    <div className="relative">
      <Player src={src} poster={poster} onVideo={onVideo} bare fill />
      {badge && (
        <a
          href="https://www.showthrough.com/?ref=embed"
          target="_blank"
          rel="noopener"
          className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/55 py-1 pl-1 pr-2.5 text-[12px] font-semibold text-white backdrop-blur transition-colors hover:bg-black/75"
        >
          <LogoMark className="size-5" />
          Showthrough
        </a>
      )}
    </div>
  );
}
