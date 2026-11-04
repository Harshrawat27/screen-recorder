import type { Metadata } from "next";
import { FinalCta, SiteFooter } from "@/components/home-sections";
import { SiteNav } from "@/components/site-nav";
import { CheckIcon } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Roadmap",
  description: `What's coming to ${site.name}: team members, AI titles and chapters, comments and reactions, and a video editor.`,
};

const big: { title: string; body: string; points: string[]; icon: React.ReactNode }[] = [
  {
    title: "Team members",
    body: "Invite your team into one shared library. Everyone records with their own account, and every video lands in your company's Cloudflare.",
    points: [
      "Invite people by email, remove them anytime",
      "One shared library, with who recorded what",
      "Each member gets their own upload key, so removing someone locks them out right away",
      "Still one price for the whole team, no per-seat fees",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5M15.5 14.6c2.4-.3 4.4 1.1 5 3.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "AI titles, summaries and chapters",
    body: "Every recording gets transcribed, then titled, summarized and split into chapters automatically. It all runs on Cloudflare's AI inside your own account, so your audio never goes to us or anyone else.",
    points: [
      "A clear title instead of “Recording, 4 Nov”",
      "A two-line summary at the top of every video",
      "Chapters with timestamps viewers can click to jump",
      "Captions and a searchable transcript",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
        <path d="M12 3l1.8 4.6L18.5 9.5l-4.7 1.9L12 16l-1.8-4.6L5.5 9.5l4.7-1.9z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Comments and reactions",
    body: "Viewers can react with an emoji or leave a comment pinned to the exact moment in the video, so feedback lands where it belongs instead of in a long thread.",
    points: [
      "Comments pinned to a timestamp",
      "Emoji reactions on the timeline",
      "Choose per video who can comment",
      "Stored in your Cloudflare, like your videos",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
        <path
          d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4.5 3.5V17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Video editor",
    body: "Fix a recording without starting over. Trim the start and end, cut out a mistake in the middle, and the share link updates in place.",
    points: [
      "Trim the beginning and end",
      "Cut out parts in the middle",
      "Edits happen in your browser, no re-upload",
      "Undo anytime: the original recording is kept",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
        <circle cx="6.5" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="6.5" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8.6 8.4L20 16M8.6 15.6L20 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
];

const more: { title: string; body: string }[] = [
  { title: "Private links", body: "Password-protected videos, encrypted so only people with the link or password can watch." },
  { title: "Import from Loom", body: "Bring your whole Loom library over in one click." },
  { title: "Your own domain", body: "Share links on videos.yourcompany.com." },
  { title: "Slack previews", body: "Videos play right inside Slack." },
  { title: "Hover previews", body: "Scrub through a video by hovering, like YouTube." },
  { title: "Viewer insights", body: "See who watched and how far they got." },
  { title: "Download as MP4", body: "Save any recording as a regular video file." },
  { title: "Mac app", body: "Record without opening Chrome." },
];

export default function RoadmapPage() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="mx-auto max-w-3xl px-5 pb-16 pt-20 text-center sm:px-8 sm:pt-28">
          <h1 className="text-[48px] leading-[1.02] sm:text-[76px]" style={{ letterSpacing: "-0.03em" }}>
            What&rsquo;s coming next
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {site.name} records and shares today. Here&rsquo;s what we&rsquo;re building next. The first 100 buyers get every one of
            these updates free, forever.
          </p>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-5 sm:px-8 md:grid-cols-2">
          {big.map((item) => (
            <article key={item.title} className="flex flex-col rounded-[24px] border border-line bg-surface p-7 sm:p-9">
              <div className="flex items-center justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-full border border-line bg-sunken">{item.icon}</span>
                <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-muted">Planned</span>
              </div>
              <h2 className="mt-6 text-[30px] leading-tight">{item.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
              <ul className="mt-6 space-y-3 border-t border-line pt-6 text-[15px]">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-text text-canvas">
                      <CheckIcon className="size-3" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[40px] leading-[1.04] sm:text-[56px]" style={{ letterSpacing: "-0.025em" }}>
              And plenty more on the list
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              These are planned too. Tell us what you need most and it moves up the list.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {more.map((item) => (
              <div key={item.title} className="bg-surface p-6">
                <h3 className="text-[20px] leading-tight">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-muted">
            Missing something?{" "}
            <a href={`mailto:${site.contactEmail}?subject=${encodeURIComponent("Feature request")}`} className="font-medium text-text underline underline-offset-4">
              Send us a request
            </a>
            .
          </p>
        </section>

        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
