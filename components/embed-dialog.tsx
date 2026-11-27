"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { buttonClass } from "@/components/ui";
import { embedCode, embedUrl } from "@/lib/embed";

// "Embed": the code to put this video on any website (Notion, Webflow, WordPress, a help centre).
export function EmbedDialog({
  space,
  id,
  title,
  open,
  onOpenChange,
}: {
  space: string;
  id: string;
  title?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const code = embedCode(space, id, title);
  const copy = async (what: "code" | "link") => {
    await navigator.clipboard?.writeText(what === "code" ? code : `${window.location.origin}/v/${space}/${id}`).catch(() => {});
    setCopied(what);
    window.setTimeout(() => setCopied(null), 2000);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Embed this video</DialogTitle>
          <DialogDescription>Paste the code into any website. It plays right there, like a normal video player.</DialogDescription>
        </DialogHeader>
        <div className="mt-5 overflow-hidden rounded-xl border border-line bg-black">
          <iframe src={embedUrl(space, id).replace(/^https?:\/\/[^/]+/, "")} title="Preview" className="block aspect-video w-full border-0" allow="fullscreen" />
        </div>
        <textarea
          readOnly
          value={code}
          rows={4}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Embed code"
          className="mt-4 w-full resize-none rounded-xl border border-line bg-sunken px-3 py-2.5 font-mono text-[12px] leading-relaxed text-muted outline-none"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => copy("code")} className={buttonClass("primary", "md")}>
            {copied === "code" ? "Copied" : "Copy embed code"}
          </button>
          <button type="button" onClick={() => copy("link")} className={buttonClass("secondary", "md")}>
            {copied === "link" ? "Copied" : "Copy link"}
          </button>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-faint">
          In Notion, Medium and similar tools, pasting the video&rsquo;s link is enough: it turns into the player on its own. On the free plan,
          a small Showthrough tag shows in the corner.
        </p>
      </DialogContent>
    </Dialog>
  );
}
