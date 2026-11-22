import Link from "next/link";
import { author } from "@/lib/author";

// "About the author" box at the end of blog posts.
export function AuthorBox() {
  return (
    <aside aria-label="About the author" className="mt-14 flex gap-5 rounded-[24px] border border-line bg-surface p-6 sm:p-7">
      <span
        aria-hidden
        className="grid size-14 shrink-0 place-items-center rounded-full bg-text text-[17px] font-semibold text-canvas"
      >
        {author.initials}
      </span>
      <div>
        <p className="text-sm text-muted">Written by</p>
        <p className="mt-0.5 text-[18px] font-semibold">
          <Link href={author.path} className="hover:underline">
            {author.name}
          </Link>
        </p>
        <p className="mt-2 leading-relaxed text-muted">{author.short}</p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link href={author.path} className="font-medium underline underline-offset-2 hover:text-muted">
            More about me
          </Link>
          {author.profiles.map((p) => (
            <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer me" className="text-muted hover:text-text">
              {p.label}
            </a>
          ))}
        </p>
      </div>
    </aside>
  );
}
