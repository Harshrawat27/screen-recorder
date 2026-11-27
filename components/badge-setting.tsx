"use client";

import { useState } from "react";

// Paid plan: show or hide "Recorded with Showthrough" under your videos on their share pages.
export function BadgeSetting({ initialHidden }: { initialHidden: boolean }) {
  const [hidden, setHidden] = useState(initialHidden);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    const next = !hidden;
    setHidden(next);
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/settings/badge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ hide: next }),
      });
      // On the free plan the upgrade popup opens (components/upgrade.tsx); just put the switch back.
      if (res.status === 402) {
        setHidden(!next);
        return;
      }
      if (!res.ok) throw new Error();
    } catch {
      setHidden(!next);
      setError("Couldn’t save that. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-10 max-w-2xl rounded-panel border border-line bg-surface p-6 sm:p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-xl">Share pages</h2>
          <p className="mt-2 text-muted">
            Show &ldquo;Recorded with Showthrough&rdquo; under your videos. Turn it off to keep your share pages free of our name.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={!hidden}
          aria-label="Show “Recorded with Showthrough”"
          onClick={toggle}
          disabled={saving}
          className={`relative mt-1 h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors disabled:opacity-60 ${hidden ? "bg-line-strong" : "bg-text"}`}
        >
          <span className={`absolute top-1 size-5 rounded-full bg-canvas shadow transition-all ${hidden ? "left-1" : "left-6"}`} />
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
    </section>
  );
}
