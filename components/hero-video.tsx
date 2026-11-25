'use client';

import { Dialog } from '@base-ui/react/dialog';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import 'plyr/dist/plyr.css';

// The home page's demo: a still from the video with a play button. Clicking it opens the video
// in a large popup, playing straight away with the sound off (the player's speaker turns it
// on). The video lives in Cloudflare R2 (served from assets.showthrough.com); the still is in
// public/demo.

export const DEMO_VIDEO = 'https://assets.showthrough.com/for-website.mp4';
const POSTER = '/demo/poster.webp';

const PlayIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox='0 0 24 24' aria-hidden className={className}>
    <path d='M8 5.6v12.8a1 1 0 0 0 1.52.85l10.2-6.4a1 1 0 0 0 0-1.7L9.52 4.75A1 1 0 0 0 8 5.6z' fill='currentColor' />
  </svg>
);

/** The player inside the popup. Plyr is loaded only when the popup opens. */
function DemoPlayer() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let cancelled = false;
    let player: { destroy: () => void } | null = null;
    import('plyr').then(({ default: Plyr }) => {
      const video = ref.current;
      if (cancelled || !video) return;
      const plyr = new Plyr(video, {
        autoplay: true,
        muted: true,
        clickToPlay: true,
        hideControls: true,
        resetOnEnd: true,
        keyboard: { focused: true, global: true },
        controls: ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'settings', 'fullscreen'],
        settings: ['speed'],
        speed: { selected: 1, options: [0.75, 1, 1.25, 1.5, 2] },
      });
      plyr.muted = true;
      // Muted videos may autoplay in every browser; if one still refuses, the big play button is there.
      const started = plyr.play();
      if (started && typeof started.catch === 'function') started.catch(() => {});
      player = plyr;
    });
    return () => {
      cancelled = true;
      player?.destroy();
    };
  }, []);

  return (
    <div className='demo-player overflow-hidden rounded-[18px] bg-black'>
      <video ref={ref} src={DEMO_VIDEO} poster={POSTER} playsInline muted autoPlay preload='auto' className='block aspect-video w-full' />
    </div>
  );
}

/** The demo in a large popup, playing with the sound off. Used by every "Watch the demo" / "See how it works". */
export function DemoDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0' />
        <Dialog.Popup className='fixed left-1/2 top-1/2 z-50 w-[min(94vw,1200px,calc((100dvh-7rem)*16/9))] -translate-x-1/2 -translate-y-1/2 outline-none transition duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0'>
          <Dialog.Title className='sr-only'>Showthrough demo</Dialog.Title>
          <Dialog.Close
            aria-label='Close the video'
            className='absolute -top-12 right-0 grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20'
          >
            <svg viewBox='0 0 24 24' aria-hidden className='size-5'>
              <path d='M18 6 6 18M6 6l12 12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
            </svg>
          </Dialog.Close>
          {open && <DemoPlayer />}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** A button that opens the demo popup ("See how it works" across the site). */
export function WatchDemoButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type='button' onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <DemoDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

export function HeroVideo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        aria-label='Play the Showthrough demo video'
        className='group relative mx-auto block w-full max-w-5xl cursor-pointer overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_40px_90px_-40px_rgb(0_0_0/0.45)] outline-none focus-visible:ring-2 focus-visible:ring-text'
      >
        <Image
          src={POSTER}
          width={1600}
          height={900}
          priority
          sizes='(min-width: 1100px) 1024px, 100vw'
          alt='Showthrough recording a page in Chrome, with the camera bubble and the recording controls'
          className='block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.015]'
        />
        <span className='absolute inset-0 grid place-items-center'>
          <span className='flex items-center gap-3 rounded-full bg-[#18181b]/90 p-2 text-white shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)] backdrop-blur transition-transform duration-300 group-hover:scale-105 sm:p-3 sm:pr-6'>
            <span className='grid size-11 place-items-center rounded-full bg-white text-[#18181b] sm:size-12'>
              <PlayIcon className='ml-0.5 size-5 sm:size-6' />
            </span>
            {/* On phones just the round play button, so the picture stays visible. */}
            <span className='hidden text-base font-semibold sm:inline'>
              Watch the demo <span className='font-normal text-white/60'>· 46 sec</span>
            </span>
          </span>
        </span>
      </button>

      <DemoDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
