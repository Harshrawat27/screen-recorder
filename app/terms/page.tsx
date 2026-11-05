import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms" };

export default function Terms() {
  return (
    <LegalPage title="Terms" updated="1 November 2026">
      <p>
        By using {site.name} you agree to these terms. They are short on purpose.
      </p>

      <h2>Your license</h2>
      <p>
        {site.name} is a one-time purchase, not a subscription. Your payment gives your team a license to use{" "}
        {site.name} for as long as the product exists.
      </p>
      <p>
        Purchases made at the early prices (the first 100 customers) include every future update. Purchases made after
        that include the version available at the time of purchase, without future updates; that version keeps working.
      </p>

      <h2>Payments</h2>
      <p>
        Payments are processed by Dodo Payments, which acts as the merchant of record and handles billing, taxes and
        receipts. Prices are shown in US dollars on our pricing page.
      </p>

      <h2>Your Cloudflare account</h2>
      <p>
        Recordings are stored in your Cloudflare account. You are responsible for that account, including any charges
        Cloudflare bills you beyond their free tier.
      </p>

      <h2>Your content</h2>
      <p>
        You own your recordings. Don’t use {site.name} to record or share anything illegal or anything you don’t have
        the right to share.
      </p>

      <h2>No warranty</h2>
      <p>
        {site.name} is provided as is. We work hard to keep it reliable, but we can’t guarantee it will always be
        available or free of bugs.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>

    </LegalPage>
  );
}
