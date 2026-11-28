import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/home-sections";
import { SiteNav } from "@/components/site-nav";
import { formatDate, posts } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Guides on screen recording, async video and working with clients, from the maker of ${site.name}.`,
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const sorted = [...posts].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <>
      <div className="sky">
        <SiteNav />
      </div>

      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <header className="mx-auto max-w-3xl pt-16 text-center sm:pt-24">
          <h1 className="text-[44px] leading-[1.04] sm:text-[64px]" style={{ letterSpacing: "-0.03em" }}>
            Blog
          </h1>
          <p className="mx-auto mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">
            Guides on screen recording, async video and working with clients, written by the person who builds {site.name}.
          </p>
        </header>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-surface transition-colors hover:border-line-strong"
              >
                <Image
                  src={post.image.src}
                  alt={post.image.alt}
                  width={post.image.width}
                  height={post.image.height}
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[16/9] w-full border-b border-line object-cover object-top"
                />
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-[19px] leading-snug" style={{ letterSpacing: "-0.02em" }}>
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
                  <p className="mt-4 text-[13px] text-faint">
                    <time dateTime={post.published}>{formatDate(post.published)}</time> · {post.readingMinutes} min read
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </>
  );
}
