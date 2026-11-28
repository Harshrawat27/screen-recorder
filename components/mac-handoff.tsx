"use client";

import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";

/** Opens the Mac app with the one-time code, and offers a button in case the browser asks first. */
export function MacHandoff({ href, places }: { href: string; places: string[] }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.href = href;
      setOpened(true);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [href]);

  return (
    <div>
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">{opened ? "Back to the app" : "Opening Showthrough…"}</h1>
      <p className="mt-2 text-muted">
        {places.length === 1
          ? `Your Mac will save recordings to ${places[0]}.`
          : `Your Mac can save recordings to: ${places.join(", ")}.`}{" "}
        If your browser asks, choose Open Showthrough.
      </p>
      <a href={href} className={buttonClass("primary", "md", "mt-8")}>
        Open Showthrough
      </a>
      <p className="mt-4 text-[13px] text-muted">You can close this tab once the app says Connected.</p>
    </div>
  );
}
