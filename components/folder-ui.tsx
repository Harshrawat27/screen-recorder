"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonClass } from "@/components/ui";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Folders: create, rename, delete, and add a video to one. Videos always stay in the library
// too; a folder is just another place to find them. Everything is stored in the
// user's own Cloudflare (D1) through /api/folders and /api/videos.

export type FolderOption = { id: string; name: string };

const NAME_MAX = 80;
const inputClass =
  "h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-[15px] outline-none! transition-colors placeholder:text-faint focus:border-text";

async function request<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(String(res.status));
  return (await res.json()) as T;
}

export const createFolder = (name: string) => request<{ folder: FolderOption }>("/api/folders", "POST", { name }).then((d) => d.folder);
export const moveVideo = (videoId: string, folderId: string | null) => request(`/api/videos/${videoId}`, "PATCH", { folderId });

const FolderIcon = ({ className = "size-[18px]" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
    <path
      d="M2.8 6.2c0-1 .8-1.7 1.7-1.7h3.2l1.6 1.8h6.2c1 0 1.7.8 1.7 1.7v6.6c0 1-.8 1.7-1.7 1.7H4.5c-1 0-1.7-.8-1.7-1.7z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

/** A one-field dialog for naming a folder (new or renamed). */
function NameDialog({
  open,
  onClose,
  title,
  description,
  initial = "",
  action,
  busyLabel,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  initial?: string;
  action: string;
  busyLabel: string;
  onSave: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const clean = name.replace(/\s+/g, " ").trim();

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!clean || busy) return;
    if (clean === initial) return onClose();
    setBusy(true);
    setError("");
    try {
      await onSave(clean);
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && !busy && onClose()}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) {
          setName(initial);
          setError("");
        }
      }}
    >
      <DialogContent>
        <form onSubmit={save}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <input
            autoFocus
            value={name}
            maxLength={NAME_MAX}
            onChange={(e) => setName(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            placeholder="Folder name"
            aria-label="Folder name"
            className={`mt-5 ${inputClass}`}
          />
          {error && (
            <p role="alert" className="mt-2 text-sm text-danger">
              {error}
            </p>
          )}
          <DialogFooter>
            <DialogClose className={buttonClass("ghost", "md")}>Cancel</DialogClose>
            <button type="submit" disabled={!clean || busy} className={buttonClass("primary", "md", "disabled:opacity-50")}>
              {busy ? busyLabel : action}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** "New folder" beside the library title. */
export function NewFolderButton({ enabled, className }: { enabled: boolean; className: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!enabled}
        title={enabled ? undefined : "Press Update in the sidebar to use folders"}
        className={`${className} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <FolderIcon />
        New folder
      </button>
      <NameDialog
        open={open}
        onClose={() => setOpen(false)}
        title="New folder"
        description="Group recordings by project, client or team."
        action="Create folder"
        busyLabel="Creating…"
        onSave={async (name) => {
          const folder = await createFolder(name);
          router.push(`/dashboard/folders/${folder.id}`);
        }}
      />
    </>
  );
}

/** Rename and delete, on a folder's own page. */
export function FolderActions({ id, name }: { id: string; name: string }) {
  const [dialog, setDialog] = useState<"rename" | "delete" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function remove() {
    setBusy(true);
    setError("");
    try {
      await request(`/api/folders/${id}`, "DELETE");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Couldn’t delete the folder. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => setDialog("rename")} className={buttonClass("secondary", "md")}>
        Rename
      </button>
      <button type="button" onClick={() => setDialog("delete")} className={buttonClass("secondary", "md")}>
        Delete folder
      </button>

      <NameDialog
        open={dialog === "rename"}
        onClose={() => setDialog(null)}
        title="Rename folder"
        description="The new name shows in your library and in search."
        initial={name}
        action="Save"
        busyLabel="Saving…"
        onSave={async (next) => {
          await request(`/api/folders/${id}`, "PATCH", { name: next });
          router.refresh();
        }}
      />

      <Dialog
        open={dialog === "delete"}
        onOpenChange={(next) => !next && !busy && setDialog(null)}
        onOpenChangeComplete={(isOpen) => !isOpen && setError("")}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete “{name}”?</DialogTitle>
            <DialogDescription>
              Only the folder is deleted. Its videos stay in your library, and their links keep working.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <p role="alert" className="mt-4 text-sm text-danger">
              {error}
            </p>
          )}
          <DialogFooter>
            <DialogClose disabled={busy} className={buttonClass("ghost", "md")}>
              Cancel
            </DialogClose>
            <button type="button" onClick={remove} disabled={busy} className={buttonClass("primary", "md", "disabled:opacity-60")}>
              {busy ? "Deleting…" : "Delete folder"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Pick a folder for a video, or make a new one on the spot. */
export function MoveDialog({
  open,
  onClose,
  videoId,
  videoTitle,
  current,
  folders,
  onMoved,
}: {
  open: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle: string;
  current: string | null;
  folders: FolderOption[];
  onMoved: (folderId: string | null, name: string) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const clean = newName.replace(/\s+/g, " ").trim();

  async function move(folderId: string | null, name: string) {
    if (busy) return;
    if (folderId === current) return onClose();
    setBusy(folderId ?? "library");
    setError("");
    try {
      await moveVideo(videoId, folderId);
      onMoved(folderId, name);
      onClose();
    } catch {
      setError("Couldn’t update the folder. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function createAndMove(event: React.FormEvent) {
    event.preventDefault();
    if (!clean || busy) return;
    setBusy("new");
    setError("");
    try {
      const folder = await createFolder(clean);
      await moveVideo(videoId, folder.id);
      onMoved(folder.id, folder.name);
      onClose();
    } catch {
      setError("Couldn’t create the folder. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  const option = (id: string | null, name: string, icon: React.ReactNode) => {
    const here = id === current;
    return (
      <li key={id ?? "library"}>
        <button
          type="button"
          onClick={() => move(id, name)}
          disabled={Boolean(busy)}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors hover:bg-sunken disabled:opacity-60 ${here ? "bg-sunken font-semibold" : ""}`}
        >
          <span className="text-muted">{icon}</span>
          <span className="min-w-0 flex-1 truncate">{name}</span>
          {here && <span className="text-xs font-normal text-muted">{id ? "Added" : "Current"}</span>}
        </button>
      </li>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && !busy && onClose()}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) {
          setNewName("");
          setError("");
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to folder</DialogTitle>
          <DialogDescription>
            <span className="block truncate">{videoTitle}</span>
            <span className="mt-1 block text-sm">It stays in your library too. A video can be in one folder at a time.</span>
          </DialogDescription>
        </DialogHeader>
        <ul className="-mx-2 mt-4 max-h-[min(320px,45vh)] space-y-0.5 overflow-y-auto">
          {option(
            null,
            "No folder",
            <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-[18px]">
              <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M5.5 14.5l9-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>,
          )}
          {folders.map((f) => option(f.id, f.name, <FolderIcon />))}
        </ul>
        <form onSubmit={createAndMove} className="mt-4 flex gap-2 border-t border-line pt-4">
          <input
            value={newName}
            maxLength={NAME_MAX}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New folder name"
            aria-label="New folder name"
            className={inputClass}
          />
          <button type="submit" disabled={!clean || Boolean(busy)} className={buttonClass("secondary", "md", "shrink-0 disabled:opacity-50")}>
            {busy === "new" ? "Creating…" : "Create & add"}
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-2 text-sm text-danger">
            {error}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
