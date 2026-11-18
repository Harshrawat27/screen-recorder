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
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
