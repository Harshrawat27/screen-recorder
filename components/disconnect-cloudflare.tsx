"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { buttonClass } from "@/components/ui";

// "Disconnect Cloudflare" on the profile page. It asks the person to type "disconnect" first,
// because their library and share links stop working here until they connect again.

const WORD = "disconnect";

export function DisconnectCloudflare({ accountName, email }: { accountName: string | null; email: string }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const ready = typed.trim().toLowerCase() === WORD;

  async function disconnect(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/cloudflare/disconnect", { method: "POST" });
      if (!res.ok) throw new Error();
      // Tell the extension (if it's installed) to forget this connection too.
      window.postMessage({ type: "showthrough:disconnected", email }, window.location.origin);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Couldn't disconnect. Try again in a moment.");
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 max-w-xl rounded-panel border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-xl">Cloudflare connection</h2>
      <p className="mt-1.5 text-muted">
        Your videos are saved to {accountName ? <span className="font-semibold text-text">{accountName}</span> : "your Cloudflare account"}.
      </p>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass("danger", "md", "mt-5")}>
        Disconnect Cloudflare
      </button>

      <Dialog
        open={open}
        onOpenChange={(next) => !next && !busy && setOpen(false)}
        onOpenChangeComplete={(isOpen) => {
          if (!isOpen) {
            setTyped("");
            setError("");
          }
        }}
      >
        <DialogContent>
          <form onSubmit={disconnect}>
            <DialogHeader>
              <DialogTitle>Disconnect Cloudflare?</DialogTitle>
              <DialogDescription>Nothing is deleted. Your videos stay in your own Cloudflare.</DialogDescription>
            </DialogHeader>
            <ul className="mt-5 space-y-2 text-[15px] leading-relaxed">
              <li className="flex gap-2.5">
                <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-faint" />
                Your library here will be empty and share links won&rsquo;t open until you connect again.
              </li>
              <li className="flex gap-2.5">
                <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-faint" />
                The extension stops recording. Connect it again from your library afterwards.
              </li>
              <li className="flex gap-2.5">
                <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-faint" />
                Connect the same Cloudflare account later and everything comes back, links included.
              </li>
            </ul>
            <label className="mt-6 block text-sm text-muted">
              Type <span className="font-semibold text-text">{WORD}</span> to confirm
              <input
                autoFocus
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="mt-2 h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-[15px] text-text outline-none! transition-colors placeholder:text-faint focus:border-text"
              />
            </label>
            {error && (
              <p role="alert" className="mt-2 text-sm text-danger">
                {error}
              </p>
            )}
            <DialogFooter>
              <DialogClose className={buttonClass("ghost", "md")} disabled={busy}>
                Cancel
              </DialogClose>
              <button type="submit" disabled={!ready || busy} className={buttonClass("danger", "md", "disabled:opacity-40")}>
                {busy ? "Disconnecting…" : "Disconnect"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
