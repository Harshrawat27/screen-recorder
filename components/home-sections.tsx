import Link from "next/link";
import { Savings } from "@/components/savings";
import { CheckIcon, LogoMark, buttonClass } from "@/components/ui";
import { site } from "@/lib/site";
import { type TierState, tierStates } from "@/lib/pricing";

// Home page sections below the hero. Black and white for now; every color comes from theme tokens.

function SectionIntro({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-[40px] leading-[1.04] sm:text-[56px]" style={{ letterSpacing: "-0.025em" }}>
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">{body}</p>
    </div>
  );
}

/* ---------- Features (bento) ---------- */

function Tile({
  title,
  body,
  soon = false,
  className = "",
  children,
}: {
  title: string;
  body: string;
  soon?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-[24px] border border-line bg-surface ${className}`}>
      <div className="relative flex-1 bg-sunken/60 p-5 sm:p-6">{children}</div>
      <div className="border-t border-line p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-[24px] leading-tight">{title}</h3>
          {soon && <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-muted">Coming soon</span>}
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}

function StopVisual() {
  return (
    <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-3 rounded-full border border-line bg-surface py-2 pl-4 pr-2 shadow-pop">
        <span className="size-2.5 rounded-full bg-text" />
        <span className="tabular font-semibold">4:12</span>
        <span className="btn-primary rounded-full bg-text px-4 py-1.5 text-sm font-semibold text-canvas">Stop</span>
      </div>
      <svg viewBox="0 0 20 40" className="h-8 w-4 text-faint" fill="none" aria-hidden>
        <path d="M10 2v34M4 30l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-4 shadow-pop">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid size-5 place-items-center rounded-full bg-text text-canvas">
            <CheckIcon className="size-3" />
          </span>
          Link copied
        </div>
        <p className="mt-2 truncate rounded-lg bg-sunken px-3 py-2 font-mono text-[13px] text-muted">showthrough.com/v/st-fdce/199b07a9</p>
        <p className="mt-2 text-xs text-faint">Paste it in Slack, email or a ticket</p>
      </div>
    </div>
  );
}

function CloudVisual() {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center gap-3">
      <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-center text-sm shadow-pop">
        <p className="font-semibold">Your browser</p>
        <p className="text-xs text-muted">records</p>
      </div>
      <svg viewBox="0 0 60 12" className="h-3 w-14 text-faint" fill="none" aria-hidden>
        <path d="M2 6h52M48 1l6 5-6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="rounded-2xl border-2 border-text bg-surface px-4 py-3 text-center text-sm shadow-pop">
        <p className="font-semibold">Your Cloudflare</p>
        <p className="text-xs text-muted">stores</p>
      </div>
    </div>
  );
}

function PriceVisual({ price }: { price: number }) {
  return (
    <div className="flex h-full min-h-[200px] flex-col justify-center gap-4">
      <div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Loom, 10 people, 1 year</span>
          <span className="tabular font-semibold text-muted">${(10 * site.loom.perUserPerMonth * 12).toLocaleString("en-US")}</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-line-strong" />
      </div>
      <div>
        <div className="flex justify-between text-sm">
          <span className="font-semibold">{site.name}, forever</span>
          <span className="tabular font-semibold">${price}</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-line">
          <div className="h-full w-[2%] min-w-2.5 rounded-full bg-text" />
        </div>
      </div>
    </div>
  );
}

function BubbleVisual() {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center">
      <div className="relative aspect-video w-full max-w-[260px] rounded-xl bg-stage p-3">
        <div className="space-y-1.5">
          <span className="block h-1.5 w-1/3 rounded-full bg-white/25" />
          <span className="block h-1.5 w-2/3 rounded-full bg-white/10" />
          <span className="block h-1.5 w-1/2 rounded-full bg-white/10" />
        </div>
        <span className="absolute -bottom-3 -left-3 grid size-16 place-items-center rounded-full border-[3px] border-surface bg-gradient-to-b from-neutral-400 to-neutral-600 shadow-pop">
          <svg viewBox="0 0 24 24" className="size-8 text-white/80" fill="currentColor" aria-hidden>
            <circle cx="12" cy="9" r="4" />
            <path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6z" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function ViewerVisual() {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center">
      <div className="w-full max-w-[280px] overflow-hidden rounded-xl border border-line bg-surface shadow-pop">
        <div className="relative aspect-video bg-stage">
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-10 place-items-center rounded-full bg-white text-black">
              <svg viewBox="0 0 12 12" className="ml-0.5 size-3.5" fill="currentColor" aria-hidden>
                <path d="M3 1.8v8.4L10 6z" />
              </svg>
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between px-3 py-2.5 text-xs">
          <span className="font-semibold">No sign-up to watch</span>
          <span className="text-muted">Any browser</span>
        </div>
      </div>
    </div>
  );
}

function SafeVisual() {
  return (
    <div className="flex h-full min-h-[200px] flex-col justify-center gap-2.5">
      {[
        { label: "Saved on this computer", done: true },
        { label: "Uploading as you talk", done: true },
        { label: "Wi-Fi dropped? Picks up where it left off", done: false },
      ].map((row) => (
        <div key={row.label} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm">
          <span className={`grid size-5 shrink-0 place-items-center rounded-full ${row.done ? "bg-text text-canvas" : "border-2 border-line-strong"}`}>
            {row.done && <CheckIcon className="size-3" />}
          </span>
          {row.label}
        </div>
      ))}
    </div>
  );
}

function TalkVisual() {
  const comments = [
    { who: "Priya", at: "1:12", text: "Can we keep the old button color here?", left: "22%" },
    { who: "Marco", at: "2:40", text: "This flow is so much clearer. Ship it.", left: "58%" },
  ];
  const reactions = [
    { emoji: "👍", left: "12%" },
    { emoji: "👀", left: "34%" },
    { emoji: "❤️", left: "49%" },
    { emoji: "🎉", left: "66%" },
    { emoji: "👍", left: "81%" },
  ];
  return (
    <div className="flex h-full min-h-[240px] flex-col justify-center gap-6 px-1 sm:px-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {comments.map((c) => (
          <div key={c.at} className="rounded-2xl border border-line bg-surface p-4 shadow-pop">
            <div className="flex items-center gap-2.5 text-sm">
              <span className="grid size-7 place-items-center rounded-full bg-text text-xs font-semibold text-canvas">{c.who[0]}</span>
              <span className="font-semibold">{c.who}</span>
              <span className="tabular rounded-md bg-sunken px-1.5 py-0.5 text-xs text-muted">{c.at}</span>
            </div>
            <p className="mt-2.5 text-[15px] leading-snug">{c.text}</p>
          </div>
        ))}
      </div>
      <div className="relative pt-9">
        {reactions.map((r, i) => (
          <span
            key={i}
            className="absolute top-0 grid size-8 -translate-x-1/2 place-items-center rounded-full border border-line bg-surface text-[15px] shadow-pop"
            style={{ left: r.left }}
          >
            {r.emoji}
          </span>
        ))}
        <div className="relative h-1.5 rounded-full bg-line">
          <div className="h-full w-[64%] rounded-full bg-text" />
          {comments.map((c) => (
            <span key={c.at} className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-text" style={{ left: c.left }} />
          ))}
        </div>
        <div className="tabular mt-2 flex justify-between text-xs text-muted">
          <span>2:41</span>
          <span>4:12</span>
        </div>
      </div>
    </div>
  );
}

export function Features({ price }: { price: number }) {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-6 px-5 py-24 sm:px-8 sm:py-32">
      <SectionIntro
        title="Everything Loom does for async video. None of the monthly bill."
        body="Record from Chrome, share a link, get back to work. Your recordings sit in your own Cloudflare account, so the price doesn't grow with your team."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Tile
          className="md:col-span-2 lg:row-span-2"
          title="The link is ready the moment you stop"
          body="Your video uploads while you talk. Press stop and the link is already on your clipboard, playing for whoever opens it."
        >
          <StopVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          title="Your videos live in your Cloudflare"
          body="Connect a free Cloudflare account in one click and we set up private storage there. Your recordings never sit on our servers."
        >
          <CloudVisual />
        </Tile>
        <Tile title="Pay once" body={`$${price} for your whole team. No seats, no subscription.`}>
          <PriceVisual price={price} />
        </Tile>
        <Tile title="Camera bubble" body="Put your face in the corner so it feels like a conversation.">
          <BubbleVisual />
        </Tile>
        <Tile className="md:col-span-1 lg:col-span-2" title="Anyone can watch" body="Viewers just open the link. It plays in any browser, on any phone, without an account.">
          <ViewerVisual />
        </Tile>
        <Tile
          className="md:col-span-1 lg:col-span-2"
          title="Recordings don't get lost"
          body="Every recording is saved on your computer until it has fully uploaded, so a closed tab or a dropped connection doesn't cost you a take."
        >
          <SafeVisual />
        </Tile>
        <Tile
          soon
          className="md:col-span-2 lg:col-span-4"
          title="Comments and reactions"
          body="Viewers react with an emoji or leave a comment pinned to the exact moment in the video, so feedback lands where it belongs. Stored in your Cloudflare, like your videos."
        >
          <TalkVisual />
        </Tile>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */

const included = [
  "Unlimited recordings and share links",
  "Screen, camera bubble, mic and tab audio",
  "Every team member, no per-seat pricing",
  "Videos stored in your own Cloudflare",
];

const badge: Record<TierState, string> = {
  open: "On sale now",
  next: "Next",
  "sold-out": "Sold out",
  later: "After the first 100",
};

function TierCard({ name, price, updates, note, state, left, size }: {
  name: string;
  price: number;
  updates: string;
  note: string;
  state: TierState;
  left: number | null;
  size: number | null;
}) {
  const open = state === "open";
  const faded = state === "sold-out" || state === "later";
  const hasUpdates = updates.startsWith("Lifetime");
  return (
    <div
      aria-disabled={!open || undefined}
      className={`flex flex-col rounded-[24px] bg-surface p-7 sm:p-8 ${
        open ? "border-2 border-text shadow-pop" : "border border-line"
      } ${faded ? "pointer-events-none select-none opacity-45" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-semibold">{name}</p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${open ? "bg-text text-canvas" : "border border-line text-muted"}`}
        >
          {badge[state]}
        </span>
      </div>
      <p className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-[64px] leading-none" style={{ letterSpacing: "-0.03em" }}>
          ${price}
        </span>
        <span className="text-muted">once</span>
      </p>
      <p className="mt-2 text-muted">{note}</p>

      <p className="mt-6 flex items-center gap-2.5 text-[15px] font-medium">
        <span
          className={`grid size-5 shrink-0 place-items-center rounded-full ${hasUpdates ? "bg-text text-canvas" : "border border-line-strong text-muted"}`}
        >
          {hasUpdates ? (
            <CheckIcon className="size-3" />
          ) : (
            <svg viewBox="0 0 12 12" className="size-2.5" fill="none" aria-hidden>
              <path d="M3 6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </span>
        {updates}
      </p>

      {size !== null && left !== null && (
        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted">{state === "sold-out" ? "All spots taken" : `${left} of ${size} spots left`}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-sunken">
            <div className="h-full rounded-full bg-text" style={{ width: `${((size - left) / size) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="mt-auto pt-8">
        {open ? (
          <a href="/buy" className={buttonClass("primary", "lg", "w-full rounded-full")}>
            Buy for ${price}
          </a>
        ) : (
          <span className={buttonClass("secondary", "lg", "w-full cursor-default rounded-full opacity-70")}>
            {state === "next" ? "Opens after the first 20" : state === "sold-out" ? "Sold out" : "Not on sale yet"}
          </span>
        )}
      </div>
    </div>
  );
}

export function Pricing({ sold, price, notice }: { sold: number; price: number; notice?: React.ReactNode }) {
  return (
    <section id="pricing" className="scroll-mt-6 border-y border-line bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionIntro
          title="One price. Your whole team. Forever."
          body="Loom charges every person, every month. Showthrough is a one-time purchase, and the earlier you buy, the less you pay."
        />

        {notice && <div className="mx-auto mt-10 max-w-3xl">{notice}</div>}

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {tierStates(sold).map(({ tier, state, left, size }) => (
            <TierCard key={tier.id} name={tier.name} price={tier.price} updates={tier.updates} note={tier.note} state={state} left={left} size={size} />
          ))}
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[24px] border border-line bg-surface p-7 sm:p-9">
            <p className="text-lg font-semibold">Every plan includes</p>
            <ul className="mt-6 space-y-3.5 text-[15px]">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-text text-canvas">
                    <CheckIcon className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 border-t border-line pt-6 text-sm leading-relaxed text-faint">
              One-time payment, no subscription. Cloudflare storage is free up to 10 GB; beyond that, Cloudflare bills your
              account about $0.015 per GB a month.
            </p>
          </div>

          <Savings price={price} />
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const faqs: { q: string; a: string }[] = [
  {
    q: "Do I need a Cloudflare account?",
    a: "Yes, a free one. You sign in to Cloudflare, click Allow, and we create the storage and video address for you in about 30 seconds. Nothing to configure, no keys to copy.",
  },
  {
    q: "Will Cloudflare charge me?",
    a: "Cloudflare asks for a card before it turns on storage, but you pay nothing while you stay within the free tier: 10 GB of storage, and viewing is always free. That's a lot of screen recordings. Past 10 GB it's about $0.015 per GB a month, billed by Cloudflare.",
  },
  {
    q: "Where are my videos stored?",
    a: "In a private storage bucket in your own Cloudflare account. Our servers never store your recordings. Share links play through a fast cache so videos start quickly for viewers anywhere.",
  },
  {
    q: "Who can watch my videos?",
    a: "Anyone you send the link to. Viewers don't need an account. Password-protected and private links are on the roadmap.",
  },
  {
    q: "Does it work on Windows and Chromebooks?",
    a: "Yes. Showthrough is a Chrome extension, so it works anywhere Chrome runs: Mac, Windows, Linux and ChromeOS.",
  },
  {
    q: "Why are there three prices?",
    a: "The first 20 customers pay $29 and customers 21 to 100 pay $59. Both include every future update, forever. After the first 100 the price is $99, and that purchase covers the version you buy without future updates. Whatever you buy keeps working.",
  },
  {
    q: "Is it a subscription?",
    a: "No. You pay once and your whole team can use it. The only other cost is Cloudflare storage if you go past their free 10 GB, billed to your own Cloudflare account.",
  },
  {
    q: "When can I start recording?",
    a: "The Chrome extension is in review on the Chrome Web Store. As soon as it's approved, it works for every account that has bought.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-6 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-[40px] leading-[1.04] sm:text-[56px]" style={{ letterSpacing: "-0.025em" }}>
            Questions, answered.
          </h2>
        </div>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {faqs.map((item) => (
            <details key={item.q} className="faq group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold">
                {item.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line transition-transform group-open:rotate-45">
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 max-w-[62ch] pr-12 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final call to action ---------- */

export function FinalCta({ price }: { price: number }) {
  return (
    <section className="px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center rounded-[28px] bg-text px-6 py-20 text-center text-canvas sm:rounded-[32px] sm:py-28">
        <h2 className="max-w-[16ch] text-[44px] leading-[1.02] sm:text-[72px]" style={{ letterSpacing: "-0.03em" }}>
          Be one of the first 100.
        </h2>
        <p className="mt-6 max-w-[48ch] text-lg leading-relaxed opacity-75">
          $29 for the first 20, then $59 up to 100, both with every future update. After that it&rsquo;s $99 without future updates.
        </p>
        <a
          href="/buy"
          className="mt-10 inline-flex h-13 items-center rounded-full bg-canvas px-8 text-base font-semibold text-text shadow-pop transition-opacity hover:opacity-90"
        >
          Buy for ${price}
        </a>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-8">
      <div className="flex flex-col justify-between gap-10 sm:flex-row">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2.5 font-semibold">
            <LogoMark className="size-7" />
            <span className="text-[17px]">{site.name}</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted">Screen recording you own. Videos live in your Cloudflare, and you pay once.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm">
          <p className="font-semibold">Product</p>
          <p className="font-semibold">Company</p>
          <Link href="/#how" className="text-muted hover:text-text">
            Features
          </Link>
          <Link href="/privacy" className="text-muted hover:text-text">
            Privacy
          </Link>
          <Link href="/#pricing" className="text-muted hover:text-text">
            Pricing
          </Link>
          <Link href="/terms" className="text-muted hover:text-text">
            Terms
          </Link>
          <Link href="/#faq" className="text-muted hover:text-text">
            FAQ
          </Link>
          <Link href="/roadmap" className="text-muted hover:text-text">
            Roadmap
          </Link>
        </div>
      </div>
      <div className="mt-14 flex flex-col justify-between gap-2 border-t border-line pt-6 text-sm text-faint sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>Not affiliated with Loom or Cloudflare.</p>
      </div>
    </footer>
  );
}
