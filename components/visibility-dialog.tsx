"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/** Someone in the team, for "Who can see this". */
export type TeamPerson = { id: string; name: string; email: string };
export type Visibility = "team" | "chosen";

/**
 * "Who can see this": the whole team (the default), or only chosen teammates. The admin and
 * whoever recorded it can always see it. This is about finding it in the dashboard; anyone
 * with the share link can still watch. Used in the library and on the video page.
 */
export function VisibilityDialog({
  title,
  recordedBy,
  team,
  initial,
  saveUrl,
  open,
  onClose,
  onSaved,
}: {
  title: string;
  recordedBy?: string | null;
  team: { people: TeamPerson[]; ownerId: string };
  initial: { visibility?: Visibility; sharedWith?: string[] };
  /** PATCHed with { visibility, sharedWith }. */
  saveUrl: string;
  open: boolean;
  onClose: () => void;
  onSaved: (visibility: Visibility, sharedWith: string[]) => void;
}) {
  const [visibility, setVisibility] = useState<Visibility>(initial.visibility ?? "team");
  const [chosen, setChosen] = useState<Set<string>>(() => new Set(initial.sharedWith ?? []));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The admin and the recorder always see it, so they aren't in the list.
  const people = team.people.filter((p) => p.id !== team.ownerId && p.id !== recordedBy);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const sharedWith = visibility === "chosen" ? [...chosen] : [];
    try {
      const res = await fetch(saveUrl, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ visibility, sharedWith }),
      });
      if (!res.ok) throw new Error();
      onSaved(visibility, sharedWith);
      onClose();
    } catch {
      setError("Couldn’t save. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const option = (value: 'team' | 'chosen', title: string, body: string) => (
    <label
      className={`flex cursor-pointer gap-3 rounded-card border p-3.5 transition-colors ${
        visibility === value ? 'border-text bg-sunken' : 'border-line hover:bg-sunken/60'
      }`}
    >
      <input
        type='radio'
        name='visibility'
        checked={visibility === value}
        onChange={() => setVisibility(value)}
        className='mt-1 accent-[var(--color-text)]'
      />
      <span>
        <span className='block font-semibold'>{title}</span>
        <span className='block text-sm text-muted'>{body}</span>
      </span>
    </label>
  );

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !busy && onClose()}>
      <DialogContent>
        <form onSubmit={save}>
          <DialogHeader>
            <DialogTitle>Who can see this</DialogTitle>
            <DialogDescription>
              Who can find &ldquo;{title}&rdquo; in their dashboard. Anyone
              you send the link to can still watch it.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-5 space-y-2'>
            {option('team', 'Everyone on the team', 'Teammates can find it in your library.')}
            {option('chosen', 'Only people I choose', 'Your admin and the people you pick.')}
          </div>
          {visibility === 'chosen' && (
            <div className='mt-3 max-h-56 space-y-1 overflow-y-auto rounded-card border border-line p-2'>
              {people.length ? (
                people.map((p) => (
                  <label
                    key={p.id}
                    className='flex cursor-pointer items-center gap-3 rounded-control px-2 py-2 hover:bg-sunken'
                  >
                    <input
                      type='checkbox'
                      checked={chosen.has(p.id)}
                      onChange={() =>
                        setChosen((prev) => {
                          const next = new Set(prev);
                          if (next.has(p.id)) next.delete(p.id);
                          else next.add(p.id);
                          return next;
                        })
                      }
                      className='accent-[var(--color-text)]'
                    />
                    <span className='min-w-0'>
                      <span className='block truncate text-sm font-semibold'>{p.name}</span>
                      <span className='block truncate text-xs text-muted'>{p.email}</span>
                    </span>
                  </label>
                ))
              ) : (
                <p className='px-2 py-2 text-sm text-muted'>
                  No one else to choose yet. Only you and your admin will see it.
                </p>
              )}
            </div>
          )}
          {error && (
            <p role='alert' className='mt-3 text-sm text-danger'>
              {error}
            </p>
          )}
          <DialogFooter>
            <DialogClose className={buttonClass('ghost', 'md')} disabled={busy}>
              Cancel
            </DialogClose>
            <button type='submit' disabled={busy} className={buttonClass('primary', 'md')}>
              {busy ? 'Saving…' : 'Save'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
