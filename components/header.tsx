import Link from "next/link";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoMark, buttonClass } from "@/components/ui";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-[17px] font-bold tracking-tight text-text">
      <LogoMark />
      {site.name}
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-1">
          <div className="hidden items-center gap-1 sm:flex">
            <Link href="/#pricing" className={buttonClass("ghost", "sm")}>
              Pricing
            </Link>
            <Link href="/#how" className={buttonClass("ghost", "sm")}>
              How it works
            </Link>
          </div>
          <ThemeToggle />
          <Link href="/login" className={buttonClass("ghost", "sm")}>
            Sign in
          </Link>
          <Link href="/#pricing" className={buttonClass("primary", "sm", "ml-1")}>
            Get {site.name}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Logo />
        <nav className="flex gap-6">
          <Link href="/privacy" className="hover:text-text">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-text">
            Terms
          </Link>
          <Link href="/#pricing" className="hover:text-text">
            Pricing
          </Link>
        </nav>
        <p>© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
