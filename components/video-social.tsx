"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleSignInButton } from "@/components/auth-buttons";
import { Logo } from "@/components/header";
import { Player } from "@/components/player";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClass } from "@/components/ui";
import { CtaButtons, CtaOwnerTools, useCta } from "@/components/video-cta";
import { VideoDownloads } from "@/components/video-download";
import { site } from "@/lib/site";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./video-social.css";
import { openUpgrade } from "@/components/upgrade";

// The share page. A top bar with the title, stats and every tool (Copy link, the owner's
// buttons, download and sharing, Watch later); the video with its call-to-action buttons and
// reactions under it; comments in a panel on the right. The panel's frame is drawn straight
// away with placeholder rows, so the video never jumps when comments arrive.
// Anyone can type a comment or tap a reaction; if they aren't signed in, a sign-in dialog
// opens and what they did is posted as soon as they're back.

type Comment = {
  id: string;
  name: string;
  image: string | null;
  body: string;
  atSec: number | null;
  createdAt: number;
  mine: boolean;
  canDelete: boolean;
};
type Reaction = { emoji: string; count: number; mine: boolean };
/** A reaction with the moment it was tapped, shown among the comments. */
type Moment = { key: string; name: string; image: string | null; emoji: string; atSec: number | null; mine: boolean };
type Me = { id: string; name: string; image: string | null };
type Social =
  | {
      enabled: true;
      /** The sender is on the free plan: they see the panel, and using it offers the upgrade. */
      locked?: boolean;
      isOwner: boolean;
      me: Me | null;
      views: number;
      comments: Comment[];
      reactions: Reaction[];
      moments?: Moment[];
    }
  | { enabled: false; reason: string; isOwner?: boolean; me?: Me | null };
type Pending =
  | { type: "comment"; body: string; atSec: number | null }
  | { type: "react"; emoji: string; atSec: number | null };

const REFRESH_MS = 20_000;

const clock = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rest = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${rest}` : `${m}:${rest}`;
};

function recordedAgo(ms: number) {
  const minutes = Math.round((Date.now() - ms) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function ago(ms: number) {
  const minutes = Math.round((Date.now() - ms) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ms).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

const plural = (n: number, word: string) =>
  `${n.toLocaleString()} ${word}${n === 1 ? "" : "s"}`;

function Face({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        referrerPolicy="no-referrer"
        className="size-8 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="grid size-8 shrink-0 place-items-center rounded-full bg-sunken text-[13px] font-bold"
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

export function VideoSocial({
  space,
  id,
  src,
  metaUrl,
  poster,
  finishing,
  title: initialTitle,
  createdAt: initialCreatedAt,
  commentsOn,
  badge,
}: {
  space: string;
  id: string;
  src: string;
  metaUrl: string;
  poster: string;
  finishing: boolean;
  /** From meta.json, read on the server so the top bar is there from the first paint. */
  title: string | null;
  createdAt: number | null;
  /** Whether this video's backend has comments, known on the server so the layout never jumps. */
  commentsOn: boolean;
  /** "Recorded with Showthrough": always on the free plan; paid senders can turn it off. */
  badge: boolean;
}) {
  const api = `/api/v/${space}/${id}/social`;
  const cta = useCta(space, id);
  const [meta, setMeta] = useState({ title: initialTitle, createdAt: initialCreatedAt });
  const [copied, setCopied] = useState(false);

  // A video opened right after recording may not have its title yet: keep asking for a bit.
  useEffect(() => {
    if (meta.title) return;
    let cancelled = false;
    let timer: number | undefined;
    const load = (attempt: number) => {
      fetch(metaUrl, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null)
        .then((data: { title?: string | null; createdAt?: number | null } | null) => {
          if (cancelled) return;
          if (data?.title) setMeta({ title: data.title, createdAt: data.createdAt ?? null });
          else if (attempt < 40) timer = window.setTimeout(() => load(attempt + 1), 2000);
        });
    };
    load(0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [meta.title, metaUrl]);

  async function copyLink() {
    // The clean link, without ?finishing.
    await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}`).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }
  const pendingKey = `showthrough:pending:${space}/${id}`;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const watched = useRef(new WeakSet<HTMLVideoElement>());
  const [social, setSocial] = useState<Social | null>(null);
  // Watch later: only for signed-in people whose own workspace can keep the list.
  const [later, setLater] = useState<{ enabled: boolean; saved: boolean } | null>(null);
  const signedIn = Boolean(social?.me);
  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    fetch(`/api/watch-later?space=${space}&videoId=${id}`)
      .then((res) => res.json())
      .then((data: { enabled: boolean; saved: boolean }) => !cancelled && setLater(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [signedIn, space, id]);

  async function toggleLater() {
    if (!later) return;
    const saved = !later.saved;
    setLater({ ...later, saved });
    const res = await fetch("/api/watch-later", {
      method: saved ? "POST" : "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ space, videoId: id }),
    }).catch(() => null);
    if (!res?.ok) setLater({ ...later, saved: !saved });
  }
  const [draft, setDraft] = useState("");
  const [draftAt, setDraftAt] = useState<number | null>(null);
  // The video's listeners outlive renders, so they read the draft from here.
  const draftRef = useRef("");
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [signInOpen, setSignInOpen] = useState(false);
  const [burst, setBurst] = useState<{ emoji: string; key: number } | null>(
    null,
  );
  const counted = useRef(false);
  // The comment list scrolls on its own; after posting, bring the new comment into view.
  const listRef = useRef<HTMLOListElement | null>(null);
  const scrollToComment = useRef<string | null>(null);
  useEffect(() => {
    const id = scrollToComment.current;
    if (!id || !listRef.current) return;
    scrollToComment.current = null;
    const el = listRef.current.querySelector<HTMLElement>(`[data-comment="${CSS.escape(id)}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
  const resumed = useRef(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(api, { cache: "no-store" });
      if (res.ok) setSocial((await res.json()) as Social);
    } catch {
      // Keep what's on screen; the next refresh will try again.
    }
  }, [api]);

  // First load, then refresh while the page is open, and when the tab comes back into view.
  useEffect(() => {
    const first = window.setTimeout(load, 0);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, REFRESH_MS);
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  // Opened from a notification (?c=<comment id>): bring that comment into view and flash it once.
  const linked = useRef(false);
  useEffect(() => {
    if (linked.current || !social?.enabled || !listRef.current) return;
    linked.current = true;
    const id = new URLSearchParams(window.location.search).get("c");
    const el = id ? listRef.current.querySelector<HTMLElement>(`[data-comment="${CSS.escape(id)}"]`) : null;
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.classList.add("comment-flash");
    window.setTimeout(() => el.classList.remove("comment-flash"), 2600);
  }, [social]);

  const now = () => {
    const t = videoRef.current?.currentTime;
    return typeof t === "number" && Number.isFinite(t)
      ? Math.round(t * 10) / 10
      : null;
  };

  // A view counts the first time the video starts playing.
  const onVideo = useCallback(
    (video: HTMLVideoElement | null) => {
      videoRef.current = video;
      if (!video) return;
      const onPlay = () => {
        if (counted.current) return;
        counted.current = true;
        fetch(api, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "view" }),
        })
          .then((res) => res.json())
          .then((data: { counted?: boolean; views?: number }) => {
            if (data.counted && typeof data.views === "number") {
              setSocial((s) =>
                s && s.enabled ? { ...s, views: data.views as number } : s,
              );
            }
          })
          .catch(() => {});
      };
      // While a comment is started but still empty: playing again drops its time (the next
      // comment gets a fresh one), and moving the video while paused moves the time with it.
      const onResume = () => {
        if (!draftRef.current.trim()) setDraftAt(null);
      };
      const onSeeked = () => {
        if (!draftRef.current.trim() && video.paused) setDraftAt((at) => (at === null ? at : now()));
      };
      // The player hands over the same element on every render; listen to it only once.
      if (watched.current.has(video)) return;
      watched.current.add(video);
      video.addEventListener("play", onPlay);
      video.addEventListener("play", onResume);
      video.addEventListener("seeked", onSeeked);
    },
    [api],
  );

  async function send(action: Pending): Promise<boolean> {
    const res = await fetch(api, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        action.type === "comment"
          ? { action: "comment", body: action.body, atSec: action.atSec }
          : { action: "react", emoji: action.emoji, atSec: action.atSec },
      ),
    });
    if (res.status === 401) {
      sessionStorage.setItem(pendingKey, JSON.stringify(action));
      setSignInOpen(true);
      return false;
    }
    if (!res.ok) throw new Error("Couldn't post that. Try again.");
    if (action.type === "comment") {
      const { comment } = (await res.json()) as { comment: Comment };
      setSocial((s) =>
        s && s.enabled ? { ...s, comments: [...s.comments, comment] } : s,
      );
      scrollToComment.current = comment.id;
    }
    return true;
  }

  function react(emoji: string, atSec: number | null) {
    if (social?.enabled && social.locked) return openUpgrade("comments");
    setBurst({ emoji, key: Date.now() });
    setSocial((s) =>
      s && s.enabled
        ? {
            ...s,
            reactions: s.reactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r,
            ),
            // Show it in the panel right away; the next refresh brings the saved list.
            moments: s.me
              ? [
                  ...(s.moments ?? []),
                  { key: `local-${Date.now()}`, name: s.me.name, image: s.me.image, emoji, atSec, mine: true },
                ]
              : s.moments,
          }
        : s,
    );
    send({ type: "react", emoji, atSec }).catch(() => load());
  }

  // Back from signing in: post what they were doing before the dialog opened.
  useEffect(() => {
    if (resumed.current || !social || !social.enabled || !social.me) return;
    resumed.current = true;
    const saved = sessionStorage.getItem(pendingKey);
    if (!saved) return;
    sessionStorage.removeItem(pendingKey);
    let action: Pending;
    try {
      action = JSON.parse(saved) as Pending;
    } catch {
      return;
    }
    const id = window.setTimeout(() => {
      if (action.type === "react") react(action.emoji, action.atSec);
      else
        send(action).catch(() =>
          setError("Your comment didn't post. Try again."),
        );
    }, 0);
    return () => window.clearTimeout(id);
    // Runs once, when the signed-in viewer first loads (guarded by `resumed`).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [social, pendingKey]);

  // Starting a comment pauses the video and pins the comment to that moment.
  function startDraft() {
    if (social?.enabled && social.locked) {
      (document.activeElement as HTMLElement | null)?.blur();
      return openUpgrade("comments");
    }
    if (draftAt !== null || draft) return;
    const video = videoRef.current;
    if (video && !video.paused) video.pause();
    setDraftAt(now());
  }

  function seek(sec: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = sec;
    video.play().catch(() => {});
  }

  async function submit() {
    const body = draft.trim();
    if (!body || posting) return;
    if (!social || !social.enabled) return;
    const action: Pending = { type: "comment", body, atSec: draftAt };
    if (!social.me) {
      sessionStorage.setItem(pendingKey, JSON.stringify(action));
      setSignInOpen(true);
      return;
    }
    setPosting(true);
    setError("");
    try {
      if (await send(action)) {
        setDraft("");
        setDraftAt(null);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPosting(false);
    }
  }

  function tapReaction(emoji: string) {
    if (!social || !social.enabled) return;
    const atSec = now();
    if (!social.me) {
      sessionStorage.setItem(
        pendingKey,
        JSON.stringify({ type: "react", emoji, atSec } satisfies Pending),
      );
      setSignInOpen(true);
      return;
    }
    react(emoji, atSec);
  }

  async function remove(commentId: string) {
    setSocial((s) =>
      s && s.enabled
        ? { ...s, comments: s.comments.filter((c) => c.id !== commentId) }
        : s,
    );
    await fetch(api, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "delete", commentId }),
    }).catch(() => {});
    load();
  }

  const enabled = social?.enabled === true ? social : null;
  // Comments in the order they happen in the video; general comments (no time) after.
  const comments = enabled
    ? [...enabled.comments].sort(
        (a, b) =>
          (a.atSec ?? Infinity) - (b.atSec ?? Infinity) ||
          a.createdAt - b.createdAt,
      )
    : [];
  // Comments and timed reactions together, in video order. Reactions without a time (tapped
  // before the video loaded) only count in the bar.
  const feed: ({ kind: "comment"; at: number; item: Comment } | { kind: "moment"; at: number; item: Moment })[] = [
    ...comments.map((c) => ({ kind: "comment" as const, at: c.atSec ?? Infinity, item: c })),
    ...(enabled?.moments ?? [])
      .filter((m) => m.atSec !== null)
      .map((m) => ({ kind: "moment" as const, at: m.atSec as number, item: m })),
  ].sort((a, b) => a.at - b.at);
  const statsLine = (
    <p className="flex min-h-5 flex-wrap items-center gap-x-2 text-sm text-muted">
      {/* Worked out on the server too, where the clock, time zone and date format differ:
          let the browser's version win instead of failing the whole page's hydration. */}
      {meta.createdAt && <span suppressHydrationWarning>Recorded {recordedAgo(meta.createdAt)}</span>}
      {commentsOn &&
        (enabled ? (
          <>
            {meta.createdAt && <span aria-hidden>·</span>}
            <span>{plural(enabled.views, "view")}</span>
            <span aria-hidden>·</span>
            <span>{plural(enabled.comments.length, "comment")}</span>
          </>
        ) : social === null ? (
          <span aria-hidden className="animate-pulse bg-sunken h-3.5 w-28 rounded" />
        ) : null)}
    </p>
  );

  const watchLater = later?.enabled && (
    <button
      type="button"
      onClick={toggleLater}
      aria-pressed={later.saved}
      className={buttonClass("secondary", "sm", later.saved ? "border-text bg-sunken" : "")}
    >
      <svg viewBox="0 0 24 24" fill={later.saved ? "currentColor" : "none"} aria-hidden className="size-4">
        <path
          d="M7 4h10a1.2 1.2 0 0 1 1.2 1.2V20L12 16l-6.2 4V5.2A1.2 1.2 0 0 1 7 4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      {later.saved ? "Saved for later" : "Watch later"}
    </button>
  );

  const topBar = (
    <header className="shrink-0 border-b border-line">
      <div className="px-5 py-4 sm:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          <span aria-hidden className="hidden h-6 w-px bg-line sm:block" />
          <h1 className="hidden min-w-0 flex-1 truncate text-xl font-semibold tracking-[-0.01em] sm:block">
            {meta.title || <span aria-hidden className="animate-pulse bg-sunken inline-block h-5 w-56 rounded align-middle" />}
          </h1>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <button type="button" onClick={copyLink} className={buttonClass("primary", "sm")}>
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        </div>
        {/* On phones the title gets its own line. */}
        {meta.title && <h1 className="mt-3 text-lg font-semibold leading-snug sm:hidden">{meta.title}</h1>}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 sm:mt-3">
          {statsLine}
          <div className="flex flex-wrap items-center gap-2">
            <CtaOwnerTools cta={cta} space={space} id={id} src={src} />
            {watchLater}
          </div>
        </div>
      </div>
    </header>
  );

  const reactionBar = commentsOn ? (
    <div className="mt-4 flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-line bg-surface p-1.5" aria-label="Reactions">
        {enabled
          ? enabled.reactions.map((r) => (
              <button
                key={r.emoji}
                type="button"
                onClick={() => tapReaction(r.emoji)}
                aria-label={`React with ${r.emoji}`}
                className={`relative inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[15px] transition-colors ${
                  r.mine ? "bg-sunken ring-1 ring-text" : "hover:bg-sunken"
                }`}
              >
                <span className="text-lg leading-none">{r.emoji}</span>
                {r.count > 0 && <span className="tabular text-sm font-semibold text-muted">{r.count}</span>}
                {burst?.emoji === r.emoji && (
                  <span key={burst.key} aria-hidden className="reaction-burst pointer-events-none absolute -top-2 left-1/2 text-xl">
                    {r.emoji}
                  </span>
                )}
              </button>
            ))
          : Array.from({ length: 6 }, (_, i) => <span key={i} aria-hidden className="animate-pulse bg-sunken size-10 rounded-full" />)}
      </div>
    </div>
  ) : null;

  const player = (
    <Player
      src={src}
      poster={poster}
      finishing={finishing}
      onVideo={onVideo}
      bare
      belowVideo={
        <>
          <CtaButtons cta={cta} />
          {reactionBar}
          {badge && (
          <p className="mt-6 text-sm text-muted">
            Recorded with{" "}
            <Link href="/" className="font-semibold text-text underline decoration-line-strong underline-offset-4 hover:decoration-brand">
              {site.name}
            </Link>
            . Stored in the sender&rsquo;s own cloud.
          </p>
          )}
        </>
      }
    />
  );

  const skeletonRows = (
    <ol aria-hidden className="min-h-0 flex-1 space-y-6 overflow-hidden px-5 py-5">
      {[0.9, 0.65, 0.8].map((w, i) => (
        <li key={i} className="flex gap-3">
          <span className="animate-pulse bg-sunken size-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2 pt-1">
            <span className="animate-pulse bg-sunken block h-3 w-24 rounded" />
            <span className="animate-pulse bg-sunken block h-3 rounded" style={{ width: `${w * 100}%` }} />
          </div>
        </li>
      ))}
    </ol>
  );

  const panel = (
    // On wide screens a full-height column on the right edge, under the top bar. On phones a
    // box under the video. Either way it has a fixed height, so a long conversation scrolls
    // inside it instead of growing the page.
    <aside className="mx-5 mb-10 flex h-[min(70dvh,640px)] flex-col overflow-hidden rounded-panel border border-line bg-surface sm:mx-8 lg:m-0 lg:h-auto lg:w-[380px] lg:shrink-0 lg:rounded-none lg:border-0 lg:border-l">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="text-lg">Comments</h2>
        {enabled ? (
          <span className="tabular rounded-full bg-sunken px-2.5 py-0.5 text-sm font-semibold text-muted">{enabled.comments.length}</span>
        ) : social === null ? (
          <span aria-hidden className="animate-pulse bg-sunken h-6 w-8 rounded-full" />
        ) : null}
      </div>

      {social === null ? (
        <>
          {skeletonRows}
          <div className="border-t border-line p-4">
            <div aria-hidden className="h-[66px] rounded-[14px] border border-line bg-canvas" />
            <div className="mt-2 h-8" />
          </div>
        </>
      ) : !enabled ? (
        <div className="grid flex-1 place-items-center p-6 text-center">
          <div>
            <p className="font-semibold">Comments aren&rsquo;t available right now</p>
            <p className="mt-1.5 text-sm text-muted">The video still plays. Try again in a minute.</p>
            {!social.enabled && social.isOwner && social.reason === "update" && (
              <Link href="/dashboard" className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
                Update from your dashboard
              </Link>
            )}
          </div>
        </div>
      ) : (
          <>
          <ol ref={listRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5">
            {feed.length === 0 && (
              <li className="py-10 text-center text-sm text-muted">
                No comments yet. Pause on a moment and say something about it.
              </li>
            )}
            {feed.map((entry) => {
              if (entry.kind === "moment") {
                const m = entry.item;
                return (
                  <li key={m.key} className="flex items-center gap-3">
                    <Face name={m.name} image={m.image} />
                    <p className="min-w-0 flex-1 text-sm">
                      <span className="font-semibold">{m.mine ? "You" : m.name}</span>{" "}
                      <span className="text-muted">reacted</span> <span className="text-base leading-none">{m.emoji}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => seek(m.atSec as number)}
                      className="tabular rounded-md bg-sunken px-1.5 py-0.5 text-[13px] font-semibold text-text hover:bg-line"
                      title="Jump to this moment"
                    >
                      {clock(m.atSec as number)}
                    </button>
                  </li>
                );
              }
              const c = entry.item;
              return (
              <li key={c.id} data-comment={c.id} className="group flex gap-3">
                <Face name={c.name} image={c.image} />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-xs text-faint">
                      {ago(c.createdAt)}
                    </span>
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                    {c.atSec !== null && (
                      <button
                        type="button"
                        onClick={() => seek(c.atSec as number)}
                        className="tabular mr-1.5 rounded-md bg-sunken px-1.5 py-0.5 text-[13px] font-semibold text-text hover:bg-line"
                        title="Jump to this moment"
                      >
                        {clock(c.atSec)}
                      </button>
                    )}
                    {c.body}
                  </p>
                  {c.canDelete && (
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      className="mt-1 text-xs font-medium text-faint opacity-0 transition-opacity hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
              );
            })}
          </ol>

          <form
            className="border-t border-line p-4"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="rounded-[14px] border border-line bg-canvas transition-colors focus-within:border-text/40">
              {draftAt !== null && (
                <div className="flex items-center gap-1.5 px-3 pt-2.5 text-xs text-muted">
                  <span className="tabular rounded-md bg-sunken px-1.5 py-0.5 font-semibold text-text">
                    at {clock(draftAt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDraftAt(null)}
                    className="hover:text-text"
                    aria-label="Post without a time"
                  >
                    ✕
                  </button>
                </div>
              )}
              <textarea
                value={draft}
                onChange={(e) => {
                  startDraft();
                  setDraft(e.target.value);
                }}
                onFocus={startDraft}
                // Also on click: the box may still have focus after the video was played again.
                onPointerDown={startDraft}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={2}
                maxLength={2000}
                placeholder={
                  enabled.me
                    ? "Add a comment…"
                    : "Add a comment… (you'll sign in to post)"
                }
                aria-label="Add a comment"
                className="block w-full resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none! placeholder:text-faint"
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-faint">
                Enter to post · Shift+Enter for a new line
              </p>
              <button
                type="submit"
                disabled={!draft.trim() || posting}
                className="btn-primary inline-flex h-8 items-center rounded-full bg-text px-3.5 text-[13px] font-semibold text-canvas transition-colors hover:bg-text/85 disabled:opacity-40"
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
            {error && (
              <p role="alert" className="mt-2 text-sm text-danger">
                {error}
              </p>
            )}
          </form>
        </>
        )}
    </aside>
  );

  return (
    <VideoDownloads>
      {/* Wide screens: the page fills the window. The top bar spans it, the video scrolls on
          the left and comments fill the right edge. Phones: one normal scrolling page. */}
      <div className="flex flex-col lg:h-dvh">
        {topBar}
        {commentsOn ? (
          <div className="lg:flex lg:min-h-0 lg:flex-1">
            <main className="min-w-0 px-5 pb-10 pt-6 sm:px-8 lg:flex-1 lg:overflow-y-auto lg:pb-16">
              <div className="mx-auto max-w-6xl">{player}</div>
            </main>
            {panel}
          </div>
        ) : (
          <main className="px-5 pb-16 pt-6 sm:px-8">
            <div className="mx-auto max-w-5xl">{player}</div>
          </main>
        )}
      </div>

      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to join the conversation</DialogTitle>
            <DialogDescription>
              Comments and reactions show your name, so the person who shared
              this video knows who it&rsquo;s from. We&rsquo;ll post yours as
              soon as you&rsquo;re back.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <GoogleSignInButton callbackURL={`/v/${space}/${id}`} />
          </div>
          <p className="mt-4 text-center text-xs text-faint">
            Free. No purchase needed to comment.
          </p>
        </DialogContent>
      </Dialog>
    </VideoDownloads>
  );
}
