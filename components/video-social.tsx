"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleSignInButton } from "@/components/auth-buttons";
import { Player } from "@/components/player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./video-social.css";

// The share page: the video on the left, comments on the right, reactions under the video.
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
type Me = { id: string; name: string; image: string | null };
type Social =
  | {
      enabled: true;
      isOwner: boolean;
      me: Me | null;
      views: number;
      comments: Comment[];
      reactions: Reaction[];
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
}: {
  space: string;
  id: string;
  src: string;
  metaUrl: string;
  poster: string;
  finishing: boolean;
}) {
  const api = `/api/v/${space}/${id}/social`;
  const pendingKey = `showthrough:pending:${space}/${id}`;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [social, setSocial] = useState<Social | null>(null);
  const [draft, setDraft] = useState("");
  const [draftAt, setDraftAt] = useState<number | null>(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [signInOpen, setSignInOpen] = useState(false);
  const [burst, setBurst] = useState<{ emoji: string; key: number } | null>(
    null,
  );
  const counted = useRef(false);
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
      video.addEventListener("play", onPlay);
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
    }
    return true;
  }

  function react(emoji: string, atSec: number | null) {
    setBurst({ emoji, key: Date.now() });
    setSocial((s) =>
      s && s.enabled
        ? {
            ...s,
            reactions: s.reactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r,
            ),
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

  function startDraft() {
    if (draftAt === null && !draft) setDraftAt(now());
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
  const showPanel =
    Boolean(enabled) ||
    (social && !social.enabled && social.isOwner && social.reason === "update");

  const stats = enabled ? (
    <span>
      {plural(enabled.views, "view")} ·{" "}
      {plural(enabled.comments.length, "comment")}
    </span>
  ) : null;

  const reactionBar = enabled ? (
    <div
      className="mt-4 flex flex-wrap items-center gap-2"
      aria-label="Reactions"
    >
      {enabled.reactions.map((r) => (
        <button
          key={r.emoji}
          type="button"
          onClick={() => tapReaction(r.emoji)}
          aria-label={`React with ${r.emoji}`}
          className={`relative inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-[15px] transition-colors ${
            r.mine
              ? "border-text bg-sunken"
              : "border-line bg-surface hover:border-line-strong hover:bg-sunken"
          }`}
        >
          <span className="text-lg leading-none">{r.emoji}</span>
          {r.count > 0 && (
            <span className="tabular text-sm font-semibold text-muted">
              {r.count}
            </span>
          )}
          {burst?.emoji === r.emoji && (
            <span
              key={burst.key}
              aria-hidden
              className="reaction-burst pointer-events-none absolute -top-2 left-1/2 text-xl"
            >
              {r.emoji}
            </span>
          )}
        </button>
      ))}
    </div>
  ) : null;

  const player = (
    <Player
      src={src}
      metaUrl={metaUrl}
      poster={poster}
      finishing={finishing}
      onVideo={onVideo}
      stats={stats}
      belowVideo={reactionBar}
    />
  );

  if (!showPanel) return player;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0">{player}</div>

      <aside className="flex max-h-[calc(100dvh-7rem)] min-h-[420px] flex-col overflow-hidden rounded-panel border border-line bg-surface lg:sticky lg:top-6">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg">Comments</h2>
          {enabled && (
            <span className="tabular rounded-full bg-sunken px-2.5 py-0.5 text-sm font-semibold text-muted">
              {enabled.comments.length}
            </span>
          )}
        </div>

        {!enabled ? (
          <div className="grid flex-1 place-items-center p-6 text-center">
            <div>
              <p className="font-semibold">Turn on comments and reactions</p>
              <p className="mt-1.5 text-sm text-muted">
                Update your Showthrough backend from the dashboard. It takes
                about 10 seconds.
              </p>
              <Link
                href="/dashboard"
                className="mt-4 inline-block text-sm font-semibold underline underline-offset-4"
              >
                Open dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ol className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {comments.length === 0 && (
                <li className="py-10 text-center text-sm text-muted">
                  No comments yet. Pause on a moment and say something about it.
                </li>
              )}
              {comments.map((c) => (
                <li key={c.id} className="group flex gap-3">
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
              ))}
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
    </div>
  );
}
