import Link from "next/link";
import { CookieSettingsLink } from "@/components/analytics";
import { Savings } from "@/components/savings";
import { CheckIcon, LogoMark, buttonClass } from "@/components/ui";
import { site } from "@/lib/site";
import { LIFETIME_PRICE, MAC_PRICE, shownTiers } from "@/lib/pricing";
import { type Locale, fill, localeNames, localePath, locales } from "@/lib/i18n";
import { homeCopy } from "@/lib/i18n/home";
import { ui } from "@/lib/i18n/ui";
import type { HomeCopy } from "@/lib/i18n/home-types";

type V = HomeCopy["features"]["v"];

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
  soonLabel = "Coming soon",
  className = "",
  children,
}: {
  title: string;
  body: string;
  soon?: boolean;
  soonLabel?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-[24px] border border-line bg-surface ${className}`}>
      <div className="relative flex-1 bg-sunken/60 p-5 sm:p-6">{children}</div>
      <div className="border-t border-line p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-[24px] leading-tight">{title}</h3>
          {soon && (
            <Link
              href="/roadmap"
              className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-muted transition-colors hover:border-line-strong hover:text-text"
            >
              {soonLabel}
            </Link>
          )}
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}

function StopVisual({ v }: { v: V }) {
  return (
    <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-3 rounded-full border border-line bg-surface py-2 pl-4 pr-2 shadow-pop">
        <span className="size-2.5 rounded-full bg-text" />
        <span className="tabular font-semibold">4:12</span>
        <span className="btn-primary rounded-full bg-text px-4 py-1.5 text-sm font-semibold text-canvas">{v.stop}</span>
      </div>
      <svg viewBox="0 0 20 40" className="h-8 w-4 text-faint" fill="none" aria-hidden>
        <path d="M10 2v34M4 30l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-4 shadow-pop">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid size-5 place-items-center rounded-full bg-text text-canvas">
            <CheckIcon className="size-3" />
          </span>
          {v.linkCopied}
        </div>
        <p className="mt-2 truncate rounded-lg bg-sunken px-3 py-2 font-mono text-[13px] text-muted">showthrough.com/v/st-fdce/199b07a9</p>
        <p className="mt-2 text-xs text-faint">{v.pasteIt}</p>
      </div>
    </div>
  );
}

function CloudVisual({ v }: { v: V }) {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center gap-3">
      <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-center text-sm shadow-pop">
        <p className="font-semibold">{v.yourBrowser}</p>
        <p className="text-xs text-muted">{v.records}</p>
      </div>
      <svg viewBox="0 0 60 12" className="h-3 w-14 text-faint" fill="none" aria-hidden>
        <path d="M2 6h52M48 1l6 5-6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="rounded-2xl border-2 border-text bg-surface px-4 py-3 text-center text-sm shadow-pop">
        <p className="font-semibold">{v.yourCloudflare}</p>
        <p className="text-xs text-muted">{v.stores}</p>
      </div>
    </div>
  );
}

function PriceVisual({ price, v }: { price: number; v: V }) {
  return (
    <div className="flex h-full min-h-[200px] flex-col justify-center gap-4">
      <div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">{v.loomTeam}</span>
          <span className="tabular font-semibold text-muted">${(10 * site.loom.perUserPerMonth * 12).toLocaleString("en-US")}</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-line-strong" />
      </div>
      <div>
        <div className="flex justify-between text-sm">
          <span className="font-semibold">{fill(v.oursForever, { name: site.name })}</span>
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

function ViewerVisual({ v }: { v: V }) {
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
          <span className="font-semibold">{v.noSignup}</span>
          <span className="text-muted">{v.anyBrowser}</span>
        </div>
      </div>
    </div>
  );
}

function SafeVisual({ v }: { v: V }) {
  return (
    <div className="flex h-full min-h-[200px] flex-col justify-center gap-2.5">
      {[
        { label: v.safeRows[0], done: true },
        { label: v.safeRows[1], done: true },
        { label: v.safeRows[2], done: false },
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

function TeamVisual({ v }: { v: V }) {
  const people = [
    { name: v.you, note: v.admin },
    { name: "Priya", note: "priya@studio.com" },
    { name: "Marco", note: "marco@studio.com" },
  ];
  return (
    <div className="flex h-full min-h-[200px] flex-col justify-center gap-3">
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-faint">{v.teammate}</span>
        <span className="btn-primary shrink-0 rounded-xl bg-text px-3.5 py-2.5 text-sm font-semibold text-canvas">{v.invite}</span>
      </div>
      <div className="rounded-xl border border-line bg-surface px-3.5 shadow-pop">
        {people.map((p, i) => (
          <div key={p.name} className={`flex items-center gap-3 py-2.5 text-sm ${i ? "border-t border-line" : ""}`}>
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-text text-xs font-semibold text-canvas">{p.name[0]}</span>
            <span className="font-semibold">{p.name}</span>
            <span className="ml-auto truncate text-xs text-muted">{p.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DownloadVisual({ v }: { v: V }) {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center">
      <div className="flex w-full max-w-[300px] items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-pop">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sunken text-[11px] font-bold tracking-wide text-muted">MP4</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">client-walkthrough.mp4</p>
          <p className="text-xs text-muted">{v.savedTo}</p>
        </div>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-text text-canvas">
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
            <path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function TalkVisual({ v }: { v: V }) {
  const comments = [
    { who: "Priya", at: "1:12", text: v.comment1 },
    { who: "Marco", at: "2:40", text: v.comment2 },
  ];
  const reactions = [
    { emoji: "👍", count: 6, mine: true },
    { emoji: "❤️", count: 3, mine: false },
    { emoji: "🎉", count: 4, mine: false },
    { emoji: "🔥", count: 2, mine: false },
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
      <div className="flex flex-wrap items-center gap-2">
        {reactions.map((r) => (
          <span
            key={r.emoji}
            className={`tabular inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm shadow-pop ${r.mine ? "border-text bg-surface font-semibold" : "border-line bg-surface text-muted"}`}
          >
            <span className="text-[15px]">{r.emoji}</span>
            {r.count}
          </span>
        ))}
        <span className="tabular ml-auto text-sm text-muted">{v.views}</span>
      </div>
    </div>
  );
}

export function Features({ price, locale = "en" }: { price: number; locale?: Locale }) {
  const t = homeCopy(locale).features;
  const v = t.v;
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-6 px-5 py-24 sm:px-8 sm:py-32">
      <SectionIntro title={t.title} body={t.body} />

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Tile className="md:col-span-2 lg:row-span-2" title={t.stop.title} body={t.stop.body}>
          <StopVisual v={v} />
        </Tile>
        <Tile className="md:col-span-2" title={t.cloud.title} body={t.cloud.body}>
          <CloudVisual v={v} />
        </Tile>
        <Tile title={t.price.title} body={fill(t.price.body, { price })}>
          <PriceVisual price={price} v={v} />
        </Tile>
        <Tile title={t.bubble.title} body={t.bubble.body}>
          <BubbleVisual />
        </Tile>
        <Tile className="md:col-span-1 lg:col-span-2" title={t.viewer.title} body={t.viewer.body}>
          <ViewerVisual v={v} />
        </Tile>
        <Tile className="md:col-span-1 lg:col-span-2" title={t.safe.title} body={t.safe.body}>
          <SafeVisual v={v} />
        </Tile>
        <Tile className="md:col-span-1 lg:col-span-2" title={t.team.title} body={t.team.body}>
          <TeamVisual v={v} />
        </Tile>
        <Tile className="md:col-span-1 lg:col-span-2" title={t.download.title} body={t.download.body}>
          <DownloadVisual v={v} />
        </Tile>
        <Tile className="md:col-span-2 lg:col-span-4" title={t.talk.title} body={t.talk.body}>
          <TalkVisual v={v} />
        </Tile>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */

type P = HomeCopy["pricing"];

function Check() {
  return (
    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-text text-canvas">
      <CheckIcon className="size-3" />
    </span>
  );
}

function Dash() {
  return (
    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-line-strong text-muted">
      <svg viewBox="0 0 12 12" className="size-2.5" fill="none" aria-hidden>
        <path d="M3 6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/** One plan: name and badge, price, a line under it, the button, then what's included. */
function PlanCard({
  name,
  badge,
  price,
  unit,
  note,
  button,
  items,
  highlight = false,
  muted = false,
}: {
  name: string;
  badge: string;
  price: number;
  unit: string;
  note: string;
  button: React.ReactNode;
  items: { text: React.ReactNode; key: string; no?: boolean }[];
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      aria-disabled={muted || undefined}
      className={`flex flex-col rounded-[24px] bg-surface p-7 sm:p-8 ${highlight ? "border-2 border-text shadow-pop" : "border border-line"} ${
        muted ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-semibold">{name}</p>
        <span
          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${highlight ? "bg-text text-canvas" : "border border-line text-muted"}`}
        >
          {badge}
        </span>
      </div>
      <p className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-[64px] leading-none" style={{ letterSpacing: "-0.03em" }}>
          ${price}
        </span>
        <span className="text-muted">{unit}</span>
      </p>
      <p className="mt-2 min-h-[3em] text-muted">{note}</p>
      <div className="mt-6">{button}</div>
      <ul className="mt-7 space-y-3 border-t border-line pt-6 text-[15px]">
        {items.map((item) => (
          <li key={item.key} className="flex items-start gap-3">
            {item.no ? <Dash /> : <Check />}
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Pricing({ price, notice, locale = "en" }: { sold?: number; price: number; notice?: React.ReactNode; locale?: Locale }) {
  const copy = homeCopy(locale);
  const t = copy.pricing;
  const s = copy.savings;
  const tiers = shownTiers();
  const lifetime = tiers.find((x) => x.tier.id !== "launch");
  const mac = tiers.find((x) => x.tier.id === "launch");
  const lifetimeOpen = lifetime?.state === "open";
  const roadmapLink = (
    <Link href="/roadmap" className="underline underline-offset-2 hover:text-muted">
      {t.tiers.first100.updates}
    </Link>
  );
  return (
    <section id="pricing" className="scroll-mt-6 border-y border-line bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionIntro title={t.title} body={t.body} />

        {notice && <div className="mx-auto mt-10 max-w-3xl">{notice}</div>}

        {/* Three plans side by side: Free, the lifetime price on sale now, the price after the Mac app. */}
        <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
          <PlanCard
            name={t.free}
            badge={t.forever}
            price={0}
            unit={t.noCard}
            note={t.freeNote}
            button={
              <a href="/start" className={buttonClass("secondary", "lg", "w-full rounded-full")}>
                {t.startFree}
              </a>
            }
            items={t.freeIncludes.map((text) => ({ key: text, text }))}
          />
          {lifetime && (
            <PlanCard
              name={t.tiers.first100.name}
              badge={t.badges[lifetime.state]}
              price={lifetime.tier.price}
              unit={t.once}
              note={t.tiers.first100.note}
              highlight={lifetimeOpen}
              button={
                lifetimeOpen ? (
                  <a href="/buy" className={buttonClass("primary", "lg", "w-full rounded-full")}>
                    {fill(t.buy, { price: lifetime.tier.price })}
                  </a>
                ) : (
                  <span className={buttonClass("secondary", "lg", "w-full cursor-default rounded-full opacity-70")}>
                    {t.badges[lifetime.state]}
                  </span>
                )
              }
              items={[
                ...t.included.map((text) => ({ key: text, text })),
                { key: "updates", text: roadmapLink },
              ]}
            />
          )}
          {mac && (
            <PlanCard
              name={t.tiers.launch.name}
              badge={t.badges[mac.state]}
              price={mac.tier.price}
              unit={t.once}
              note={t.tiers.launch.note}
              muted
              button={
                <span className={buttonClass("secondary", "lg", "w-full cursor-default rounded-full opacity-70")}>{t.laterButton}</span>
              }
              items={[
                { key: "all", text: t.macEverything },
                { key: "updates", text: t.tiers.launch.updates, no: true },
              ]}
            />
          )}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-[15px] leading-relaxed text-muted">
          {t.updatesBefore}
          <Link href="/roadmap" className="underline underline-offset-2 hover:text-text">
            {t.updatesLink}
          </Link>
          {fill(t.updatesAfter, { price: LIFETIME_PRICE, mac: MAC_PRICE })}
        </p>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-faint">{t.footnote}</p>

        {/* The Loom comparison, on its own. */}
        <div className="mx-auto mt-20 max-w-2xl">
          <h3 className="mb-6 text-center text-[28px] leading-tight sm:text-[34px]" style={{ letterSpacing: "-0.02em" }}>
            {t.savingsTitle}
          </h3>
          <Savings
            price={price}
            labels={{
              people: s.people,
              loomOver: fill(s.loomOver, { years: 3 }),
              oursEver: fill(s.oursEver, { name: site.name }),
              keeps: s.keeps,
              note: fill(s.note, {
                plan: site.loom.planName,
                price: `$${site.loom.perUserPerMonth}`,
                checked: site.loom.checked,
              }),
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

// `text` is the plain-text answer for search engines (FAQ structured data) when `a` holds links.
const faqs: { q: string; a: React.ReactNode; text?: string }[] = [
  {
    q: "Is Showthrough really free?",
    a: "Yes, free forever, with no catch. Record as many videos as you like, as long as you like: no video limit, no time limit, no watermark on the video and no card needed. Your recordings live in your own Cloudflare account, not on our servers, so they cost us nothing to keep and we never have to cap them. The paid plan is a one-time payment that adds comments and reactions, live notifications, your whole team, folders and buttons under your videos.",
  },
  {
    q: "What's the difference between Free and paid?",
    a: "Free gives you everything to record and share: unlimited recordings of any length, screen, camera and mic, share links anyone can watch, search, Recent and Watch later, and MP4 downloads. Paid, a one-time payment, adds comments and reactions with view counts, live notifications, team members with no per-seat pricing, folders, buttons under your videos, and share pages without \"Recorded with Showthrough\".",
  },
  {
    q: "Do I need a Cloudflare account?",
    a: "Yes, a free one, and connecting it is just one click. Sign in to Cloudflare, press Allow, and we handle the rest: your storage, database and video address are set up for you in about 30 seconds. Nothing to configure, no keys to copy. No Cloudflare account yet? Signing up is free.",
  },
  {
    q: "Can Showthrough see the rest of my Cloudflare account?",
    text: "No. What we keep: your Cloudflare account ID and name, the names and address of the storage, database and video app we created, and an upload key. That key only works with the Showthrough video app in your account, so our website can show your library and the extension can upload. What we don't keep: the access Cloudflare gives us when you press Allow (or Update). We use it for about 30 seconds to set up or update the Showthrough parts, then throw it away, so afterwards we can't reach anything else in your account. What we never see: your Cloudflare password, your card and billing, your websites, domains and DNS, or your other Workers, storage and databases. Cloudflare doesn't give us access to your password, card, websites or DNS at all, and we never open anything we didn't create.",
    a: (
      <>
        No. Here&rsquo;s exactly where the line is.
        <span className="mt-3 block">
          <b className="text-text">What we keep:</b> your Cloudflare account ID and name, the names and address of the storage, database and
          video app we created, and an upload key. That key only works with the Showthrough video app in your account, so our website can show
          your library and the extension can upload.
        </span>
        <span className="mt-3 block">
          <b className="text-text">What we don&rsquo;t keep:</b> the access Cloudflare gives us when you press Allow (or Update). We use it for
          about 30 seconds to set up or update the Showthrough parts, then throw it away, so afterwards we can&rsquo;t reach anything else in
          your account.
        </span>
        <span className="mt-3 block">
          <b className="text-text">What we never see:</b> your Cloudflare password, your card and billing, your websites, domains and DNS, or
          your other Workers, storage and databases. Cloudflare doesn&rsquo;t give us access to your password, card, websites or DNS at all,
          and we never open anything we didn&rsquo;t create.
        </span>
      </>
    ),
  },
  {
    q: "Will Cloudflare charge me?",
    a: "Cloudflare asks for a card before it turns on storage, but you pay nothing while you stay within the free tier: 10 GB of storage, and viewing is always free. That's about 8 hours of recordings, and you can delete old videos anytime to stay under it. Past 10 GB it's about $0.015 per GB a month, billed by Cloudflare.",
  },
  {
    q: "Where are my videos stored?",
    a: "In a private storage bucket in your own Cloudflare account. You connect it in one click and we handle the rest. Our servers never store your recordings. Share links play through a fast cache so videos start quickly for viewers anywhere.",
  },
  {
    q: "Who can watch my videos?",
    text: "Anyone you send the link to. Viewers don't need an account. Password-protected and private links are on the roadmap.",
    a: (
      <>
        Anyone you send the link to. Viewers don&rsquo;t need an account. Password-protected and private links are on the{" "}
        <Link href="/roadmap" className="underline underline-offset-2 hover:text-text">
          roadmap
        </Link>
        .
      </>
    ),
  },
  {
    q: "Does it work on Windows and Chromebooks?",
    text: "Yes. Showthrough is a Chrome extension, so it works anywhere Chrome runs: Mac, Windows, Linux and ChromeOS.",
    a: (
      <>
        Yes. Showthrough is a{" "}
        <a href={site.chromeStoreUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-text">
          Chrome extension
        </a>
        , so it works anywhere Chrome runs: Mac, Windows, Linux and ChromeOS.
      </>
    ),
  },
  {
    q: "Will the price go up?",
    a: `Yes. Right now the paid plan is $${LIFETIME_PRICE} once, with every future update included, forever. Once the Mac app is live, the price goes to $${MAC_PRICE}, and future updates may be paid for people who buy then. Buy at $${LIFETIME_PRICE} now and you keep every update. Whatever you buy keeps working.`,
  },
  {
    q: "Is it a subscription?",
    a: "No. Showthrough is free forever, and the paid plan is a one-time payment that covers your whole team: invite as many people as you like. The only other cost is Cloudflare storage if you go past their free 10 GB, billed to your own Cloudflare account.",
  },
  {
    q: "Can I get a refund?",
    text: `Yes, within 7 days of buying. Email ${site.contactEmail} from the address you bought with and we'll refund you, back to your original payment method. After 7 days, purchases can't be refunded.`,
    a: (
      <>
        Yes, within 7 days of buying. Email{" "}
        <a href={`mailto:${site.contactEmail}`} className="underline underline-offset-2 hover:text-text">
          {site.contactEmail}
        </a>{" "}
        from the address you bought with and we&rsquo;ll refund you, back to your original payment method. After 7 days, purchases
        can&rsquo;t be refunded. Details are in the{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-text">
          terms
        </Link>
        .
      </>
    ),
  },
  {
    q: "When can I start recording?",
    text: "Right now, for free. Sign in with Google, add the Chrome extension, connect your Cloudflare from the dashboard (one click, we handle the rest), and click the Showthrough icon to record.",
    a: (
      <>
        Right now, for free. Sign in with Google, add the{" "}
        <a href={site.chromeStoreUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-text">
          Chrome extension
        </a>
        , connect your Cloudflare from the dashboard (one click, we handle the rest), and click the Showthrough icon to record.
      </>
    ),
  },
];

/** The FAQ as plain text, for FAQPage structured data. */
export const faqText = faqs.map((item) => ({ q: item.q, a: item.text ?? String(item.a) }));

export function Faq({ locale = "en" }: { locale?: Locale } = {}) {
  const copy = homeCopy(locale);
  const items: { q: string; a: React.ReactNode }[] = locale === "en" ? faqs : copy.faqs;
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-6 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-[40px] leading-[1.04] sm:text-[56px]" style={{ letterSpacing: "-0.025em" }}>
            {copy.faqTitle}
          </h2>
        </div>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {items.map((item) => (
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

export function FinalCta({ price, locale = "en" }: { price: number; locale?: Locale }) {
  const t = homeCopy(locale).cta;
  return (
    <section className="px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center rounded-[28px] bg-text px-6 py-20 text-center text-canvas sm:rounded-[32px] sm:py-28">
        <h2 className="max-w-[16ch] text-[44px] leading-[1.02] sm:text-[72px]" style={{ letterSpacing: "-0.03em" }}>
          {t.title}
        </h2>
        <p className="mt-6 max-w-[50ch] text-lg leading-relaxed opacity-75">
          {fill(t.body, { price })}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="/start"
            className="inline-flex h-13 items-center rounded-full bg-canvas px-8 text-base font-semibold text-text shadow-pop transition-opacity hover:opacity-90"
          >
            {t.start}
          </a>
          <a
            href="/buy"
            className="inline-flex h-13 items-center rounded-full border border-canvas/30 px-8 text-base font-semibold text-canvas transition-colors hover:bg-canvas/10"
          >
            {fill(t.buy, { price })}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function footerColumns(locale: Locale) {
  const t = homeCopy(locale).footer;
  const home = locale === "en" ? "" : localePath(locale, "/");
  return [
    {
      key: "product",
      title: t.product,
      links: [
        { href: `${home}/#how`, label: t.features },
        { href: locale === "en" ? "/pricing" : `${home}/#pricing`, label: t.pricing },
        { href: `${home}/#faq`, label: t.faq },
        { href: "/roadmap", label: t.roadmap },
        { href: "/blog", label: t.blog },
        { href: localePath(locale, "/guide"), label: t.guide },
        { href: "/guide/team", label: t.teamGuide },
        { href: "/support", label: t.support },
      ],
    },
    {
      key: "compare",
      title: t.compare,
      links: [
        { href: "/alternatives/loom", label: t.loomAlt },
        { href: "/alternatives/cap", label: t.capAlt },
        { href: "/alternatives/vidyard", label: t.vidyardAlt },
        { href: "/alternatives/screencastify", label: t.screencastifyAlt },
        { href: "/alternatives", label: t.allAlts },
      ],
    },
    {
      key: "company",
      title: t.company,
      links: [
        { href: "/about", label: t.about },
        { href: localePath(locale, "/privacy"), label: t.privacy },
        { href: localePath(locale, "/terms"), label: t.terms },
      ],
    },
  ];
}

/**
 * The footer. `path` is the current page's path without a language prefix ("/", "/privacy"…)
 * when the page exists in every language, so the language links go to the same page.
 */
export function SiteFooter({ locale = "en", path }: { locale?: Locale; path?: string } = {}) {
  const t = homeCopy(locale).footer;
  return (
    <footer className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-8">
      <div className="flex flex-col justify-between gap-10 sm:flex-row">
        <div className="max-w-xs">
          <Link href={localePath(locale, "/")} className="flex items-center gap-2.5 font-semibold">
            <LogoMark className="size-7" />
            <span className="text-[17px]">{site.name}</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.tagline}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-8 text-sm sm:grid-cols-3">
          {footerColumns(locale).map((column) => (
            <div key={column.key} className="flex flex-col gap-3">
              <p className="font-semibold">{column.title}</p>
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="text-muted hover:text-text">
                  {link.label}
                </Link>
              ))}
              {column.key === "company" && <CookieSettingsLink label={ui[locale].cookie.settings} className="text-left text-muted hover:text-text" />}
            </div>
          ))}
        </nav>
      </div>
      <nav aria-label={t.language} className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="font-semibold">{t.language}</span>
        {locales.map((l) => (
          <Link
            key={l}
            href={localePath(l, path ?? "/")}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "true" : undefined}
            className={l === locale ? "font-semibold text-text" : "text-muted hover:text-text"}
          >
            {localeNames[l]}
          </Link>
        ))}
      </nav>
      <div className="mt-6 flex flex-col justify-between gap-2 border-t border-line pt-6 text-sm text-faint sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>{t.notAffiliated}</p>
      </div>
    </footer>
  );
}
