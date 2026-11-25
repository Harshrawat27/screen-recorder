import type { Metadata } from "next";
import { WatchDemoButton } from "@/components/hero-video";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/author-box";
import { SiteFooter } from "@/components/home-sections";
import { JsonLd } from "@/components/json-ld";
import { SiteNav } from "@/components/site-nav";
import { buttonClass } from "@/components/ui";
import { author, authorId, personSchema } from "@/lib/author";
import { formatDate, getPost, posts } from "@/lib/blog";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  const images = [{ url: post.image.src, width: post.image.width, height: post.image.height, alt: post.image.alt }];
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: url },
    authors: [{ name: author.name, url: `${site.url}${author.path}` }],
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: ["Harsh Rawat"],
      images,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [post.image.src] },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${site.url}/blog/${post.slug}`;
  const { Body } = post;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              headline: post.title,
              description: post.description,
              image: `${site.url}${post.image.src}`,
              datePublished: post.published,
              dateModified: post.updated,
              author: { "@id": authorId },
              publisher: { "@id": `${site.url}/#organization` },
              mainEntityOfPage: url,
            },
            personSchema(),
            {
              "@type": "Organization",
              "@id": `${site.url}/#organization`,
              name: site.name,
              url: site.url,
              logo: `${site.url}/apple-icon.png`,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: site.name, item: site.url },
                { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
                { "@type": "ListItem", position: 3, name: post.title, item: url },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: post.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />
      <div className="sky">
        <SiteNav />
      </div>

      <main className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <nav aria-label="Breadcrumb" className="pt-10 text-sm text-muted">
          <Link href="/" className="hover:text-text">
            Home
          </Link>
          <span className="px-2 text-faint">/</span>
          <Link href="/blog" className="hover:text-text">
            Blog
          </Link>
        </nav>

        <article>
          <header className="pt-8">
            <h1 className="text-[38px] leading-[1.06] sm:text-[54px]" style={{ letterSpacing: "-0.03em" }}>
              {post.title}
            </h1>
            <p className="mt-5 text-sm text-muted">
              By{" "}
              <Link href={author.path} className="underline underline-offset-2 hover:text-text">
                {author.name}
              </Link>{" "}
              · <time dateTime={post.updated}>{formatDate(post.updated)}</time> · {post.readingMinutes} min read
            </p>
          </header>

          <div className="prose-blog mt-10">
            <Body />
          </div>
          <AuthorBox />
        </article>

        <aside className="mt-16 rounded-[24px] border border-line bg-surface p-8 text-center">
          <h2 className="text-[28px] leading-tight" style={{ letterSpacing: "-0.02em" }}>
            Record in one click. Share the moment you stop.
          </h2>
          <p className="mx-auto mt-3 max-w-[48ch] leading-relaxed text-muted">
            {site.name} works in Chrome on any computer. No video or time limits, videos stay in your own Cloudflare, and you pay once.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <WatchDemoButton className={buttonClass("primary", "lg", "rounded-full px-7")}>See how it works</WatchDemoButton>
            <Link href="/pricing" className={buttonClass("secondary", "lg", "rounded-full px-7")}>
              Pricing
            </Link>
          </div>
        </aside>
      </main>

      <SiteFooter />
    </>
  );
}
