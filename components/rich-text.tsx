import Link from "next/link";
import { Fragment } from "react";
import { site } from "@/lib/site";

// Renders translated copy that uses **bold**, [[label|href]] links and {email}.
// "CHROME" as an href means the Chrome Web Store listing.

const linkClass = "font-medium text-text underline underline-offset-2 hover:text-muted";

export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[\[[^\]]+\]\]|\{email\})/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**")) return <b key={i}>{part.slice(2, -2)}</b>;
        if (part === "{email}")
          return (
            <a key={i} href={`mailto:${site.contactEmail}`} className={linkClass}>
              {site.contactEmail}
            </a>
          );
        if (part.startsWith("[[")) {
          const [label, raw] = part.slice(2, -2).split("|");
          const href = raw === "CHROME" ? site.chromeStoreUrl : raw;
          if (href.startsWith("http"))
            return (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {label}
              </a>
            );
          return (
            <Link key={i} href={href} className={linkClass}>
              {label}
            </Link>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
