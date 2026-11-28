"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type Locale, localeNames, locales, switchHref } from "@/lib/i18n";
import { ui } from "@/lib/i18n/ui";

// The language menu in the navbar (wide screens). Each language links to the same page in that
// language when it exists (home, privacy, terms, setup guide), otherwise to that language's home.
// Plain links, so a switch is a normal page load.

export function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.75 10h14.5M10 2.75c2 2.1 3 4.5 3 7.25s-1 5.15-3 7.25c-2-2.1-3-4.5-3-7.25s1-5.15 3-7.25z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function LanguageMenu({ locale, wide = false }: { locale: Locale; wide?: boolean }) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={box} className={`relative hidden ${wide ? "xl:block" : "lg:block"}`}>
      <button
        type="button"
        aria-label={ui[locale].language}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 items-center gap-1.5 rounded-control px-2.5 text-sm font-medium text-muted hover:bg-sunken hover:text-text"
      >
        <GlobeIcon className="size-[18px]" />
        <span className="hidden xl:inline">{locale.toUpperCase()}</span>
      </button>
      {open && (
        <ul className="absolute right-0 top-full z-50 mt-2 w-44 rounded-2xl border border-line bg-surface p-1.5 text-[15px] shadow-[0_16px_40px_-16px_rgb(0_0_0/0.25)]">
          {locales.map((l) => (
            <li key={l}>
              <a
                href={switchHref(pathname, l)}
                hrefLang={l}
                lang={l}
                aria-current={l === locale ? "true" : undefined}
                className={`flex items-center justify-between rounded-xl px-3 py-2 hover:bg-sunken ${l === locale ? "font-semibold text-text" : "text-muted hover:text-text"}`}
              >
                {localeNames[l]}
                {l === locale && <span aria-hidden>✓</span>}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** The languages as a plain list, for the phone menu. */
export function LanguageList({ locale, onPick }: { locale: Locale; onPick?: () => void }) {
  const pathname = usePathname() ?? "/";
  return (
    <div className="mt-1 border-t border-line px-4 pb-2 pt-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-muted">
        <GlobeIcon className="size-4" />
        {ui[locale].language}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {locales.map((l) => (
          <a
            key={l}
            href={switchHref(pathname, l)}
            hrefLang={l}
            lang={l}
            onClick={onPick}
            aria-current={l === locale ? "true" : undefined}
            className={`rounded-full border px-3 py-1.5 text-sm ${l === locale ? "border-text font-semibold text-text" : "border-line text-muted hover:text-text"}`}
          >
            {localeNames[l]}
          </a>
        ))}
      </div>
    </div>
  );
}
