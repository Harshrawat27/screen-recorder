"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { buttonClass } from "@/components/ui";
import { type Cta, CTA_LABEL_MAX, CTA_MAX, cleanButtons, ctaHost } from "@/lib/cta";

// The call-to-action buttons under a shared video. Each button shows, in small type, the site
// it opens. The owner adds, changes and removes them right here on the page.

const inputClass =
  "h-11 w-full min-w-0 rounded-xl border border-line bg-canvas px-3.5 text-[15px] text-text outline-none! transition-colors placeholder:text-faint focus:border-text";

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5 shrink-0">
    <path d="M5 11l6-6M6 5h5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type Row = Cta & { key: number };
let nextKey = 0;
const row = (b: Cta = { label: "", url: "" }): Row => ({ ...b, key: nextKey++ });

export function VideoCta({ space, id }: { space: string; id: string }) {
  const [state, setState] = useState<{ buttons: Cta[]; isOwner: boolean } | null>(null);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const api = `/api/v/${space}/${id}/cta`;

  useEffect(() => {
    let live = true;
    fetch(api)
      .then((res) => res.json())
      .then((data: { buttons?: Cta[]; isOwner?: boolean }) => live && setState({ buttons: data.buttons ?? [], isOwner: Boolean(data.isOwner) }))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [api]);

  if (!state || (!state.buttons.length && !state.isOwner)) return null;
  const { buttons, isOwner } = state;

  function edit() {
    setRows(buttons.length ? buttons.map((b) => row(b)) : [row()]);
    setError("");
    setOpen(true);
  }

  const update = (key: number, patch: Partial<Cta>) => setRows((list) => list.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    // Rows left completely empty are ignored, so an unused "Add another" doesn't block saving.
    const filled = rows.filter((r) => r.label.trim() || r.url.trim()).map(({ label, url }) => ({ label, url }));
    const checked = cleanButtons(filled);
    if (typeof checked === "string") return setError(checked);
    setBusy(true);
    setError("");
    try {
      const res = await fetch(api, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ buttons: filled }) });
      const data = (await res.json().catch(() => ({}))) as { buttons?: Cta[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
      setState({ buttons: data.buttons ?? [], isOwner });
      setOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {buttons.map((b, i) => (
        <a
          key={`${b.url}-${i}`}
          href={b.url}
          target="_blank"
          rel="noopener noreferrer nofollow ugc"
          title={b.url}
          className={buttonClass(i === 0 ? "primary" : "secondary", "md", "h-auto min-h-11 max-w-full py-1.5")}
        >
          <span className="flex min-w-0 flex-col items-start leading-tight">
            <span className="truncate">{b.label}</span>
            <span className="truncate text-[11.5px] font-normal opacity-60">{ctaHost(b.url)}</span>
          </span>
          <ArrowIcon />
        </a>
      ))}
      {isOwner && (
        <button type="button" onClick={edit} className={buttonClass("ghost", "sm", buttons.length ? "" : "border border-dashed border-line")}>
          {buttons.length ? (
            "Edit buttons"
          ) : (
            <>
              <span aria-hidden className="text-base leading-none">+</span> Add a button
            </>
          )}
        </button>
      )}

      <Dialog open={open} onOpenChange={(next) => !next && !busy && setOpen(false)}>
        <DialogContent className="max-w-lg">
          <form onSubmit={save}>
            <DialogHeader>
              <DialogTitle>Buttons under your video</DialogTitle>
              <DialogDescription>Book a call, try your product, read the doc. Viewers see each button and the site it opens.</DialogDescription>
            </DialogHeader>

            <div className="mt-5 max-h-[50vh] space-y-3 overflow-y-auto pr-1">
              {rows.map((r, i) => (
                <div key={r.key} className="rounded-card border border-line p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Button {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => setRows((list) => list.filter((x) => x.key !== r.key))}
                      className="text-sm text-muted hover:text-text"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-[2fr_3fr]">
                    <input
                      autoFocus={i === rows.length - 1}
                      value={r.label}
                      maxLength={CTA_LABEL_MAX}
                      onChange={(e) => update(r.key, { label: e.target.value })}
                      placeholder="Book a call"
                      aria-label={`Button ${i + 1} label`}
                      className={inputClass}
                    />
                    <input
                      value={r.url}
                      onChange={(e) => update(r.key, { url: e.target.value })}
                      placeholder="https://cal.com/you"
                      aria-label={`Button ${i + 1} link`}
                      inputMode="url"
                      autoCapitalize="off"
                      spellCheck={false}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
              {rows.length === 0 && <p className="text-sm text-muted">No buttons. Save to remove them from the video.</p>}
            </div>

            {rows.length < CTA_MAX && (
              <button type="button" onClick={() => setRows((list) => [...list, row()])} className={buttonClass("secondary", "sm", "mt-3")}>
                <span aria-hidden className="text-base leading-none">+</span> Add another button
              </button>
            )}
            {error && (
              <p role="alert" className="mt-3 text-sm text-danger">
                {error}
              </p>
            )}
            <DialogFooter>
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
