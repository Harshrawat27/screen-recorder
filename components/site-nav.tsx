import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoMark } from "@/components/ui";
import { betaHref, site } from "@/lib/site";

// Floating navbar for the home page hero.
const links = [
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteNav() {
  return (
    <header className="relative z-20 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav
        aria-label="Main"
        className="sky-glass mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-full py-2 pl-4 pr-2 sm:pl-5"
      >
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-text">
          <LogoMark className="size-7" />
          <span className="hidden text-[17px] tracking-[-0.01em] min-[360px]:inline">{site.name}</span>
        </Link>

        <ul className="hidden items-center gap-7 text-[15px] text-text lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-muted">
                {link.label}
              </a>
            </li>
          ))}
          <li className="flex items-center gap-2">
            <span>Chrome extension</span>
            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-ink">In review</span>
          </li>
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden rounded-full px-3.5 py-2 text-[15px] font-medium text-text hover:bg-sunken sm:block">
            Sign in
          </Link>
          <a
            href={betaHref}
            className="btn-primary inline-flex h-11 items-center whitespace-nowrap rounded-full bg-text px-4 text-sm font-semibold sm:h-12 sm:px-5 sm:text-[15px] text-canvas transition-colors hover:bg-text/85"
          >
            Join the beta
          </a>
        </div>
      </nav>
    </header>
  );
}
