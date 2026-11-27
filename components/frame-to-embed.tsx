"use client";

import { useEffect } from "react";

// A share page shown inside another website (Notion's "Create embed", an iframe someone made from
// the share link) switches to the embed player, so it shows just the video, not the whole page.
export function FrameToEmbed({ space, id }: { space: string; id: string }) {
  useEffect(() => {
    let framed = false;
    try {
      framed = window.self !== window.top;
    } catch {
      framed = true; // a cross-origin parent can't be read: we're framed
    }
    if (framed) window.location.replace(`/embed/${space}/${id}`);
  }, [space, id]);
  return null;
}
