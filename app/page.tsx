import { Footer, Header } from "@/components/header";
import { RecorderPreview } from "@/components/recorder-preview";
import { Savings } from "@/components/savings";
import { site } from "@/lib/site";

const steps = [
  {
    title: "Connect your Cloudflare",
    body: "Create a free Cloudflare account if you don't have one, then click Allow. We set up your private video storage in about 30 seconds.",
  },
  {
    title: "Add the Chrome extension",
    body: "Record your screen, your voice and your camera bubble. Works on Mac, Windows and Chromebooks.",
  },
  {
    title: "Stop and paste",
    body: "The video uploads while you talk, so the link is copied the moment you stop. It plays instantly for whoever opens it.",
  },
];

const faqs = [
  {
    q: "Do I need a Cloudflare account?",
    a: "Yes. It's free, and it's where your videos are stored. If you don't have one, you can create it during setup in about a minute.",
  },
  {
    q: "Is the storage really free?",
    a: "Cloudflare's free tier includes 10 GB of storage, which is roughly 10 hours of recordings, and watching videos never costs anything. After that, Cloudflare charges about $0.015 per GB each month, so 100 GB is around $1.50.",
  },
  {
    q: "Can you see my videos or my other Cloudflare data?",
    a: "No. Your videos live in your Cloudflare account and play from there. We only ask for access to storage and to the small app that runs your video links, never your websites, DNS or billing. We recommend a separate Cloudflare account just for videos.",
  },
  {
    q: "What do you actually store?",
    a: "Your email, your license, your team list and the total minutes you've recorded. That's it.",
  },
  {
    q: "What happens to my videos if you shut down?",
    a: "They stay where they are: in your Cloudflare account, with links that keep working.",
  },
  {
    q: "Can my whole team use it?",
    a: "Yes. Invite teammates by email and everyone records into your company's storage. Remove someone and their access stops right away.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-16 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
          <div>
            <h1 className="max-w-[14ch] text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl">
              Record your screen. Skip the per-seat bill.
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-slate">
              A screen recorder like Loom that keeps your videos in your own free Cloudflare account. Pay{" "}
              {`$${site.price.amount}`} once for your whole team.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(`${site.name} beta`)}`}
                className="rounded-full bg-ink px-6 py-3.5 font-medium text-paper hover:bg-ink/90"
              >
                Join the beta
              </a>
              <a href="#pricing" className="px-2 py-3.5 font-medium underline decoration-line underline-offset-4 hover:decoration-ink">
                See how much you’d save
              </a>
            </div>
          </div>
          <RecorderPreview />
        </section>

        <section id="pricing" className="mx-auto max-w-6xl scroll-mt-8 px-5 pb-28 sm:px-8">
          <h2 className="mb-8 max-w-[22ch] text-3xl font-semibold tracking-tight sm:text-4xl">
            Loom charges for every person, every month.
          </h2>
          <Savings />
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-28 sm:px-8">
          <h2 className="max-w-[22ch] text-3xl font-semibold tracking-tight sm:text-4xl">
            Two minutes from sign-up to your first link.
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="border-t-2 border-ink pt-5">
                <span className="tabular text-sm font-medium text-slate">Step {i + 1}</span>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 max-w-[38ch] leading-relaxed text-slate">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-28 sm:px-8">
          <div className="grid gap-12 rounded-3xl border border-line bg-paper p-8 sm:p-12 lg:grid-cols-[1fr_1.4fr]">
            <h2 className="max-w-[16ch] text-3xl font-semibold tracking-tight sm:text-4xl">
              Your videos never touch our servers.
            </h2>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold">In your Cloudflare account</h3>
                <ul className="mt-3 space-y-2 text-slate">
                  <li>Every video</li>
                  <li>The player your viewers see</li>
                  <li>Views and comments</li>
                  <li>Your own domain, if you add one</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">With us</h3>
                <ul className="mt-3 space-y-2 text-slate">
                  <li>Your email and license</li>
                  <li>Your team list</li>
                  <li>Total minutes recorded</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl scroll-mt-8 px-5 pb-28 sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Questions</h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="text-2xl leading-none text-slate transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[62ch] leading-relaxed text-slate">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
