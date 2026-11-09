"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { dashboardPages } from "@/components/dashboard-nav";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { VideoThumb } from "@/components/video-thumb";
import type { SearchResults, SearchVideo } from "@/lib/search";

// The dashboard's search: a small button in the top bar (or ⌘K / Ctrl+K) opens a command
// palette. Typing is debounced, older requests are cancelled, and answers are remembered
// for the session, so going back to an earlier query is instant.

const DEBOUNCE_MS = 200;

function duration(sec: number | null) {
  if (!sec) return null;
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function date(ms: number | null) {
  return ms ? new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "";
}

const SearchIcon = ({ className = "size-4" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
    <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M13.2 13.2L17 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

function useSearch(query: string, enabled: boolean) {
  const cache = useRef(new Map<string, SearchResults>());
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const key = query.trim().toLowerCase();
    const known = cache.current.get(key);
    if (known) {
      setResults(known);
      setLoading(false);
      setFailed(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    // The first (empty) query runs straight away; typing waits for a pause.
    const timer = setTimeout(
      async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(key)}`, { signal: controller.signal });
          if (!res.ok) throw new Error();
          const data = (await res.json()) as SearchResults;
          cache.current.set(key, data);
          setResults(data);
          setFailed(false);
        } catch {
          if (controller.signal.aborted) return;
          setFailed(true);
        }
        setLoading(false);
      },
      key ? DEBOUNCE_MS : 0,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, enabled]);

  // Renames and deletes change the answers; start fresh each time the palette opens.
  useEffect(() => {
    if (!enabled) cache.current.clear();
  }, [enabled]);

  return { results, loading, failed };
}

export function DashboardSearch({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mac, setMac] = useState(true);
  const router = useRouter();
  const { results, loading, failed } = useSearch(query, open);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the platform is only known in the browser
    setMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const pages = dashboardPages.filter((page) => !q || page.label.toLowerCase().includes(q));
  const videos = results?.videos ?? [];
  const folders = q ? (results?.folders ?? []) : [];
  // Keep the highlight on the best match as results arrive, not on whatever was first before.
  const first = videos[0] ? `video-${videos[0].id}` : folders[0] ? `folder-${folders[0].id}` : pages[0] ? `page-${pages[0].href}` : "";
  const [selected, setSelected] = useState("");
  const [shownFirst, setShownFirst] = useState("");
  if (first !== shownFirst) {
    setShownFirst(first);
    setSelected(first);
  }

  function go(run: () => void) {
    setOpen(false);
    run();
  }

  const openVideo = (video: SearchVideo) => go(() => window.open(video.href, "_blank", "noopener"));

  return (
    <>
      {compact ? (
        <button
          type="button"
          aria-label="Search"
          onClick={() => setOpen(true)}
          className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-text"
        >
          <SearchIcon className="size-[18px]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 w-full max-w-[380px] items-center gap-2.5 rounded-full border border-line bg-surface pl-3.5 pr-2 text-sm text-faint transition-colors hover:border-line-strong hover:text-muted"
        >
          <SearchIcon />
          <span className="flex-1 text-left">Search videos</span>
          <kbd className="rounded-md border border-line bg-sunken px-1.5 py-0.5 font-sans text-[11px] text-muted">{mac ? "⌘K" : "Ctrl K"}</kbd>
        </button>
      )}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        onOpenChangeComplete={(isOpen) => {
          if (!isOpen) setQuery("");
        }}
        title="Search"
        description="Search your videos and dashboard pages"
      >
        {/* The server does the matching for videos, so cmdk's own filter is off. */}
        <Command shouldFilter={false} loop value={selected} onValueChange={setSelected}>
          <CommandInput value={query} onValueChange={setQuery} placeholder="Search videos and folders…" autoFocus />
          <CommandList>
            {videos.length > 0 && (
              <CommandGroup heading={q ? "Videos" : "Recent videos"}>
                {videos.map((video) => (
                  <CommandItem key={video.id} value={`video-${video.id}`} onSelect={() => openVideo(video)}>
                    <span className="relative aspect-video w-16 shrink-0 overflow-hidden rounded-md bg-text/90">
                      <VideoThumb src={video.thumb} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{video.title}</span>
                      <span className="tabular block text-xs text-muted">
                        {[date(video.createdAt), duration(video.durationSec)].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {folders.length > 0 && (
              <CommandGroup heading="Folders">
                {folders.map((folder) => (
                  <CommandItem key={folder.id} value={`folder-${folder.id}`} onSelect={() => go(() => router.push(folder.href))}>
                    <span className="grid size-7 place-items-center text-muted">
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-[18px]">
                        <path
                          d="M2.8 6.2c0-1 .8-1.7 1.7-1.7h3.2l1.6 1.8h6.2c1 0 1.7.8 1.7 1.7v6.6c0 1-.8 1.7-1.7 1.7H4.5c-1 0-1.7-.8-1.7-1.7z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1 truncate">{folder.name}</span>
                    <span className="tabular text-xs text-muted">
                      {folder.videos} video{folder.videos === 1 ? "" : "s"}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {pages.length > 0 && (
              <CommandGroup heading="Go to">
                {pages.map((page) => (
                  <CommandItem key={page.href} value={`page-${page.href}`} onSelect={() => go(() => router.push(page.href))}>
                    <span className="grid size-7 place-items-center text-muted">{page.icon}</span>
                    {page.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {videos.length === 0 && folders.length === 0 && pages.length === 0 && (
              <CommandEmpty>
                {loading ? "Searching…" : failed ? "Search isn’t available right now. Try again in a moment." : `Nothing matches “${query.trim()}”.`}
              </CommandEmpty>
            )}
            {loading && (videos.length > 0 || folders.length > 0 || pages.length > 0) && <p className="px-2.5 pb-1 pt-2 text-xs text-faint">Searching…</p>}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

