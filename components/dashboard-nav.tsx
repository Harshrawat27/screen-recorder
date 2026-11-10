"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Dashboard navigation. One list of pages, shown as a vertical sidebar on large screens
// and as a scrollable row of tabs on small ones.

type Item = { href: string; label: string; icon: React.ReactNode };

const icon = (path: React.ReactNode) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-[18px] shrink-0">
    {path}
  </svg>
);

const library: Item[] = [
  {
    href: "/dashboard",
    label: "Library",
    icon: icon(
      <>
        <rect x="3" y="4" width="14" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8.5 7.8v4.4L12.3 10z" fill="currentColor" />
      </>,
    ),
  },
  {
    href: "/dashboard/recent",
    label: "Recent",
    icon: icon(
      <>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 6.2V10l2.6 1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>,
    ),
  },
  {
    href: "/dashboard/watch-later",
    label: "Watch later",
    icon: icon(<path d="M6 3.5h8a1 1 0 0 1 1 1v12l-5-3.2-5 3.2v-12a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />),
  },
];

const workspace: Item[] = [
  {
    href: "/dashboard/team",
    label: "Manage team",
    icon: icon(
      <>
        <circle cx="7.5" cy="7.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="14" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M2.8 16c.6-2.5 2.5-4 4.7-4s4.1 1.5 4.7 4M13 12.3c2-.2 3.7.9 4.2 3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>,
    ),
  },
  {
    href: "/dashboard/usage",
    label: "Usage",
    icon: icon(
      <>
        <path d="M3.5 16.5h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="4.5" y="10" width="2.8" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8.6" y="6.5" width="2.8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="12.7" y="3.5" width="2.8" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </>,
    ),
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: icon(
      <>
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="10" cy="8.2" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5.2 15.3c1-1.8 2.7-2.8 4.8-2.8s3.8 1 4.8 2.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>,
    ),
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: icon(
      <>
        <rect x="2.5" y="4.5" width="15" height="11" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M2.5 8h15M5.5 12.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>,
    ),
  },
];

/** Every dashboard page, for search. */
export const dashboardPages = [...library, ...workspace].map(({ href, label, icon }) => ({ href, label, icon }));

function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item, pathname, compact = false }: { item: Item; pathname: string; compact?: boolean }) {
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-control text-[15px] transition-colors ${
        compact ? "shrink-0 px-3 py-2" : "px-3 py-2.5"
      } ${active ? "bg-sunken font-semibold text-text" : "text-muted hover:bg-sunken/60 hover:text-text"}`}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Dashboard" className="space-y-6">
      <div className="space-y-0.5">
        {library.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </div>
      <div>
        <p className="px-3 pb-2 text-xs font-medium text-faint">Workspace</p>
        <div className="space-y-0.5">
          {workspace.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </div>
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  // Keep the current page's tab in view when it sits past the edge of the screen.
  useEffect(() => {
    ref.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname]);
  return (
    <nav ref={ref} aria-label="Dashboard" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {[...library, ...workspace].map((item) => (
        <NavLink key={item.href} item={item} pathname={pathname} compact />
      ))}
    </nav>
  );
}
