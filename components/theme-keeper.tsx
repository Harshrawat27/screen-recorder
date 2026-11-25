"use client";

import { useEffect } from "react";

// The script in app/layout.tsx sets <html data-theme> before the page paints. If React has to
// re-render the whole page while loading (for example when a browser extension changed the
// page before React took over), <html> loses that attribute and the page turns light. This puts
// it back, now and whenever it goes missing.

function savedTheme(): "light" | "dark" {
  try {
    const t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") return t;
  } catch {
    // Storage blocked: try the cookie.
  }
  const m = document.cookie.match(/(?:^|; )theme=(light|dark)/);
  if (m) return m[1] as "light" | "dark";
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeKeeper() {
  useEffect(() => {
    const root = document.documentElement;
    const ensure = () => {
      if (root.dataset.theme !== "light" && root.dataset.theme !== "dark") root.dataset.theme = savedTheme();
    };
    ensure();
    const observer = new MutationObserver(ensure);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return null;
}
