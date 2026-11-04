"use client";

import Hls from "hls.js";
import Link from "next/link";
import { buttonClass } from "@/components/ui";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { site } from "@/lib/site";

type Status = "loading" | "ready" | "live" | "missing" | "blocked" | "unsupported";

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function readSource(hash: string | null): string | null | undefined {
  if (hash === null) return undefined; // server render: not known yet
  const src = new URLSearchParams(hash.replace(/^#/, "")).get("src");
  if (!src) return null;
  try {
    const url = new URL(src);
    return url.protocol === "https:" || url.hostname === "localhost" ? url.toString() : null;
  } catch {
    return null;
  }
}

const messages: Record<Exclude<Status, "loading" | "ready" | "live">, { title: string; body: string }> = {
  missing: {
    title: "This video isn't available",
    body: "The link may be incomplete, or the video was deleted. Ask the person who sent it for a new link.",
  },
  blocked: {
    title: "This video can't be loaded",
    body: "The storage it lives in isn't allowing this page to play it. If it's your video, check your bucket's CORS settings.",
  },
  unsupported: {
    title: "This browser can't play the video",
    body: "Try opening the link in Chrome, Safari, Edge or Firefox.",
  },
};

type Meta = { title?: string | null; createdAt?: number | null; durationSec?: number | null };

function recordedAgo(ms: number) {
  const minutes = Math.round((Date.now() - ms) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

/** Plays an HLS recording. Pass `src` (short links), or it reads #src= from the URL (older links). */
export function Player({ src: srcProp, metaUrl, poster }: { src?: string; metaUrl?: string; poster?: string } = {}) {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => null);
  const src = srcProp ?? readSource(hash);
  const [meta, setMeta] = useState<Meta | null>(null);

  useEffect(() => {
    if (!metaUrl) return;
    let cancelled = false;
    fetch(metaUrl)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => !cancelled && data && setMeta(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [metaUrl]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Chrome, Firefox, Edge: hls.js. Start fetching right away so playback is instant on click.
    if (Hls.isSupported()) {
      const hls = new Hls({ startFragPrefetch: true, backBufferLength: 60 });
      hls.on(Hls.Events.LEVEL_LOADED, (_event, data) => setStatus(data.details.live ? "live" : "ready"));
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          const code = data.response?.code ?? 0;
          setStatus(code === 0 ? "blocked" : "missing");
          hls.destroy();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          setStatus("unsupported");
          hls.destroy();
        }
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }

    // Safari plays HLS natively.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      const onReady = () => setStatus("ready");
      const onError = () => setStatus("missing");
      video.addEventListener("loadedmetadata", onReady);
      video.addEventListener("error", onError);
      video.src = src;
      return () => {
        video.removeEventListener("loadedmetadata", onReady);
        video.removeEventListener("error", onError);
        video.removeAttribute("src");
        video.load();
      };
    }

    const id = window.setTimeout(() => setStatus("unsupported"), 0);
    return () => window.clearTimeout(id);
  }, [src]);

  const shown: Status = src === null ? "missing" : status;
  const problem = shown === "missing" || shown === "blocked" || shown === "unsupported" ? messages[shown] : null;

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      {meta?.title && (
        <div className="mb-5">
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em]">{meta.title}</h1>
          {meta.createdAt && <p className="mt-1 text-sm text-muted">Recorded {recordedAgo(meta.createdAt)}</p>}
        </div>
      )}
      <div className="relative aspect-video overflow-hidden rounded-panel bg-stage">
        {problem ? (
          <div role="alert" className="absolute inset-0 grid place-items-center p-8 text-center text-white">
            <div className="max-w-md">
              <h1 className="text-2xl font-semibold tracking-tight">{problem.title}</h1>
              <p className="mt-3 leading-relaxed text-white/70">{problem.body}</p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            controls
            playsInline
            preload="auto"
            poster={poster}
            className="absolute inset-0 size-full"
            aria-label="Shared screen recording"
          />
        )}
        {shown === "live" && (
          <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-sm font-semibold text-text">
            <span className="rec-dot size-2 rounded-full bg-rec" />
            Recording now
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Recorded with{" "}
          <Link href="/" className="font-semibold text-text underline decoration-line-strong underline-offset-4 hover:decoration-brand">
            {site.name}
          </Link>
          . Stored in the sender&rsquo;s own cloud.
        </p>
        {!problem && (
          <button
            type="button"
            onClick={copyLink}
            className={buttonClass("primary", "md")}
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
        )}
      </div>
    </div>
  );
}
