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

const loomDownloadFaqs = [
  {
    q: "Can you download Loom videos on the free plan?",
    a: "No. On Loom's free Starter plan, admins and creators can't download videos, and viewers on Starter can't download other people's videos either. Downloading needs a paid plan such as Business.",
  },
  {
    q: "Why is the Download button missing in Loom?",
    a: "Usually because of your plan or role: Starter, Creator Lite and Viewer roles can't download. It can also be missing if the video uses Variables, is a meeting recording you didn't organise, is larger than 20 GB, or is still being processed after recording.",
  },
  {
    q: "Can I download a Loom video someone else sent me?",
    a: "Only if the creator turned on downloads for that video, and you're signed in to Loom with a paid workspace role (creator or admin). Viewers who aren't signed in can't download, whatever the video's settings.",
  },
  {
    q: "What format are Loom downloads?",
    a: "MP4. Trims you made are kept, but calls to action, filler word and silence removal, chapters and closed captions are not included in the file.",
  },
  {
    q: "Can I download all my Loom videos at once?",
    a: "Not from Loom itself: bulk download is an open feature request. You download videos one at a time from your Library, or use a migration tool from another provider, such as Tella Transfer or Cap's Loom importer.",
  },
];

const windowsRecordFaqs = [
  {
    q: "How do I screen record on Windows 11?",
    a: "Press Windows + Shift + R to open the Snipping Tool's recorder, drag to select the area, select Start, then Stop when you're done. The recording is saved as an MP4 in Videos > Screen Recordings.",
  },
  {
    q: "How do I screen record on Windows 10?",
    a: "Use the Xbox Game Bar: open the app you want to record and press Windows + Alt + R to start and stop. It records one app window, not the desktop or File Explorer. Recordings go to Videos > Captures as MP4 files. PowerPoint's Insert > Screen Recording works too.",
  },
  {
    q: "How do I screen record on Windows with audio?",
    a: "In the Snipping Tool, turn on the microphone (and system audio, in recent versions) before you start. In the Xbox Game Bar, press Windows + Alt + M to toggle the microphone. PowerPoint records your microphone by default.",
  },
  {
    q: "Where do screen recordings go on Windows?",
    a: "Snipping Tool recordings go to Videos > Screen Recordings when automatic saving is on. Xbox Game Bar recordings go to Videos > Captures. Both are MP4 files.",
  },
  {
    q: "Why isn't Windows + Shift + R working?",
    a: "Screen recording in the Snipping Tool is a Windows 11 feature. Update Windows and the Snipping Tool from the Microsoft Store. On Windows 10, use the Xbox Game Bar or PowerPoint instead.",
  },
];

const chromebookRecorderFaqs = [
  {
    q: "What is the best free screen recorder for Chromebook?",
    a: "The built-in Screen capture tool is free with no sign-up and saves a file. If you want more features for free, Screenity is free and open source with no watermark or time limit, and also saves a file. For free share links, Loom, Screencastify and Vidyard have free plans with limits.",
  },
  {
    q: "Does Chromebook have a built-in screen recorder?",
    a: "Yes. Press Shift + Ctrl + Show windows, choose Screen record, pick full screen, part of the screen or a window, and start. Stop with Search + Shift + X. The video saves to Downloads as a .webm file.",
  },
  {
    q: "Can I use OBS on a Chromebook?",
    a: "Not officially. OBS Studio doesn't support ChromeOS, and Linux workarounds often break screen capture. On a Chromebook, use the built-in tool or a Chrome extension.",
  },
  {
    q: "Which Chromebook screen recorder has no watermark?",
    a: "The built-in Screen capture tool, Screenity and Showthrough add no watermark. Screencastify's free plan adds a watermark.",
  },
  {
    q: "Which Chromebook screen recorder gives you a share link?",
    a: "Showthrough, Loom, Screencastify and Vidyard all give you a link to send. The built-in tool and Screenity's free recorder save a file instead.",
  },
];

const loomExtensionFaqs = [
  {
    q: "Is the Loom Chrome extension free?",
    a: "Yes, the extension is free to install. On Loom's free Starter plan you can keep up to 25 videos per person, each screen recording stops at 5 minutes, and quality goes up to 720p. Paid plans remove those limits.",
  },
  {
    q: "What quality does the Loom Chrome extension record in?",
    a: "Up to 720p on the free Starter plan and up to 1080p on paid plans. Camera-only recordings stay at 720p. For 4K you need Loom's desktop app on a paid plan.",
  },
  {
    q: "What's the difference between the Loom Chrome extension and the desktop app?",
    a: "The extension installs in seconds and records your screen, a tab or a window from Chrome. The desktop app adds HD recording up to 4K, drawing on screen, speaker notes and more camera options. Loom suggests installing both.",
  },
  {
    q: "Does the Loom Chrome extension work on a Chromebook?",
    a: "Yes. Loom's desktop app doesn't run on ChromeOS, so the Chrome extension is the way to use Loom on a Chromebook.",
  },
  {
    q: "What's a good alternative to the Loom Chrome extension?",
    a: "Showthrough is a Chrome extension that also gives you a link the moment you stop, with no limit on videos or length, for a one-time payment. Screenity is free and open source but saves a file. Screencastify and Vidyard have free plans with limits.",
  },
];

const macRecorderFaqs = [
  {
    q: "What is the best free screen recorder for Mac?",
    a: "The built-in Screenshot toolbar (Shift + Command + 5) is free, fast and already on your Mac. If you want more control for free, OBS Studio is free and open source, and Cap has a free plan for personal use.",
  },
  {
    q: "How do I screen record on a Mac?",
    a: "Press Shift + Command + 5, choose Record Entire Screen or Record Selected Portion, pick your microphone under Options, and select Record. Stop with the button in the menu bar. The video saves as a .mov file, on your desktop by default.",
  },
  {
    q: "Can a Mac screen recording include sound from apps?",
    a: "On macOS 27 or later, yes: in Shift + Command + 5, open Options and turn on Include System Audio. Older versions record only your microphone, so use an app like OBS or Cap, or a Chrome extension that records tab audio.",
  },
  {
    q: "Which Mac screen recorder gives you a share link?",
    a: "Showthrough, Loom and Cap all give you a link to send. CleanShot X can upload to its own cloud. The built-in tool, QuickTime and OBS save a file instead.",
  },
  {
    q: "Is there a Mac screen recorder without a subscription?",
    a: "Yes. The built-in tool, QuickTime and OBS are free. CleanShot X and Showthrough are one-time payments. Loom, Screen Studio and Cap Pro are subscriptions.",
  },
];

const proposalFaqs = [
  {
    q: "What should a freelance project proposal include?",
    a: "The client's problem in their words, what you'll do, what they'll get, a timeline, the price and payment terms, what isn't included, and the next step. Seven short sections is enough for most projects.",
  },
  {
    q: "How long should a freelance proposal be?",
    a: "One to two pages for most freelance projects. The client should be able to read it in a few minutes and know what they're paying for, by when.",
  },
  {
    q: "Should I give one price or several options?",
    a: "Both work. One price keeps the decision simple. Two or three options, such as a basic and a full version, let the client choose instead of deciding yes or no, but keep them clearly different.",
  },
  {
    q: "How do I make my proposal stand out?",
    a: "Restate the client's problem in their own words, keep it short, and send it fast. A two-minute video walking through the proposal also helps, because the client hears your voice and sees you understood the brief.",
  },
  {
    q: "When should I ask for payment in a proposal?",
    a: "Put payment terms in the proposal itself. A common setup is part of the fee upfront before work starts and the rest at delivery, or payments tied to milestones for longer projects.",
  },
];

const macHowToFaqs = [
  {
    q: "How do I screen record on a Mac?",
    a: "Press Shift + Command + 5, choose Record Entire Screen, Record Selected Window or Record Selected Portion, and click Record. To stop, click the Stop button in the menu bar or press Command + Control + Esc.",
  },
  {
    q: "How do I screen record on a Mac with sound?",
    a: "For your voice, open Options in the Shift + Command + 5 toolbar and pick a microphone. For sound from apps, turn on Include System Audio in Options on macOS 27 or later. On older versions, use OBS Studio, a virtual audio driver like BlackHole, or a Chrome extension that records tab audio.",
  },
  {
    q: "Where do Mac screen recordings go?",
    a: "To your Desktop by default, named \"Screen Recording [date] at [time].mov\". You can change the folder under Options > Save to.",
  },
  {
    q: "Why is my Mac screen recording silent?",
    a: "Usually because no microphone was selected in Options, or because you expected sound from an app on a macOS version older than 27, which can't record system audio with the built-in tool.",
  },
  {
    q: "How do I stop a screen recording on a Mac?",
    a: "Click the Stop button in the menu bar at the top of the screen, or press Command + Control + Esc.",
  },
];

const loomVsVidyardFaqs = [
  {
    q: "Is Loom or Vidyard better?",
    a: "Loom is better for teams sending quick updates and walkthroughs to each other. Vidyard is better for sales teams that send video to prospects and want to track who watched and connect it to their CRM.",
  },
  {
    q: "Is Vidyard cheaper than Loom?",
    a: "No. Vidyard's Starter plan is $59 per user per month billed yearly, or $89 monthly. Loom Business is $18 per user per month, or about $15 billed yearly. Both have free plans.",
  },
  {
    q: "Which has the better free plan, Loom or Vidyard?",
    a: "It depends on what you record. Loom's free plan keeps up to 25 videos, each up to 5 minutes. Vidyard's free plan gives you 5 videos a month, each up to 30 minutes. For a few longer videos, Vidyard's is better; for many short ones, Loom's is.",
  },
  {
    q: "Does Loom have sales features like Vidyard?",
    a: "Loom has some, like seeing who viewed a video, but it isn't built around sales. Vidyard adds sales-focused analytics, branded sharing pages, calls to action and CRM integrations on its paid plans.",
  },
  {
    q: "Is there an alternative to Loom and Vidyard without a monthly fee?",
    a: "Yes. Showthrough is a Chrome extension that gives you a share link the moment you stop recording, with no limit on videos or length, for a one-time payment. It has no sales analytics or CRM integrations.",
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
  {
    slug: "download-loom-videos",
    title: "How to download a Loom video (and why the button is missing)",
    metaTitle: "How to download a Loom video, step by step",
    description:
      "Download your Loom videos as MP4 in three steps, let viewers download them, and fix a missing Download button. Plus what the free plan allows and bulk export.",
    excerpt:
      "The three steps to download a Loom video, who's allowed to, why the button disappears, and how to get your whole library out.",
    published: "2026-11-22",
    updated: "2026-11-22",
    readingMinutes: 6,
    image: {
      src: "/blog/download-loom-videos.webp",
      alt: "A video player with its menu open and Download highlighted, saving the video as an .mp4 file, with a lock badge for plans that can't download",
      width: 1600,
      height: 900,
    },
    faqs: loomDownloadFaqs,
    Body: () => (
      <>
        <p>
          Loom lets you download your videos as MP4 files, but only on some plans and roles. That&rsquo;s why so many people go looking for the
          Download button and can&rsquo;t find it. This guide shows the steps, who&rsquo;s allowed to download, why the button goes missing, and
          what to do if you want your whole library.
        </p>

        <figure>
          <Image
            src="/blog/download-loom-videos.webp"
            alt="A video player with its menu open and Download highlighted, saving the video as an .mp4 file, with a lock badge for plans that can't download"
            width={1600}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        </figure>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> open the video from your Loom Library, open the menu above the video, and choose{" "}
            <strong>Download</strong>. You get an MP4 file. This works for admins and creators on Business and Business + AI, admins on
            Education, and admins and members on Enterprise. On the free Starter plan, nobody can download.
          </p>
        </div>

        <p className="text-sm">
          Checked on 22 November 2026 against{" "}
          <a href="https://support.atlassian.com/loom/docs/download-your-loom-video/" target="_blank" rel="noopener noreferrer nofollow">
            Loom&rsquo;s help centre
          </a>
          .
        </p>

        <h2>How to download your own Loom video</h2>
        <ol>
          <li>
            <strong>Open your Library</strong> at loom.com/my-videos and select the video.
          </li>
          <li>
            <strong>Open the menu above the video.</strong>
          </li>
          <li>
            <strong>Select Download.</strong> The video saves to your computer as an MP4.
          </li>
        </ol>
        <p>
          If you see a &ldquo;Polishing pixels&rdquo; message, the file isn&rsquo;t ready yet. Long videos can take a while to process; Loom
          suggests allowing up to 30 minutes before the download is available.
        </p>

        <h2>Who can download, by plan</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Plan</th>
                <th scope="col">Who can download</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Starter (free)</th>
                <td>Nobody, not even the video&rsquo;s creator</td>
              </tr>
              <tr>
                <th scope="row">Business and Business + AI</th>
                <td>Admins and creators</td>
              </tr>
              <tr>
                <th scope="row">Education</th>
                <td>Admins only</td>
              </tr>
              <tr>
                <th scope="row">Enterprise</th>
                <td>Admins and members (unless an admin turns downloads off for everyone)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The Creator Lite and Viewer roles can&rsquo;t download on any plan. If you&rsquo;re weighing an upgrade just to get your videos out, see{" "}
          <Link href="/blog/loom-pricing">Loom pricing explained</Link> for what each plan costs.
        </p>

        <h2>How to let viewers download your video</h2>
        <p>If you&rsquo;re on a paid plan, you can let the people you share with download too:</p>
        <ul>
          <li>
            <strong>For one video:</strong> open it, select <strong>Settings</strong>, turn on <strong>Allow downloads</strong>, then refresh
            the page.
          </li>
          <li>
            <strong>For all your videos:</strong> open any video, go to <strong>Settings</strong>, scroll down to{" "}
            <strong>Set defaults&hellip;</strong>, open the <strong>Audience</strong> tab, turn on <strong>Downloads</strong> and save.
          </li>
        </ul>
        <p>
          There&rsquo;s a catch: viewers can only download if they&rsquo;re signed in to Loom with a paid workspace role (creator or admin). A
          client who just opens your link without a Loom account can&rsquo;t download, whatever your settings say.
        </p>

        <h2>Why the Download button is missing</h2>
        <ul>
          <li>
            <strong>You&rsquo;re on the free plan,</strong> or your role is Creator Lite or Viewer.
          </li>
          <li>
            <strong>The video is still processing.</strong> Wait a few minutes, up to 30 for long recordings.
          </li>
          <li>
            <strong>It uses Variables</strong> (personalised versions of one video). These can&rsquo;t be downloaded.
          </li>
          <li>
            <strong>It&rsquo;s a meeting recording</strong> and you weren&rsquo;t the organiser.
          </li>
          <li>
            <strong>It&rsquo;s larger than 20 GB,</strong> roughly three hours of 4K. Loom&rsquo;s support team has to help with those.
          </li>
          <li>
            <strong>Your Enterprise admin has turned downloads off</strong> for the organisation.
          </li>
        </ul>
        <p>
          If the button is there but no file appears, Loom suggests clearing your cache and cookies or trying another browser.
        </p>

        <h2>What you lose in the downloaded file</h2>
        <p>
          The MP4 keeps any trims you made, but not the extras Loom adds on top: calls to action, filler word and silence removal, chapters and
          closed captions. If you recorded at an unusual screen shape, the file keeps that shape, so it can look stretched in other players. Loom
          recommends recording at a 16:9 resolution to avoid this.
        </p>

        <h2>Can you download all your Loom videos at once?</h2>
        <p>
          Not from Loom itself. Bulk download is still an{" "}
          <a href="https://jira.atlassian.com/browse/LOOM-168" target="_blank" rel="noopener noreferrer nofollow">
            open feature request
          </a>
          , so you download videos one at a time. If you have hundreds, some competitors offer migration tools, such as{" "}
          <a href="https://www.tella.com/tools/tella-transfer" target="_blank" rel="noopener noreferrer nofollow">
            Tella Transfer
          </a>{" "}
          and Cap&rsquo;s Loom importer.
        </p>
        <p>
          Be careful with third-party &ldquo;Loom downloader&rdquo; sites and extensions. Most only work on public videos, and some ask for your
          Loom password or browser cookies to reach private ones. Never hand those over to a tool you don&rsquo;t trust; it&rsquo;s full access
          to your account.
        </p>

        <h2>Why owning your videos matters</h2>
        <p>
          When I was freelancing, I paid for Loom, and my library became a record of everything I&rsquo;d sent clients: changes, fixes,
          handovers. I never once downloaded a video. I only realised later that all of it lived in Loom&rsquo;s account, not mine. If I&rsquo;d
          wanted to stop paying, I&rsquo;d first have had to download hundreds of videos one by one, because once you drop to the free plan,
          nobody can download at all.
        </p>
        <p>
          That&rsquo;s one reason I built <Link href="/">Showthrough</Link> to store videos in your own Cloudflare account instead of ours.
          Connecting it is one click, and we handle the setup. A plan change can&rsquo;t lock you out of your own recordings, because they never
          sat on our servers, and you can download any video as a file whenever you like. It&rsquo;s a <Link href="/pricing">one-time payment</Link>, with no free plan. For other options, see{" "}
          <Link href="/alternatives">the best Loom alternatives</Link>.
        </p>

        <h2>Questions people ask</h2>
        {loomDownloadFaqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    slug: "how-to-screen-record-on-windows",
    title: "How to screen record on Windows 11 and 10 (with audio)",
    metaTitle: "How to screen record on Windows 11 and 10, with audio",
    description:
      "Screen record on Windows 11 with the Snipping Tool, or on Windows 10 with the Xbox Game Bar or PowerPoint. Add your voice, find your recordings and share a link.",
    excerpt:
      "Three free ways to record your screen on Windows, with sound, where the files go, and what to do when something doesn't work.",
    published: "2026-11-23",
    updated: "2026-11-23",
    readingMinutes: 7,
    image: {
      src: "/blog/how-to-screen-record-on-windows.webp",
      alt: "A laptop screen with a dashed orange selection box around one app window, an orange record button, and a microphone with a sound wave beside the laptop",
      width: 1600,
      height: 900,
    },
    faqs: windowsRecordFaqs,
    Body: () => (
      <>
        <p>
          Windows has screen recording built in, so you don&rsquo;t need to install anything. Which tool you use depends on your version: Windows 11
          has the Snipping Tool, and both Windows 11 and 10 have the Xbox Game Bar. If you have Microsoft Office, PowerPoint can record too. This
          guide covers all three, how to include sound, where your recordings go, and what to do when you need to send one to someone.
        </p>

        <figure>
          <Image
            src="/blog/how-to-screen-record-on-windows.webp"
            alt="A laptop screen with a dashed orange selection box around one app window, an orange record button, and a microphone with a sound wave beside the laptop"
            width={1600}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        </figure>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> on Windows 11, press <Keys>Windows</Keys> + <Keys>Shift</Keys> + <Keys>R</Keys>, drag to select part
            of the screen, select <strong>Start</strong>, then <strong>Stop</strong>. The video saves as an MP4 in{" "}
            <strong>Videos &gt; Screen Recordings</strong>. On Windows 10, open the app you want to record and press <Keys>Windows</Keys> +{" "}
            <Keys>Alt</Keys> + <Keys>R</Keys> to record with the Xbox Game Bar.
          </p>
        </div>

        <h2>Method 1: the Snipping Tool (Windows 11)</h2>
        <p>
          The Snipping Tool is the easiest way to record on Windows 11. These steps follow{" "}
          <a
            href="https://support.microsoft.com/en-us/windows/use-snipping-tool-to-capture-screenshots-00246869-1843-655f-f220-97299b865f6b"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft&rsquo;s Snipping Tool guide
          </a>
          .
        </p>
        <ol>
          <li>
            <strong>Open the recorder.</strong> Press <Keys>Windows</Keys> + <Keys>Shift</Keys> + <Keys>R</Keys>. Or open the Snipping Tool,
            select <strong>Record</strong>, then <strong>New</strong>.
          </li>
          <li>
            <strong>Select the area.</strong> Drag a rectangle over the part of the screen you want to record. Drag across the whole screen to
            record everything.
          </li>
          <li>
            <strong>Turn on sound if you need it.</strong> In recent versions, the toolbar has a microphone button for your voice and a button for
            system audio (sound playing on the computer). If you don&rsquo;t see them, update the Snipping Tool from the Microsoft Store.
          </li>
          <li>
            <strong>Select Start.</strong> You can pause and resume from the toolbar while you record.
          </li>
          <li>
            <strong>Select Stop</strong> when you&rsquo;re done. The recording opens in the Snipping Tool, where you can save it, copy it or open it
            in Clipchamp to edit.
          </li>
        </ol>
        <p>
          <strong>Where it goes:</strong> Videos &gt; Screen Recordings, as an MP4, if automatic saving is on. If a recording seems to have
          vanished, open the Snipping Tool&rsquo;s settings and check that <strong>Automatically save original screen recordings</strong> is
          turned on; without it, an unsaved recording is lost when you close the window.
        </p>

        <h2>Method 2: the Xbox Game Bar (Windows 10 and 11)</h2>
        <p>
          Despite the name, the Game Bar records any app, not just games. It&rsquo;s the built-in option on Windows 10. See{" "}
          <a
            href="https://support.microsoft.com/en-us/windows/record-your-screen-with-xbox-game-bar-5328cd25-9046-4472-8a14-c485f138802c"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft&rsquo;s Game Bar guide
          </a>{" "}
          for the full details.
        </p>
        <ol>
          <li>
            <strong>Turn it on</strong> in Settings: search for &ldquo;Xbox Game Bar&rdquo; and switch it on.
          </li>
          <li>
            <strong>Open the app you want to record,</strong> such as your browser.
          </li>
          <li>
            <strong>Press</strong> <Keys>Windows</Keys> + <Keys>Alt</Keys> + <Keys>R</Keys> to start recording.
          </li>
          <li>
            <strong>Toggle your microphone</strong> with <Keys>Windows</Keys> + <Keys>Alt</Keys> + <Keys>M</Keys>. To see the controls, press{" "}
            <Keys>Windows</Keys> + <Keys>G</Keys>.
          </li>
          <li>
            <strong>Press</strong> <Keys>Windows</Keys> + <Keys>Alt</Keys> + <Keys>R</Keys> again to stop.
          </li>
        </ol>
        <p>
          <strong>Where it goes:</strong> Videos &gt; Captures, as an MP4.
        </p>
        <p>
          <strong>The catch:</strong> the Game Bar records one app window at a time. It won&rsquo;t record the desktop or File Explorer, so it&rsquo;s
          no good for showing someone how to move between apps.
        </p>

        <h2>Method 3: PowerPoint (if you have Microsoft Office)</h2>
        <p>
          PowerPoint has a screen recorder that works on Windows 10 and 11, and it can record the whole screen, which the Game Bar can&rsquo;t.
        </p>
        <ol>
          <li>
            Open PowerPoint and go to <strong>Insert &gt; Screen Recording</strong>.
          </li>
          <li>
            Choose <strong>Select Area</strong> and drag over what you want to record. PowerPoint records your microphone and mouse pointer by
            default.
          </li>
          <li>
            Select <strong>Record</strong>. Stop with <Keys>Windows</Keys> + <Keys>Shift</Keys> + <Keys>Q</Keys>.
          </li>
          <li>
            The recording is added to your slide. Right-click it and choose <strong>Save Media as</strong> to keep it as a video file.
          </li>
        </ol>
        <p>
          PowerPoint records your microphone, but sound playing on the computer usually needs extra Windows sound settings, so use the Snipping Tool
          if you need system audio.
        </p>

        <h2>Which one should you use?</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Tool</th>
                <th scope="col">Windows</th>
                <th scope="col">Records</th>
                <th scope="col">Sound</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Snipping Tool</th>
                <td>11</td>
                <td>Any area or the full screen</td>
                <td>Microphone and system audio in recent versions</td>
              </tr>
              <tr>
                <th scope="row">Xbox Game Bar</th>
                <td>10 and 11</td>
                <td>One app window, not the desktop</td>
                <td>System audio, microphone on demand</td>
              </tr>
              <tr>
                <th scope="row">PowerPoint</th>
                <td>10 and 11, with Office</td>
                <td>Any area or the full screen</td>
                <td>Microphone</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Common problems</h2>
        <ul>
          <li>
            <strong>Windows + Shift + R does nothing.</strong> Screen recording in the Snipping Tool needs Windows 11. Update Windows, then update the
            Snipping Tool from the Microsoft Store. On Windows 10, use the Game Bar or PowerPoint.
          </li>
          <li>
            <strong>There&rsquo;s no sound.</strong> Check the microphone and system audio buttons before you press Start; they&rsquo;re easy to
            miss. In the Game Bar, the microphone is off until you press <Keys>Windows</Keys> + <Keys>Alt</Keys> + <Keys>M</Keys>.
          </li>
          <li>
            <strong>The Game Bar won&rsquo;t record.</strong> It doesn&rsquo;t work on the desktop or in File Explorer. Click into an app window
            first.
          </li>
          <li>
            <strong>You can&rsquo;t find the file.</strong> Look in Videos &gt; Screen Recordings (Snipping Tool) or Videos &gt; Captures (Game Bar).
          </li>
        </ul>

        <h2>When you need to send it to someone</h2>
        <p>
          All three tools give you a video file. That&rsquo;s fine for keeping a copy, but awkward when a client or teammate needs to watch it. A
          ten-minute recording is too big for most email attachments, and uploading it to a drive and fixing the sharing settings takes longer than
          the recording did.
        </p>
        <p>
          That&rsquo;s why most people who record to explain something use a recorder that gives them a link instead. I built{" "}
          <Link href="/">Showthrough</Link> for that: it&rsquo;s a Chrome extension, so it works the same on Windows, Mac and Chromebook. It
          records your screen, camera and voice, uploads while you talk, and copies a share link the moment you stop. Videos are stored in your
          own Cloudflare account, connected in one click while we handle the setup. It&rsquo;s a <Link href="/pricing">one-time payment</Link>. For
          other options, see <Link href="/alternatives">the best Loom alternatives</Link>, or{" "}
          <Link href="/blog/how-to-screen-record-on-chromebook">how to screen record on a Chromebook</Link>.
        </p>

        <h2>Questions people ask</h2>
        {windowsRecordFaqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    slug: "best-screen-recorders-for-chromebook",
    title: "The 6 best screen recorders for Chromebook in 2026",
    metaTitle: "The 6 best screen recorders for Chromebook (2026)",
    description:
      "The best screen recorders for Chromebook compared: the built-in tool, Showthrough, Loom, Screencastify, Screenity and Vidyard. Free plans, limits and sharing.",
    excerpt:
      "Six screen recorders that work on a Chromebook, what each free plan allows, and which to pick for school, work or client updates.",
    published: "2026-11-23",
    updated: "2026-11-23",
    readingMinutes: 7,
    image: {
      src: "/blog/best-screen-recorders-for-chromebook.webp",
      alt: "A laptop playing a video, surrounded by six screen recorder icons for recording, camera, playback, drawing, links and film, with the drawing icon highlighted in orange",
      width: 1600,
      height: 900,
    },
    faqs: chromebookRecorderFaqs,
    Body: () => (
      <>
        <p>
          A Chromebook can&rsquo;t run Windows or Mac recording apps, and OBS Studio{" "}
          <a href="https://streamyard.com/blog/best-screen-recording-software-for-chromebook" target="_blank" rel="noopener noreferrer nofollow">
            doesn&rsquo;t officially support ChromeOS
          </a>
          . So your choices are the recorder built into ChromeOS, or a Chrome extension. Here are the six worth using, what each free plan really
          allows, and which one fits what you&rsquo;re recording.
        </p>

        <figure>
          <Image
            src="/blog/best-screen-recorders-for-chromebook.webp"
            alt="A laptop playing a video, surrounded by six screen recorder icons for recording, camera, playback, drawing, links and film, with the drawing icon highlighted in orange"
            width={1600}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        </figure>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> for a quick recording you&rsquo;ll keep yourself, use the <strong>built-in Screen capture</strong>{" "}
            tool. For free recording with no limits, use <strong>Screenity</strong>. To send a link to someone, use a tool that hosts your video:{" "}
            <strong>Loom</strong> or <strong>Screencastify</strong> on their free plans, or <strong>Showthrough</strong> if you&rsquo;d rather pay
            once and skip the limits.
          </p>
        </div>

        <p className="text-sm">
          We make Showthrough, so it&rsquo;s on this list, with its trade-offs stated like everyone else&rsquo;s. Free plans checked on 23 November
          2026 on each tool&rsquo;s own website.
        </p>

        <h2>The six at a glance</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Recorder</th>
                <th scope="col">Free plan</th>
                <th scope="col">Share link</th>
                <th scope="col">Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Built-in Screen capture</th>
                <td>Free, no sign-up</td>
                <td>No, saves a .webm file</td>
                <td>Quick recordings you keep</td>
              </tr>
              <tr>
                <th scope="row">Showthrough</th>
                <td>No free plan; one payment</td>
                <td>Yes, the moment you stop</td>
                <td>Daily updates with no limits</td>
              </tr>
              <tr>
                <th scope="row">Loom</th>
                <td>25 videos, 5 minutes each</td>
                <td>Yes</td>
                <td>Short work videos</td>
              </tr>
              <tr>
                <th scope="row">Screencastify</th>
                <td>10 videos, 30 minutes each, watermark</td>
                <td>Yes</td>
                <td>Teachers and students</td>
              </tr>
              <tr>
                <th scope="row">Screenity</th>
                <td>Free and open source, no limits</td>
                <td>No, saves a file</td>
                <td>Free recording with drawing tools</td>
              </tr>
              <tr>
                <th scope="row">Vidyard</th>
                <td>5 videos a month, 30 minutes each</td>
                <td>Yes</td>
                <td>Sales outreach</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>1. Built-in Screen capture: free and already there</h2>
        <p>
          Every Chromebook has a recorder. Press <Keys>Shift</Keys> + <Keys>Ctrl</Keys> + <Keys>Show windows</Keys>, choose{" "}
          <strong>Screen record</strong>, and record the full screen, part of it or one window, with your microphone, device audio and front camera.
          Stop with <Keys>Search</Keys> + <Keys>Shift</Keys> + <Keys>X</Keys>. The full steps are in{" "}
          <Link href="/blog/how-to-screen-record-on-chromebook">how to screen record on a Chromebook</Link>.
        </p>
        <p>
          <strong>The catch:</strong> it saves a .webm file to your Downloads folder, with no editing and no link. Fine for yourself, awkward for
          sending to someone.
        </p>

        <h2>2. Showthrough: a link the moment you stop, and no limits</h2>
        <p>
          <Link href="/">Showthrough</Link> is our Chrome extension. It records your screen, a tab or a window with your camera and voice, uploads
          while you talk, and copies a share link the moment you stop. There&rsquo;s no limit on how many videos you record or how long they run,
          and viewers watch in any browser without an account. Videos are stored in your own Cloudflare account, connected in one click while we
          handle the setup.
        </p>
        <p>
          <strong>The catch:</strong> there&rsquo;s no free plan. It&rsquo;s a <Link href="/pricing">one-time payment</Link> instead of a
          subscription, with refunds within 7 days. It also has no AI summaries or video editor yet.
        </p>

        <h2>3. Loom: the best-known option, with tight free limits</h2>
        <p>
          Loom works on Chromebooks through its{" "}
          <a href="https://www.loom.com/blog/screen-capture-chromebook" target="_blank" rel="noopener noreferrer nofollow">
            Chrome extension
          </a>
          ; its desktop app doesn&rsquo;t run on ChromeOS. It&rsquo;s polished, with comments, reactions and a big library of integrations.
        </p>
        <p>
          <strong>The catch:</strong> the free plan stops at 25 videos and 5 minutes per recording (see{" "}
          <Link href="/blog/is-loom-free">Is Loom free?</Link>), and paid plans cost $18 per user per month (see{" "}
          <Link href="/blog/loom-pricing">Loom pricing explained</Link>).
        </p>

        <h2>4. Screencastify: built for classrooms</h2>
        <p>
          <a href="https://www.screencastify.com/buy" target="_blank" rel="noopener noreferrer nofollow">
            Screencastify
          </a>{" "}
          is the recorder many schools use on Chromebooks. The free plan lets you create up to 10 videos of up to 30 minutes each and share them with
          a link, and paid plans add quizzes, assignments and LMS grade sync.
        </p>
        <p>
          <strong>The catch:</strong> free videos carry a Castify watermark, and you&rsquo;re capped at 10 videos. See{" "}
          <Link href="/alternatives/screencastify">Showthrough vs Screencastify</Link>.
        </p>

        <h2>5. Screenity: free, open source and unlimited</h2>
        <p>
          <a href="https://screenity.io/extension" target="_blank" rel="noopener noreferrer nofollow">
            Screenity
          </a>{" "}
          is a free, open-source Chrome extension with no watermark and no time limit. You can draw on the screen, blur sensitive parts and
          highlight clicks while you record.
        </p>
        <p>
          <strong>The catch:</strong> the free recorder saves the video to your Chromebook, so you upload it somewhere yourself to share it. Its
          editor is a paid upgrade.
        </p>

        <h2>6. Vidyard: for sales videos</h2>
        <p>
          <a href="https://www.vidyard.com/pricing/" target="_blank" rel="noopener noreferrer nofollow">
            Vidyard
          </a>{" "}
          has a Chrome extension and a free plan with 5 videos a month of up to 30 minutes each. It&rsquo;s built for sales teams, with viewer
          tracking and CRM integrations on paid plans.
        </p>
        <p>
          <strong>The catch:</strong> 5 videos a month goes quickly, and its paid prices aren&rsquo;t listed publicly. See{" "}
          <Link href="/alternatives/vidyard">Showthrough vs Vidyard</Link>.
        </p>

        <h2>How to choose</h2>
        <ul>
          <li>
            <strong>Recording for yourself, or once in a while:</strong> the built-in tool or Screenity.
          </li>
          <li>
            <strong>School work and lessons:</strong> Screencastify.
          </li>
          <li>
            <strong>A few short work videos a month:</strong> Loom&rsquo;s free plan.
          </li>
          <li>
            <strong>Sales outreach:</strong> Vidyard.
          </li>
          <li>
            <strong>Updates to clients or teammates every day, or recordings longer than 5 minutes:</strong> Showthrough, or a paid plan elsewhere.
          </li>
        </ul>
        <p>
          When I was freelancing, the free plans ran out within a week or two, because clients wanted small updates every day. The free tools with
          no limits solved that, but then I was uploading files and fixing sharing settings for every update. If you&rsquo;re comparing more than
          Chromebook options, see <Link href="/alternatives">the best Loom alternatives</Link>.
        </p>

        <h2>How to add a screen recorder extension to a Chromebook</h2>
        <ol>
          <li>Open the Chrome Web Store and search for the recorder&rsquo;s name.</li>
          <li>
            Select <strong>Add to Chrome</strong>, then <strong>Add extension</strong>.
          </li>
          <li>
            Select the puzzle-piece icon next to the address bar and pin the extension so it&rsquo;s one click away.
          </li>
          <li>Open it and allow access to your camera and microphone the first time you record.</li>
        </ol>
        <p>
          On a school or work Chromebook, your administrator may block new extensions. If <strong>Add to Chrome</strong> is greyed out, ask your IT
          team, or use the built-in recorder.
        </p>

        <h2>Questions people ask</h2>
        {chromebookRecorderFaqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    slug: "loom-chrome-extension",
    title: "Loom Chrome extension: what it does, its limits, and alternatives",
    metaTitle: "Loom Chrome extension: how it works, limits and alternatives",
    description:
      "How the Loom Chrome extension works, what the free plan allows (25 videos, 5 minutes, 720p), how it differs from the desktop app, and the best alternatives.",
    excerpt:
      "What the Loom Chrome extension does, what you get for free, where it falls short of the desktop app, and alternatives if the limits get in the way.",
    published: "2026-11-24",
    updated: "2026-11-24",
    readingMinutes: 6,
    image: {
      src: "/blog/loom-chrome-extension.webp",
      alt: "A browser window with the extensions menu open and a record extension highlighted, above three recording choices: screen, screen with camera, and camera only",
      width: 1600,
      height: 900,
    },
    faqs: loomExtensionFaqs,
    Body: () => (
      <>
        <p>
          The Loom Chrome extension is the quickest way to start using Loom: install it, click the icon, and record your screen and camera from
          the browser. When you stop, you get a link to send. It&rsquo;s free to install, but the free plan has firm limits, and some features only
          exist in Loom&rsquo;s desktop app. Here&rsquo;s what you get, what you don&rsquo;t, and what to use if the limits get in your way.
        </p>

        <figure>
          <Image
            src="/blog/loom-chrome-extension.webp"
            alt="A browser window with the extensions menu open and a record extension highlighted, above three recording choices: screen, screen with camera, and camera only"
            width={1600}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        </figure>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> the Loom Chrome extension is free and records your screen, a tab, a window or your camera. On the free
            Starter plan you get{" "}
            <a href="https://www.loom.com/products/chrome-screen-recorder" target="_blank" rel="noopener noreferrer nofollow">
              25 videos per person
            </a>
            , 5 minutes per recording, and up to 720p. Paid plans start at $18 per user per month. For 4K, drawing or speaker notes you need the
            desktop app.
          </p>
        </div>

        <p className="text-sm">Checked on 24 November 2026 against Loom&rsquo;s own help pages.</p>

        <h2>What the Loom Chrome extension does</h2>
        <ul>
          <li>Records your full screen, one window or one Chrome tab, with or without your camera.</li>
          <li>Records your camera on its own, for a quick talking-head message.</li>
          <li>Records your voice through your microphone.</li>
          <li>Uploads as you record, then gives you a link to share.</li>
          <li>Lets viewers comment and react on the video page.</li>
        </ul>

        <h2>How to install and use it</h2>
        <ol>
          <li>
            Open the Chrome Web Store, search for <strong>Loom</strong>, and select <strong>Add to Chrome</strong>.
          </li>
          <li>Pin the extension from the puzzle-piece icon next to the address bar, then sign in or create a free account.</li>
          <li>
            Click the Loom icon and choose what to record: <strong>Screen and Camera</strong>, <strong>Screen only</strong> or{" "}
            <strong>Camera only</strong>.
          </li>
          <li>Pick your microphone and camera, then select Start recording and choose a tab, window or your entire screen.</li>
          <li>Stop from the Loom controls. The video opens in Loom, ready to share with a link.</li>
        </ol>

        <h2>Its limits on the free plan</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Limit</th>
                <th scope="col">Free Starter plan</th>
                <th scope="col">Paid plans</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Videos you can keep</th>
                <td>25 per person</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <th scope="row">Length per screen recording</th>
                <td>5 minutes</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <th scope="row">Quality in the extension</th>
                <td>Up to 720p</td>
                <td>Up to 1080p</td>
              </tr>
              <tr>
                <th scope="row">Price</th>
                <td>$0</td>
                <td>From $18 per user per month</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Loom&rsquo;s help centre also says{" "}
          <a
            href="https://support.atlassian.com/loom/kb/adjust-and-troubleshoot-loom-video-recording-resolution-settings/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            camera-only recordings in the extension stay at 720p
          </a>{" "}
          on every plan. For the full breakdown, see <Link href="/blog/is-loom-free">Is Loom free?</Link> and{" "}
          <Link href="/blog/loom-pricing">Loom pricing explained</Link>.
        </p>

        <h2>Chrome extension vs desktop app</h2>
        <p>
          Loom{" "}
          <a href="https://www.atlassian.com/software/loom/screen-recorder" target="_blank" rel="noopener noreferrer nofollow">
            describes the extension as its basic option
          </a>
          . The desktop app, for Mac and Windows, adds the extras:
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Chrome extension</th>
                <th scope="col">Desktop app</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Install</th>
                <td>Seconds, from the Chrome Web Store</td>
                <td>Download and install</td>
              </tr>
              <tr>
                <th scope="row">Best quality</th>
                <td>1080p on paid plans</td>
                <td>Up to 4K on paid plans</td>
              </tr>
              <tr>
                <th scope="row">Drawing on screen</th>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">Speaker notes</th>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <th scope="row">Works on a Chromebook</th>
                <td>Yes</td>
                <td>No</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          If you only record quick updates in Chrome, the extension is enough. If you want polished demos, Loom itself points you to the desktop app.
        </p>

        <h2>Alternatives to the Loom Chrome extension</h2>
        <p>
          The usual reasons to look elsewhere are the 25-video cap, the 5-minute limit, or paying $18 for every person on the team, every month.
        </p>
        <ul>
          <li>
            <strong>
              <Link href="/">Showthrough</Link>
            </strong>{" "}
            is a Chrome extension that works the same way: record your screen, a tab or a window with your camera, and a link is copied the moment
            you stop. There&rsquo;s no limit on videos or length, and you pay once instead of every month (see{" "}
            <Link href="/pricing">pricing</Link>). The catch: there&rsquo;s no free plan, and no AI summaries or editor yet. We make it.
          </li>
          <li>
            <strong>Screenity</strong> is free and open source with no time limit, but it saves a file you have to upload and share yourself.
          </li>
          <li>
            <strong>Screencastify</strong> has a free plan with 10 videos of up to 30 minutes each, with a watermark. It&rsquo;s popular in schools.
          </li>
          <li>
            <strong>Vidyard</strong> has a free plan with 5 videos a month and is built for sales teams.
          </li>
        </ul>
        <p>
          For the full comparison, including desktop apps, see <Link href="/alternatives">the best Loom alternatives</Link>.
        </p>

        <h2>Questions people ask</h2>
        {loomExtensionFaqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    slug: "best-screen-recorders-for-mac",
    title: "The 8 best screen recorders for Mac in 2026",
    metaTitle: "The 8 best screen recorders for Mac (2026), free and paid",
    description:
      "The best screen recorders for Mac compared: the built-in tool, QuickTime, Showthrough, Loom, CleanShot X, Screen Studio, OBS and Cap. Prices, limits and sharing.",
    excerpt:
      "Eight screen recorders for Mac, from the free built-in tool to polished demo apps, with what each costs and which to pick for what you're recording.",
    published: "2026-11-24",
    updated: "2026-11-24",
    readingMinutes: 8,
    image: {
      src: "/blog/best-screen-recorders-for-mac.webp",
      alt: "A laptop playing a video, with eight screen recorder app icons in an arc above it and the link icon highlighted in orange",
      width: 1600,
      height: 900,
    },
    faqs: macRecorderFaqs,
    Body: () => (
      <>
        <p>
          Every Mac comes with a screen recorder, and for a lot of people it&rsquo;s enough. You reach for something else when you want to send a
          link instead of a file, record sound from apps, or make a demo that looks polished. Here are the eight worth knowing, what each costs, and
          which one fits what you&rsquo;re recording.
        </p>

        <figure>
          <Image
            src="/blog/best-screen-recorders-for-mac.webp"
            alt="A laptop playing a video, with eight screen recorder app icons in an arc above it and the link icon highlighted in orange"
            width={1600}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        </figure>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> for a quick recording you keep yourself, use the free <strong>Shift + Command + 5</strong> toolbar. To
            send a link to a client or teammate, use <strong>Showthrough</strong> or <strong>Loom</strong>. For polished product demos, use{" "}
            <strong>Screen Studio</strong>. For screenshots and recordings in one app, use <strong>CleanShot X</strong>. For full control for free,
            use <strong>OBS</strong>.
          </p>
        </div>

        <p className="text-sm">
          We make Showthrough, so it&rsquo;s on this list, with its trade-offs stated like everyone else&rsquo;s. Prices checked on 24 November 2026.
        </p>

        <h2>The eight at a glance</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Recorder</th>
                <th scope="col">Price</th>
                <th scope="col">Share link</th>
                <th scope="col">Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Screenshot toolbar</th>
                <td>Free, built in</td>
                <td>No, saves a .mov</td>
                <td>Quick recordings you keep</td>
              </tr>
              <tr>
                <th scope="row">QuickTime Player</th>
                <td>Free, built in</td>
                <td>No, saves a .mov</td>
                <td>Recording plus a quick trim</td>
              </tr>
              <tr>
                <th scope="row">Showthrough</th>
                <td>Pay once</td>
                <td>Yes, the moment you stop</td>
                <td>Updates to clients and teams</td>
              </tr>
              <tr>
                <th scope="row">Loom</th>
                <td>Free plan; $18 per user per month</td>
                <td>Yes</td>
                <td>Teams already on Loom</td>
              </tr>
              <tr>
                <th scope="row">CleanShot X</th>
                <td>$35 once, 1 year of updates</td>
                <td>Yes, via its cloud</td>
                <td>Screenshots and short recordings</td>
              </tr>
              <tr>
                <th scope="row">Screen Studio</th>
                <td>$9 a month yearly, or $29 monthly</td>
                <td>Yes</td>
                <td>Polished product demos</td>
              </tr>
              <tr>
                <th scope="row">OBS Studio</th>
                <td>Free, open source</td>
                <td>No, saves a file</td>
                <td>Full control, streaming</td>
              </tr>
              <tr>
                <th scope="row">Cap</th>
                <td>Free for personal use; Pro from $8.16 a month</td>
                <td>Yes</td>
                <td>Open-source Loom-style recording</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>1. Screenshot toolbar: free and already on your Mac</h2>
        <p>
          Press <Keys>Shift</Keys> + <Keys>Command</Keys> + <Keys>5</Keys>, choose <strong>Record Entire Screen</strong> or{" "}
          <strong>Record Selected Portion</strong>, pick your microphone under <strong>Options</strong>, and select <strong>Record</strong>. Stop
          from the button in the menu bar. The video saves as a .mov file, on your desktop by default.
        </p>
        <p>
          <strong>The catch:</strong> it saves a file, with no link. Recording sound from apps needs{" "}
          <a href="https://support.apple.com/102618" target="_blank" rel="noopener noreferrer nofollow">
            macOS 27 or later
          </a>
          , where Options has an Include System Audio choice. Older versions record only your microphone. See{" "}
          <Link href="/blog/how-to-screen-record-on-mac">how to screen record on Mac with audio</Link>.
        </p>

        <h2>2. QuickTime Player: the built-in tool with a trim button</h2>
        <p>
          Open QuickTime Player and choose <strong>File &gt; New Screen Recording</strong>. It opens the same toolbar as Shift + Command + 5, but
          the recording opens in QuickTime afterwards, where you can trim the start and end before saving.
        </p>
        <p>
          <strong>The catch:</strong> it saves a file, not a link, and it records your microphone, not sound from apps.
        </p>

        <h2>3. Showthrough: a link the moment you stop</h2>
        <p>
          <Link href="/">Showthrough</Link> is a Chrome extension, so it works on any Mac with Chrome. It records your screen, a tab or a window
          with your camera, voice and tab audio, uploads while you talk, and copies a share link the moment you stop. There&rsquo;s no limit on how
          many videos you record or how long they run, and viewers watch in any browser without an account. Videos are stored in your own
          Cloudflare account, set up in one click.
        </p>
        <p>
          <strong>The catch:</strong> there&rsquo;s no free plan. You pay once instead of every month (see <Link href="/pricing">pricing</Link>
          ). It has no editor, AI summaries or zoom effects yet, so it&rsquo;s for updates, not polished demos. We make it.
        </p>

        <h2>4. Loom: the best-known option for teams</h2>
        <p>
          Loom has a Mac desktop app and a <Link href="/blog/loom-chrome-extension">Chrome extension</Link>. The desktop app records{" "}
          <a href="https://support.loom.com/hc/en-us/articles/360002241197" target="_blank" rel="noopener noreferrer nofollow">
            up to 4K on paid plans
          </a>
          , with drawing tools, camera filters and comments on every video.
        </p>
        <p>
          <strong>The catch:</strong> the free plan stops at 25 videos and 5 minutes per recording, at up to 720p, and paid plans cost $18 per user
          per month (see <Link href="/blog/loom-pricing">Loom pricing explained</Link>).
        </p>

        <h2>5. CleanShot X: screenshots and recordings in one app</h2>
        <p>
          <a href="https://cleanshot.com/pricing" target="_blank" rel="noopener noreferrer nofollow">
            CleanShot X
          </a>{" "}
          replaces the built-in screenshot tool with a better one: scrolling screenshots, annotations, text recognition, and screen recording as
          video or GIF. Its Basic license costs{" "}
          <a href="https://academy.techpresso.co/reviews/is-cleanshot-x-worth-it" target="_blank" rel="noopener noreferrer nofollow">
            $35 once with a year of updates
          </a>
          , and you can upload recordings to CleanShot Cloud to share a link.
        </p>
        <p>
          <strong>The catch:</strong> it&rsquo;s built for screenshots and short clips first. For long recordings with your camera, a dedicated
          video recorder suits better.
        </p>

        <h2>6. Screen Studio: the prettiest demos</h2>
        <p>
          <a href="https://screen.studio" target="_blank" rel="noopener noreferrer nofollow">
            Screen Studio
          </a>{" "}
          is what many product launch videos are made with. It zooms in on your clicks automatically, smooths your cursor and adds backgrounds, so
          a plain recording looks edited without editing.
        </p>
        <p>
          <strong>The catch:</strong> it&rsquo;s a subscription now,{" "}
          <a href="https://www.softwares.com/software/screen-studio/pricing" target="_blank" rel="noopener noreferrer nofollow">
            $9 a month billed yearly or $29 monthly
          </a>
          , with a 14-day trial. It&rsquo;s Mac-only, and it&rsquo;s more than you need for a quick update.
        </p>

        <h2>7. OBS Studio: free and powerful</h2>
        <p>
          <a href="https://obsproject.com" target="_blank" rel="noopener noreferrer nofollow">
            OBS Studio
          </a>{" "}
          is free and open source. You can combine your screen, camera, images and several audio sources into scenes, record at high quality, and
          stream live.
        </p>
        <p>
          <strong>The catch:</strong> it takes real setup to get right, and it saves a file, so sharing is up to you.
        </p>

        <h2>8. Cap: open source, Loom-style</h2>
        <p>
          <a href="https://cap.so/pricing" target="_blank" rel="noopener noreferrer nofollow">
            Cap
          </a>{" "}
          is an open-source recorder for Mac and Windows with an editor and share links. The free plan is for personal use, with{" "}
          <a href="https://androidexperto.com/apps/cap/" target="_blank" rel="noopener noreferrer nofollow">
            local recording with no time limit and share links up to 5 minutes
          </a>
          .
        </p>
        <p>
          <strong>The catch:</strong> commercial use and longer share links need Cap Pro, at $12 per user per month or $8.16 billed yearly. See{" "}
          <Link href="/alternatives/cap">Showthrough vs Cap</Link>.
        </p>

        <h2>How to choose</h2>
        <ul>
          <li>
            <strong>Recording for yourself, now and then:</strong> the Screenshot toolbar or QuickTime.
          </li>
          <li>
            <strong>Sending updates to clients or teammates:</strong> Showthrough, if you&rsquo;d rather pay once, or Loom, if your team already
            uses it.
          </li>
          <li>
            <strong>Product demos and launch videos:</strong> Screen Studio.
          </li>
          <li>
            <strong>Lots of screenshots, some short clips:</strong> CleanShot X.
          </li>
          <li>
            <strong>Full control for free, or live streaming:</strong> OBS.
          </li>
        </ul>
        <p>
          Comparing tools for a whole team? See <Link href="/alternatives">the best Loom alternatives</Link>.
        </p>

        <h2>Questions people ask</h2>
        {macRecorderFaqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    slug: "freelance-project-proposal-template",
    title: "Freelance project proposal template (free, with an example)",
    metaTitle: "Freelance project proposal template, free with an example",
    description:
      "A free project proposal template for freelancers: the seven sections to include, a filled-in example for a website project, and one trick that makes proposals stand out.",
    excerpt:
      "Seven sections that make a freelance proposal easy to say yes to, a template to copy, a filled-in example, and why a two-minute video helps you win.",
    published: "2026-11-24",
    updated: "2026-11-24",
    readingMinutes: 7,
    image: {
      src: "/blog/freelance-project-proposal-template.webp",
      alt: "A proposal document with seven checked sections, a pen, and a video thumbnail clipped to the corner",
      width: 1600,
      height: 900,
    },
    faqs: proposalFaqs,
    Body: () => (
      <>
        <p>
          A good proposal doesn&rsquo;t need to be long or clever. It needs to show the client you understood their problem, tell them exactly what
          they&rsquo;ll get, by when and for how much, and make saying yes easy. After four years and 150+ freelance projects, this is the template
          I&rsquo;d use.
        </p>

        <figure>
          <Image
            src="/blog/freelance-project-proposal-template.webp"
            alt="A proposal document with seven checked sections, a pen, and a video thumbnail clipped to the corner"
            width={1600}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        </figure>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> a freelance project proposal needs seven sections: the problem, your solution, deliverables, timeline,
            price and payment terms, what&rsquo;s not included, and next steps. Keep it to one or two pages, send it within a day, and add a short
            video walking through it.
          </p>
          <p>
            <strong>Free templates:</strong> <a href="#download">download the proposal template</a> as a Word file or as 3 ready-made Figma
            designs.
          </p>
        </div>

        <h2>The 7 sections of a freelance proposal</h2>
        <ol>
          <li>
            <strong>The problem.</strong> Two or three sentences in the client&rsquo;s own words. This is where they decide whether you listened.
          </li>
          <li>
            <strong>Your solution.</strong> What you&rsquo;ll do, in plain language. Not your process, just the plan.
          </li>
          <li>
            <strong>Deliverables.</strong> The exact things they&rsquo;ll receive: pages, screens, files, rounds of changes.
          </li>
          <li>
            <strong>Timeline.</strong> Dates for each stage, and what you need from them to hit those dates.
          </li>
          <li>
            <strong>Price and payment terms.</strong> The total, what&rsquo;s paid when, and how they pay.
          </li>
          <li>
            <strong>Not included.</strong> The things that look included but aren&rsquo;t. This section prevents most scope arguments.
          </li>
          <li>
            <strong>Next steps.</strong> What happens when they say yes, and how long the proposal stays valid.
          </li>
        </ol>

        <h2>The template</h2>
        <p>Copy this into a doc and replace everything in [brackets].</p>

        <div className="callout">
          <p>
            <strong>Proposal: [Project name] for [Client name]</strong>
            <br />
            [Your name] &middot; [Date] &middot; Valid until [date, 14 days from now]
          </p>
          <p>
            <strong>1. The problem</strong>
            <br />
            You told me [their problem, in their words]. Right now this means [the cost to them: lost sales, wasted time, a launch that&rsquo;s
            stuck].
          </p>
          <p>
            <strong>2. What I&rsquo;ll do</strong>
            <br />
            I&rsquo;ll [your solution in one or two sentences], so that [the result they care about].
          </p>
          <p>
            <strong>3. What you&rsquo;ll get</strong>
            <br />
            &bull; [Deliverable 1]
            <br />
            &bull; [Deliverable 2]
            <br />
            &bull; [Number] rounds of changes
          </p>
          <p>
            <strong>4. Timeline</strong>
            <br />
            &bull; [Stage 1]: [date]
            <br />
            &bull; [Stage 2]: [date]
            <br />
            &bull; Launch or handover: [date]
            <br />
            To keep to these dates, I&rsquo;ll need [content, logins, feedback within X days] from you.
          </p>
          <p>
            <strong>5. Price</strong>
            <br />
            [Total price]. [Part] upfront to start, [part] on [milestone or delivery]. Paid by [bank transfer, Payoneer, card].
          </p>
          <p>
            <strong>6. Not included</strong>
            <br />
            [Hosting, copywriting, extra pages, ongoing maintenance]. Happy to quote for these separately.
          </p>
          <p>
            <strong>7. Next steps</strong>
            <br />
            Reply &ldquo;yes&rdquo; and I&rsquo;ll send the invoice for the first payment. I can start on [date].
          </p>
        </div>

        <h2 id="download">Download the free templates</h2>
        <ul>
          <li>
            <strong>
              <a href="/templates/freelance-proposal-template.docx" download>
                Word file (.docx)
              </a>
            </strong>
            : opens in Word, Pages or Google Docs (upload it to Google Drive, then open it with Google Docs).
          </li>
          <li>
            <strong>
              <a href="https://www.figma.com/design/NUfXuNKp9sXmqYDHJGNYGu" target="_blank" rel="noopener noreferrer">
                Figma file with 3 designs
              </a>
            </strong>
            : Classic, Bold and Split layouts, A4 size. Duplicate it to your own Figma, edit the text in brackets, and export as PDF.
          </li>
        </ul>

        <h2>A filled-in example</h2>
        <p>Here&rsquo;s the template used for a small website project:</p>
        <ul>
          <li>
            <strong>The problem:</strong> &ldquo;Our site looks outdated and people leave before booking a call.&rdquo; Visitors can&rsquo;t tell
            what the agency does from the homepage.
          </li>
          <li>
            <strong>What I&rsquo;ll do:</strong> redesign and rebuild the homepage, services page and contact page so visitors understand the
            offer in five seconds and can book a call from any page.
          </li>
          <li>
            <strong>What you&rsquo;ll get:</strong> designs for 3 pages, the built pages on your current platform, a booking button on every page,
            and 2 rounds of changes.
          </li>
          <li>
            <strong>Timeline:</strong> designs in week 1, build in weeks 2 and 3, launch at the end of week 3. I need your logo, photos and
            service descriptions before day 2.
          </li>
          <li>
            <strong>Price:</strong> one fixed price, half upfront and half at launch.
          </li>
          <li>
            <strong>Not included:</strong> new copywriting, a blog, and changes after launch.
          </li>
          <li>
            <strong>Next steps:</strong> reply yes, I send the first invoice, and we start Monday.
          </li>
        </ul>

        <h2>The trick that helps you win: send a 2-minute video with it</h2>
        <p>
          Most clients get several proposals that look alike. A short screen recording walking through yours stands out: they hear your voice,
          see you understood the brief, and get their questions answered before they ask. It also works for clients in other time zones, because
          they watch it when it suits them. We wrote more about this in{" "}
          <Link href="/blog/async-communication">async communication</Link>.
        </p>
        <p>Keep it simple:</p>
        <ol>
          <li>Open the proposal and record your screen with your camera on.</li>
          <li>Spend 20 seconds restating their problem.</li>
          <li>Scroll through the deliverables, timeline and price, explaining anything that could raise a question.</li>
          <li>End with the next step: &ldquo;If this looks right, just reply yes.&rdquo;</li>
          <li>Put the link at the top of your email or message.</li>
        </ol>
        <p>
          You can do this with any screen recorder that gives you a link. <Link href="/">Showthrough</Link> is the one we make: it copies a link
          the moment you stop, has no limit on videos or length, and you pay once instead of every month (see <Link href="/pricing">pricing</Link>
          ).
        </p>

        <h2>Five mistakes that lose proposals</h2>
        <ul>
          <li>
            <strong>Talking about yourself first.</strong> Start with their problem. Your experience belongs in a line or a link.
          </li>
          <li>
            <strong>Vague deliverables.</strong> &ldquo;A modern website&rdquo; invites arguments. &ldquo;3 pages, 2 rounds of changes&rdquo;
            doesn&rsquo;t.
          </li>
          <li>
            <strong>No &ldquo;not included&rdquo; section.</strong> Whatever you leave unsaid, the client will assume is included.
          </li>
          <li>
            <strong>No deadline on the offer.</strong> A validity date gives the client a reason to decide now.
          </li>
          <li>
            <strong>Sending it days later.</strong> The client is most interested right after your call. Send it the same day if you can.
          </li>
        </ul>

        <h2>Questions people ask</h2>
        {proposalFaqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    slug: "how-to-screen-record-on-mac",
    title: "How to screen record on Mac (with audio)",
    metaTitle: "How to screen record on Mac, with sound from apps and your mic",
    description:
      "How to screen record on a Mac with Shift + Command + 5 or QuickTime, how to record your voice and sound from apps, where recordings save, and fixes for common problems.",
    excerpt:
      "The two built-in ways to record your Mac's screen, how to get sound from apps as well as your voice, where the file goes, and what to do when something goes wrong.",
    published: "2026-11-25",
    updated: "2026-11-25",
    readingMinutes: 7,
    image: {
      src: "/blog/how-to-screen-record-on-mac.webp",
      alt: "A laptop with a floating screen recording toolbar and an orange record button, next to a speaker and a microphone with sound waves",
      width: 1600,
      height: 900,
    },
    faqs: macHowToFaqs,
    Body: () => (
      <>
        <p>
          Every Mac has a screen recorder built in, and it takes about three seconds to start. The part that trips people up is sound: by default
          you get your microphone, and recording sound from apps depends on your macOS version. Here&rsquo;s how to record your screen, get the
          audio you want, and find the file afterwards.
        </p>

        <figure>
          <Image
            src="/blog/how-to-screen-record-on-mac.webp"
            alt="A laptop with a floating screen recording toolbar and an orange record button, next to a speaker and a microphone with sound waves"
            width={1600}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        </figure>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> press <strong>Shift + Command + 5</strong>, choose what to record, pick your microphone under{" "}
            <strong>Options</strong>, and click <strong>Record</strong>. Stop with <strong>Command + Control + Esc</strong>. The video saves to your
            Desktop as a .mov file. For sound from apps, turn on <strong>Include System Audio</strong> in Options on macOS 27 or later.
          </p>
        </div>

        <p className="text-sm">Steps checked on 25 November 2026 against Apple&rsquo;s own support page.</p>

        <h2>Method 1: the Screenshot toolbar (Shift + Command + 5)</h2>
        <p>This is the quickest way and works on macOS Mojave and later.</p>
        <ol>
          <li>
            Press <Keys>Shift</Keys> + <Keys>Command</Keys> + <Keys>5</Keys>. A toolbar appears at the bottom of the screen.
          </li>
          <li>
            Choose <strong>Record Entire Screen</strong>, <strong>Record Selected Window</strong> (macOS Tahoe 26 or later) or{" "}
            <strong>Record Selected Portion</strong>, and drag the edges to adjust a portion.
          </li>
          <li>
            Click <strong>Options</strong> to pick your microphone, turn on system audio (macOS 27 or later), set a timer, show mouse clicks, or
            change where the file saves.
          </li>
          <li>
            Click <strong>Record</strong>. For a selected window, click the window you want.
          </li>
          <li>
            To stop, click the Stop button in the menu bar or press <Keys>Command</Keys> + <Keys>Control</Keys> + <Keys>Esc</Keys>.
          </li>
        </ol>
        <p>
          A thumbnail appears in the corner. Click it to trim the recording, or leave it and the video saves to your Desktop. Apple&rsquo;s{" "}
          <a href="https://support.apple.com/102618" target="_blank" rel="noopener noreferrer nofollow">
            support page
          </a>{" "}
          lists every option.
        </p>

        <h2>Method 2: QuickTime Player</h2>
        <ol>
          <li>Open QuickTime Player from Applications.</li>
          <li>
            Choose <strong>File &gt; New Screen Recording</strong>, or press <Keys>Control</Keys> + <Keys>Command</Keys> + <Keys>N</Keys>. On
            recent macOS versions this opens the same toolbar as Method 1.
          </li>
          <li>
            On older versions, click the arrow next to the Record button to pick a microphone and show mouse clicks, then click Record and either
            click to record the full screen or drag to select an area.
          </li>
          <li>Stop from the menu bar. The recording opens in QuickTime, where you can trim it before saving.</li>
        </ol>

        <h2>How to record sound from apps (system audio)</h2>
        <p>
          Recording your voice is easy: pick a microphone in Options. Recording the sound your Mac plays, like a video, a browser tab or a call,
          depends on your macOS version.
        </p>
        <ul>
          <li>
            <strong>macOS 27 or later:</strong> in the Shift + Command + 5 toolbar, open Options and turn on <strong>Include System Audio</strong>.
            You can record it together with your microphone.
          </li>
          <li>
            <strong>Older versions:</strong> the built-in tools record your microphone only. You have three options:
            <ul>
              <li>
                <strong>OBS Studio:</strong> free, and records sound from apps on recent macOS versions. It takes some setup.
              </li>
              <li>
                <strong>BlackHole:</strong> a free virtual audio driver that routes your Mac&rsquo;s sound into the recorder. It works with the
                built-in tools but needs setup in Audio MIDI Setup.
              </li>
              <li>
                <strong>A Chrome extension that records tab audio:</strong> if the sound is playing in a browser tab, a recorder like{" "}
                <Link href="/">Showthrough</Link> captures the tab&rsquo;s sound and your voice with no extra setup.
              </li>
            </ul>
          </li>
        </ul>

        <h2>Which method to use</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Method</th>
                <th scope="col">Cost</th>
                <th scope="col">Sound from apps</th>
                <th scope="col">You get</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Shift + Command + 5</th>
                <td>Free</td>
                <td>macOS 27 or later</td>
                <td>A .mov file</td>
              </tr>
              <tr>
                <th scope="row">QuickTime Player</th>
                <td>Free</td>
                <td>Microphone only</td>
                <td>A .mov file, easy to trim</td>
              </tr>
              <tr>
                <th scope="row">OBS Studio</th>
                <td>Free</td>
                <td>Yes</td>
                <td>A file, with full control</td>
              </tr>
              <tr>
                <th scope="row">Showthrough (Chrome)</th>
                <td>Pay once</td>
                <td>Tab audio</td>
                <td>A share link the moment you stop</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          For more options, including paid apps like CleanShot X and Screen Studio, see{" "}
          <Link href="/blog/best-screen-recorders-for-mac">the 8 best screen recorders for Mac</Link>.
        </p>

        <h2>If it isn&rsquo;t working</h2>
        <ul>
          <li>
            <strong>No sound:</strong> open Options and check a microphone is selected. For sound from apps, check your macOS version (above).
          </li>
          <li>
            <strong>An app asks for permission, or records a blank screen:</strong> open System Settings &gt; Privacy &amp; Security &gt; Screen
            &amp; System Audio Recording, and turn the app on.
          </li>
          <li>
            <strong>A window records as black:</strong> some apps, like the Apple TV app, don&rsquo;t allow their windows to be recorded.
          </li>
          <li>
            <strong>You can&rsquo;t find the file:</strong> look on your Desktop for &ldquo;Screen Recording [date] at [time].mov&rdquo;, or check
            Options &gt; Save to.
          </li>
          <li>
            <strong>The file is too big to send:</strong> record a smaller area, or send a link instead of a file (below).
          </li>
        </ul>

        <h2>Need to send it to someone? Send a link, not a file</h2>
        <p>
          A few minutes of Mac screen recording can be hundreds of megabytes, too big for most email and slow to upload to chat. If you&rsquo;re
          recording to show a client or teammate something, a recorder that gives you a link saves the upload step.
        </p>
        <p>
          <Link href="/">Showthrough</Link> is the one we make. It&rsquo;s a Chrome extension: record your screen, a window or a tab with your camera
          and voice, and a share link is copied the moment you stop. There&rsquo;s no limit on videos or length, viewers watch in any browser, and
          you pay once instead of every month (see <Link href="/pricing">pricing</Link>). It has no editor yet, so for polished demos the
          built-in tools plus an editor still suit better.
        </p>

        <h2>Questions people ask</h2>
        {macHowToFaqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    slug: "loom-vs-vidyard",
    title: "Loom vs Vidyard: which should you pick in 2026?",
    metaTitle: "Loom vs Vidyard (2026): pricing, free plans and which to pick",
    description:
      "Loom vs Vidyard compared on price, free plans, recording limits, analytics and integrations, with a clear answer on which suits your team, and an option without a monthly fee.",
    excerpt:
      "Loom is built for team updates, Vidyard for sales. Here's how they compare on price, free plans and features, and how to choose.",
    published: "2026-11-25",
    updated: "2026-11-25",
    readingMinutes: 6,
    image: {
      src: "/blog/loom-vs-vidyard.webp",
      alt: "Two browser windows with video players side by side and a balance scale between them, with a third smaller video link card below",
      width: 1600,
      height: 900,
    },
    faqs: loomVsVidyardFaqs,
    Body: () => (
      <>
        <p>
          Loom and Vidyard both let you record your screen and camera and send a link. They look alike, but they&rsquo;re built for different
          jobs, and their prices are far apart. Here&rsquo;s how they compare, and which one fits what you&rsquo;re doing.
        </p>

        <figure>
          <Image
            src="/blog/loom-vs-vidyard.webp"
            alt="Two browser windows with video players side by side and a balance scale between them, with a third smaller video link card below"
            width={1600}
            height={900}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
          />
        </figure>

        <div className="callout">
          <p>
            <strong>Quick answer:</strong> pick <strong>Loom</strong> for quick updates, walkthroughs and feedback inside a team. It&rsquo;s{" "}
            $18 per user per month. Pick <strong>Vidyard</strong> if you&rsquo;re in sales and want to track who watched your videos and connect
            them to your CRM. Its paid plans start at $59 per user per month, billed yearly.
          </p>
        </div>

        <p className="text-sm">
          Prices checked on 25 November 2026 on{" "}
          <a href="https://www.vidyard.com/pricing/" target="_blank" rel="noopener noreferrer nofollow">
            Vidyard&rsquo;s pricing page
          </a>{" "}
          and Loom&rsquo;s. We make Showthrough, a third option mentioned near the end.
        </p>

        <h2>Loom vs Vidyard at a glance</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Loom</th>
                <th scope="col">Vidyard</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Built for</th>
                <td>Team updates and walkthroughs</td>
                <td>Sales outreach</td>
              </tr>
              <tr>
                <th scope="row">Free plan</th>
                <td>25 videos, up to 5 minutes each</td>
                <td>5 videos a month, up to 30 minutes each</td>
              </tr>
              <tr>
                <th scope="row">Paid from</th>
                <td>$18 per user per month (about $15 yearly)</td>
                <td>$59 per user per month yearly, or $89 monthly</td>
              </tr>
              <tr>
                <th scope="row">Recording</th>
                <td>Chrome extension, desktop and mobile apps</td>
                <td>Chrome extension and desktop app</td>
              </tr>
              <tr>
                <th scope="row">Analytics</th>
                <td>Views and viewers</td>
                <td>Full video and team analytics on paid plans</td>
              </tr>
              <tr>
                <th scope="row">CRM integrations</th>
                <td>Not the focus</td>
                <td>On the Teams plan and up</td>
              </tr>
              <tr>
                <th scope="row">AI features</th>
                <td>Titles, summaries, chapters on Business + AI ($24)</td>
                <td>AI scripts and avatars; paid Video Agent add-on</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Pricing</h2>
        <p>
          <strong>Loom</strong> has a free Starter plan, Business at $18 per user per month (about $15 billed yearly) and Business + AI at $24.
          See <Link href="/blog/loom-pricing">Loom pricing explained</Link> for the details.
        </p>
        <p>
          <strong>Vidyard</strong> has a free plan, Starter at{" "}
          <a href="https://www.vidyard.com/pricing.md" target="_blank" rel="noopener noreferrer nofollow">
            $59 per seat per month billed yearly, or $89 monthly
          </a>
          , and Teams and Enterprise plans priced by quote. A 5-person team pays about $900 a year on Loom Business and about $3,540 on Vidyard
          Starter.
        </p>

        <h2>Free plans</h2>
        <p>
          The two free plans limit different things. Loom&rsquo;s keeps up to 25 videos in total, each up to 5 minutes, at up to 720p (see{" "}
          <Link href="/blog/is-loom-free">Is Loom free?</Link>). Vidyard&rsquo;s resets every month: 5 videos, each up to 30 minutes.
        </p>
        <p>
          If you record a few longer videos, Vidyard&rsquo;s free plan goes further. If you record lots of short ones, Loom&rsquo;s does, until you
          hit 25.
        </p>

        <h2>Where Loom wins</h2>
        <ul>
          <li>
            <strong>Price.</strong> About a third of Vidyard&rsquo;s cost per person.
          </li>
          <li>
            <strong>Team use.</strong> Comments, reactions, shared libraries and integrations with tools like Slack make it easy for a team to
            reply to each other&rsquo;s videos.
          </li>
          <li>
            <strong>More ways to record.</strong> A Chrome extension, desktop apps and a mobile app. See{" "}
            <Link href="/blog/loom-chrome-extension">the Loom Chrome extension</Link>.
          </li>
        </ul>

        <h2>Where Vidyard wins</h2>
        <ul>
          <li>
            <strong>Sales analytics.</strong> Paid plans show who watched, how much, and how your team&rsquo;s videos perform.
          </li>
          <li>
            <strong>Branded pages and calls to action.</strong> Send prospects to a page with your branding and a button to book a call.
          </li>
          <li>
            <strong>CRM integrations.</strong> On Teams and Enterprise, video activity can flow into your CRM.
          </li>
          <li>
            <strong>Longer free videos.</strong> 30 minutes each on the free plan, against Loom&rsquo;s 5.
          </li>
        </ul>

        <h2>Which should you pick?</h2>
        <ul>
          <li>
            <strong>A team sending updates, bug reports and walkthroughs:</strong> Loom.
          </li>
          <li>
            <strong>A sales team sending video to prospects:</strong> Vidyard, if you&rsquo;ll use the analytics and CRM features enough to justify
            the price.
          </li>
          <li>
            <strong>Just a few videos a month:</strong> either free plan may be enough.
          </li>
        </ul>

        <h2>Or neither: video updates without a monthly bill</h2>
        <p>
          If you&rsquo;re comparing these two because of the price, and you mostly need to record a quick video and send a link, there&rsquo;s a
          third option. <Link href="/">Showthrough</Link> is a Chrome extension that copies a share link the moment you stop recording. There&rsquo;s
          no limit on videos or length, and you pay once instead of every month (see <Link href="/pricing">pricing</Link>).
        </p>
        <p>
          To be clear about the trade-off: it has no sales analytics, CRM integrations or AI features. If you need those, Vidyard or Loom is the
          better pick. We make Showthrough. Compare it directly with{" "}
          <Link href="/alternatives/loom">Loom</Link> or <Link href="/alternatives/vidyard">Vidyard</Link>, or see{" "}
          <Link href="/alternatives">the best Loom alternatives</Link>.
        </p>

        <h2>Questions people ask</h2>
        {loomVsVidyardFaqs.map((f) => (
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
