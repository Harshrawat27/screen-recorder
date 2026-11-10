'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// The home page headline. "Screen recording you own." stays put; under it, "Say no to …"
// cycles through what other recorders put up with. Each one rises in, gets struck through,
// and the Showthrough answer appears in a small pill underneath.

const ITEMS = [
  { no: 'video limits', yes: 'Unlimited videos' },
  { no: 'time limits', yes: 'Record as long as you like' },
  { no: 'monthly bills', yes: 'Pay once, use it forever' },
  { no: 'pointless stand-ups', yes: 'Share a link the moment you stop' },
];

const CYCLE_MS = 3400;

// useLayoutEffect warns on the server; this runs it only in the browser.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function SayNoHeadline() {
  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState<number[] | null>(null);
  const measure = useRef<HTMLSpanElement>(null);

  // Measure every phrase once (and on resize) so the slot can glide to the right width.
  useIsoLayoutEffect(() => {
    const read = () => {
      const spans = measure.current?.querySelectorAll('span');
      if (spans) setWidths(Array.from(spans, (s) => s.getBoundingClientRect().width));
    };
    read();
    document.fonts?.ready.then(read);
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % ITEMS.length), CYCLE_MS);
    return () => window.clearInterval(timer);
  }, []);

  const item = ITEMS[index];

  return (
    <>
      {/* What search engines and screen readers get: the whole idea, once. */}
      <h1 className='sr-only'>
        Screen recording you own. Say no to video limits, time limits, monthly
        bills and pointless stand-ups.
      </h1>

      <div aria-hidden className='say-no mt-7 flex flex-col items-center'>
        <p
          className='font-display font-medium text-[48px] leading-[1] sm:text-[64px] md:whitespace-nowrap md:text-[64px] lg:text-[84px]'
          style={{ letterSpacing: '-0.03em' }}
        >
          Screen recording you own.
        </p>

        <p
          className='mt-2 whitespace-nowrap font-display font-medium text-[25px] leading-[1.15] text-muted sm:mt-3 sm:text-[60px]'
          style={{ letterSpacing: '-0.025em' }}
        >
          Say no to{' '}
          <span
            className='say-no-slot'
            style={{ width: widths ? widths[index] : undefined }}
          >
            <span key={index} className='say-no-word'>
              {item.no}
              <span className='say-no-strike' />
            </span>
          </span>
        </p>

        <div className='mt-5 h-9'>
          <span key={index} className='say-no-yes sky-glass'>
            <svg viewBox='0 0 16 16' fill='none' aria-hidden className='size-3.5'>
              <path
                d='M3.5 8.5l3 3 6-7'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            {item.yes}
          </span>
        </div>

        {/* Hidden copies, only for measuring each phrase's width. */}
        <span
          ref={measure}
          className='pointer-events-none invisible absolute whitespace-nowrap font-display font-medium text-[25px] sm:text-[60px]'
          style={{ letterSpacing: '-0.025em' }}
        >
          {ITEMS.map((x) => (
            <span key={x.no} className='inline-block'>
              {x.no}
            </span>
          ))}
        </span>
      </div>
    </>
  );
}
