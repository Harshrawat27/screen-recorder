"use client";

import { useState } from "react";

// A recording's thumbnail. Older recordings don't have one, so a missing image just disappears
// and the card's dark placeholder shows instead.
export function VideoThumb({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)}
      // The image can fail before React is listening; catch that case when the element mounts.
      ref={(img) => {
        if (img?.complete && img.naturalWidth === 0) setFailed(true);
      }} className="absolute inset-0 size-full object-cover" />
  );
}
