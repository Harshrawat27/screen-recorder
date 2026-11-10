"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui";
import type { AvatarInfo } from "@/lib/avatar";

// Upload and crop a profile photo. The crop happens here in the browser: the photo is drawn
// onto a 512×512 canvas and sent as a small WebP, so the original never leaves the computer.

const OUT = 512; // saved size, in pixels
const STAGE = 288; // crop area on screen, in CSS pixels
const MAX_BYTES = 400 * 1024;

type Crop = { img: HTMLImageElement; url: string; zoom: number; x: number; y: number };

/** Tell the extension (if it's installed) which account this is and that the photo changed. */
function tellExtension(userId: string, email: string) {
  window.postMessage({ type: "showthrough:profile", userId, email }, window.location.origin);
}

function loadImage(file: File) {
  return new Promise<{ img: HTMLImageElement; url: string }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file isn't a photo we can open. Try a JPG or PNG."));
    };
    img.src = url;
  });
}

// The scale at which the photo just covers the crop circle.
const coverScale = (img: HTMLImageElement, size: number) => Math.max(size / img.naturalWidth, size / img.naturalHeight);

// Keep the photo covering the whole square: no empty edges.
function clamp(c: Crop): Crop {
  const s = coverScale(c.img, STAGE) * c.zoom;
  const maxX = Math.max(0, (c.img.naturalWidth * s - STAGE) / 2);
  const maxY = Math.max(0, (c.img.naturalHeight * s - STAGE) / 2);
  return { ...c, x: Math.min(maxX, Math.max(-maxX, c.x)), y: Math.min(maxY, Math.max(-maxY, c.y)) };
}

async function render(c: Crop): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = OUT;
  canvas.height = OUT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't prepare the photo.");
  const k = OUT / STAGE;
  const s = coverScale(c.img, STAGE) * c.zoom * k;
  const w = c.img.naturalWidth * s;
  const h = c.img.naturalHeight * s;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(c.img, OUT / 2 - w / 2 + c.x * k, OUT / 2 - h / 2 + c.y * k, w, h);
  for (const quality of [0.86, 0.72, 0.55]) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", quality));
    if (!blob || blob.type !== "image/webp") throw new Error("This browser can't save the photo. Open this page in Chrome and try again.");
    if (blob.size <= MAX_BYTES) return blob;
  }
  throw new Error("That photo is too detailed to save. Try a different one.");
}

export function AvatarEditor({
  name,
  email,
  userId,
  googleImage,
  initial,
}: {
  name: string;
  email: string;
  userId: string;
  googleImage: string | null;
  initial: AvatarInfo;
}) {
  const [avatar, setAvatar] = useState(initial);
  const [crop, setCrop] = useState<Crop | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

  // Visiting this page also tells the extension which account it's connected to.
  useEffect(() => tellExtension(userId, email), [userId, email]);
  const cropUrl = crop?.url;
  useEffect(() => {
    if (cropUrl) return () => URL.revokeObjectURL(cropUrl);
  }, [cropUrl]);

  const pick = useCallback(async (file: File | undefined) => {
    setError(null);
    setSaved(false);
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) return setError("That file is over 30 MB. Pick a smaller photo.");
    try {
      const { img, url } = await loadImage(file);
      setCrop({ img, url, zoom: 1, x: 0, y: 0 });
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  async function save() {
    if (!crop) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await render(crop);
      const res = await fetch("/api/avatar", { method: "POST", headers: { "content-type": "image/webp" }, body: blob });
      if (!res.ok) throw new Error("Couldn't save your photo. Try again in a moment.");
      setAvatar(((await res.json()) as { avatar: AvatarInfo }).avatar);
      setCrop(null);
      setSaved(true);
      tellExtension(userId, email);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/avatar", { method: "DELETE" });
      if (!res.ok) throw new Error("Couldn't remove your photo. Try again in a moment.");
      setAvatar(null);
      tellExtension(userId, email);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const fileInput = (
    <input
      ref={input}
      type="file"
      accept="image/*"
      className="sr-only"
      onChange={(e) => {
        pick(e.target.files?.[0]);
        e.target.value = "";
      }}
    />
  );

  if (crop) {
    const s = coverScale(crop.img, STAGE) * crop.zoom;
    return (
      <section className="mt-8 max-w-xl rounded-panel border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-xl">Position your photo</h2>
        <p className="mt-1.5 text-muted">Drag to move it. Use the slider to zoom.</p>
        <div
          className="relative mx-auto mt-6 cursor-grab touch-none select-none overflow-hidden rounded-card bg-sunken active:cursor-grabbing"
          style={{ width: STAGE, height: STAGE }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d || d.id !== e.pointerId) return;
            const dx = e.clientX - d.x;
            const dy = e.clientY - d.y;
            drag.current = { id: d.id, x: e.clientX, y: e.clientY };
            setCrop((c) => c && clamp({ ...c, x: c.x + dx, y: c.y + dy }));
          }}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          onWheel={(e) => setCrop((c) => c && clamp({ ...c, zoom: Math.min(4, Math.max(1, c.zoom - e.deltaY * 0.002)) }))}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={crop.url}
            alt=""
            draggable={false}
            className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
            style={{
              width: crop.img.naturalWidth * s,
              height: crop.img.naturalHeight * s,
              transform: `translate(calc(-50% + ${crop.x}px), calc(-50% + ${crop.y}px))`,
            }}
          />
          {/* Darken everything outside the circle the viewers will see. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: "0 0 0 999px rgb(0 0 0 / 0.5)" }} />
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/80" />
        </div>
        <label className="mx-auto mt-5 flex max-w-[288px] items-center gap-3 text-sm text-muted">
          <span>Zoom</span>
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={crop.zoom}
            onChange={(e) => setCrop((c) => c && clamp({ ...c, zoom: Number(e.target.value) }))}
            className="h-1 flex-1 cursor-pointer accent-[var(--color-text)]"
            aria-label="Zoom"
          />
        </label>
        {error && (
          <p role="alert" className="mt-4 text-center text-sm text-danger">
            {error}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" className={buttonClass("primary", "md")} onClick={save} disabled={busy}>
            {busy ? "Saving…" : "Save photo"}
          </button>
          <button type="button" className={buttonClass("secondary", "md")} onClick={() => input.current?.click()} disabled={busy}>
            Choose another
          </button>
          <button type="button" className={buttonClass("ghost", "md")} onClick={() => setCrop(null)} disabled={busy}>
            Cancel
          </button>
        </div>
        {fileInput}
      </section>
    );
  }

  const shown = avatar?.url ?? googleImage;
  return (
    <section
      className="mt-8 max-w-xl rounded-panel border border-line bg-surface p-6 sm:p-8"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        pick(e.dataTransfer.files?.[0]);
      }}
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="Your profile photo" referrerPolicy="no-referrer" className="size-28 shrink-0 rounded-full object-cover" />
        ) : (
          <span aria-hidden className="grid size-28 shrink-0 place-items-center rounded-full bg-sunken text-4xl font-bold">
            {name.trim().charAt(0).toUpperCase() || "?"}
          </span>
        )}
        <div className="min-w-0 text-center sm:text-left">
          <h2 className="text-xl">{avatar ? "Your recording photo" : "Add a photo"}</h2>
          <p className="mt-1.5 text-muted">
            {avatar
              ? "When you don't want to show your face, pick My photo from the camera menu in the extension. Viewers see this photo, with a ring that moves when you talk."
              : "Show a photo in the corner of your recordings instead of your camera. Upload one, then pick My photo from the camera menu in the extension."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
            <button type="button" className={buttonClass("primary", "md")} onClick={() => input.current?.click()} disabled={busy}>
              {avatar ? "Change photo" : "Upload photo"}
            </button>
            {avatar && (
              <button type="button" className={buttonClass("secondary", "md")} onClick={remove} disabled={busy}>
                {busy ? "Removing…" : "Remove"}
              </button>
            )}
          </div>
        </div>
      </div>
      {saved && (
        <p role="status" className="mt-5 text-sm text-muted">
          Saved. The extension uses it from your next recording.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-5 text-sm text-danger">
          {error}
        </p>
      )}
      <p className="mt-6 border-t border-line pt-5 text-sm text-faint">
        Your photo is kept in your own Cloudflare, next to your videos. It&rsquo;s cropped to a circle here in your browser, so the
        original never leaves your computer.
      </p>
      {fileInput}
    </section>
  );
}
