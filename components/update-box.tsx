"use client";

import { useState } from "react";
import { startCloudflareConnect } from "@/components/connect-cloudflare";

// "New version available" in the sidebar. Updating runs Cloudflare's Allow screen again,
// because we don't keep access to the user's Cloudflare: the server then redeploys their
// video backend with the new features. Videos and links aren't touched.
export function UpdateBox({ version, notes, included }: { version: number; notes: string; included: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function update() {
    setPending(true);
    setError("");
    try {
      await startCloudflareConnect();
    } catch (err) {
      setError((err as Error).message);
      setPending(false);
    }
  }

  return (
    <div className="mx-3 mb-3 rounded-[14px] border border-line bg-canvas p-3.5">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#F35733] opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-[#F35733]" />
        </span>
        New version available
      </p>
      <p className="mt-1.5 text-[13px] leading-snug text-muted">{notes}</p>
      {included ? (
        <button
          type="button"
          onClick={update}
          disabled={pending}
          className="btn-primary mt-3 inline-flex h-8 w-full items-center justify-center rounded-full bg-text px-3 text-[13px] font-semibold text-canvas transition-colors hover:bg-text/85 disabled:opacity-60"
        >
          {pending ? "Opening Cloudflare…" : `Update to version ${version}`}
        </button>
      ) : (
        <p className="mt-3 text-[13px] text-muted">This update isn&rsquo;t included in your purchase.</p>
      )}
      {included && !error && <p className="mt-2 text-[11.5px] leading-snug text-faint">Takes about 10 seconds. Your videos and links aren&rsquo;t touched.</p>}
      {error && (
        <p role="alert" className="mt-2 text-[12px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
