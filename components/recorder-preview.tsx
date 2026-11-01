"use client";

import { useEffect, useState } from "react";

// The hero's one moving element: a recording in progress that ends with a copied link.
const RECORD_SECONDS = 9;

function clock(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function RecorderPreview() {
  const [seconds, setSeconds] = useState(42);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let s = 42;
    const id = window.setInterval(() => {
      s += 1;
      if (s === 42 + RECORD_SECONDS) setStopped(true);
      if (s === 42 + RECORD_SECONDS + 5) {
        s = 42;
        setStopped(false);
      }
      setSeconds(Math.min(s, 42 + RECORD_SECONDS));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <figure
      aria-label="Preview of a screen recording with a camera bubble and a share link"
      className="relative mx-auto w-full max-w-[520px]"
    >
      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="ml-3 h-5 flex-1 rounded-md bg-fog" />
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-4 p-5">
          <div className="space-y-2.5">
            <div className="h-3 w-4/5 rounded bg-fog" />
            <div className="h-3 w-3/5 rounded bg-fog" />
            <div className="h-3 w-2/3 rounded bg-fog" />
            <div className="h-3 w-1/2 rounded bg-fog" />
          </div>
          <div className="space-y-3">
            <div className="h-24 rounded-lg bg-fog" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-12 rounded-lg bg-fog" />
              <div className="h-12 rounded-lg bg-fog" />
              <div className="h-12 rounded-lg bg-fog" />
            </div>
            <div className="h-3 w-3/4 rounded bg-fog" />
          </div>
        </div>
        <div className="h-20" />
      </div>

      <div
        aria-hidden
        className="absolute bottom-5 left-5 grid size-24 place-items-end overflow-hidden rounded-full border-4 border-paper bg-[#c9d3df] sm:size-28"
      >
        <div className="mx-auto mb-[-18%] h-3/4 w-3/4 rounded-t-full bg-[#9fb0c4]" />
        <div className="absolute left-1/2 top-[22%] size-[34%] -translate-x-1/2 rounded-full bg-[#9fb0c4]" />
      </div>

      <div className="absolute -top-4 right-4 flex items-center gap-3 rounded-full border border-line bg-paper py-1.5 pl-3.5 pr-1.5 text-sm shadow-[0_6px_20px_-12px_rgba(15,35,64,0.5)]">
        {stopped ? (
          <span className="font-medium">Stopped</span>
        ) : (
          <span className="flex items-center gap-2 font-medium">
            <span className="rec-dot size-2.5 rounded-full bg-rec" />
            <span className="tabular">{clock(seconds)}</span>
          </span>
        )}
        <span
          className={`rounded-full px-3 py-1 font-medium ${stopped ? "bg-fog text-slate" : "bg-ink text-paper"}`}
        >
          Stop
        </span>
      </div>

      <div
        role="status"
        className={`absolute -bottom-5 right-4 flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm transition-all duration-500 motion-reduce:transition-none ${
          stopped ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <span className="text-slate">videos.acme.com/v/k3J9xQ</span>
        <span className="font-medium">Link copied</span>
      </div>
    </figure>
  );
}
