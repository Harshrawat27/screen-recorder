"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckIcon, buttonClass } from "@/components/ui";

// The upgrade popup. On the free plan, paid features keep their buttons; using one opens this
// instead, listing everything the paid plan adds. Two ways in:
//   openUpgrade("comments")   from a button that knows it's locked
//   any API answering 402 with { plan: true } (lib/plan-response.ts), caught below
// <UpgradeHost /> is mounted once, in the root layout.

type Feature = "comments" | "folders" | "team" | "notifications" | "cta" | "hideBadge";

const EVENT = "showthrough:upgrade";

export function openUpgrade(feature?: Feature) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: feature ?? null }));
}

// What the paid plan adds, in the order people care about. Kept in step with lib/plan.ts.
const PERKS: { key: Feature; title: string; body: string }[] = [
  { key: "comments", title: "Comments and reactions", body: "Viewers reply at the exact moment in the video, and you see the views." },
  { key: "notifications", title: "Live notifications", body: "Know the moment someone watches, comments or reacts." },
  { key: "team", title: "Your whole team", body: "Invite people into one shared library. No per-seat pricing." },
  { key: "folders", title: "Folders", body: "Keep clients and projects apart." },
  { key: "cta", title: "Buttons under your videos", body: "Book a call, open your doc, try your product." },
  { key: "hideBadge", title: "Your share pages, without our name", body: "Turn off “Recorded with Showthrough”." },
];

const HEADLINE: Record<Feature, string> = {
  comments: "Comments and reactions come with the paid plan",
  notifications: "Live notifications come with the paid plan",
  team: "Teams come with the paid plan",
  folders: "Folders come with the paid plan",
  cta: "Buttons under videos come with the paid plan",
  hideBadge: "Hiding our name comes with the paid plan",
};

export function UpgradeHost() {
  const [open, setOpen] = useState(false);
  const [feature, setFeature] = useState<Feature | null>(null);

  useEffect(() => {
    const show = (event: Event) => {
      setFeature(((event as CustomEvent).detail as Feature | null) ?? null);
      setOpen(true);
    };
    window.addEventListener(EVENT, show);

    // Any request to our own API that's refused for the plan opens the popup too, so every
    // paid button on the site leads here without each one having to know.
    const original = window.fetch;
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const res = await original(...args);
      if (res.status === 402) {
        res
          .clone()
          .json()
          .then((data: { plan?: boolean }) => data?.plan && window.dispatchEvent(new CustomEvent(EVENT, { detail: null })))
          .catch(() => {});
      }
      return res;
    };
    return () => {
      window.removeEventListener(EVENT, show);
      window.fetch = original;
    };
  }, []);

  const first = feature ? PERKS.find((p) => p.key === feature) : null;
  const perks = first ? [first, ...PERKS.filter((p) => p !== first)] : PERKS;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-text px-2.5 py-0.5 text-xs font-semibold text-canvas">
            <span className="size-1.5 rounded-full bg-[#F35733]" />
            Paid plan
          </p>
          <DialogTitle className="mt-3">{feature ? HEADLINE[feature] : "Upgrade to get this"}</DialogTitle>
          <DialogDescription>Pay once and keep it for life. No subscription, and it covers your whole team.</DialogDescription>
        </DialogHeader>
        <ul className="mt-5 space-y-3.5">
          {perks.map((p) => (
            <li key={p.key} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-text text-canvas">
                <CheckIcon className="size-3" />
              </span>
              <span className="text-[15px] leading-snug">
                <span className="font-semibold">{p.title}.</span> <span className="text-muted">{p.body}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted">Everything you have now stays free: unlimited recording, share links, search, download.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {/* /buy signs in if needed, then goes straight to checkout. */}
          <a href="/buy" className={buttonClass("primary", "md", "rounded-full px-6")}>
            Upgrade
          </a>
          <Link href="/pricing" onClick={() => setOpen(false)} className={buttonClass("secondary", "md", "rounded-full px-6")}>
            See pricing
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
