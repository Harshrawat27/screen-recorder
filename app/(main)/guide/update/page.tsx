import type { Metadata } from "next";
import Link from "next/link";
import { Do, Lead, Note, Shot } from "@/components/guide";
import { SiteFooter } from "@/components/home-sections";
import { SiteNav } from "@/components/site-nav";
import { buttonClass } from "@/components/ui";

// One page, linked from "How it works" in the dashboard's "New version available" box. Explains
// why Cloudflare asks again (we don't keep access) and the four short steps of an update.

export const metadata: Metadata = {
  title: "Updating to a new version",
  description: "How to update Showthrough to a new version, and why Cloudflare asks you to allow access again. About 10 seconds, and your videos aren't touched.",
  alternates: { canonical: "/guide/update" },
};

const UPDATE_MARKS: ({ circle: [number, number, number, number] } | { cursor: [number, number] })[] = [{ circle: [3.3, 76.1, 33.3, 5.8] }, { cursor: [27.7, 80.0] }];

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="flex items-center gap-3 text-[28px] leading-tight" style={{ letterSpacing: "-0.015em" }}>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-text font-sans text-[15px] font-semibold text-canvas">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function UpdateGuidePage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        <p className="text-sm text-muted">
          <Link href="/guide" className="hover:text-text">
            Guides
          </Link>
          <span className="mx-2 text-faint">/</span>
          Updates
        </p>
        <h1 className="mt-3 text-[38px] leading-[1.05] sm:text-[48px]" style={{ letterSpacing: "-0.025em" }}>
          Updating to a new version
        </h1>
        <Lead>
          New features run inside your own Cloudflare, so each new version has to be installed there. It takes about 10 seconds, and your videos,
          links, comments and views stay exactly as they are.
        </Lead>

        <Note title="Why does Cloudflare ask again?">
          <p>
            Because we don&rsquo;t keep access to your Cloudflare. When you press Authorize, Cloudflare gives us a one-time pass. We use it to
            install the update, then throw it away.
          </p>
          <p>So nobody at Showthrough can change anything in your Cloudflare without you. The catch: every new version needs your OK once more.</p>
        </Note>

        <Step n={1} title="Press Update">
          <Do>
            <li>
              Open your <Link href="/dashboard" className="underline underline-offset-2">dashboard</Link>. When there&rsquo;s a new version, a{" "}
              <b>New version available</b> box at the bottom of the sidebar lists what&rsquo;s new.
            </li>
            <li>
              Press <b>Update to version …</b>
            </li>
          </Do>
          <Shot
            src="update-box"
            width={800}
            height={950}
            alt="The dashboard sidebar with the New version available box and its Update button"
            marks={UPDATE_MARKS}
          />
        </Step>

        <Step n={2} title="Press Authorize on Cloudflare">
          <p className="mt-4 text-[17px] leading-relaxed">
            Cloudflare opens and asks whether Showthrough may access your account, the same screen as when you first connected. Press{" "}
            <b>Authorize</b>. If Cloudflare asks you to sign in first, sign in with the account your videos are in.
          </p>
          <Shot
            src="authorize"
            width={1600}
            height={1008}
            alt="Cloudflare asking whether Showthrough may access your account, with the Authorize button"
            marks={[{ circle: [52.7, 77.0, 41.4, 5.7] }, { cursor: [77.2, 81.3] }]}
          />
        </Step>

        <Step n={3} title="Wait a few seconds">
          <p className="mt-4 text-[17px] leading-relaxed">
            We install the new version in your Cloudflare. Keep the page open while the steps tick off.
          </p>
          <Shot src="setting-up" width={1123} height={821} alt="Showthrough updating your Cloudflare, with the steps ticking off" />
        </Step>

        <Step n={4} title="Done">
          <p className="mt-4 text-[17px] leading-relaxed">
            You&rsquo;re taken back to your dashboard, the box is gone, and the new features are ready to use.
          </p>
        </Step>

        <Note title="Good to know">
          <p>
            <b className="text-text">On a team?</b> Only the admin (whoever connected Cloudflare) updates. Members see &ldquo;Ask your admin to
            update&rdquo; and don&rsquo;t need to do anything.
          </p>
          <p>
            <b className="text-text">No time right now?</b> Your current version keeps working. Update whenever suits you.
          </p>
          <p>
            <b className="text-text">Something went wrong?</b> Nothing is lost: press Update again, or{" "}
            <Link href="/support" className="underline underline-offset-2">
              contact support
            </Link>
            .
          </p>
        </Note>

        <div className="mt-12">
          <Link href="/dashboard" className={buttonClass("primary", "lg", "rounded-full px-7")}>
            Go to your dashboard
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
