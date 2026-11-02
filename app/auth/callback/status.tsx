"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui";
import { useSyncExternalStore } from "react";

// Cloudflare redirects here after "Allow" with ?code=…&state=… (or ?error=…).
// Exchanging the code and setting up storage happens in the browser; that step is built next.
type State = { kind: "loading" } | { kind: "connected" } | { kind: "denied" } | { kind: "error"; message: string } | { kind: "empty" };

const noop = () => () => {};

function readState(search: string | null): State {
  if (search === null) return { kind: "loading" };
  const params = new URLSearchParams(search);
  const error = params.get("error");
  if (error === "access_denied") return { kind: "denied" };
  if (error) return { kind: "error", message: params.get("error_description") ?? error };
  if (params.get("code")) return { kind: "connected" };
  return { kind: "empty" };
}

export function CallbackStatus() {
  const search = useSyncExternalStore(noop, () => window.location.search, () => null);
  const state = readState(search);

  const copy: Record<State["kind"], { title: string; body: string }> = {
    loading: { title: "Connecting Cloudflare", body: "One moment." },
    connected: {
      title: "Cloudflare is connected",
      body: "Cloudflare sent you back with permission. Automatic storage setup will run here in the next version.",
    },
    denied: {
      title: "Cloudflare wasn't connected",
      body: "You chose not to allow access. Your videos need somewhere to live, so connect Cloudflare to continue.",
    },
    error: {
      title: "Cloudflare couldn't connect",
      body: state.kind === "error" ? `Cloudflare said: ${state.message}. Try connecting again.` : "",
    },
    empty: { title: "Nothing to connect", body: "Start from the home page to connect your Cloudflare account." },
  };

  return (
    <div role="status">
      <h1 className="text-3xl font-semibold tracking-tight">{copy[state.kind].title}</h1>
      <p className="mt-3 leading-relaxed text-muted">{copy[state.kind].body}</p>
      {state.kind !== "loading" && (
        <Link href="/" className={buttonClass("primary", "md", "mt-8")}>
          Back to home
        </Link>
      )}
    </div>
  );
}
