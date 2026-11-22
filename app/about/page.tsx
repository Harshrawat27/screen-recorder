import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/home-sections";
import { JsonLd } from "@/components/json-ld";
import { SiteNav } from "@/components/site-nav";
import { author, authorId, personSchema } from "@/lib/author";
import { posts } from "@/lib/blog";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About Harsh Rawat, founder of Showthrough" },
  description:
    "Harsh Rawat is an indie developer from Delhi and the founder of Showthrough. Five years of freelancing in design and frontend, and why he built a pay-once screen recorder.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const recent = [...posts].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 5);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ProfilePage",
              "@id": `${site.url}/about`,
              url: `${site.url}/about`,
              name: "About Harsh Rawat, founder of Showthrough",
              mainEntity: { "@id": authorId },
            },
            personSchema(),
            breadcrumbSchema([["About", "/about"]]),
          ],
        }}
      />
      <div className="sky">
        <SiteNav />
      </div>

      <main className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <header className="flex flex-col items-start gap-6 pt-16 sm:flex-row sm:items-center sm:pt-24">
          <span aria-hidden className="grid size-20 shrink-0 place-items-center rounded-full bg-text text-2xl font-semibold text-canvas">
            {author.initials}
          </span>
          <div>
            <h1 className="text-[40px] leading-[1.05] sm:text-[56px]" style={{ letterSpacing: "-0.03em" }}>
              Hi, I&rsquo;m Harsh
            </h1>
            <p className="mt-3 text-lg text-muted">
              {author.role} · {author.location}
            </p>
          </div>
        </header>

        <div className="prose-blog mt-10">
          <p>
            I&rsquo;m an indie developer from Delhi, India, and I build {site.name} on my own. Before that, I spent five years freelancing. I
            started with book design, moved into UI/UX and web design in Figma, and then into frontend development with Webflow, React and React
            Native.
          </p>

          <h2>Why I built {site.name}</h2>
          <p>
            As a freelancer, my clients wanted small updates all the time. At first I sent them as text messages, Google Docs or Google Meet calls.
            Writing out something that was easier to show took too long, and booking a call for a two-minute update wasted everyone&rsquo;s time.
          </p>
          <p>
            Loom fixed that, and it became the tool I used most. But the free plan ran out within weeks, and once two or three people were working
            with me, paying for every person every month added up fast. So I built the recorder I wanted: one click to record, a link the moment you
            stop, no limits, and one payment instead of a subscription. Your videos live in your own Cloudflare account, so I never hold them.
          </p>

          <h2>Other things I&rsquo;ve made</h2>
          <ul>
            <li>
              <strong>Spendler</strong>, a privacy-first expense tracker for iPhone with no bank linking
            </li>
            <li>
              <strong>VibeTasking</strong>, voice reminders in the Mac menu bar
            </li>
            <li>
              <strong>LearNoted</strong>, a Chrome extension for YouTube timestamps, highlights and in-page search
            </li>
            <li>
              <strong>GitHubFolio</strong>, a one-click developer portfolio built from your GitHub
            </li>
            <li>
              <strong>PicloreAI</strong>, a template-based image creation tool
            </li>
          </ul>

          <h2>What I write about</h2>
          <p>
            On the <Link href="/blog">blog</Link> I write about screen recording, async work and working with clients, mostly from what I learned
            freelancing. Recent posts:
          </p>
          <ul>
            {recent.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>

          <h2>Say hello</h2>
          <p>
            I read every message. You can find me on{" "}
            {author.profiles.map((p, i) => (
              <span key={p.href}>
                <a href={p.href} target="_blank" rel="noopener noreferrer me">
                  {p.label}
                </a>
                {i < author.profiles.length - 2 ? ", " : i === author.profiles.length - 2 ? " and " : ""}
              </span>
            ))}
            , or reach me through the <Link href="/support">support page</Link>.
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
