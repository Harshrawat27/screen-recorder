'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

// The home page's product picture: the real dashboard, with the pieces of a recording floating
// around it (the recording controls, the extension's panel, the camera bubble and the
// "Link copied" toast), partly hanging over its edges. Moving the mouse shifts each layer a
// few pixels by its depth, a subtle parallax. Turned off for touch screens and reduced motion.

const DEPTH = { base: 4, controls: 14, panel: 18, avatar: 22, toast: 12 } as const;

/** Moves with the mouse by `depth` pixels at most. */
function layer(depth: number): React.CSSProperties {
  return {
    transform: `translate3d(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px), 0)`,
  };
}

function useParallax(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || still.matches) return;

    let target = { x: 0, y: 0 };
    let now = { x: 0, y: 0 };
    let frame = 0;
    const tick = () => {
      // Ease toward the mouse so the motion stays soft.
      now = { x: now.x + (target.x - now.x) * 0.08, y: now.y + (target.y - now.y) * 0.08 };
      el.style.setProperty('--px', now.x.toFixed(4));
      el.style.setProperty('--py', now.y.toFixed(4));
      frame = Math.abs(target.x - now.x) + Math.abs(target.y - now.y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      // -1 … 1 across the window, centred on the middle of the screen.
      target = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const leave = () => {
      target = { x: 0, y: 0 };
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

const LogoMark = ({ className }: { className?: string }) => (
  <svg viewBox='0 0 64 64' className={className} aria-hidden>
    <rect width='64' height='64' rx='16' fill='#F35733' />
    <circle cx='32' cy='32' r='19.5' fill='#fff' fillOpacity='.28' />
    <circle cx='32' cy='32' r='15' fill='#fff' />
  </svg>
);

const Chevron = () => (
  <svg viewBox='0 0 12 12' fill='none' className='ml-auto size-2.5 shrink-0 text-faint' aria-hidden>
    <path d='M3 4.5l3 3 3-3' stroke='currentColor' strokeWidth='1.5' />
  </svg>
);

/** The extension's setup panel, as it looks when you click the icon. */
function Panel() {
  const row = 'flex h-9 items-center gap-2.5 whitespace-nowrap rounded-[10px] border border-line px-2.5 text-xs font-semibold';
  const icon = 'size-3.5 shrink-0 text-muted';
  return (
    <div className='w-[270px] rounded-[16px] border border-line bg-surface p-3 text-left text-text shadow-[0_22px_50px_-14px_rgb(0_0_0/0.28),0_2px_6px_rgb(0_0_0/0.05)]'>
      <div className='mb-2.5 flex items-center gap-2 text-[13.5px] font-semibold'>
        <LogoMark className='size-[18px]' />
        Showthrough
        <svg viewBox='0 0 16 16' fill='none' className='ml-auto size-3 text-muted' aria-hidden>
          <path d='M4 4l8 8M12 4l-8 8' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
        </svg>
      </div>
      <div className='space-y-[7px]'>
        <div className={row}>
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className={icon} aria-hidden>
            <rect x='3' y='6.5' width='13' height='11' rx='2' />
            <path d='M16 10.5l5-3v9l-5-3' />
          </svg>
          FaceTime HD Camera
          <Chevron />
        </div>
        <div className={row}>
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className={icon} aria-hidden>
            <rect x='9' y='3' width='6' height='11' rx='3' />
            <path d='M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21' />
          </svg>
          MacBook Pro Microphone
          <Chevron />
        </div>
        <div className={row}>
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className={icon} aria-hidden>
            <path d='M4 9.5h3.5L12 5.5v13l-4.5-4H4z' />
            <path d='M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11' />
          </svg>
          Record tab or system audio
          <span className='relative ml-auto h-[17px] w-[30px] shrink-0 rounded-full bg-text after:absolute after:right-0.5 after:top-0.5 after:size-[13px] after:rounded-full after:bg-surface' />
        </div>
      </div>
      <div className='mt-2.5 flex h-9 items-center justify-center gap-2 rounded-full bg-text text-[13px] font-semibold text-canvas'>
        <span className='size-[9px] rounded-full bg-[#F35733]' />
        Start recording
      </div>
      <p className='mt-2.5 text-center text-[10.5px] text-muted'>
        Saved to your own Cloudflare · <span className='text-text underline underline-offset-2'>Account</span>
      </p>
    </div>
  );
}

/** The recording controls on the page: timer, pause, restart, delete, stop. */
function Controls() {
  const icon = 'size-[18px] text-[#a1a1aa]';
  return (
    <div className='flex w-[54px] flex-col items-center gap-3 rounded-[20px] bg-[#18181b] pb-2 pt-3 shadow-[0_16px_30px_-12px_rgb(0_0_0/0.45)] ring-1 ring-white/10'>
      <div className='flex flex-col items-center gap-1.5 text-[12px] font-semibold tabular-nums text-white'>
        <span className='size-2.5 rounded-full bg-[#F35733] shadow-[0_0_0_5px_rgb(243_87_51/0.2)]' />
        1:24
      </div>
      <span className='h-px w-7 bg-white/15' />
      <svg viewBox='0 0 24 24' fill='currentColor' className={icon} aria-hidden>
        <rect x='7' y='5.5' width='3.2' height='13' rx='1' />
        <rect x='13.8' y='5.5' width='3.2' height='13' rx='1' />
      </svg>
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' className={icon} aria-hidden>
        <path d='M4.5 12a7.5 7.5 0 1 0 2.2-5.3' />
        <path d='M4.5 4v4h4' />
      </svg>
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' className={icon} aria-hidden>
        <path d='M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13' />
      </svg>
      <span className='grid size-9 place-items-center rounded-[11px] bg-white'>
        <span className='size-3 rounded-[3px] bg-[#18181b]' />
      </span>
    </div>
  );
}

/** "Link copied", the moment you press stop. */
function Toast() {
  return (
    <div className='flex h-14 items-center gap-3 whitespace-nowrap rounded-[16px] bg-[#18181b] pl-3 pr-5 text-left text-white shadow-[0_24px_44px_-18px_rgb(0_0_0/0.55)] ring-1 ring-white/10'>
      <span className='grid size-8 place-items-center rounded-full bg-white/12'>
        <svg viewBox='0 0 24 24' fill='none' stroke='#fff' strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round' className='size-4' aria-hidden>
          <path d='M5 12.5l4.5 4.5L19 7.5' />
        </svg>
      </span>
      <span>
        <b className='block text-[15px] font-semibold'>Link copied</b>
        <small className='block text-[12.5px] text-[#a1a1aa]'>showthrough.com/v/acme/q4-plan</small>
      </span>
    </div>
  );
}

export function HeroShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref);

  return (
    <div ref={ref} className='relative mx-auto max-w-6xl'>
      {/* The real dashboard (public/dashboard-image.png, 1920×992), fading out at the bottom. */}
      <div style={layer(DEPTH.base)} className='will-change-transform'>
        <div className='hero-shot overflow-hidden rounded-t-[20px] border border-b-0 border-line bg-canvas shadow-pop sm:rounded-t-[24px]'>
          <Image
            src='/dashboard-image.png'
            alt='The Showthrough library: your recordings, folders and search, stored in your own Cloudflare'
            width={1920}
            height={992}
            priority
            sizes='(min-width: 1200px) 1152px, 100vw'
            className='block h-auto w-full'
          />
        </div>
      </div>

      {/* The pieces of a recording, hanging over the edges. Pictures only, so hidden from screen readers. */}
      <div aria-hidden className='pointer-events-none absolute inset-0 select-none'>
        <div className='absolute left-0 top-[20%] hidden -translate-x-1/2 lg:block'>
          <div style={layer(DEPTH.controls)} className='will-change-transform'>
            <Controls />
          </div>
        </div>

        <div className='absolute right-0 top-[7%] hidden translate-x-[18%] lg:block'>
          <div style={layer(DEPTH.panel)} className='will-change-transform'>
            <Panel />
          </div>
        </div>

        <div className='absolute left-[3%] top-[58%] lg:left-0 lg:-translate-x-[12%]'>
          <div style={layer(DEPTH.avatar)} className='will-change-transform'>
            <div className='size-24 overflow-hidden rounded-full border-4 border-surface bg-sunken shadow-[0_22px_44px_-16px_rgb(24_24_27/0.5)] ring-1 ring-line sm:size-36 lg:size-44'>
              <Image src='/hero-avatar.svg' alt='' width={176} height={176} className='size-full object-cover' unoptimized />
            </div>
          </div>
        </div>

        <div className='absolute right-[3%] top-[66%] hidden sm:block lg:right-0 lg:translate-x-[10%]'>
          <div style={layer(DEPTH.toast)} className='will-change-transform'>
            <Toast />
          </div>
        </div>
      </div>
    </div>
  );
}
