"use client";

import { useEffect, useState } from "react";

// The hero's one moving moment: a recording counts up, stops, and the link is copied.
const START = 42;
const RECORD_FOR = 8;
const HOLD = 4;

function clock(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function FakeScreen() {
  // A neutral app layout, drawn with shapes so it reads as "someone's screen".
  return (
    <div aria-hidden className="absolute inset-0 grid grid-cols-[22%_1fr] gap-[3%] p-[4%]">
      <div className="space-y-[10%] rounded-[6px] bg-white/[0.04] p-[10%]">
        <div className="h-[6%] min-h-1.5 w-3/4 rounded-full bg-white/20" />
        <div className="h-[4%] min-h-1 w-1/2 rounded-full bg-white/10" />
        <div className="h-[4%] min-h-1 w-2/3 rounded-full bg-white/10" />
        <div className="h-[4%] min-h-1 w-1/2 rounded-full bg-[var(--brand)]/70" />
        <div className="h-[4%] min-h-1 w-3/5 rounded-full bg-white/10" />
      </div>
      <div className="grid grid-rows-[auto_1fr_auto] gap-[5%]">
        <div className="flex items-center justify-between">
          <div className="h-2 w-1/3 rounded-full bg-white/25" />
          <div className="h-3.5 w-12 rounded-full bg-white/10" />
        </div>
        <div className="grid grid-cols-3 gap-[4%]">
          <div className="rounded-[6px] bg-white/[0.07]" />
          <div className="rounded-[6px] bg-white/[0.07]" />
          <div className="rounded-[6px] bg-white/[0.07]" />
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-5/6 rounded-full bg-white/10" />
          <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function HeroVisual() {
  const [seconds, setSeconds] = useState(START);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tick = 0;
    const id = window.setInterval(() => {
      tick = (tick + 1) % (RECORD_FOR + HOLD);
      setStopped(tick >= RECORD_FOR);
      setSeconds(START + Math.min(tick, RECORD_FOR));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <figure aria-label="A Showthrough share page with a recording in progress" className="relative mx-auto w-full max-w-[600px]">
      <div className="overflow-hidden rounded-panel border border-line bg-surface shadow-pop">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
          </div>
          <div className="flex-1 truncate rounded-full bg-sunken px-3 py-1 text-xs text-muted">showthrough.com/v/k3J9xQ</div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="relative aspect-video overflow-hidden rounded-card bg-stage">
            <FakeScreen />

            <div aria-hidden className="absolute bottom-[24%] left-[4%] grid aspect-square w-[15%] place-items-end overflow-hidden rounded-full border-[3px] border-white/90 bg-[#3a3a41]">
              <div className="mx-auto mb-[-20%] h-[62%] w-[62%] rounded-t-full bg-[#8d8d97]" />
              <div className="absolute left-1/2 top-[20%] size-[34%] -translate-x-1/2 rounded-full bg-[#8d8d97]" />
            </div>

            {/* Player controls with a seek preview, YouTube-style */}
            <div aria-hidden className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-[4%] pb-[3%] pt-[8%]">
              <div className="relative">
                <div className="absolute bottom-4 left-[62%] -translate-x-1/2">
                  <div className="h-[46px] w-[82px] overflow-hidden rounded-[6px] border border-white/30 bg-[#2a2a30] p-1 sm:h-[54px] sm:w-[96px]">
                    <div className="grid h-full grid-cols-[30%_1fr] gap-1">
                      <div className="rounded-[2px] bg-white/10" />
                      <div className="rounded-[2px] bg-white/[0.07]" />
                    </div>
                  </div>
                  <p className="mt-1 text-center text-[10px] font-semibold text-white">2:36</p>
                </div>
                <div className="relative h-1 rounded-full bg-white/25">
                  <div className="absolute inset-y-0 left-0 w-[34%] rounded-full bg-[var(--brand)]" />
                  <div className="absolute inset-y-0 left-[34%] w-[28%] bg-white/30" />
                  <div className="absolute left-[34%] top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand)]" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-white/85">
                <svg viewBox="0 0 12 12" className="size-3" fill="currentColor">
                  <path d="M3 1.8v8.4L10 6z" />
                </svg>
                <span className="tabular">1:24 / 4:12</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 px-1 pb-1 pt-4">
            <div className="flex min-w-0 items-center gap-3">
              <div aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand-ink">
                H
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Homepage redesign walkthrough</p>
                <p className="text-xs text-muted">Harsh, 2 minutes ago</p>
              </div>
            </div>
            <span className="hidden shrink-0 rounded-control border border-line px-3 py-1.5 text-xs font-semibold sm:inline">Copy link</span>
          </div>
        </div>
      </div>

      <div className="absolute -top-4 right-3 flex items-center gap-3 rounded-full border border-line bg-surface py-1.5 pl-4 pr-1.5 text-sm shadow-pop sm:right-6">
        {stopped ? (
          <span className="font-semibold text-muted">Stopped</span>
        ) : (
          <span className="flex items-center gap-2 font-semibold">
            <span className="rec-dot size-2.5 rounded-full bg-rec" />
            <span className="tabular">{clock(seconds)}</span>
          </span>
        )}
        <span className={`rounded-full px-3.5 py-1 font-semibold ${stopped ? "bg-sunken text-faint" : "bg-brand text-on-brand"}`}>Stop</span>
      </div>

      <div
        role="status"
        className={`absolute -bottom-5 left-3 flex items-center gap-2.5 rounded-card border border-line bg-surface px-4 py-3 text-sm shadow-pop transition-all duration-500 motion-reduce:transition-none sm:left-auto sm:right-6 ${
          stopped ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <span className="grid size-5 place-items-center rounded-full bg-success text-white">
          <svg viewBox="0 0 20 20" fill="none" className="size-3.5" aria-hidden>
            <path d="M5 10.5l3.2 3.2L15 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-semibold">Link copied</span>
        <span className="text-muted">ready 0.1s after stop</span>
      </div>
    </figure>
  );
}
