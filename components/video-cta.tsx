"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { buttonClass } from "@/components/ui";
import { type Cta, CTA_LABEL_MAX, cleanCta, ctaHost } from "@/lib/cta";

// The call-to-action button under a shared video. Viewers see the button and where it goes;
// the owner can add, change or remove it right here on the page.

const inputClass =
  "h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-[15px] text-text outline-none! transition-colors placeholder:text-faint focus:border-text";

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
    <path d="M5 11l6-6M6 5h5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function VideoCta({ space, id }: { space: string; id: string }) {
  const [state, setState] = useState<{ cta: Cta | null; isOwner: boolean } | null>(null);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const api = `/api/v/${space}/${id}/cta`;

  useEffect(() => {
    let live = true;
    fetch(api)
      .then((res) => res.json())
      .then((data: { cta: Cta | null; isOwner: boolean }) => live && setState(data))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [api]);

  if (!state || (!state.cta && !state.isOwner)) return null;
  const { cta, isOwner } = state;

  function edit() {
    setLabel(cta?.label ?? "");
    setUrl(cta?.url ?? "");
    setError("");
    setOpen(true);
  }

  async function send(method: "PUT" | "DELETE") {
    if (method === "PUT") {
      const checked = cleanCta({ label, url });
      if (typeof checked === "string") return setError(checked);
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(api, {
        method,
        headers: { "content-type": "application/json" },
        body: method === "PUT" ? JSON.stringify({ label, url }) : undefined,
      });
      const data = (await res.json().catch(() => ({}))) as { cta?: Cta | null; error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
      setState({ cta: data.cta ?? null, isOwner });
      setOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
      {cta ? (
        <>
          <a href={cta.url} target="_blank" rel="noopener noreferrer nofollow ugc" className={buttonClass("primary", "md")}>
            {cta.label}
            <ArrowIcon />
          </a>
          <span className="text-sm text-muted">{ctaHost(cta.url)}</span>
          {isOwner && (
            <button type="button" onClick={edit} className="text-sm font-semibold text-muted underline underline-offset-2 hover:text-text">
              Edit button
            </button>
          )}
        </>
      ) : (
        <button type="button" onClick={edit} className={buttonClass("secondary", "sm")}>
          <span aria-hidden className="text-base leading-none">+</span> Add a button
        </button>
      )}

      <Dialog open={open} onOpenChange={(next) => !next && !busy && setOpen(false)}>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send("PUT");
            }}
          >
            <DialogHeader>
              <DialogTitle>{cta ? "Edit button" : "Add a button"}</DialogTitle>
              <DialogDescription>Viewers see it under your video. Use it to book a call, try your product, or anything else.</DialogDescription>
            </DialogHeader>
            <label className="mt-5 block text-sm font-semibold">
              Label
              <input
                autoFocus
                value={label}
                maxLength={CTA_LABEL_MAX}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Book a call"
                className={`mt-2 font-normal ${inputClass}`}
              />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Link
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://cal.com/you"
                inputMode="url"
                autoCapitalize="off"
                spellCheck={false}
                className={`mt-2 font-normal ${inputClass}`}
              />
            </label>
            {error && (
              <p role="alert" className="mt-3 text-sm text-danger">
                {error}
              </p>
            )}
            <DialogFooter>
              {cta && (
                <button type="button" onClick={() => send("DELETE")} disabled={busy} className={buttonClass("ghost", "md", "sm:mr-auto")}>
                  Remove button
                </button>
              )}
              <DialogClose className={buttonClass("ghost", "md")} disabled={busy}>
                Cancel
              </DialogClose>
              <button type="submit" disabled={busy} className={buttonClass("primary", "md")}>
                {busy ? "Saving…" : "Save"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
