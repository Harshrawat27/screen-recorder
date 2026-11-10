import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <LegalPage title="Privacy" updated="9 November 2026">
      <p>
        {site.name} is a screen recorder (a website and a Chrome extension) built so that your recordings live in your
        own Cloudflare account, not ours. This page explains what we keep, what passes through our services, and what
        the extension does on your computer.
      </p>

      <h2>What we store about you</h2>
      <ul>
        <li>
          <strong>Your account:</strong> your name, email address and profile photo from Google, so you can sign in. Our
          sign-in system also keeps the sign-in details Google gives it, used only to sign you in.
        </li>
        <li>
          <strong>A sign-in cookie</strong> that keeps you signed in on our website.
        </li>
        <li>
          <strong>Your purchase:</strong> your plan, the amount and currency paid, the date, and the payment ID from our
          payment provider. We never see or store your card details.
        </li>
        <li>
          <strong>Your Cloudflare connection:</strong> your Cloudflare account ID and name, the name of the storage
          bucket and the address of the small video app (a Cloudflare Worker) set up in your account, and the upload key
          for that app. The upload key lets the extension upload recordings and lets your dashboard list them. It works
          only with that video app and its storage, not with the rest of your Cloudflare account.
        </li>
        <li>When you connected the Chrome extension to your account.</li>
      </ul>

      <h2>Cloudflare access during setup</h2>
      <p>
        When you click &ldquo;Connect Cloudflare&rdquo; (or &ldquo;Update&rdquo; when a new version is available),
        Cloudflare gives us a temporary access token. Our server uses it once, for a few seconds, to create or update
        your storage bucket, database and video app, and then discards it. We don&rsquo;t store
        it and can&rsquo;t use it afterwards. We never touch anything else in your Cloudflare account, such as websites,
        DNS or billing.
      </p>

      <h2>Your videos</h2>
      <ul>
        <li>Recordings, thumbnails and video details are stored in your Cloudflare account, not on our servers.</li>
        <li>
          When someone opens a share link, the video is streamed from your Cloudflare storage through our media address
          (media.showthrough.com), which may keep a short-lived cached copy to make playback fast.
        </li>
        <li>
          When you open your dashboard, our server asks your video app for the list of your videos (titles, dates and
          lengths) to show it to you. We don&rsquo;t keep that list.
        </li>
        <li>We don&rsquo;t copy, store, watch or analyse your videos.</li>
        <li>
          Comments, reactions and view counts are stored in the video owner&rsquo;s Cloudflare account (in a database
          created during setup), not on our servers.
        </li>
        <li>Anyone with a share link can watch that video. Only share links with people you want to see it.</li>
      </ul>

      <h2>Comments, reactions and views</h2>
      <ul>
        <li>
          You need to sign in to comment or react. Your comment or reaction is saved in the video owner&rsquo;s Cloudflare
          together with your name, profile photo and a Showthrough account ID, so the owner can see who it&rsquo;s from.
          Anyone who can open the video can see your name, photo and comments.
        </li>
        <li>
          Our server passes your comment to the owner&rsquo;s Cloudflare and checks that you&rsquo;re signed in; it
          doesn&rsquo;t keep a copy.
        </li>
        <li>You can delete your own comments, and the video owner can delete any comment on their videos.</li>
        <li>
          If you have a {site.name} workspace, the last 25 videos you watched and the videos you save to Watch later
          are kept in your own Cloudflare database, so you can find them again. We don&rsquo;t keep them.
        </li>
        <li>
          To count views, we set a cookie for 30 minutes after someone plays a video, so the same browser isn&rsquo;t
          counted twice. View counts are just numbers; we don&rsquo;t record who watched.
        </li>
      </ul>

      <h2>The Chrome extension</h2>
      <ul>
        <li>
          It uses your screen, camera and microphone only while you are setting up or making a recording, and only
          after you allow it in Chrome.
        </li>
        <li>
          The recording controls appear only on the tab where you click the {site.name} icon. The extension doesn&rsquo;t
          read or collect the content of the pages you visit.
        </li>
        <li>
          While you record, parts of the recording are kept in your browser&rsquo;s storage until they have been uploaded
          to your Cloudflare. If an upload is interrupted, they stay there so the upload can finish later.
        </li>
        <li>
          It saves your connection details (the address of your video app and its upload key) and your camera,
          microphone and audio choices in your browser.
        </li>
        <li>Recordings are uploaded only to the video app in your own Cloudflare account.</li>
        <li>The extension has no ads, trackers or analytics, and we don&rsquo;t sell or share your data.</li>
      </ul>

      <h2>Our website</h2>
      <ul>
        <li>
          We use Vercel Analytics to count page visits. It is anonymous and doesn&rsquo;t use cookies to follow you
          across websites.
        </li>
        <li>
          People watching a share link don&rsquo;t need an account. Like any website, our hosting providers (Vercel and
          Cloudflare) process basic request details, such as IP addresses, to deliver the page and the video.
        </li>
      </ul>

      <h2>Services we use</h2>
      <ul>
        <li>Google, to sign you in.</li>
        <li>Dodo Payments, to process payments. It receives your name and email for checkout and receipts.</li>
        <li>Vercel, to host our website and database.</li>
        <li>Cloudflare, for your storage and video app (under your own account) and for our media address.</li>
      </ul>

      <h2>Removing access and deleting your data</h2>
      <p>
        You can delete the {site.name} video app and storage bucket from your Cloudflare dashboard at any time. The upload
        key we hold then stops working, and so do your share links.
      </p>
      <p>
        To delete your {site.name} account and everything listed under &ldquo;What we store about you&rdquo;, email{" "}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. Your videos are in your Cloudflare account and
        are yours to keep or delete there.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
