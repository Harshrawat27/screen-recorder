import { Footer, Header } from "@/components/header";
import { HeroVisual } from "@/components/hero-visual";
import { Savings } from "@/components/savings";
import { CheckIcon, buttonClass } from "@/components/ui";
import { betaHref, site } from "@/lib/site";

const proof = ["Link ready the moment you stop", "Works in Chrome on Mac, Windows and Chromebooks", "Videos stay in your own cloud"];

const steps = [
  {
    title: "Connect your Cloudflare",
    body: "Sign in to a free Cloudflare account and click Allow. We set up your private video storage in about 30 seconds.",
  },
  {
    title: "Record from Chrome",
    body: "Your screen, your voice and a camera bubble. The video uploads while you talk.",
  },
  {
    title: "Stop and paste the link",
    body: "It's copied the moment you stop and plays instantly for whoever opens it. No account needed to watch.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-16 px-5 pb-28 pt-14 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:pt-24">
          <div>
            <h1 className="max-w-[13ch] text-[44px] font-bold leading-[1.02] tracking-[-0.04em] sm:text-[64px]">
              Show it once. Skip the meeting.
            </h1>
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted">
              {site.name} records your screen, camera and voice, and the link is ready the moment you stop. Videos live in your own free
              Cloudflare storage, so you pay ${site.price.amount} once, not per person every month.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={betaHref} className={buttonClass("primary", "lg")}>
                Join the beta
              </a>
              <a href="#pricing" className={buttonClass("secondary", "lg")}>
                See what you&rsquo;d save
              </a>
            </div>
            <ul className="mt-10 space-y-2.5 text-[15px] text-muted">
              {proof.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="grid size-5 place-items-center rounded-full bg-brand-soft text-brand-ink">
                    <CheckIcon className="size-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <HeroVisual />
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 border-y border-line bg-surface/50">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="max-w-[16ch] text-4xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                Loom bills every person, every month.
              </h2>
              <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-muted">
                {site.name} is ${site.price.amount}, once, for your whole team. Your videos sit in your own Cloudflare account, where
                storage is free up to 10 GB and pennies after that.
              </p>
            </div>
            <Savings />
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 sm:px-8">
          <h2 className="max-w-[20ch] text-4xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            From sign-up to your first link in two minutes.
          </h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <li key={step.title}>
                <span className="tabular grid size-10 place-items-center rounded-full bg-brand-soft text-base font-bold text-brand-ink">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight">{step.title}</h3>
                <p className="mt-2.5 max-w-[36ch] leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-panel bg-stage p-8 text-white dark:border dark:border-line sm:flex-row sm:items-center sm:p-10">
            <div>
              <p className="text-2xl font-bold tracking-tight">Your videos never touch our servers.</p>
              <p className="mt-2 max-w-[56ch] text-white/65">
                They&rsquo;re stored in your Cloudflare account and stream from there. We keep your email, your license and the number of
                minutes you&rsquo;ve recorded. That&rsquo;s it.
              </p>
            </div>
            <a href={betaHref} className={buttonClass("primary", "lg", "shrink-0")}>
              Join the beta
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
