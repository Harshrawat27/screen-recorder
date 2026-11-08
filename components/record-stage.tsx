"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";
import { site } from "@/lib/site";

// The extension marks <html data-showthrough="ready"> when it loads on this page.
const hasExtension = () =>
  document.documentElement.dataset.showthrough === "ready";

export function RecordStage() {
  const [status, setStatus] = useState<"checking" | "ready" | "missing">(
    "checking",
  );

  useEffect(() => {
    const started = Date.now();
    const timer = setInterval(() => {
      if (hasExtension()) setStatus("ready");
      else if (Date.now() - started > 2500) setStatus("missing");
      else return;
      clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  if (status === "missing") {
    return (
      <div className="w-full max-w-[480px] text-center">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">
          Add the extension to record
        </h1>
        <p className="mt-2 text-muted">
          We couldn&rsquo;t find the {site.name} extension in this browser.
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <a href={site.chromeStoreUrl} className={buttonClass("primary", "md")}>
            Add to Chrome
          </a>
          <Link
            href="/dashboard"
            className={buttonClass("ghost", "md")}
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-[480px] text-center transition-opacity duration-300 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
    >
      <span className="relative mx-auto mb-7 flex size-3">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#F35733] opacity-60" />
        <span className="relative inline-flex size-3 rounded-full bg-[#F35733]" />
      </span>
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">
        Ready when you are
      </h1>
      <p className="mt-2 text-muted">
        Pick what to share in the panel and press Start recording. You can
        record any tab, window or your whole screen from here.
      </p>
      <button
        type="button"
        onClick={() =>
          document.dispatchEvent(new CustomEvent("showthrough:open"))
        }
        className={buttonClass("ghost", "md", "mt-6")}
      >
        Open recorder
      </button>
    </div>
  );
}
