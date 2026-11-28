import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import { WatchDemoButton } from "@/components/hero-video";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoMark } from "@/components/ui";
import { site } from "@/lib/site";
import { type Locale, localePath } from "@/lib/i18n";
import { homeCopy } from "@/lib/i18n/home";
import "./sky-hero.css";

// Floating navbar, fixed to the top of the window on every page that uses it.
// The <header> keeps the navbar's height in the page so content starts below it.
// (Roadmap and FAQ are linked from the footer.) "How it works" opens the demo video popup.
function navLinks(locale: Locale): { href: string; label: string; demo?: boolean }[] {
  const t = homeCopy(locale).nav;
  const home = localePath(locale, "/");
  return [
    { href: `${home === "/" ? "" : home}/#how`, label: t.how, demo: true },
    { href: `${home === "/" ? "" : home}/#pricing`, label: t.pricing },
    { href: localePath(locale, "/guide"), label: t.guide },
    { href: "/blog", label: t.blog },
  ];
}

export function SiteNav({ locale = "en" }: { locale?: Locale } = {}) {
  const t = homeCopy(locale).nav;
  const links = navLinks(locale);
  return (
    <header className="relative z-50 h-[76px] sm:h-[84px]">
      <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav
        aria-label="Main"
        className="relative mx-auto flex h-16 border border-line bg-surface shadow-[0_8px_24px_-12px_rgb(0_0_0/0.18)] max-w-6xl items-center justify-between gap-4 rounded-full py-2 pl-4 pr-2 sm:pl-5"
      >
        <Link href={localePath(locale, "/")} className="flex items-center gap-2.5 font-semibold text-text">
          <LogoMark className="size-7" />
          <span className={`hidden text-[17px] tracking-[-0.01em] ${locale === "en" ? "min-[360px]:inline" : "min-[420px]:inline"}`}>{site.name}</span>
        </Link>

        <ul className="hidden items-center gap-7 text-[15px] text-text lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              {link.demo ? (
                <WatchDemoButton className="cursor-pointer transition-colors hover:text-muted">{link.label}</WatchDemoButton>
              ) : (
                <a href={link.href} className="transition-colors hover:text-muted">
                  {link.label}
                </a>
              )}
            </li>
          ))}
          <li>
            <a href={site.chromeStoreUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-muted">
              {t.chrome}
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <MobileMenu links={links} chromeStoreUrl={site.chromeStoreUrl} labels={{ chrome: t.chrome, signIn: t.signIn, open: t.openMenu, close: t.closeMenu }} signInUntilMd={locale !== "en"} />
          <Link href="/login" className={`hidden whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] font-medium text-text hover:bg-sunken ${locale === "en" ? "sm:block" : "md:block"}`}>
            {t.signIn}
          </Link>
          {/* Free plan: sign in with Google if needed, then the dashboard (see /start). */}
          <a
            href="/start"
            className="btn-primary inline-flex h-11 items-center whitespace-nowrap rounded-full bg-text px-4 text-sm font-semibold sm:h-12 sm:px-5 sm:text-[15px] text-canvas transition-colors hover:bg-text/85"
          >
            {t.cta}
          </a>
        </div>
      </nav>
      </div>
    </header>
  );
}
