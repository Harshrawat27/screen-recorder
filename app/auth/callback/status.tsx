"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { OAUTH_STORAGE_KEY, startCloudflareConnect } from "@/components/connect-cloudflare";
import { buttonClass } from "@/components/ui";
import { cloudflareRedirectUri } from "@/lib/config";

// Cloudflare sends people back here after "Allow" with ?code=…&state=… (or ?error=…).
type State =
  | { kind: "working" }
  | { kind: "done"; accountName: string | null }
  | { kind: "denied" }
  | { kind: "failed"; message: string; detail?: string };

const STEPS = ["Checking your Cloudflare account", "Creating private storage for your videos", "Setting up your video backend", "Turning on your video address"];

export function CallbackStatus() {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "working" });
  const [step, setStep] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    // Run after the first paint so the progress screen shows immediately.
    Promise.resolve().then(run);

    function run() {
      const params = new URLSearchParams(window.location.search);
      const fail = (message: string, detail?: string) => setState({ kind: "failed", message, detail });
      if (params.get("error") === "access_denied") return setState({ kind: "denied" });
      if (params.get("error")) return fail("Cloudflare couldn’t connect.", params.get("error_description") ?? params.get("error") ?? undefined);

      let saved: { state: string; verifier: string } | null = null;
      try {
        saved = JSON.parse(sessionStorage.getItem(OAUTH_STORAGE_KEY) ?? "null");
      } catch {
        saved = null;
      }
      const code = params.get("code");
      if (!code || !saved || saved.state !== params.get("state")) {
        return fail("This Cloudflare response doesn’t match a connection started in this browser. Start again from your dashboard.");
      }
      sessionStorage.removeItem(OAUTH_STORAGE_KEY);

      const ticker = window.setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 2500);
      fetch("/api/cloudflare/connect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, verifier: saved.verifier, redirectUri: cloudflareRedirectUri(window.location.origin) }),
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (res.status === 401) return fail("Your Showthrough session ended. Sign in, then connect Cloudflare again.");
          if (!res.ok) return fail(data.error ?? "Setup failed.", data.detail);
          setState({ kind: "done", accountName: data.accountName ?? null });
          window.setTimeout(() => router.replace("/dashboard"), 1200);
        })
        .catch(() => fail("We lost the connection while setting up. Try again."))
        .finally(() => window.clearInterval(ticker));
    }
  }, [router]);

  if (state.kind === "working" || state.kind === "done") {
    const done = state.kind === "done";
    return (
      <div role="status">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">{done ? "You’re all set" : "Setting up your Cloudflare"}</h1>
        <p className="mt-2 text-muted">
          {done
            ? `Connected${state.kind === "done" && state.accountName ? ` to ${state.accountName}` : ""}. Taking you to your dashboard…`
            : "This takes about 30 seconds. Keep this page open."}
        </p>
        <ol className="mt-8 space-y-4">
          {STEPS.map((label, i) => {
            const complete = done || i < step;
            const active = !done && i === step;
            return (
              <li key={label} className={`flex items-center gap-3 ${complete || active ? "text-text" : "text-faint"}`}>
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-full ${complete ? "bg-success text-white" : active ? "bg-brand-soft" : "bg-sunken"}`}
                >
                  {complete ? (
                    <svg viewBox="0 0 20 20" fill="none" className="size-3.5" aria-hidden>
                      <path d="M5 10.5l3.2 3.2L15 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : active ? (
                    <span className="rec-dot size-2 rounded-full bg-brand" />
                  ) : null}
                </span>
                {label}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  const failed = state.kind === "failed" ? state : null;
  return (
    <div role="alert">
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">{failed ? "Setup didn’t finish" : "Cloudflare wasn’t connected"}</h1>
      <p className="mt-2 leading-relaxed text-muted">
        {failed ? failed.message : "You chose not to allow access. Your videos need somewhere to live, so connect Cloudflare to continue."}
      </p>
      {failed?.detail && <p className="mt-3 rounded-control bg-sunken px-3 py-2 text-xs text-faint">Details: {failed.detail}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={() => startCloudflareConnect()} className={buttonClass("primary", "md")}>
          Connect again
        </button>
        <Link href="/dashboard" className={buttonClass("secondary", "md")}>
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
