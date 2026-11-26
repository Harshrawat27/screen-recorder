import type { Metadata } from "next";
import { InterestForm } from "@/components/interest-form";
import { SiteFooter } from "@/components/home-sections";
import { SiteNav } from "@/components/site-nav";
import { CheckIcon } from "@/components/ui";

// A sign-up page for the "$20 a month for every tool" plan, shared on X. Responses go to their
// own table in Neon (lib/interest.ts).

export const metadata: Metadata = {
  title: "Software as a service, for $20 a month",
  description:
    "One subscription for every tool I build for freelancers, agencies and small remote teams, running on your own Cloudflare. Tell me what you want to replace.",
  alternates: { canonical: "/service-as-a-software" },
};

const points = [
  "Every tool I build for freelancers, agencies and small remote teams, from Loom to Jira to Calendly",
  "One interface; the heavy lifting runs in your own Cloudflare, so costs stay tiny",
  "Built to cut what you pay for software today by up to 90%",
];

export default function ServiceAsASoftwarePage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16">
        <section className="lg:pt-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm font-semibold">
            <span className="size-2 rounded-full bg-[#F35733]" />
            Early list
          </p>
          <h1 className="mt-5 text-[44px] leading-[1.02] sm:text-[60px]" style={{ letterSpacing: "-0.03em" }}>
            Every tool your team pays for. <span className="text-muted">One $20 subscription.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            I&rsquo;m Harsh. I freelanced for 4+ years and kept a 5-star rating across 150+ projects, paying for a stack of expensive
            tools the whole time. Now I&rsquo;m building those tools for freelancers, agencies and small remote teams, starting with a Loom
            alternative that&rsquo;s already live with paying customers.
          </p>
          <ul className="mt-8 space-y-3.5">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[16px] leading-relaxed">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-text text-canvas">
                  <CheckIcon className="size-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-xl leading-relaxed text-muted">
            Tell me what you use today. What people list here decides what I build next.
          </p>
        </section>

        <section className="mt-12 lg:mt-0" aria-label="Sign up">
          <InterestForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
