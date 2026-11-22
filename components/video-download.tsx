"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

// Download a recording as one MP4 file. Recordings are stored as streaming chunks (HLS), so the
// browser joins them into a single MP4 with Mediabunny. Nothing is re-encoded: it's the original
// quality, and fast. In Chrome the file is written straight to disk (no size limit); other
// browsers build it in memory first.

type Job = { title: string; progress: number; error: string | null; done: boolean };

const fileName = (title: string) =>
  `${(title || "Showthrough recording").replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, " ").trim().slice(0, 100) || "Showthrough recording"}.mp4`;

type SavePicker = (options: {
  suggestedName: string;
  types: { description: string; accept: Record<string, string[]> }[];
}) => Promise<{ createWritable: () => Promise<WritableStream> }>;

const DownloadContext = createContext<((src: string, title: string) => void) | null>(null);

/** Use inside a <VideoDownloads> to start a download: download(masterPlaylistUrl, title). */
export function useVideoDownload() {
  const start = useContext(DownloadContext);
  if (!start) throw new Error("useVideoDownload needs a <VideoDownloads> around it");
  return start;
}

export function VideoDownloads({ children }: { children: React.ReactNode }) {
  const [job, setJob] = useState<Job | null>(null);
  const cancelRef = useRef<(() => Promise<void>) | null>(null);
  const busy = Boolean(job && !job.done && !job.error);

  const start = useCallback(
    async (src: string, title: string) => {
      if (busy) return;
      const name = fileName(title);
      // Ask where to save first: the browser only allows this right after the click.
      const picker = (window as unknown as { showSaveFilePicker?: SavePicker }).showSaveFilePicker;
      let writable: WritableStream | null = null;
      if (picker) {
        try {
          const handle = await picker({ suggestedName: name, types: [{ description: "MP4 video", accept: { "video/mp4": [".mp4"] } }] });
          writable = await handle.createWritable();
        } catch (err) {
          if ((err as Error).name === "AbortError") return; // closed the save dialog
          writable = null; // fall back to building it in memory
        }
      }

      setJob({ title: name, progress: 0, error: null, done: false });
      try {
        const mb = await import("mediabunny");
        const input = new mb.Input({ source: new mb.UrlSource(src), formats: mb.ALL_FORMATS });
        const target = writable ? new mb.StreamTarget(writable as WritableStream<import("mediabunny").StreamTargetChunk>, { chunked: true }) : new mb.BufferTarget();
        const output = new mb.Output({ format: new mb.Mp4OutputFormat({ fastStart: writable ? false : "in-memory" }), target });
        const conversion = await mb.Conversion.init({ input, output });
        if (!conversion.isValid) throw new Error("This recording can't be saved as MP4 in this browser.");
        cancelRef.current = () => conversion.cancel();
        conversion.onProgress = (p) => setJob((j) => (j ? { ...j, progress: p } : j));
        await conversion.execute();
        input.dispose();

        if (target instanceof mb.BufferTarget && target.buffer) {
          const url = URL.createObjectURL(new Blob([target.buffer], { type: "video/mp4" }));
          const a = document.createElement("a");
          a.href = url;
          a.download = name;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 60_000);
        }
        setJob((j) => (j ? { ...j, progress: 1, done: true } : j));
        setTimeout(() => setJob((j) => (j?.done ? null : j)), 4000);
      } catch (err) {
        if ((err as Error).name === "ConversionCanceledError") return setJob(null);
        console.error("Download failed", err);
        setJob((j) => (j ? { ...j, error: "Couldn't download this video. Check your connection and try again." } : j));
      } finally {
        cancelRef.current = null;
      }
    },
    [busy],
  );

  return (
    <DownloadContext.Provider value={start}>
      {children}
      {job && (
        <div
          role="status"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-sm rounded-card border border-line bg-surface p-4 text-sm shadow-pop sm:left-auto sm:right-5 sm:bottom-5"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0">
              <span className="block font-semibold">
                {job.error ? "Download failed" : job.done ? "Downloaded" : "Preparing your MP4…"}
              </span>
              <span className="block truncate text-muted">{job.error ?? job.title}</span>
            </p>
            {!job.done && !job.error ? (
              <button type="button" onClick={() => cancelRef.current?.()} className="shrink-0 text-muted hover:text-text">
                Cancel
              </button>
            ) : (
              <button type="button" onClick={() => setJob(null)} className="shrink-0 text-muted hover:text-text">
                Close
              </button>
            )}
          </div>
          {!job.error && (
            <div className="mt-3 h-1.5 rounded-full bg-sunken">
              <div className="h-full rounded-full bg-text transition-[width]" style={{ width: `${Math.round(job.progress * 100)}%` }} />
            </div>
          )}
        </div>
      )}
    </DownloadContext.Provider>
  );
}
