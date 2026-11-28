"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DemoDialog } from "@/components/hero-video";
import { LanguageList } from "@/components/language-menu";
import type { Locale } from "@/lib/i18n";

// The navbar's links on screens narrower than `lg`, behind a menu button.
type Labels = { chrome: string; signIn: string; open: string; close: string };
const defaultLabels: Labels = { chrome: "Chrome extension", signIn: "Sign in", open: "Open menu", close: "Close menu" };

export function MobileMenu({
  links,
  chromeStoreUrl,
  labels = defaultLabels,
  signInUntilMd = false,
  locale = "en",
  wide = false,
}: {
  links: { href: string; label: string; demo?: boolean }[];
  chromeStoreUrl: string;
  labels?: Labels;
  /** Show Sign in here up to `md` (other languages hide the navbar's Sign in until then). */
  signInUntilMd?: boolean;
  locale?: Locale;
  /** Keep the menu up to `xl` instead of `lg` (longer labels in other languages). */
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [demo, setDemo] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={wide ? "xl:hidden" : "lg:hidden"}>
      <button
        type="button"
        aria-label={open ? labels.close : labels.open}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="grid size-11 place-items-center rounded-full text-text hover:bg-sunken"
      >
        <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5">
          {open ? (
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          ) : (
            <path d="M3.5 6h13M3.5 10h13M3.5 14h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full mt-2 rounded-[24px] border border-line bg-surface p-2 shadow-[0_16px_40px_-16px_rgb(0_0_0/0.25)]"
        >
          <ul className="flex flex-col text-[16px]">
            {links.map((link) => (
              <li key={link.href}>
                {link.demo ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setDemo(true);
                    }}
                    className="block w-full cursor-pointer rounded-2xl px-4 py-3 text-left hover:bg-sunken"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a href={link.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 hover:bg-sunken">
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            <li>
              <a href={chromeStoreUrl} target="_blank" rel="noopener noreferrer" className="block rounded-2xl px-4 py-3 hover:bg-sunken">
                {labels.chrome}
              </a>
            </li>
            <li className={signInUntilMd ? "md:hidden" : "sm:hidden"}>
              <Link href="/login" onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 hover:bg-sunken">
                {labels.signIn}
              </Link>
            </li>
          </ul>
          <LanguageList locale={locale} onPick={() => setOpen(false)} />
        </div>
      )}
      <DemoDialog open={demo} onOpenChange={setDemo} locale={locale} />
    </div>
  );
}
