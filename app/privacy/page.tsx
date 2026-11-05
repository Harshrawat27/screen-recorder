import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy" updated="1 November 2026">
      <p>
        {site.name} is built so that your recordings stay in your own Cloudflare account. This page explains the little
        we do keep.
      </p>

      <h2>What we store</h2>
      <ul>
        <li>Your email address and name, so you can sign in.</li>
        <li>Your license and payment status. Payments are handled by our payment provider; we never see card numbers.</li>
        <li>Your team list, so you can invite and remove teammates.</li>
        <li>The address of the video app in your Cloudflare account, so the extension knows where to upload.</li>
        <li>The total number of minutes recorded, as a single number per account. You can turn this off.</li>
      </ul>

      <h2>What we never store or see</h2>
      <ul>
        <li>Your videos, titles, transcripts, comments or view counts. These live in your Cloudflare account.</li>
        <li>
          Your Cloudflare access. When you connect Cloudflare, the access is given to your browser to set things up and
          is never sent to our servers.
        </li>
        <li>Anything else in your Cloudflare account, such as websites, DNS or billing.</li>
      </ul>

      <h2>Cloudflare</h2>
      <p>
        Your videos are stored and served by Cloudflare under your own account and your own agreement with them. You can
        remove our access at any time from your Cloudflare dashboard. Your videos and links keep working.
      </p>

      <h2>Deleting your data</h2>
      <p>
        Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> and we will delete your account and
        everything listed above. Your videos are yours to delete in Cloudflare.
      </p>

    </LegalPage>
  );
}
