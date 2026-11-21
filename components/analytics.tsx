"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { PostHog } from "posthog-js";
import { POSTHOG_KEY, POSTHOG_UI, untracked } from "@/lib/analytics";

// PostHog in the browser, and the cookie banner.
//   Europe (EU, EEA, UK, Switzerland): nothing loads until the visitor chooses Allow.
//   Everyone else: it loads straight away; "Cookie settings" in the footer turns it off.
// It never loads on shared video pages (/v/...). PostHog's code is fetched only when it's
// about to run, so it doesn't slow the first paint. Typing is hidden in session replays.

const CHOICE = "st_analytics"; // "yes" | "no", saved in this browser
const OPEN_SETTINGS = "showthrough:cookie-settings";

let ph: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;
let userId: string | null = null;

function saved(): "yes" | "no" | null {
  try {
    const v = localStorage.getItem(CHOICE);
    return v === "yes" || v === "no" ? v : null;
  } catch {
    return null;
  }
}

function save(choice: "yes" | "no") {
  try {
    localStorage.setItem(CHOICE, choice);
  } catch {}
}

function start(): Promise<PostHog | null> {
  if (ph) {
    if (ph.has_opted_out_capturing()) ph.opt_in_capturing();
    return Promise.resolve(ph);
  }
  loading ??= import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: POSTHOG_UI,
        defaults: "2026-01-30",
        person_profiles: "identified_only",
        session_recording: { maskAllInputs: true },
        // A visitor who moves on to a shared video stops being tracked there.
        before_send: (event) => {
          const url = event?.properties?.$current_url;
          if (typeof url === "string" && untracked(new URL(url, location.origin).pathname)) return null;
          return event;
        },
      });
      if (posthog.has_opted_out_capturing()) posthog.opt_in_capturing();
      if (userId) posthog.identify(userId);
      ph = posthog;
      return posthog;
    })
    .catch(() => null);
  return loading;
}

function stop() {
  if (ph) {
    ph.opt_out_capturing();
    ph.stopSessionRecording();
  }
  // Remove PostHog's cookie and saved data from this browser.
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (name.startsWith("ph_")) {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname.replace(/^www\./, "")}`;
    }
  }
  try {
    for (const key of Object.keys(localStorage)) if (key.startsWith("ph_")) localStorage.removeItem(key);
  } catch {}
}

/** Links this browser's visits to a signed-in account (by its internal id, never the email). */
export function AnalyticsIdentify({ id }: { id: string }) {
  useEffect(() => {
    userId = id;
    if (ph && !ph.has_opted_out_capturing()) ph.identify(id);
  }, [id]);
  return null;
}

/** Call on sign-out, so the next person on this computer starts fresh. */
export function resetAnalytics() {
  userId = null;
  ph?.reset();
}

/** "Cookie settings" in the footer: reopens the banner. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS))}>
      Cookie settings
    </button>
  );
}

export function Analytics() {
  const pathname = usePathname();
  const [banner, setBanner] = useState(false);
  const skip = untracked(pathname);

  useEffect(() => {
    if (skip) return;
    const choice = saved();
    if (choice === "yes") return void start();
    if (choice === "no") return;
    let live = true;
    fetch("/api/consent-region")
      .then((res) => res.json())
      .then((data: { ask?: boolean }) => {
        if (!live) return;
        if (data.ask) setBanner(true);
        else start();
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [skip]);

  useEffect(() => {
    const open = () => setBanner(true);
    window.addEventListener(OPEN_SETTINGS, open);
    return () => window.removeEventListener(OPEN_SETTINGS, open);
  }, []);

  if (!banner) return null;

  const choose = (choice: "yes" | "no") => {
    save(choice);
    setBanner(false);
    if (choice === "yes" && !skip) start();
    else if (choice === "no") stop();
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie settings"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-card border border-line bg-surface p-4 text-sm shadow-pop sm:left-auto sm:right-5 sm:bottom-5"
    >
      <p className="leading-relaxed text-muted">
        We use cookies to see how people use our website, so we can make it better. No ads.{" "}
        <Link href="/privacy#analytics" className="font-medium text-text underline underline-offset-2">
          Privacy
        </Link>
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => choose("no")}
          className="h-9 rounded-control px-3.5 font-semibold text-muted transition-colors hover:bg-sunken hover:text-text"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose("yes")}
          className="h-9 rounded-control bg-text px-3.5 font-semibold text-canvas transition-colors hover:bg-text/85"
        >
          Allow
        </button>
      </div>
    </div>
  );
}
