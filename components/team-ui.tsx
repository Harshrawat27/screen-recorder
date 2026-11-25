"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { buttonClass } from "@/components/ui";
import { resetAnalytics } from "@/components/analytics";
import { authClient } from "@/lib/auth-client";

// The interactive parts of teams: joining, inviting, removing people and leaving.

const inputClass =
  "h-11 w-full min-w-0 rounded-xl border border-line bg-canvas px-3.5 text-[15px] text-text outline-none! transition-colors placeholder:text-faint focus:border-text";

async function call(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string } & Record<string, unknown>;
  if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
  return data;
}

/** "Join team" on an invite link. */
export function JoinTeamButton({ token }: { token: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function join() {
    setBusy(true);
    setError("");
    try {
      await call("/api/team/join", "POST", { token });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }
  return (
    <>
      <button type="button" onClick={join} disabled={busy} className={buttonClass("primary", "md", "mt-8 w-full")}>
        {busy ? "Joining…" : "Join team"}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
    </>
  );
}

function CopyButton({ text, label = "Copy link" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className={buttonClass("secondary", "sm")}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

export type PendingInvite = { token: string; email: string; link: string };

/** Invite by email: makes a link to send them, and lists invites nobody has used yet. */
export function TeamInvites({ initial }: { initial: PendingInvite[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState(initial);
  const [fresh, setFresh] = useState<PendingInvite | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function invite(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const { invite } = (await call("/api/team/invites", "POST", { email })) as unknown as { invite: PendingInvite };
      setInvites((list) => [invite, ...list.filter((i) => i.token !== invite.token)]);
      setFresh(invite);
      setEmail("");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function cancel(token: string) {
    setInvites((list) => list.filter((i) => i.token !== token));
    if (fresh?.token === token) setFresh(null);
    await call("/api/team/invites", "DELETE", { token }).catch(() => router.refresh());
  }

  return (
    <section className="mt-8 max-w-3xl rounded-panel border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-xl">Invite someone</h2>
      <p className="mt-1.5 text-muted">
        They sign in with this email and record with their own account. Their videos go to your Cloudflare. No extra cost.
      </p>
      <form onSubmit={invite} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teammate@company.com"
          aria-label="Their email"
          className={inputClass}
        />
        <button type="submit" disabled={busy || !email.trim()} className={buttonClass("primary", "md", "shrink-0")}>
          {busy ? "Creating…" : "Create invite"}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
      {fresh && (
        <div className="mt-4 rounded-card border border-line bg-sunken p-4">
          <p className="text-sm font-semibold">Send this link to {fresh.email}</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-control bg-canvas px-3 py-2 text-[13px]">{fresh.link}</code>
            <CopyButton text={fresh.link} />
          </div>
          <p className="mt-2 text-xs text-muted">Only {fresh.email} can use it.</p>
        </div>
      )}
      {invites.length > 0 && (
        <div className="mt-6 border-t border-line pt-5">
          <p className="text-sm font-semibold">Waiting to join</p>
          <ul className="mt-2 divide-y divide-line">
            {invites.map((i) => (
              <li key={i.token} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span className="min-w-0 truncate text-[15px]">{i.email}</span>
                <span className="flex gap-2">
                  <CopyButton text={i.link} />
                  <button type="button" onClick={() => cancel(i.token)} className={buttonClass("ghost", "sm")}>
                    Cancel
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** A confirm dialog with one destructive action. */
function Confirm({
  open,
  onClose,
  title,
  body,
  action,
  run,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  body: string;
  action: string;
  run: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <Dialog open={open} onOpenChange={(next) => !next && !busy && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{body}</DialogDescription>
        </DialogHeader>
        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}
        <DialogFooter>
          <DialogClose className={buttonClass("ghost", "md")} disabled={busy}>
            Cancel
          </DialogClose>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                await run();
              } catch (err) {
                setError((err as Error).message);
                setBusy(false);
              }
            }}
            className={buttonClass("danger", "md")}
          >
            {busy ? "Working…" : action}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** "Remove" next to a member, for the admin. */
export function RemoveMemberButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass("ghost", "sm")}>
        Remove
      </button>
      <Confirm
        open={open}
        onClose={() => setOpen(false)}
        title={`Remove ${name}?`}
        body="Their extension stops working right away. The videos they recorded stay in your Cloudflare, and you can still see them."
        action="Remove"
        run={async () => {
          await call(`/api/team/members/${encodeURIComponent(id)}`, "DELETE");
          setOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}

/** "Leave team", for members. */
export function LeaveTeamButton({ admin, ownerId, space }: { admin: string; ownerId: string; space: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass("danger", "md")}>
        Leave team
      </button>
      <Confirm
        open={open}
        onClose={() => setOpen(false)}
        title="Leave this team?"
        body={`Your extension stops recording to ${admin}'s Cloudflare right away. The videos you made stay there; ${admin} can still see them.`}
        action="Leave team"
        run={async () => {
          await call("/api/team/leave", "POST", { ownerId });
          // Tell the extension (if it's installed) to forget this team's connection.
          window.postMessage({ type: "showthrough:forget", space }, window.location.origin);
          setOpen(false);
          router.push("/dashboard");
          router.refresh();
        }}
      />
    </>
  );
}

/** Signs out and comes back to the same invite, so they can join with a different account. */
export function SwitchAccountButton({ back, label = "Use a different account" }: { back: string; label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await authClient.signOut().catch(() => undefined);
        resetAnalytics();
        router.push(`/login?next=${encodeURIComponent(back)}`);
        router.refresh();
      }}
      className={buttonClass("secondary", "md")}
    >
      {busy ? "Signing out…" : label}
    </button>
  );
}

/**
 * The team switcher at the top of the dashboard: "Personal" (their own Cloudflare) and each
 * team they're on. Only shown when there's more than one.
 */
export function TeamSwitcher({ choices, current }: { choices: { ownerId: string; label: string }[]; current: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  if (choices.length < 2) return null;
  const active = choices.find((c) => c.ownerId === current) ?? choices[0];
  async function pick(ownerId: string) {
    if (ownerId === active.ownerId) return;
    setBusy(true);
    try {
      await call("/api/team/switch", "POST", { ownerId });
      router.push("/dashboard");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={busy}
        aria-label="Switch team"
        className="flex w-full items-center gap-2.5 rounded-control border border-line bg-canvas px-3 py-2 text-left text-sm font-semibold outline-none transition-colors hover:bg-sunken focus-visible:ring-2 focus-visible:ring-text/20"
      >
        <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-md bg-text text-[11px] font-bold text-canvas">
          {active.label.charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 truncate">{busy ? "Switching…" : active.label}</span>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5 shrink-0 text-muted">
          <path d="M5 6l3-3 3 3M5 10l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {choices.map((c) => (
          <DropdownMenuItem key={c.ownerId} onClick={() => pick(c.ownerId)}>
            <span className="min-w-0 flex-1 truncate">{c.label}</span>
            {c.ownerId === active.ownerId && <span aria-hidden>✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
