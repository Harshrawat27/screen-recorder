"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// The navbar's links on screens narrower than `lg`, behind a menu button.
export function MobileMenu({ links, chromeStoreUrl }: { links: { href: string; label: string }[]; chromeStoreUrl: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
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
                <a href={link.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 hover:bg-sunken">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href={chromeStoreUrl} target="_blank" rel="noopener noreferrer" className="block rounded-2xl px-4 py-3 hover:bg-sunken">
                Chrome extension
              </a>
            </li>
            <li className="sm:hidden">
              <Link href="/login" onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 hover:bg-sunken">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
