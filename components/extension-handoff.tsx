"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";
import { site } from "@/lib/site";

export type ExtensionConfig = {
  version: 1;
  email: string;
  space: string;
  uploadUrl: string;
  uploadKey: string;
  mediaBase: string;
  playerBase: string;
};

// The Showthrough extension runs a tiny script on this page only. We hand it the
// account settings through window messages, and it confirms when they're saved.
export function ExtensionHandoff({ config }: { config: ExtensionConfig }) {
  const [status, setStatus] = useState<"waiting" | "connected" | "missing">("waiting");

  useEffect(() => {
    let done = false;
    const send = () => window.postMessage({ type: "showthrough:config", config }, window.location.origin);
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window || event.origin !== window.location.origin) return;
      if (event.data?.type === "showthrough:connected" && !done) {
        done = true;
        setStatus("connected");
        fetch("/api/extension/connected", { method: "POST" }).catch(() => {});
      }
    };
    window.addEventListener("message", onMessage);
    send();
    const retry = window.setInterval(() => !done && send(), 1000);
    const giveUp = window.setTimeout(() => !done && setStatus("missing"), 4000);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(retry);
      window.clearTimeout(giveUp);
    };
  }, [config]);

  if (status === "connected") {
    return (
      <div role="status">
        <span className="grid size-12 place-items-center rounded-full bg-success text-white">
          <svg viewBox="0 0 20 20" fill="none" className="size-6" aria-hidden>
            <path d="M5 10.5l3.2 3.2L15 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="mt-6 text-[28px] font-bold tracking-[-0.02em]">Extension connected</h1>
        <p className="mt-2 text-muted">
          Click the Showthrough icon in Chrome&rsquo;s toolbar and choose <b>Start recording</b>. Your videos go straight to your own
          Cloudflare.
        </p>
        <Link href="/dashboard" className={buttonClass("primary", "md", "mt-8")}>
          Go to your library
        </Link>
      </div>
    );
  }

  return (
    <div role="status">
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">{status === "waiting" ? "Connecting the extension…" : "Install the extension first"}</h1>
      {status === "waiting" ? (
        <p className="mt-2 text-muted">One moment.</p>
      ) : (
        <>
          <p className="mt-2 text-muted">We couldn&rsquo;t find the Showthrough extension in this browser. Install it, then this page connects it automatically.</p>
          <a href={site.chromeStoreUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md", "mt-8")}>
            Add to Chrome
          </a>
          <p className="mt-4 text-sm text-muted">Once it&rsquo;s added, come back and refresh this page.</p>
        </>
      )}
    </div>
  );
}
