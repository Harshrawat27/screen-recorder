"use client";

import Hls from "hls.js";
import Link from "next/link";
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

export function Player() {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => null);
  const src = readSource(hash);
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
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink">
        {problem ? (
          <div role="alert" className="absolute inset-0 grid place-items-center p-8 text-center text-paper">
            <div className="max-w-md">
              <h1 className="text-2xl font-semibold tracking-tight">{problem.title}</h1>
              <p className="mt-3 leading-relaxed text-paper/70">{problem.body}</p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            controls
            playsInline
            preload="auto"
            className="absolute inset-0 size-full"
            aria-label="Shared screen recording"
          />
        )}
        {shown === "live" && (
          <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-paper px-3 py-1 text-sm font-medium">
            <span className="rec-dot size-2 rounded-full bg-rec" />
            Recording now
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate">
          Recorded with{" "}
          <Link href="/" className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
            {site.name}
          </Link>
          . Stored in the sender&rsquo;s own cloud.
        </p>
        {!problem && (
          <button
            type="button"
            onClick={copyLink}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
        )}
      </div>
    </div>
  );
}
