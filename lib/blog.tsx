import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

// Blog posts. Each post has its metadata (used for the page title, sitemap and structured data)
// and its body as JSX, styled by `.prose-blog` in globals.css.
//
// Before publishing a new post: give it a unique slug and title, put images in /public/blog,
// and set `published` and `updated`. Change `updated` whenever the post's facts change.

export type Post = {
  slug: string;
  /** The page's H1. */
  title: string;
  /** The <title> tag, without the " | Showthrough" suffix. Under ~55 characters. */
  metaTitle: string;
  /** Meta description, 140 to 160 characters. */
  description: string;
  /** One or two sentences for the blog index. */
  excerpt: string;
  published: string;
  updated: string;
  readingMinutes: number;
  image: { src: string; alt: string; width: number; height: number };
  /** Plain-text FAQ, repeated from the body, for FAQPage structured data. */
  faqs: { q: string; a: string }[];
  Body: () => ReactNode;
};

function Keys({ children }: { children: ReactNode }) {
  return <kbd>{children}</kbd>;
}

const chromebookFaqs = [
  {
    q: "What is the shortcut to screen record on a Chromebook?",
    a: "Shift + Ctrl + Show windows opens Screen capture. If your keyboard has no Show windows key, use Ctrl + Shift + F5. Press Search + Shift + X to stop recording.",
  },
  {
    q: "How do I screen record on a Chromebook with audio?",
    a: "Open Screen capture, select the gear icon and choose Microphone, Device audio, or Device audio and microphone before you start recording.",
  },
  {
    q: "Can I record myself and my screen at the same time on a Chromebook?",
    a: "Yes. In the Screen capture gear menu, turn on Front camera. Your camera appears in the corner of the recording.",
  },
  {
    q: "Is there a time limit on Chromebook screen recording?",
    a: "Google's help page doesn't list one. In practice the limit is the free space on your Chromebook, so save long recordings to Google Drive if space is tight.",
  },
  {
    q: "Where do Chromebook screen recordings go?",
    a: "To the Downloads folder in the Files app, as a .webm video, unless you choose another folder in the Screen capture gear menu.",
  },
  {
    q: "Does Chrome have a built-in screen recorder on Windows or Mac?",
    a: "No. The built-in recorder is part of ChromeOS, so it only exists on Chromebooks. On Windows or Mac, use your computer's own recorder or a Chrome extension.",
  },
  {
    q: "How do I share a screen recording as a link?",
    a: "Upload the file to Google Drive and change its sharing setting, or record with a Chrome extension like Showthrough that copies a link the moment you stop.",
  },
];

const LOOM_CHECKED = "19 November 2026";

const loomPricingFaqs = [
  {
    q: "How much does Loom cost per month?",
    a: "Loom Business costs $18 per user per month and Business + AI costs $24 per user per month. The Starter plan is free, and Enterprise is priced by quote.",
  },
  {
    q: "Is Loom free?",
    a: "Loom's Starter plan is free, but it allows 25 videos per person and 5 minutes per screen recording, at up to 720p. Removing those limits needs a paid plan.",
  },
  {
    q: "Is Loom cheaper if you pay yearly?",
    a: "Yes. Loom says yearly billing saves up to 17%, which brings Business to about $15 per user per month, or $180 a year.",
  },
  {
    q: "How much does Loom cost for a team of 5?",
    a: "On Business at monthly billing, 5 people pay $90 a month, or $1,080 a year. With yearly billing it's about $900 a year.",
  },
  {
    q: "What does Loom Business + AI add?",
    a: "Automatic titles, summaries and chapters, filler-word and silence removal, editing by transcript and meeting notes. It costs $6 more per user per month than Business.",
  },
  {
    q: "Does Loom have a free trial?",
    a: "You can try Business + AI free for 14 days, according to Loom's pricing page.",
  },
];

const asyncFaqs = [
  {
    q: "What is async communication?",
    a: "Async (asynchronous) communication is any message that doesn't need a reply right away. You send it when it suits you, and the other person reads, watches and answers when it suits them. Email, recorded videos, shared documents and comments are all async.",
  },
  {
    q: "What is an example of async communication?",
    a: "A 2-minute screen recording that walks a client through changes to their website, sent as a link instead of booking a call. Others are a written daily stand-up, comments on a shared document, or a code review left on a pull request.",
  },
  {
    q: "What is the difference between sync and async communication?",
    a: "Sync communication happens live, with everyone present at the same time, like meetings and phone calls. Async communication happens on each person's own schedule, like email, recorded videos and documents.",
  },
  {
    q: "Is Slack async or sync?",
    a: "It can be either. Slack works as async communication when people reply in threads on their own schedule, and as sync communication when everyone is expected to answer within minutes.",
  },
  {
    q: "When should you not use async communication?",
    a: "Use a live call for urgent problems, for anything that has gone back and forth without progress, for sensitive conversations, and for getting to know someone new.",
  },
  {
    q: "How do you run an async stand-up?",
    a: "Each person posts a short written or video update at the same time each day: what they did, what they're doing next, and anything blocking them. Others read it when they start work and reply only where something needs a decision.",
  },
];

const isLoomFreeFaqs = [
  {
    q: "Is Loom free?",
    a: "Yes. Loom's Starter plan is free, with up to 25 videos per person, a 5-minute limit on each screen recording, and video up to 720p.",
  },
  {
    q: "What happens when you reach 25 videos on Loom's free plan?",
    a: "You can't record new videos until you delete some or upgrade. Your existing videos stay available, and archived videos still count towards the 25.",
  },
  {
    q: "What happens when a Loom recording reaches 5 minutes on the free plan?",
    a: "On Starter, the timer counts down from 5:00 and the recording ends when it reaches zero.",
  },
  {
    q: "Is Loom free for students and teachers?",
    a: "Not any more. Loom's help centre says the free education plan is no longer available to new applicants. Verified students and educators can get a discount of up to 75% on paid plans instead.",
  },
  {
    q: "Does Loom have a free trial?",
    a: "Yes. You can try Loom Business + AI free for 14 days.",
  },
  {
    q: "How much does Loom cost after the free plan?",
    a: "Loom Business costs $18 per user per month, and Business + AI costs $24 per user per month. Paying yearly saves up to 17%.",
  },
];

const FREE_ALTS_CHECKED = "22 November 2026";

const freeAltsFaqs = [
  {
    q: "What is the best free Loom alternative?",
    a: "It depends on what you need. Screenity is the closest free option inside Chrome, with no video or time limit, but it saves files to your computer instead of giving you a link. Cap gives you share links for free, up to 25 a month and 5 minutes each. OBS Studio is best for long, high-quality recordings if you don't mind a learning curve.",
  },
  {
    q: "Is there a free Loom alternative with no time limit?",
    a: "Yes. Screenity's free recorder and OBS Studio both have no time limit. Both save the video as a file, so you share it yourself. Among tools that host your video, Vidyard and Screencastify allow 30 minutes per recording on their free plans.",
  },
  {
    q: "Which free Loom alternatives have no watermark?",
    a: "Screenity's free recorder and OBS Studio add no watermark. Screencastify's free plan adds a Castify watermark to your videos.",
  },
  {
    q: "Is Screenity really free?",
    a: "The recorder is. Screenity's recorder is free and open source under GPLv3, with no watermark and no time limit, and it records locally. Its editor is a paid upgrade with a 7-day free trial.",
  },
  {
    q: "Can I self-host a Loom alternative for free?",
    a: "Yes. Cap and Screenity are both open source, so you can run them yourself. You still pay for the server and storage you host them on, and you look after updates.",
  },
];

export const posts: Post[] = [
  {
    slug: "how-to-screen-record-on-chromebook",
    title: "How to screen record on a Chromebook (and in Chrome on any computer)",
    metaTitle: "How to screen record on a Chromebook, with audio",
    description:
      "Record your Chromebook screen with the built-in tool, add your voice and camera, and share a link instead of a file. Works in Chrome on Windows and Mac too.",
    excerpt:
      "The built-in Chromebook recorder step by step, the same job in Chrome on Windows and Mac, and how to send a link instead of a file.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 7,
    image: {
      src: "/blog/showthrough-recording-panel.webp",
      alt: "The Showthrough recording panel open on a web page, with camera, microphone and tab audio settings and a Start recording button",
      width: 1600,
      height: 912,
    },
    faqs: chromebookFaqs,
    Body: () => (
      <>
        <p>
          Every Chromebook has a screen recorder built in. You don&rsquo;t need to install anything to capture your screen, your voice and even your
          face. This guide shows the built-in way step by step, how to do the same in Chrome on Windows and Mac, and what to use when someone else
          needs to watch the recording.
        </p>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> press <Keys>Shift</Keys> + <Keys>Ctrl</Keys> + <Keys>Show windows</Keys> (the key with a rectangle and two
            lines). Select <strong>Screen record</strong>, choose full screen, part of the screen or one window, and start recording. Press{" "}
            <Keys>Search</Keys> + <Keys>Shift</Keys> + <Keys>X</Keys> to stop. The video saves to your <strong>Downloads</strong> folder as a .webm
            file.
          </p>
        </div>

        <h2>How to screen record on a Chromebook with the built-in tool</h2>
        <p>
          ChromeOS calls its recorder <strong>Screen capture</strong>. These steps follow{" "}
          <a href="https://support.google.com/chromebook/answer/10474268?hl=en" target="_blank" rel="noopener noreferrer">
            Google&rsquo;s Chromebook help page
          </a>
          .
        </p>
        <ol>
          <li>
            <strong>Open Screen capture.</strong> Press <Keys>Shift</Keys> + <Keys>Ctrl</Keys> + <Keys>Show windows</Keys>. If your keyboard has no
            Show windows key, press <Keys>Ctrl</Keys> + <Keys>Shift</Keys> + <Keys>F5</Keys>. You can also select the time in the bottom-right corner,
            then <strong>Screen capture</strong>.
          </li>
          <li>
            <strong>Switch to video.</strong> In the toolbar at the bottom, select <strong>Screen record</strong> (the video camera icon). The plain
            camera icon only takes screenshots.
          </li>
          <li>
            <strong>Choose what to record:</strong> <strong>Record the full screen</strong>, <strong>Record a partial screen</strong> or{" "}
            <strong>Record a window</strong>.
          </li>
          <li>
            <strong>Add sound and your camera.</strong> Select the gear icon. Under audio, pick <strong>Microphone</strong> for your voice,{" "}
            <strong>Device audio</strong> for sound playing on the Chromebook, or <strong>Device audio and microphone</strong> for both. Turn on{" "}
            <strong>Front camera</strong> to show your face. Turn on <strong>Show clicks and keys</strong> if you&rsquo;re teaching someone
            shortcuts.
          </li>
          <li>
            <strong>Start recording.</strong> For full screen, click anywhere. For part of the screen, drag to select the area, then select Record.
            For a window, click the window.
          </li>
          <li>
            <strong>Stop.</strong> Select <strong>Stop recording</strong> at the bottom right of the screen, or press <Keys>Search</Keys> +{" "}
            <Keys>Shift</Keys> + <Keys>X</Keys>.
          </li>
        </ol>
        <p>
          <strong>Where your recording goes:</strong> the Downloads folder, as a .webm video. To save somewhere else, such as Google Drive, open
          Screen capture, select the gear icon and choose <strong>Select folder</strong>.
        </p>
        <p>
          <strong>Want a GIF instead?</strong> Choose <strong>Record a partial screen</strong>, then <strong>Record GIF</strong> in the settings.
          GIFs don&rsquo;t include sound or your camera, but they&rsquo;re handy for showing a short click path in a document.
        </p>

        <h2>How to screen record in Chrome on Windows or Mac</h2>
        <p>Chrome itself has no record button. On Windows and Mac you have two choices: the recorder built into your computer, or a Chrome extension.</p>
        <p>
          <strong>Windows 11:</strong> press <Keys>Windows</Keys> + <Keys>Shift</Keys> + <Keys>R</Keys> to open the{" "}
          <a
            href="https://support.microsoft.com/en-us/windows/use-snipping-tool-to-capture-screenshots-00246869-1843-655f-f220-97299b865f6b"
            target="_blank"
            rel="noopener noreferrer"
          >
            Snipping Tool
          </a>
          &rsquo;s recorder. Select the area to record, then <strong>Start</strong>, and <strong>Stop</strong> when you&rsquo;re done. Recent versions
          can also record your microphone and PC sound. On Windows 10, the Xbox Game Bar (<Keys>Windows</Keys> + <Keys>G</Keys>) records a single app
          window.
        </p>
        <p>
          <strong>Mac:</strong> press <Keys>Shift</Keys> + <Keys>Command</Keys> + <Keys>5</Keys>, choose <strong>Record Entire Screen</strong> or{" "}
          <strong>Record Selected Portion</strong>, and pick a microphone under <strong>Options</strong>. Stop with the button in the menu bar or{" "}
          <Keys>Command</Keys> + <Keys>Control</Keys> + <Keys>Esc</Keys> (see{" "}
          <a href="https://support.apple.com/102618" target="_blank" rel="noopener noreferrer">
            Apple&rsquo;s guide
          </a>
          ). The Mac&rsquo;s built-in recorder captures your microphone but not sound playing from a browser tab, which catches many people out when
          recording a demo or a video call.
        </p>
        <p>
          <strong>A Chrome extension</strong> works the same way on every computer, Chromebooks included. Extensions can record a single tab with its
          sound, and many give you a share link instead of a file.
        </p>

        <h2>When you need a link, not a file</h2>
        <p>
          The built-in recorders give you a video file. That&rsquo;s fine for keeping a copy, but awkward when someone else needs to watch it. A
          ten-minute recording is too big for most email attachments, and uploading it to Drive and fixing the sharing settings takes longer than the
          recording did.
        </p>
        <p>
          I ran into this every day as a freelancer. Clients want small updates all the time: a change you made, a bug you fixed, a daily stand-up.
          The alternatives were booking a call for a two-minute update, or writing a message so long it was nearly an article. A short recording with a
          link is quicker for me and easier for the client to follow.
        </p>
        <p>
          For a while I used Loom. Its free plan stops at 25 videos and 5 minutes per recording, and the paid plan is $18 per user every month, which
          adds up fast for one person and faster for a team (see{" "}
          <Link href="/alternatives/loom">how Showthrough compares with Loom</Link>). So I built Showthrough. It&rsquo;s a Chrome extension, so it
          works the same on a Chromebook, a Windows laptop or a Mac:
        </p>
        <ol>
          <li>Click the Showthrough icon on any tab. A small panel opens on the page.</li>
          <li>Pick your camera and microphone, and turn on tab or system audio if you need it.</li>
          <li>
            Press <strong>Start recording</strong> and choose a tab, a window or your whole screen.
          </li>
        </ol>
        <figure>
          <Image
            src="/blog/showthrough-recording-panel.webp"
            alt="The Showthrough recording panel open on a web page, with camera, microphone and tab audio settings and a Start recording button"
            width={1600}
            height={912}
            sizes="(min-width: 768px) 720px, 100vw"
          />
          <figcaption>The Showthrough panel opens on the page you&rsquo;re on. Pick a camera and microphone, then start.</figcaption>
        </figure>
        <ol start={4}>
          <li>
            Talk through what you&rsquo;re showing. Your camera shows in a round bubble, and the control bar lets you pause, restart the take or delete
            it.
          </li>
          <li>
            Press <strong>Finish</strong>. The link is already copied, because the video uploaded while you were talking. Paste it into Slack, email or
            a ticket.
          </li>
        </ol>
        <figure>
          <Image
            src="/blog/showthrough-recording-controls.webp"
            alt="A Showthrough recording in progress, with the control bar for pause, restart, delete and stop on the left and a round camera bubble below it"
            width={1600}
            height={852}
            sizes="(min-width: 768px) 720px, 100vw"
          />
          <figcaption>While you record: pause, restart, delete or stop from the control bar, with your camera in the bubble.</figcaption>
        </figure>
        <p>
          Anyone with the link can watch in any browser, on any device, without an account. They can leave a comment at the exact moment in the video
          they&rsquo;re asking about.
        </p>
        <p>
          Two things are different from most recorders. There&rsquo;s no limit on the number of videos or their length. And the videos are stored in
          your own Cloudflare account, not on our servers, so they stay yours. {site.name} is a one-time purchase with no subscription.{" "}
          <Link href="/">See how it works</Link>.
        </p>
        <p>
          If you only record now and then for yourself, the free Chromebook recorder above does the job. {site.name} is for when you send recordings
          to other people often.
        </p>

        <h2>Which way should you record?</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">Chromebook built-in</th>
                <th scope="col">Windows Snipping Tool</th>
                <th scope="col">Mac Shift + Command + 5</th>
                <th scope="col">{site.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Cost</th>
                <td>Free</td>
                <td>Free</td>
                <td>Free</td>
                <td>One-time payment</td>
              </tr>
              <tr>
                <th scope="row">Your voice</th>
                <td>Yes</td>
                <td>Yes, in recent versions</td>
                <td>Yes</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">Sound from a tab or the computer</th>
                <td>Yes</td>
                <td>Yes, in recent versions</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">Your camera</th>
                <td>Yes</td>
                <td>No</td>
                <td>No</td>
                <td>Yes, in a bubble</td>
              </tr>
              <tr>
                <th scope="row">What you get</th>
                <td>A .webm file</td>
                <td>A video file</td>
                <td>A .mov file</td>
                <td>A link, ready when you stop</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Use the built-in tool when you&rsquo;re keeping the recording yourself. Use an extension when someone else needs to watch it today. If
          you&rsquo;re comparing extensions, see <Link href="/alternatives/screencastify">Showthrough vs Screencastify</Link> or{" "}
          <Link href="/alternatives">all the alternatives we compare</Link>.
        </p>

        <h2>If it isn&rsquo;t working</h2>
        <ul>
          <li>
            <strong>No sound in the recording.</strong> Open the gear icon before you record and check that an audio option is selected.
          </li>
          <li>
            <strong>The camera option is missing.</strong> On Chromebooks managed by a school or company, the administrator can turn the camera off.
            Ask your IT team.
          </li>
          <li>
            <strong>Screen capture won&rsquo;t open.</strong> Use the menu instead of the shortcut: select the time, then Screen capture. On managed
            Chromebooks, screen capture itself can be turned off.
          </li>
          <li>
            <strong>You can&rsquo;t find the file.</strong> Open the Files app and look in Downloads, or check where <strong>Select folder</strong> in
            the gear menu points.
          </li>
          <li>
            <strong>The .webm file won&rsquo;t play for someone.</strong> Most browsers play it, but some older video players don&rsquo;t. Send a link
            instead, or upload it to Google Drive and share that.
          </li>
        </ul>

        <h2>Questions people ask</h2>
        {chromebookFaqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    slug: "loom-pricing",
    title: "Loom pricing explained: what each plan costs and what you get",
    metaTitle: "Loom pricing explained: plans, limits and team costs",
    description:
      "Loom's Starter, Business, Business + AI and Enterprise plans compared: prices, free-plan limits, what a team really pays per year, and how to pay less.",
    excerpt:
      "Every Loom plan, what the free plan stops you doing, what a team of 5 or 10 really pays, and the cheaper ways to send screen recordings.",
    published: "2026-11-19",
    updated: "2026-11-19",
    readingMinutes: 6,
    image: {
      src: "/blog/loom-pricing.webp",
      alt: "Loom pricing explained: Starter at $0 a month, Business at $18 per user per month, and Enterprise with custom pricing",
      width: 1600,
      height: 900,
    },
    faqs: loomPricingFaqs,
    Body: () => (
      <>
        <p>
          Loom has four plans: a free Starter plan, Business, Business + AI and Enterprise. The paid plans are charged per user, every month, so the
          price you see on the pricing page is only the start of what a team pays. This guide shows what each plan costs, what the free plan stops
          you doing, and what a real team pays in a year.
        </p>

        <figure>
          <Image
            src="/blog/loom-pricing.webp"
            alt="Loom pricing explained: Starter at $0 a month, Business at $18 per user per month, and Enterprise with custom pricing"
            width={1600}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        </figure>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> Starter is free, with 25 videos per person and a 5-minute limit on screen recordings. Business costs{" "}
            <strong>$18 per user per month</strong> and removes those limits. Business + AI costs <strong>$24 per user per month</strong> and adds
            Loom&rsquo;s AI tools. Enterprise is priced by quote. Paying yearly saves up to 17%.
          </p>
        </div>

        <p className="text-sm">
          Prices checked on {LOOM_CHECKED} on{" "}
          <a href="https://www.loom.com/pricing" target="_blank" rel="noopener noreferrer nofollow">
            Loom&rsquo;s pricing page
          </a>
          , in US dollars, before tax. Prices change, so check there before you buy.
        </p>

        <h2>Loom&rsquo;s plans at a glance</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Plan</th>
                <th scope="col">Billed monthly</th>
                <th scope="col">Billed yearly</th>
                <th scope="col">Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Starter</th>
                <td>Free</td>
                <td>Free</td>
                <td>Trying Loom, or a few short videos a month</td>
              </tr>
              <tr>
                <th scope="row">Business</th>
                <td>$18 per user</td>
                <td>About $15 per user ($180 a year)</td>
                <td>Teams that record often and need longer videos</td>
              </tr>
              <tr>
                <th scope="row">Business + AI</th>
                <td>$24 per user</td>
                <td>About $20 per user ($240 a year)</td>
                <td>Teams that want AI titles, summaries and editing</td>
              </tr>
              <tr>
                <th scope="row">Enterprise</th>
                <td colSpan={2}>Contact sales</td>
                <td>Large companies that need SSO and admin controls</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Loom&rsquo;s page says yearly billing saves up to 17% but doesn&rsquo;t print the yearly amount. The yearly figures above are the ones
          pricing trackers report, and they match a 17% discount.
        </p>

        <h2>What the free Starter plan includes</h2>
        <p>Starter is a real product, not just a trial, but its limits are tight if you record every day:</p>
        <ul>
          <li>
            <strong>25 videos per person.</strong> Once you reach 25, you delete old videos or upgrade.
          </li>
          <li>
            <strong>5 minutes per screen recording.</strong> Meeting recordings aren&rsquo;t limited, but a screen recording stops at 5 minutes.
          </li>
          <li>
            <strong>Up to 720p video.</strong> 4K needs a paid plan.
          </li>
          <li>
            <strong>Up to 50 members</strong> in the workspace, or 10 if your account is linked to Atlassian, according to Loom&rsquo;s help
            centre.
          </li>
        </ul>
        <p>
          Starter does include transcripts, comments and emoji reactions, viewer insights, folders and integrations such as Slack, Jira and GitHub.
          It doesn&rsquo;t include password-protected videos, removing Loom&rsquo;s branding, or any AI features.
        </p>
        <p>
          When I was freelancing, the free plan was enough to understand Loom but not to use it. Five minutes isn&rsquo;t long enough to walk a
          client through a website handover, and 25 videos go quickly when clients want updates every day.
        </p>

        <h2>Business vs Business + AI: what the extra $6 buys</h2>
        <p>
          <strong>Business ($18)</strong> removes the Starter limits: unlimited videos, unlimited recording length and 4K. It adds uploading and
          downloading videos, password-protected videos, your own logo and player colours instead of Loom&rsquo;s branding, and more detailed
          engagement insights.
        </p>
        <p>
          <strong>Business + AI ($24)</strong> adds Loom AI on top: automatic titles, summaries and chapters, filler-word and silence removal, editing
          by transcript, and meeting notes. Loom marks it as its most popular plan, and you can try it free for 14 days.
        </p>
        <p>
          The AI tools are useful if your videos get searched and skimmed later, like training videos or product docs. For quick updates that people
          watch once, Business is usually enough.
        </p>

        <h2>What Loom really costs a team</h2>
        <p>Because Loom charges per user, the bill grows with every person who records. Here&rsquo;s what a year costs on Business:</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">People recording</th>
                <th scope="col">Business, billed monthly</th>
                <th scope="col">Business, billed yearly</th>
                <th scope="col">Business + AI, billed monthly</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>$216 a year</td>
                <td>$180 a year</td>
                <td>$288 a year</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>$648 a year</td>
                <td>$540 a year</td>
                <td>$864 a year</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>$1,080 a year</td>
                <td>$900 a year</td>
                <td>$1,440 a year</td>
              </tr>
              <tr>
                <th scope="row">10</th>
                <td>$2,160 a year</td>
                <td>$1,800 a year</td>
                <td>$2,880 a year</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          My own team of 5 was on Business at monthly billing: $90 a month, or $1,080 a year, just to send screen recordings to clients. That bill
          is what pushed me to build something else.
        </p>

        <h2>How to pay less for Loom</h2>
        <ul>
          <li>
            <strong>Pay yearly</strong> if you&rsquo;re sure you&rsquo;ll keep it. It saves up to 17%, but you commit to every seat for the year.
          </li>
          <li>
            <strong>Only pay for people who record.</strong> People who just watch don&rsquo;t need a paid seat. Check who on your team actually
            creates videos.
          </li>
          <li>
            <strong>Skip the AI plan</strong> unless you&rsquo;ll use the summaries and chapters. It&rsquo;s $6 more per person, every month.
          </li>
          <li>
            <strong>Stay on Starter</strong> if you record a few short videos a month and can live with 25 videos and 5 minutes.
          </li>
        </ul>

        <h2>Cheaper ways to send screen recordings</h2>
        <p>
          If per-user pricing is the problem, there are tools that charge differently. Some open-source recorders are free if you host them
          yourself. Others charge once instead of every month.
        </p>
        <p>
          That&rsquo;s why I built <Link href="/">Showthrough</Link>. It&rsquo;s a Chrome extension that records your screen, camera and voice and
          copies the link the moment you stop. There&rsquo;s no limit on the number of videos or their length, videos are stored in your own
          Cloudflare account, and it&rsquo;s a <Link href="/pricing">one-time payment</Link> instead of a monthly bill per person. It doesn&rsquo;t
          have Loom&rsquo;s AI tools or a desktop app yet, so it suits quick updates more than polished, edited videos.
        </p>
        <p>
          For a side-by-side look, see <Link href="/alternatives/loom">Showthrough vs Loom</Link> or{" "}
          <Link href="/alternatives">all the Loom alternatives we compare</Link>.
        </p>

        <h2>Questions people ask</h2>
        {loomPricingFaqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    slug: "async-communication",
    title: "What is async communication? Examples, benefits and how to do it well",
    metaTitle: "What is async communication? Examples and tips",
    description:
      "Async communication explained: what it means, how it differs from sync, real examples for remote teams and freelancers, and when a meeting is still better.",
    excerpt:
      "What async communication means, how it compares with meetings, real examples, and the habits that make it work for teams and freelancers.",
    published: "2026-11-21",
    updated: "2026-11-21",
    readingMinutes: 7,
    image: {
      src: "/blog/async-communication.webp",
      alt: "What is async communication? A message thread showing a message sent at 9:02 AM, seen at 2:14 PM and replied to at 6:40 PM",
      width: 1600,
      height: 900,
    },
    faqs: asyncFaqs,
    Body: () => (
      <>
        <p>
          Async communication is how most good remote work gets done. Instead of pulling everyone into a meeting, you send a message, a document or a
          short video, and people respond when they&rsquo;re ready. This guide explains what it means, when it works better than a meeting, and how
          to do it well.
        </p>

        <figure>
          <Image
            src="/blog/async-communication.webp"
            alt="What is async communication? A message thread showing a message sent at 9:02 AM, seen at 2:14 PM and replied to at 6:40 PM"
            width={1600}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        </figure>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> async (asynchronous) communication is any message that doesn&rsquo;t need a reply right away. You send it
            when it suits you, and the other person reads, watches and answers when it suits them. Email, recorded video updates, shared documents
            and comments are async. Meetings, phone calls and live chats are <strong>sync</strong> (synchronous): everyone has to be there at the
            same time.
          </p>
        </div>

        <h2>Async vs sync communication</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">Async</th>
                <th scope="col">Sync</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Examples</th>
                <td>Email, recorded videos, documents, comments, project boards</td>
                <td>Meetings, video calls, phone calls, live chat</td>
              </tr>
              <tr>
                <th scope="row">When people respond</th>
                <td>When it suits them, often within hours</td>
                <td>Right away</td>
              </tr>
              <tr>
                <th scope="row">Best for</th>
                <td>Updates, reviews, feedback, decisions that can wait a day</td>
                <td>Urgent problems, brainstorming, sensitive conversations</td>
              </tr>
              <tr>
                <th scope="row">Downside</th>
                <td>Slower back-and-forth; needs clear writing</td>
                <td>Interrupts focus; hard across time zones</td>
              </tr>
              <tr>
                <th scope="row">Leaves a record</th>
                <td>Yes, by default</td>
                <td>Only if someone takes notes or records it</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Examples of async communication at work</h2>
        <ul>
          <li>
            <strong>A video walkthrough instead of a meeting.</strong> Record 2 minutes showing a design, a bug or a finished feature, and send the
            link.
          </li>
          <li>
            <strong>A written stand-up.</strong> Each person posts what they did, what&rsquo;s next and what&rsquo;s blocking them, instead of a daily
            call.
          </li>
          <li>
            <strong>Comments on a document.</strong> People review a proposal in the doc itself, on their own time.
          </li>
          <li>
            <strong>Code review.</strong> Developers leave comments on a pull request instead of reviewing it together live.
          </li>
          <li>
            <strong>A client update.</strong> A short recording of this week&rsquo;s progress, which the client watches whenever they open their
            inbox.
          </li>
        </ul>

        <h2>Why teams switch to async</h2>
        <ul>
          <li>
            <strong>Fewer interruptions.</strong> People get long stretches of focused work instead of a day broken up by calls.
          </li>
          <li>
            <strong>Time zones stop mattering.</strong> Nobody has to join a meeting at 11 pm to give a five-minute update.
          </li>
          <li>
            <strong>Better thinking.</strong> People answer after they&rsquo;ve thought it through, not on the spot.
          </li>
          <li>
            <strong>A record by default.</strong> Decisions and explanations stay findable, so new teammates can catch up on their own.
          </li>
        </ul>
        <p>
          GitLab, a company that works fully remotely, makes async its default and documents how in its public{" "}
          <a href="https://handbook.gitlab.com/handbook/company/culture/all-remote/asynchronous/" target="_blank" rel="noopener noreferrer">
            handbook on asynchronous communication
          </a>
          . It&rsquo;s one of the most thorough guides on the subject.
        </p>

        <h2>When a meeting is still better</h2>
        <p>Async is a default, not a rule. Switch to a live call when:</p>
        <ul>
          <li>Something is urgent, or broken right now.</li>
          <li>A thread has gone back and forth three times without getting anywhere.</li>
          <li>You&rsquo;re brainstorming, or making a big decision with many opinions.</li>
          <li>The conversation is sensitive, like feedback on someone&rsquo;s work or a difficult client issue.</li>
          <li>You&rsquo;re meeting someone for the first time and building trust.</li>
        </ul>

        <h2>How freelancers use async communication</h2>
        <p>
          I freelanced for five years, and clients wanted small updates all the time: a change I&rsquo;d made, a bug I&rsquo;d fixed, where the
          project stood today. The choice was usually between booking a call for a two-minute update or writing a message so long it was nearly an
          article.
        </p>
        <p>
          A short screen recording fixed both problems. The client sees exactly what changed, hears why, and watches it when it suits them. I keep
          my focus, and there&rsquo;s a record of what we agreed. These are the updates I&rsquo;d send async:
        </p>
        <ul>
          <li>
            <strong>Daily or weekly progress</strong>: what&rsquo;s done, what&rsquo;s next, what I need from them.
          </li>
          <li>
            <strong>Design and website reviews</strong>: walk through the page and explain each decision.
          </li>
          <li>
            <strong>Handover</strong>: how to edit the site, where things live, what to do if something breaks.
          </li>
          <li>
            <strong>Bug reports</strong>: show the problem happening instead of describing it.
          </li>
        </ul>

        <h2>How to do async communication well</h2>
        <ol>
          <li>
            <strong>Give full context.</strong> Write or record as if the reader knows nothing about the last conversation. Link the doc, the design
            or the ticket.
          </li>
          <li>
            <strong>Lead with the ask.</strong> Start with what you need: a decision, feedback, or nothing (just an update).
          </li>
          <li>
            <strong>Set a reply-by time.</strong> &ldquo;Can you reply by Thursday?&rdquo; stops async from turning into waiting forever.
          </li>
          <li>
            <strong>Keep videos short.</strong> Two to five minutes, one topic each. If it needs twenty minutes, it might need a meeting.
          </li>
          <li>
            <strong>Show, don&rsquo;t describe.</strong> A screen recording beats three paragraphs explaining where to click.
          </li>
          <li>
            <strong>Agree on response times.</strong> For example: messages within a working day, urgent things by phone.
          </li>
        </ol>

        <h3>A simple async stand-up</h3>
        <p>Post this at the same time each day, in writing or as a one-minute video:</p>
        <ul>
          <li>
            <strong>Done:</strong> what I finished since yesterday
          </li>
          <li>
            <strong>Next:</strong> what I&rsquo;m working on today
          </li>
          <li>
            <strong>Blocked:</strong> anything I need from someone, and by when
          </li>
        </ul>

        <h2>Tools for async communication</h2>
        <ul>
          <li>
            <strong>Writing:</strong> email, threaded chat in Slack or Teams, shared documents like Google Docs or Notion.
          </li>
          <li>
            <strong>Project tracking:</strong> boards and issue trackers like Trello, Linear or Jira, where status updates live next to the work.
          </li>
          <li>
            <strong>Video:</strong> screen recorders that give you a link to share, so you can show instead of write.
          </li>
        </ul>
        <p>
          For video, I built <Link href="/">Showthrough</Link>, a Chrome extension that records your screen, camera and voice and copies the link the
          moment you stop. There&rsquo;s no limit on the number of videos or their length, and viewers can comment at the exact moment
          they&rsquo;re asking about. If you&rsquo;re comparing options, see <Link href="/alternatives">the screen recorders we compare</Link>.
        </p>

        <h2>Questions people ask</h2>
        {asyncFaqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    slug: "is-loom-free",
    title: "Is Loom free? The free plan's limits, explained",
    metaTitle: "Is Loom free? The 25-video and 5-minute limits explained",
    description:
      "Loom has a free Starter plan, but it stops at 25 videos and 5-minute recordings. What's included, what happens at the limits, and when it's worth paying.",
    excerpt:
      "What Loom's free plan includes, what happens when you hit 25 videos or 5 minutes, and whether you'll need to pay.",
    published: "2026-11-21",
    updated: "2026-11-21",
    readingMinutes: 5,
    image: {
      src: "/blog/is-loom-free.webp",
      alt: "Is Loom free? A free plan card showing 25 of 25 videos used, a 5-minute recording timer at 0:00 and 720p video, with a recording limit reached warning",
      width: 1600,
      height: 900,
    },
    faqs: isLoomFreeFaqs,
    Body: () => (
      <>
        <p>
          Yes, Loom has a free plan. It&rsquo;s called Starter, and it&rsquo;s enough to try Loom and send the occasional short video. But it has
          two limits that most people hit quickly: 25 videos and 5 minutes per recording. Here&rsquo;s what the free plan includes, what happens at
          those limits, and when it&rsquo;s worth paying.
        </p>

        <figure>
          <Image
            src="/blog/is-loom-free.webp"
            alt="Is Loom free? A free plan card showing 25 of 25 videos used, a 5-minute recording timer at 0:00 and 720p video, with a recording limit reached warning"
            width={1600}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        </figure>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> Loom&rsquo;s Starter plan is free, with up to <strong>25 videos per person</strong>, a{" "}
            <strong>5-minute limit</strong> on each screen recording, and video up to <strong>720p</strong>. Removing those limits costs $18 per user
            per month on the Business plan.
          </p>
        </div>

        <p className="text-sm">
          Checked on 21 November 2026 against{" "}
          <a href="https://www.loom.com/pricing" target="_blank" rel="noopener noreferrer nofollow">
            Loom&rsquo;s pricing page
          </a>{" "}
          and{" "}
          <a href="https://support.atlassian.com/loom/docs/how-long-can-i-record/" target="_blank" rel="noopener noreferrer nofollow">
            Loom&rsquo;s help centre
          </a>
          .
        </p>

        <h2>What Loom&rsquo;s free plan includes</h2>
        <ul>
          <li>Screen, camera and microphone recording, shared as a link</li>
          <li>Transcripts, comments and emoji reactions</li>
          <li>Viewer insights, folders and privacy controls</li>
          <li>Integrations such as Slack, Jira, GitHub and Gmail</li>
          <li>Unlimited screenshots</li>
        </ul>
        <p>
          It doesn&rsquo;t include password-protected videos, removing Loom&rsquo;s branding, uploading or downloading videos, 4K, or any of
          Loom&rsquo;s AI tools.
        </p>

        <h2>The limits you&rsquo;ll hit</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Limit</th>
                <th scope="col">Free Starter plan</th>
                <th scope="col">What happens</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Videos</th>
                <td>25 per person</td>
                <td>At 25, you can&rsquo;t record until you delete videos or upgrade. Archived videos still count.</td>
              </tr>
              <tr>
                <th scope="row">Recording length</th>
                <td>5 minutes</td>
                <td>The timer counts down from 5:00 and the recording ends at zero.</td>
              </tr>
              <tr>
                <th scope="row">Video quality</th>
                <td>Up to 720p</td>
                <td>Fine for most screens; small text can look soft.</td>
              </tr>
              <tr>
                <th scope="row">Members</th>
                <td>Up to 50 on the pricing page</td>
                <td>Loom&rsquo;s help centre says accounts linked to Atlassian are limited to 10 users on Starter.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The 5-minute limit is the one that hurts most. A website handover, a code review or a walkthrough of a new feature rarely fits in five
          minutes, and when the timer runs out the recording simply stops.
        </p>
        <p>
          When I was freelancing, I found the free plan was more for understanding Loom than for using it. Clients wanted updates every day, so 25
          videos went quickly, and deleting old videos to make room meant deleting the record of what I&rsquo;d sent.
        </p>

        <h2>Is there a free trial of the paid plans?</h2>
        <p>
          Yes. You can try Business + AI free for 14 days. After the trial, you&rsquo;re moved back to Starter unless you pay, and the 25-video and
          5-minute limits apply again. If you already have more than 25 videos, you keep access to them, but you can&rsquo;t record new ones until
          you&rsquo;re back under 25.
        </p>

        <h2>Is Loom free for teachers and students?</h2>
        <p>
          Not any more. Loom used to offer a free education plan, but its help centre now says that plan is closed to new applicants. Verified
          teachers and students can get{" "}
          <a href="https://support.atlassian.com/loom/docs/loom-education-discount-verification/" target="_blank" rel="noopener noreferrer nofollow">
            a discount of up to 75%
          </a>{" "}
          on paid plans instead. Some school websites still describe the old free plan, so check the date on anything you read.
        </p>

        <h2>Is the free plan enough for you?</h2>
        <p>
          <strong>Stay on free</strong> if you send a few short videos a month, mostly under five minutes, and don&rsquo;t mind deleting old ones.
        </p>
        <p>
          <strong>You&rsquo;ll outgrow it</strong> if you send updates daily, record walkthroughs longer than five minutes, or want to keep every
          video you&rsquo;ve sent. Then the options are Loom Business at $18 per user per month (see{" "}
          <Link href="/blog/loom-pricing">Loom pricing explained</Link>), or a different tool.
        </p>

        <h2>Alternatives without the limits</h2>
        <p>
          Some screen recorders are free and open source if you host them yourself; others charge once instead of every month. I built{" "}
          <Link href="/">Showthrough</Link> after hitting Loom&rsquo;s limits: there&rsquo;s no cap on the number of videos or their length, your
          videos are stored in your own Cloudflare account, and it&rsquo;s a <Link href="/pricing">one-time payment</Link>. It doesn&rsquo;t have a
          free plan or Loom&rsquo;s AI tools yet. For a full comparison, see <Link href="/alternatives/loom">Showthrough vs Loom</Link> or{" "}
          <Link href="/alternatives">all the alternatives we compare</Link>.
        </p>

        <h2>Questions people ask</h2>
        {isLoomFreeFaqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    slug: "free-loom-alternatives",
    title: "7 free Loom alternatives, and what each free plan really allows",
    metaTitle: "7 free Loom alternatives and their real limits",
    description:
      "Seven free Loom alternatives compared: Screenity, OBS, Cap, Vidyard, Screencastify, ScreenPal and Zight. The real limits on each free plan, and who each suits.",
    excerpt:
      "Seven screen recorders with a free plan, the limits on each one, and which to pick for client updates, tutorials or long recordings.",
    published: "2026-11-22",
    updated: "2026-11-22",
    readingMinutes: 7,
    image: {
      src: "/blog/free-loom-alternatives.webp",
      alt: "Seven screen recorder cards labelled with free-plan limits such as 5 min, 30 min and 10 videos, and one card highlighted in orange labelled no limit",
      width: 1600,
      height: 900,
    },
    faqs: freeAltsFaqs,
    Body: () => (
      <>
        <p>
          Loom&rsquo;s free plan stops at 25 videos and 5 minutes per recording (see{" "}
          <Link href="/blog/is-loom-free">Is Loom free?</Link>). If that&rsquo;s too tight, there are free screen recorders that go further. Each one
          has its own catch: a monthly cap, a watermark, or no share link at all. Here are seven worth trying, with the real limits on each free plan.
        </p>

        <figure>
          <Image
            src="/blog/free-loom-alternatives.webp"
            alt="Seven screen recorder cards labelled with free-plan limits such as 5 min, 30 min and 10 videos, and one card highlighted in orange labelled no limit"
            width={1600}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        </figure>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> for recording in Chrome with no limits, use <strong>Screenity</strong>. It&rsquo;s free and open source,
            but it saves a file instead of giving you a link. For free share links, use <strong>Cap</strong> (25 a month, 5 minutes each). For long,
            high-quality recordings on a desktop, use <strong>OBS Studio</strong>.
          </p>
        </div>

        <p className="text-sm">Free plans checked on {FREE_ALTS_CHECKED} on each tool&rsquo;s own website. Free plans change often, so check before you rely on one.</p>

        <h2>The free plans at a glance</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Tool</th>
                <th scope="col">Free plan limit</th>
                <th scope="col">Share link</th>
                <th scope="col">Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Screenity</th>
                <td>No video or time limit</td>
                <td>No, saves a file</td>
                <td>Recording in Chrome without limits</td>
              </tr>
              <tr>
                <th scope="row">OBS Studio</th>
                <td>No limits</td>
                <td>No, saves a file</td>
                <td>Long, high-quality desktop recordings</td>
              </tr>
              <tr>
                <th scope="row">Cap</th>
                <td>25 share links a month, 5 minutes each</td>
                <td>Yes</td>
                <td>Developers who want open source</td>
              </tr>
              <tr>
                <th scope="row">Vidyard</th>
                <td>5 videos a month, 30 minutes each</td>
                <td>Yes</td>
                <td>Sales outreach videos</td>
              </tr>
              <tr>
                <th scope="row">Screencastify</th>
                <td>10 videos, 30 minutes each, watermark</td>
                <td>Yes</td>
                <td>Teachers and classrooms</td>
              </tr>
              <tr>
                <th scope="row">ScreenPal</th>
                <td>15 minutes per recording</td>
                <td>Yes</td>
                <td>Tutorials with light editing</td>
              </tr>
              <tr>
                <th scope="row">Zight</th>
                <td>5 minutes per recording, 720p, 1 GB storage</td>
                <td>Yes</td>
                <td>Quick screenshots, GIFs and clips</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>1. Screenity: free and unlimited in Chrome</h2>
        <p>
          <a href="https://screenity.io/extension" target="_blank" rel="noopener noreferrer nofollow">
            Screenity
          </a>{" "}
          is a Chrome extension that records your screen, a tab or your camera. The recorder is free and open source, with no watermark and no time
          limit, and you don&rsquo;t need an account. You can draw on the screen, blur parts of it and highlight clicks while you record.
        </p>
        <p>
          <strong>The catch:</strong> your video is saved to your computer, so to send it you have to upload it somewhere yourself. The editor, with
          zooms and captions, is a paid upgrade.
        </p>

        <h2>2. OBS Studio: free, powerful, and harder to learn</h2>
        <p>
          <a href="https://obsproject.com" target="_blank" rel="noopener noreferrer nofollow">
            OBS Studio
          </a>{" "}
          is a free, open-source app for Windows, Mac and Linux. It has no limits on the number or length of recordings, and it&rsquo;s the tool most
          streamers and YouTubers use. You can mix your screen, camera and several microphones into one video.
        </p>
        <p>
          <strong>The catch:</strong> setting up scenes and sources takes time, and it has no editor or share links. It&rsquo;s overkill for a
          two-minute update to a client.
        </p>

        <h2>3. Cap: open source, with free share links</h2>
        <p>
          <a href="https://cap.so/pricing" target="_blank" rel="noopener noreferrer nofollow">
            Cap
          </a>{" "}
          is the closest open-source match to Loom: record on Mac, Windows or Linux and get a link to share. The free plan is for personal use and
          gives you 25 share links a month, each up to 5 minutes. You can also host Cap yourself.
        </p>
        <p>
          <strong>The catch:</strong> 5 minutes per shared video is the same limit as Loom&rsquo;s free plan. For a full comparison, see{" "}
          <Link href="/alternatives/cap">Showthrough vs Cap</Link>.
        </p>

        <h2>4. Vidyard: 30-minute videos, 5 a month</h2>
        <p>
          <a href="https://www.vidyard.com/pricing/" target="_blank" rel="noopener noreferrer nofollow">
            Vidyard
          </a>{" "}
          is built for sales teams. Its free plan lets you record up to 30 minutes per video, which is six times longer than Loom&rsquo;s free plan.
        </p>
        <p>
          <strong>The catch:</strong> you get 5 videos a month, and most of the extras, such as captions, custom thumbnails and the analytics
          dashboard, are on paid plans. See <Link href="/alternatives/vidyard">Showthrough vs Vidyard</Link>.
        </p>

        <h2>5. Screencastify: made for classrooms</h2>
        <p>
          <a href="https://www.screencastify.com/pricing" target="_blank" rel="noopener noreferrer nofollow">
            Screencastify
          </a>{" "}
          is a Chrome recorder popular with teachers. The free plan lets you create or upload 10 videos of up to 30 minutes each, and you can keep and
          share them for as long as you like. Inviting colleagues adds 5 bonus videos for each one, up to 20 in total.
        </p>
        <p>
          <strong>The catch:</strong> free videos carry a Castify watermark, which looks odd in front of a client. See{" "}
          <Link href="/alternatives/screencastify">Showthrough vs Screencastify</Link>.
        </p>

        <h2>6. ScreenPal: 15-minute recordings with an editor</h2>
        <p>
          <a href="https://screenpal.com/plans" target="_blank" rel="noopener noreferrer nofollow">
            ScreenPal
          </a>
          , formerly Screencast-O-Matic, lets you record up to 15 minutes at a time on the free plan. It includes a basic editor for cutting, cropping,
          adding text and recording a voiceover.
        </p>
        <p>
          <strong>The catch:</strong> the free plan doesn&rsquo;t record system audio, so sound playing on your computer won&rsquo;t be captured.
          Its pricing page is also unclear about how many videos free users can host. See{" "}
          <Link href="/alternatives/screenpal">Showthrough vs ScreenPal</Link>.
        </p>

        <h2>7. Zight: screenshots, GIFs and short videos</h2>
        <p>
          <a href="https://zight.com/pricing/" target="_blank" rel="noopener noreferrer nofollow">
            Zight
          </a>
          , formerly CloudApp, puts screenshots, GIFs and screen recordings in one app. The free plan allows 5-minute recordings at up to 720p, with
          1 GB of storage in total and access to your last 50 captures.
        </p>
        <p>
          <strong>The catch:</strong> 5 minutes and 1 GB fill up fast if you record every day. See{" "}
          <Link href="/alternatives/zight">Showthrough vs Zight</Link>.
        </p>

        <h2>Your computer may already have a free recorder</h2>
        <p>
          Windows 11 (<Keys>Windows</Keys> + <Keys>Shift</Keys> + <Keys>R</Keys>), Mac (<Keys>Shift</Keys> + <Keys>Command</Keys> + <Keys>5</Keys>)
          and every Chromebook come with a screen recorder. They&rsquo;re free and have no time limit, but like Screenity and OBS they give you a file,
          not a link. The steps are in{" "}
          <Link href="/blog/how-to-screen-record-on-chromebook">how to screen record on a Chromebook, Windows or Mac</Link>.
        </p>

        <h2>Which one should you pick?</h2>
        <ul>
          <li>
            <strong>Short updates to clients, a few a month:</strong> Cap, or stay on Loom&rsquo;s free plan.
          </li>
          <li>
            <strong>Long walkthroughs or handovers:</strong> Vidyard or Screencastify (30 minutes), or Screenity if you don&rsquo;t need a link.
          </li>
          <li>
            <strong>Tutorials you want to edit:</strong> ScreenPal or OBS Studio.
          </li>
          <li>
            <strong>Screenshots and quick GIFs as well as video:</strong> Zight.
          </li>
        </ul>
        <p>
          When I started freelancing, I sent client updates mostly as text messages, Google Docs or Google Meet calls. Writing out something that
          was easier to show took a long time, and booking a call for a two-minute update wasted everyone&rsquo;s time. Loom fixed that, but its
          free plan ran out quickly: clients wanted small updates every day, so the 25-video and 5-minute limits came up within a week or two.
          That&rsquo;s the trade-off with every tool on this list. The ones with no limits give you a file to upload yourself, and the ones that
          give you a link cap how much you can record.
        </p>

        <h2>If you&rsquo;d rather pay once than work around limits</h2>
        <p>
          That&rsquo;s why I built <Link href="/">Showthrough</Link>. It isn&rsquo;t free, so it&rsquo;s not on the list above. It&rsquo;s a{" "}
          <Link href="/pricing">one-time payment</Link> instead of a monthly fee. You get a share link the moment you stop recording, there&rsquo;s no
          limit on the number or length of videos, and your videos are stored in your own Cloudflare account. Connecting Cloudflare is one click, and
          we handle the setup. For more options, see <Link href="/alternatives">all the Loom alternatives we compare</Link>.
        </p>

        <h2>Questions people ask</h2>
        {freeAltsFaqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
