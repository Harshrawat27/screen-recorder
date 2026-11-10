import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <LegalPage title="Terms" updated="10 November 2026">
      <p>
        These terms cover {site.name}: the website, the dashboard, the share pages and the Chrome extension. By using{" "}
        {site.name} you agree to them. They are short on purpose.
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

      <h2>Payments and refunds</h2>
      <p>
        Payments are processed by Dodo Payments, which acts as the merchant of record and handles billing, taxes and
        receipts. Prices are shown in US dollars on our pricing page.
      </p>
      <p>
        You can ask for a refund within 7 days of your purchase. After 7 days, purchases can&rsquo;t be refunded. To
        ask, email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> from the address you
        bought with. Refunds are paid back through Dodo Payments to your original payment method. A refunded purchase
        ends your license.
      </p>

      <h2>Your Cloudflare account</h2>
      <p>
        Recordings are stored in your own Cloudflare account. You are responsible for that account, including any
        charges Cloudflare bills you beyond their free tier, and for keeping it active. If you delete the {site.name}{" "}
        video app or storage from Cloudflare, your recordings and share links stop working.
      </p>

      <h2>Your content</h2>
      <p>
        You own your recordings. Don&rsquo;t use {site.name} to record or share anything illegal, anything you
        don&rsquo;t have the right to share, or anyone who hasn&rsquo;t agreed to be recorded where the law requires
        their consent. Anyone with a share link can watch that video, so share links carefully.
      </p>

      <h2>Misuse</h2>
      <p>
        We may suspend or close an account that breaks these terms or uses {site.name} to harm others.
      </p>

      <h2>No warranty</h2>
      <p>
        {site.name} is provided as is. We work hard to keep it reliable, but we can&rsquo;t guarantee it will always be
        available or free of bugs. As far as the law allows, we aren&rsquo;t liable for lost recordings or other
        indirect losses, and our total liability is limited to the amount you paid us.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms as {site.name} changes. When we do, we will update the date at the top of this page.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
