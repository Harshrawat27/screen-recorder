import Link from "next/link";
import { site } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span aria-hidden className="grid size-6 place-items-center rounded-full bg-ink">
        <span className="size-2.5 rounded-full bg-rec" />
      </span>
      {site.name}
    </Link>
  );
}

export function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
      <Logo />
      <nav className="flex items-center gap-6 text-sm">
        <a href="#pricing" className="hidden text-slate hover:text-ink sm:inline">
          Pricing
        </a>
        <a href="#faq" className="hidden text-slate hover:text-ink sm:inline">
          Questions
        </a>
        <a
          href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(`${site.name} beta`)}`}
          className="rounded-full bg-ink px-4 py-2 font-medium text-paper hover:bg-ink/90"
        >
          Join the beta
        </a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-slate sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Logo />
        <nav className="flex gap-6">
          <Link href="/privacy/" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms/" className="hover:text-ink">
            Terms
          </Link>
          <a href={`mailto:${site.contactEmail}`} className="hover:text-ink">
            Contact
          </a>
        </nav>
        <p>© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
