"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { buttonClass } from "@/components/ui";
import { EARLY_ENDS_SHORT, INDIA_CODE, earlyOpen, tiers } from "@/lib/pricing";
import { getRegion } from "@/lib/region";

// 50% off for visitors in India (purchasing power pricing). Nothing renders until the server
// says the visitor is in India, so nobody elsewhere ever sees it, not even for a moment.
// It opens once per browser; after that, the small pill in the corner brings it back.

/** Switch: set to true to show the India offer again. Everything else stays wired up. */
const ENABLED = false;

const SEEN = "st_india_offer"; // "seen" once the dialog has been shown
const HIDDEN_ON = ["/dashboard", "/v/", "/embed/", "/record", "/extension", "/appsumo", "/login", "/auth"];

export function IndiaOffer() {
  const pathname = usePathname();
  const [india, setIndia] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const hidden = !ENABLED || HIDDEN_ON.some((p) => pathname.startsWith(p)) || !earlyOpen();

  useEffect(() => {
    if (hidden) return;
    let live = true;
    getRegion().then((region) => {
      if (!live || region.country !== "IN") return;
      setIndia(true);
      let seen = false;
      try {
        seen = localStorage.getItem(SEEN) === "seen";
        localStorage.setItem(SEEN, "seen");
      } catch {}
      if (!seen) setTimeout(() => live && setOpen(true), 1200);
    });
    return () => {
      live = false;
    };
  }, [hidden]);

  if (hidden || !india) return null;
  const price = tiers.find((t) => t.id === "first100")?.price ?? 39;
  const discounted = (price / 2).toFixed(2).replace(/\.00$/, "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INDIA_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 left-4 z-40 rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-semibold shadow-pop transition-colors hover:bg-sunken"
        >
          🇮🇳 50% off for India
        </button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hey India 🇮🇳</DialogTitle>
            <DialogDescription>
              Dollar prices hit harder here, so Showthrough is half price for you. Use this code at checkout.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-card border border-dashed border-line-strong bg-sunken px-4 py-3">
            <span className="font-mono text-xl font-semibold tracking-wider">{INDIA_CODE}</span>
            <button type="button" onClick={copy} className={buttonClass("secondary", "sm")}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl leading-none">${discounted}</span>
            <span className="text-muted line-through">${price}</span>
            <span className="text-sm text-muted">once, with lifetime updates · until {EARLY_ENDS_SHORT}</span>
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose className={buttonClass("ghost", "md")}>Maybe later</DialogClose>
            <a href={`/buy?code=${INDIA_CODE}`} className={buttonClass("primary", "md")}>
              Buy for ${discounted}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
