import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta, SiteFooter } from "@/components/home-sections";
import { JsonLd } from "@/components/json-ld";
import { SiteNav } from "@/components/site-nav";
import { currentOffer } from "@/lib/billing";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Support",
  alternates: { canonical: "/support" },
  description: `Help with ${site.name}: moving the recording controls between tabs, stopping a recording from another app, and finishing interrupted uploads.`,
};

const link = "underline underline-offset-2 hover:text-text";

// `text` is the plain-text answer for search engines (FAQPage structured data).
const questions: { q: string; text: string; a: React.ReactNode }[] = [
  {
    q: "How do I get the recording controls and camera on another tab or app?",
    text: "On another Chrome tab: click the Showthrough icon in the toolbar while you're recording. The controls and your camera move to that tab. Do the same whenever you switch tabs and want them with you. Your recording keeps going either way. On other apps (VS Code, Figma, Slack and so on): Chrome extensions can only show things inside Chrome's web pages, so Chrome doesn't let the controls or camera appear over other apps. Your screen is still recorded while you work in them. We're building a Mac app that will put the controls and camera over every app. A few Chrome pages, like chrome:// pages, the new tab page and the Chrome Web Store, don't allow extensions at all, so the controls can't appear there either.",
    a: (
      <>
        <span className="block">
          <b className="text-text">On another Chrome tab:</b> click the {site.name} icon in the toolbar while you&rsquo;re recording. The
          controls and your camera move to that tab. Do the same whenever you switch tabs and want them with you. Your recording keeps
          going either way.
        </span>
        <span className="mt-3 block">
          <b className="text-text">On other apps</b> (VS Code, Figma, Slack and so on): Chrome extensions can only show things inside
          Chrome&rsquo;s web pages, so Chrome doesn&rsquo;t let the controls or camera appear over other apps. Your screen is still recorded
          while you work in them. We&rsquo;re{" "}
          <Link href="/roadmap" className={link}>
            building a Mac app
          </Link>{" "}
          that will put the controls and camera over every app.
        </span>
        <span className="mt-3 block">
          A few Chrome pages, like <code>chrome://</code> pages, the new tab page and the Chrome Web Store, don&rsquo;t allow extensions at
          all, so the controls can&rsquo;t appear there either.
        </span>
      </>
    ),
  },
  {
    q: "How do I stop a recording while I'm in another app?",
    text: "Use Chrome's own \"Stop sharing\" bar, which shows while you're recording your screen or a window. Showthrough saves the recording and opens its link, the same as pressing stop. Or switch back to Chrome and click the Showthrough icon to bring the controls to the tab you're on.",
    a: (
      <>
        Use Chrome&rsquo;s own &ldquo;Stop sharing&rdquo; bar, which shows while you&rsquo;re recording your screen or a window.{" "}
        {site.name} saves the recording and opens its link, the same as pressing stop. Or switch back to Chrome and click the {site.name}{" "}
        icon to bring the controls to the tab you&rsquo;re on.
      </>
    ),
  },
  {
    q: "The controls disappeared from my tab. Is my recording lost?",
    text: "No. If the page reloads, or Chrome unloads a background tab to save memory, the controls go with it, but the recording keeps running. Click the Showthrough icon on any normal tab and the controls come back, with the timer still counting.",
    a: (
      <>
        No. If the page reloads, or Chrome unloads a background tab to save memory, the controls go with it, but the recording keeps
        running. Click the {site.name} icon on any normal tab and the controls come back, with the timer still counting.
      </>
    ),
  },
  {
    q: "My internet dropped or Chrome closed during a recording. What now?",
    text: "Recordings upload while you talk, and anything not yet uploaded is kept in Chrome. Click the Showthrough icon: if a recording didn't finish uploading, the panel shows a \"Finish interrupted upload\" button. Click it and the video is completed in your library.",
    a: (
      <>
        Recordings upload while you talk, and anything not yet uploaded is kept in Chrome. Click the {site.name} icon: if a recording
        didn&rsquo;t finish uploading, the panel shows a &ldquo;Finish interrupted upload&rdquo; button. Click it and the video is
        completed in your library.
      </>
    ),
  },
];

export default async function SupportPage() {
  const offer = await currentOffer();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: questions.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.text } })),
        }}
      />
      <SiteNav />
      <main>
        <section className="mx-auto max-w-3xl px-5 pb-12 pt-20 text-center sm:px-8 sm:pt-28">
          <h1 className="text-[48px] leading-[1.02] sm:text-[76px]" style={{ letterSpacing: "-0.03em" }}>
            Support
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Answers to the questions people ask most while recording. Still stuck? Email{" "}
            <a href={`mailto:${site.contactEmail}`} className={link}>
              {site.contactEmail}
            </a>{" "}
            and we&rsquo;ll help.
          </p>
        </section>

        <section className="mx-auto max-w-3xl px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="divide-y divide-line border-y border-line">
            {questions.map((item) => (
              <article key={item.q} className="py-8">
                <h2 className="text-[24px] leading-tight sm:text-[28px]">{item.q}</h2>
                <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">{item.a}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-center text-muted">
            More questions about pricing and storage are in the{" "}
            <Link href="/#faq" className={link}>
              FAQ
            </Link>
            .
          </p>
        </section>

        <FinalCta price={offer.price} />
      </main>
      <SiteFooter />
    </>
  );
}
