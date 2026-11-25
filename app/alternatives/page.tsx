import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta, SiteFooter } from "@/components/home-sections";
import { JsonLd } from "@/components/json-ld";
import { SiteNav } from "@/components/site-nav";
import { currentOffer } from "@/lib/billing";
import { authorId, personSchema } from "@/lib/author";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

// The "best Loom alternatives" roundup. This page targets "loom alternatives"; each tool's
// detailed comparison lives at /alternatives/<slug> (lib/alternatives.ts), and free tools have
// their own post at /blog/free-loom-alternatives.
//
// Keep it honest: every price and limit comes from the tool's own pricing page on the dates
// below. Showthrough is listed as one option, with its gaps stated, and the page says we make it.

export const dynamic = "force-dynamic";

const UPDATED = "2026-11-22";
const CHECKED = "between 10 and 22 November 2026";

export const metadata: Metadata = {
  title: "10 best Loom alternatives and competitors in 2026, compared",
  description:
    "The best Loom alternatives and competitors compared on price, free-plan limits and recording length: Vidyard, Screencastify, Tella, Cap, Screenity, OBS, Zight and more.",
  alternates: { canonical: "/alternatives" },
};

type Tool = {
  id: string;
  name: string;
  verdict: string;
  site: string;
  /** Slug of our detailed comparison page, if there is one. */
  vs?: string;
  price: string;
  free: string;
  length: string;
  platform: string;
  body: string[];
  good: string[];
  watch: string[];
};

function tools(price: number): Tool[] {
  return [
    {
      id: "showthrough",
      name: site.name,
      verdict: "best if you want to pay once",
      site: site.url,
      price: `$${price} once, no subscription`,
      free: "No free plan",
      length: "No limit",
      platform: "Chrome on Windows, Mac, Linux and ChromeOS",
      body: [
        "We make Showthrough, so read this one with that in mind. It’s a Chrome extension that records your screen, camera and voice, and gives you a share link the moment you stop. Viewers can watch, comment and react without an account.",
        "The difference is where your videos live and how you pay. Recordings are stored in your own Cloudflare account, connected in one click while we handle the setup, so there’s no per-seat bill that grows with your team. Cloudflare’s first 10 GB a month are free, which is about 8 hours of recordings, and you can delete old videos to stay under it; after that it’s $0.015 per GB.",
      ],
      good: ["Freelancers and small teams who send updates every day", "Long walkthroughs and handovers, with no time limit", "Anyone who wants to keep their videos in an account they own"],
      watch: [
        "No free plan, though you can get a refund within 7 days",
        "No AI summaries, video editor or mobile app yet; they’re on the roadmap",
        "Team accounts are coming soon; today it’s best for one person or a shared login",
      ],
    },
    {
      id: "vidyard",
      name: "Vidyard",
      verdict: "best for sales teams",
      site: "https://www.vidyard.com/pricing/",
      vs: "vidyard",
      price: "Paid plans not listed publicly",
      free: "5 videos a month, 30 minutes each",
      length: "30 minutes on free",
      platform: "Chrome extension and desktop app",
      body: [
        "Vidyard is built around sales outreach. It connects to Salesforce, HubSpot and other sales tools, logs who watched your video, and adds calls to action and branded sharing pages. It can also generate AI videos and avatars.",
        "The free plan allows 5 recordings a month of up to 30 minutes each, six times longer than Loom’s free plan, but the extras that make Vidyard worth using are on paid plans, and its pricing page shows no dollar amounts.",
      ],
      good: ["Sales reps who need video views tracked in their CRM", "Teams that want viewer analytics and calls to action"],
      watch: ["Only 5 free videos a month", "You have to talk to sales or start a trial to see prices"],
    },
    {
      id: "screencastify",
      name: "Screencastify",
      verdict: "best for teachers",
      site: "https://www.screencastify.com/pricing",
      vs: "screencastify",
      price: "From $7 per user per month, billed annually",
      free: "10 videos, 30 minutes each, watermark",
      length: "30 min free, 60 min Starter, 180 min Pro",
      platform: "Chrome extension",
      body: [
        "Screencastify is a Chrome recorder made for classrooms. You can add questions inside a video, set assignments and sync grades with your LMS, and the Pro plan adds captions, transcripts and translations.",
        "The free plan lets you create or upload 10 videos of up to 30 minutes and keep sharing them for as long as you like, but every free video carries a Castify watermark.",
      ],
      good: ["Teachers and schools", "Lessons with quizzes and assignments built in"],
      watch: ["Watermark on the free plan", "Recording length is capped even on paid plans"],
    },
    {
      id: "tella",
      name: "Tella",
      verdict: "best for polished demos",
      site: "https://www.tella.com/pricing",
      vs: "tella",
      price: "From $13 per user per month, billed annually",
      free: "No free plan; 7-day trial",
      length: "Up to 6 hours per clip",
      platform: "Mac and Windows apps, Chrome extension",
      body: [
        "Tella is for videos you publish rather than send. Its editor lets you cut by editing the transcript, remove filler words, and add layouts and zooms, and it exports in 4K.",
        "If your recordings are product demos, launch videos or course lessons, Tella will make them look better than any quick recorder. For a two-minute update to a client, it’s more than you need.",
      ],
      good: ["Product demos, launch videos and lessons", "People who want to edit before sharing"],
      watch: ["No free plan", "Per-user pricing adds up for a team"],
    },
    {
      id: "cap",
      name: "Cap",
      verdict: "best open-source option",
      site: "https://cap.so/pricing",
      vs: "cap",
      price: "$58 one-time per user (desktop), or Pro from $8.16 per user per month",
      free: "Personal use; 25 share links a month, 5 minutes each",
      length: "5 minutes per shared link on free",
      platform: "Mac, Windows and Linux",
      body: [
        "Cap is the closest open-source match to Loom: record on your desktop, get a link, and share it. You can read the code and host the whole thing yourself, and it has a desktop editor with 4K export.",
        "The free plan is for personal use only, with 25 share links a month of up to 5 minutes each. Cloud sharing for work needs Cap Pro, which is a subscription per user.",
      ],
      good: ["Developers who care about open source", "Teams happy to self-host"],
      watch: ["Free shared videos stop at 5 minutes", "Self-hosting means you run and update the servers"],
    },
    {
      id: "screenity",
      name: "Screenity",
      verdict: "best free recorder for Chrome",
      site: "https://screenity.io/extension",
      price: "Recorder free; editor is a paid upgrade",
      free: "No video or time limit, no watermark",
      length: "No limit",
      platform: "Chrome extension",
      body: [
        "Screenity’s recorder is free and open source, with no watermark, no time limit and no sign-in. You can draw on the screen, blur sensitive parts and highlight clicks while you record.",
        "The catch is sharing: the free recorder saves the video to your computer, so you upload it somewhere yourself before anyone can watch it. The editor, with zooms and captions, is a paid upgrade with a 7-day trial.",
      ],
      good: ["Recording in Chrome for free with no limits", "People who are fine sharing a file"],
      watch: ["No share link on the free recorder", "Chrome and Chromium browsers only"],
    },
    {
      id: "obs",
      name: "OBS Studio",
      verdict: "best free desktop recorder",
      site: "https://obsproject.com",
      price: "Free and open source",
      free: "Everything; no paid plan",
      length: "No limit",
      platform: "Windows, Mac and Linux",
      body: [
        "OBS Studio is the free app most streamers and YouTubers use. It records your screen, camera and several microphones into one high-quality video, with no limits on the number or length of recordings.",
        "It takes time to set up scenes and sources, and it has no editor or share links, so it suits long, polished recordings more than quick updates.",
      ],
      good: ["Long, high-quality recordings", "Streaming as well as recording"],
      watch: ["A learning curve", "Gives you a file, not a link"],
    },
    {
      id: "screenpal",
      name: "ScreenPal",
      verdict: "best for budget tutorials",
      site: "https://screenpal.com/plans",
      vs: "screenpal",
      price: "From a few dollars a month, billed annually",
      free: "15 minutes per recording",
      length: "15 minutes on free",
      platform: "Windows, Mac, Chromebook and mobile",
      body: [
        "ScreenPal, formerly Screencast-O-Matic, pairs a recorder with an editor, a stock library and quizzes. Its paid plans are among the cheapest recurring plans in this list.",
        "The free plan records up to 15 minutes at a time and includes basic editing, but it doesn’t capture sound playing on your computer.",
      ],
      good: ["Edited tutorials and lessons on a small budget"],
      watch: ["No system audio on the free plan", "Its pricing page is unclear about free video hosting"],
    },
    {
      id: "zight",
      name: "Zight",
      verdict: "best for screenshots and video in one",
      site: "https://zight.com/pricing/",
      vs: "zight",
      price: "From $9.95 per user per month, billed annually",
      free: "5-minute recordings, 720p, 1 GB storage",
      length: "5 minutes on free",
      platform: "Mac, Windows, Chrome and mobile",
      body: [
        "Zight, formerly CloudApp, puts screenshots, annotated images, GIFs and screen recordings in one app, with desktop and mobile apps. Paid plans add AI transcription, titles and password-protected items.",
        "The free plan is tight for video: 5-minute recordings at up to 720p, 1 GB of storage and your last 50 captures.",
      ],
      good: ["Teams that send screenshots and GIFs as often as video"],
      watch: ["5 minutes and 1 GB on the free plan", "Per-user pricing"],
    },
    {
      id: "snagit",
      name: "Snagit",
      verdict: "best for screenshots and written guides",
      site: "https://www.techsmith.com/snagit/",
      vs: "snagit",
      price: "$39 per user per year",
      free: "No free plan; 14-day money-back guarantee",
      length: "Saved to your computer",
      platform: "Mac and Windows",
      body: [
        "Snagit is first a screenshot tool: scrolling capture, annotation, blur and templates for step-by-step guides. It records video too, and it works offline as a desktop app.",
        "If most of what you send is screenshots and written guides, it’s hard to beat. As a Loom replacement for quick video updates, it’s less direct, because you share files rather than links by default.",
      ],
      good: ["Documentation, how-to guides and annotated screenshots"],
      watch: ["A yearly subscription per user", "Built around screenshots more than video links"],
    },
  ];
}

export default async function AlternativesPage() {
  const { price } = await currentOffer();
  const list = tools(price);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${site.url}/alternatives`,
              url: `${site.url}/alternatives`,
              name: "10 best Loom alternatives in 2026, compared",
              dateModified: UPDATED,
              author: { "@id": authorId },
              publisher: { "@id": `${site.url}/#organization` },
            },
            {
              "@type": "ItemList",
              name: "Best Loom alternatives",
              itemListElement: list.map((tool, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: tool.name,
                url: `${site.url}/alternatives#${tool.id}`,
              })),
            },
            personSchema(),
            breadcrumbSchema([["Loom alternatives", "/alternatives"]]),
          ],
        }}
      />
      <div className="sky">
        <SiteNav />
      </div>

      <main className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
        <header className="mx-auto max-w-3xl pt-16 text-center sm:pt-24">
          <h1 className="text-[40px] leading-[1.04] sm:text-[60px]" style={{ letterSpacing: "-0.03em" }}>
            The 10 best Loom alternatives in 2026, compared
          </h1>
          <p className="mx-auto mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
            What each one costs, where its free plan stops, and who it suits. We make {site.name}, so it&rsquo;s on the list, with its gaps
            stated as plainly as everyone else&rsquo;s.
          </p>
          <p className="mt-4 text-sm text-faint">
            By{" "}
            <Link href="/about" className="underline underline-offset-2 hover:text-text">
              Harsh Rawat
            </Link>{" "}
            · Updated 22 November 2026 · Prices checked {CHECKED} on each tool&rsquo;s own pricing page
          </p>
        </header>

        <div className="prose-blog mx-auto mt-14 max-w-3xl">
          <p>
            Loom is still a good tool. People look for alternatives for three reasons: the free plan stops at 25 videos and 5 minutes per
            recording (see <Link href="/blog/is-loom-free">Is Loom free?</Link>), the paid plans cost $18 per person every month (see{" "}
            <Link href="/blog/loom-pricing">Loom pricing explained</Link>), or they need something Loom doesn&rsquo;t do, like CRM tracking or
            classroom quizzes. This guide covers the ten tools worth considering, grouped by what you need.
          </p>

          <div className="callout">
            <p>
              <strong>Quick picks:</strong>
            </p>
            <ul>
              <li>
                <strong>Pay once, no subscription:</strong> <a href="#showthrough">{site.name}</a>
              </li>
              <li>
                <strong>Sales outreach:</strong> <a href="#vidyard">Vidyard</a>
              </li>
              <li>
                <strong>Teaching:</strong> <a href="#screencastify">Screencastify</a>
              </li>
              <li>
                <strong>Polished, edited demos:</strong> <a href="#tella">Tella</a>
              </li>
              <li>
                <strong>Open source:</strong> <a href="#cap">Cap</a>
              </li>
              <li>
                <strong>Free with no limits:</strong> <a href="#screenity">Screenity</a> in Chrome, <a href="#obs">OBS Studio</a> on desktop
              </li>
            </ul>
          </div>

          <h2>All ten at a glance</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Tool</th>
                  <th scope="col">Price</th>
                  <th scope="col">Free plan</th>
                  <th scope="col">Recording length</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Loom (for comparison)</th>
                  <td>$18 per user per month</td>
                  <td>25 videos, 5 minutes each</td>
                  <td>5 minutes on free</td>
                </tr>
                {list.map((tool) => (
                  <tr key={tool.id}>
                    <th scope="row">
                      <a href={`#${tool.id}`}>{tool.name}</a>
                    </th>
                    <td>{tool.price}</td>
                    <td>{tool.free}</td>
                    <td>{tool.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {list.map((tool, i) => (
            <section key={tool.id} id={tool.id} className="scroll-mt-28">
              <h2>
                {i + 1}. {tool.name}: {tool.verdict}
              </h2>
              <p className="text-sm">
                <strong>Price:</strong> {tool.price} · <strong>Free plan:</strong> {tool.free} · <strong>Runs on:</strong> {tool.platform}
              </p>
              {tool.body.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
              <p>
                <strong>Good for</strong>
              </p>
              <ul>
                {tool.good.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                <strong>Watch out for</strong>
              </p>
              <ul>
                {tool.watch.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                {tool.id === "showthrough" ? (
                  <>
                    See <Link href="/pricing">pricing</Link>, the <Link href="/guide">setup guide</Link>, or{" "}
                    <Link href="/alternatives/loom">{site.name} vs Loom</Link> in detail.
                  </>
                ) : tool.vs ? (
                  <>
                    <a href={tool.site} target="_blank" rel="noopener noreferrer nofollow">
                      {tool.name}&rsquo;s pricing
                    </a>{" "}
                    · <Link href={`/alternatives/${tool.vs}`}>{tool.name} vs {site.name}, in detail</Link>
                  </>
                ) : (
                  <a href={tool.site} target="_blank" rel="noopener noreferrer nofollow">
                    {tool.name}&rsquo;s website
                  </a>
                )}
              </p>
            </section>
          ))}

          <h2>How to choose</h2>
          <p>Four questions narrow it down quickly:</p>
          <ol>
            <li>
              <strong>Do you need a link or is a file fine?</strong> If you send videos to clients or teammates, pick a tool that gives you a link.
              Screenity and OBS are free with no limits, but you share the file yourself.
            </li>
            <li>
              <strong>How long are your recordings?</strong> Free plans cap length at 5 minutes (Loom, Zight, Cap&rsquo;s share links), 15
              minutes (ScreenPal) or 30 minutes (Vidyard, Screencastify).
            </li>
            <li>
              <strong>How many people will record?</strong> Most tools charge per person. For a team of five, $18 a month each is $1,080 a year;
              a one-time price or a free tool changes that maths completely.
            </li>
            <li>
              <strong>Do you edit before sharing?</strong> If yes, look at Tella, ScreenPal or Cap. If you just record and send, an editor is
              weight you don&rsquo;t need.
            </li>
          </ol>
          <p>
            As a freelancer, I sent small updates to clients every day. I started with text, Google Docs and Google Meet calls, moved to Loom, and
            ran into its free-plan limits within a couple of weeks. That&rsquo;s why the questions above start with links and length: for daily
            updates, those matter more than editing features.
          </p>

          <h2>When Loom is still the right choice</h2>
          <p>
            Stay with Loom if you rely on its AI summaries and chapters, need its mobile app, or your company already runs on Atlassian tools like
            Jira and Confluence. None of the alternatives here match all of that in one product. If price is the only problem, compare what your
            team actually pays first in <Link href="/blog/loom-pricing">Loom pricing explained</Link>.
          </p>

          <h2>Questions people ask</h2>
          <h3>What is the best Loom alternative?</h3>
          <p>
            It depends on the job. Vidyard is best for sales, Screencastify for teaching, Tella for edited demos and Cap for open source. For free
            recording with no limits, use Screenity or OBS Studio. If you want to pay once instead of per person every month, {site.name} is built
            for that.
          </p>
          <h3>Is there a free Loom alternative?</h3>
          <p>
            Yes. Screenity and OBS Studio are free with no limits but give you a file. Cap, Vidyard, Screencastify, ScreenPal and Zight have free
            plans with share links and limits. Each is compared in <Link href="/blog/free-loom-alternatives">7 free Loom alternatives</Link>.
          </p>
          <h3>Is there a Loom alternative without a subscription?</h3>
          <p>
            Yes. {site.name} is a one-time payment, Cap sells a one-time desktop license for local recordings, and Screenity and OBS Studio are
            free. Most others are monthly or yearly subscriptions per user.
          </p>
          <h3>Which Loom alternative works in Chrome?</h3>
          <p>
            {site.name}, Screencastify and Screenity are Chrome extensions, and Vidyard, Tella and Zight also offer one. They work the same on Windows,
            Mac and Chromebooks.
          </p>
        </div>
      </main>

      <FinalCta price={price} />
      <SiteFooter />
    </>
  );
}
