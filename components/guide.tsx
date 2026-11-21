import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/home-sections";
import { SiteNav } from "@/components/site-nav";
import { guidePages, guidePath } from "@/lib/guide";

// Building blocks for the setup guide (/guide): the page frame with its sidebar and
// Previous / Next links, screenshots with hand-drawn highlights, and short notes.

export const guideLink = "font-medium text-text underline underline-offset-2 hover:text-muted";

// ---- Screenshots -------------------------------------------------------------------------------

// Highlights are placed in percent of the screenshot, so they stay on target at any width.
//   circle: [left, top, width, height] of the thing to circle
//   cursor: [left, top] where the arrow's tip points
export type Mark = { circle: [number, number, number, number] } | { cursor: [number, number] };

const INK = "#e5322d"; // annotation red: reads on both light and dark screenshots

function Scribble({ box: [x, y, w, h] }: { box: [number, number, number, number] }) {
  // A loose hand-drawn loop, a little bigger than the thing it circles, with an overshooting tail.
  const padX = Math.max(1.2, w * 0.12);
  const padY = Math.max(1.6, h * 0.35);
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute overflow-visible"
      style={{ left: `${x - padX}%`, top: `${y - padY}%`, width: `${w + padX * 2}%`, height: `${h + padY * 2}%` }}
    >
      <path
        d="M 10 26 C 28 2, 82 0, 96 24 C 104 44, 94 84, 62 96 C 32 104, 1 86, 2 52 C 3 28, 24 10, 46 8"
        fill="none"
        stroke={INK}
        strokeWidth="2.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Cursor({ at: [x, y] }: { at: [number, number] }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="pointer-events-none absolute w-[clamp(18px,2.6vw,30px)] drop-shadow-[0_2px_3px_rgb(0_0_0/0.35)]"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <path d="M2 1.5l17 9.6-7.3 1.6-3.6 6.8z" fill="#111" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function Shot({ src, alt, width, height, marks = [] }: { src: string; alt: string; width: number; height: number; marks?: Mark[] }) {
  return (
    <figure className="mt-6">
      {/* Opens the full-size screenshot, for small screens. */}
      <a
        href={`/guide/${src}.webp`}
        target="_blank"
        className="relative block overflow-hidden rounded-card border border-line bg-sunken shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)]"
      >
        <Image src={`/guide/${src}.webp`} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 672px, 100vw" className="block h-auto w-full" />
        {marks.map((m, i) => ("circle" in m ? <Scribble key={i} box={m.circle} /> : <Cursor key={i} at={m.cursor} />))}
      </a>
    </figure>
  );
}

// ---- Text ------------------------------------------------------------------------------------

export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-lg leading-relaxed text-muted">{children}</p>;
}

/** The actions on a page, numbered. Keep each one short. */
export function Do({ start, children }: { start?: number; children: React.ReactNode }) {
  return <ol start={start} className="mt-6 list-decimal space-y-2.5 pl-6 text-[17px] leading-relaxed marker:font-semibold marker:text-muted">{children}</ol>;
}

export function Note({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="mt-8 rounded-card border border-line bg-surface p-5">
      <p className="font-semibold">{title}</p>
      <div className="mt-1.5 space-y-1.5 leading-relaxed text-muted">{children}</div>
    </aside>
  );
}

// ---- Page frame ------------------------------------------------------------------------------

function StepList({ current }: { current: number }) {
  return (
    <ol className="space-y-0.5">
      {guidePages.map((p, i) => (
        <li key={p.slug}>
          <Link
            href={guidePath(p.slug)}
            aria-current={i === current ? "page" : undefined}
            className={`flex gap-2.5 rounded-control px-3 py-2 text-[15px] transition-colors ${
              i === current ? "bg-sunken font-semibold text-text" : "text-muted hover:text-text"
            }`}
          >
            <span className="w-4 shrink-0 text-right tabular-nums text-faint">{i === 0 ? "" : i}</span>
            {p.nav}
          </Link>
        </li>
      ))}
    </ol>
  );
}

function Pager({ current }: { current: number }) {
  const prev = guidePages[current - 1];
  const next = guidePages[current + 1];
  const card = "group flex flex-col gap-1 rounded-card border border-line p-4 transition-colors hover:border-line-strong hover:bg-sunken";
  return (
    <nav aria-label="Guide pages" className="mt-14 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
      {prev ? (
        <Link href={guidePath(prev.slug)} className={card}>
          <span className="text-sm text-muted">← Previous</span>
          <span className="font-semibold">{prev.nav}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link href={guidePath(next.slug)} className={`${card} sm:items-end sm:text-right`}>
          <span className="text-sm text-muted">Next →</span>
          <span className="font-semibold">{next.nav}</span>
        </Link>
      )}
    </nav>
  );
}

export function GuideFrame({ slug, children }: { slug: string; children: React.ReactNode }) {
  const current = guidePages.findIndex((p) => p.slug === slug);
  const page = guidePages[current];
  const steps = guidePages.length - 1;
  return (
    <>
      <SiteNav />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16 lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <p className="mb-3 px-3 text-sm font-semibold">Setup guide</p>
            <StepList current={current} />
          </div>
        </aside>

        <main className="min-w-0 max-w-2xl">
          {/* On phones the step list folds away above the page. */}
          <details className="mb-8 rounded-card border border-line lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-[15px] font-semibold">
              Setup guide{current > 0 && <span className="font-normal text-muted"> · Step {current} of {steps}</span>}
            </summary>
            <div className="border-t border-line p-2">
              <StepList current={current} />
            </div>
          </details>

          <p className="text-sm text-muted">
            <Link href="/guide" className="hover:text-text">
              Setup guide
            </Link>
            {current > 0 && (
              <>
                <span className="mx-2 text-faint">/</span>
                Step {current} of {steps}
              </>
            )}
          </p>
          <h1 className="mt-3 text-[38px] leading-[1.05] sm:text-[48px]" style={{ letterSpacing: "-0.025em" }}>
            {page.title}
          </h1>
          {children}
          <Pager current={current} />
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
