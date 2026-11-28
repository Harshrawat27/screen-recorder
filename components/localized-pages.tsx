import Link from "next/link";
import { Faq, Features, FinalCta, Pricing, SiteFooter } from "@/components/home-sections";
import { Do, Lead, Note, Shot } from "@/components/guide";
import { RichText } from "@/components/rich-text";
import { SiteNav } from "@/components/site-nav";
import { SkyHero } from "@/components/sky-hero";
import { type OtherLocale, fill } from "@/lib/i18n";
import { homeCopy } from "@/lib/i18n/home";
import type { GuideNote, GuideSlug } from "@/lib/i18n/guide-types";
import { guideCopies } from "@/lib/i18n/guide";
import type { LegalDoc } from "@/lib/i18n/legal-types";
import type { Mark } from "@/components/guide";

// The home, privacy, terms and setup guide pages in German, French and Japanese.

export function LocalizedHome({ locale, price, sold }: { locale: OtherLocale; price: number; sold: number }) {
  return (
    <div lang={locale}>
      <main>
        <SkyHero price={price} locale={locale} />
        <Features price={price} locale={locale} />
        <Pricing sold={sold} price={price} locale={locale} />
        <Faq locale={locale} />
        <FinalCta price={price} locale={locale} />
      </main>
      <SiteFooter locale={locale} path="/" />
    </div>
  );
}

export function LocalizedLegal({ locale, doc, path }: { locale: OtherLocale; doc: LegalDoc; path: string }) {
  const t = homeCopy(locale).legal;
  return (
    <div lang={locale}>
      <SiteNav locale={locale} />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-10 sm:px-8">
        <h1 className="text-4xl font-semibold tracking-tight">{doc.title}</h1>
        <p className="mt-3 text-sm text-muted">
          {t.lastUpdated}: {doc.updated}
        </p>
        <p className="mt-4 rounded-card border border-line bg-surface px-4 py-3 text-sm text-muted">
          {t.translationNote}{" "}
          <Link href={path} hrefLang="en" className="underline underline-offset-2 hover:text-text">
            English
          </Link>
        </p>
        <div className="prose-legal mt-8">
          {doc.intro.map((p) => (
            <p key={p}>
              <RichText text={p} />
            </p>
          ))}
          {doc.sections.map((s) => (
            <section key={s.h}>
              {s.h && <h2 id={s.id}>{s.h}</h2>}
              {s.p?.map((p) => (
                <p key={p}>
                  <RichText text={p} />
                </p>
              ))}
              {s.ul && (
                <ul>
                  {s.ul.map((li) => (
                    <li key={li}>
                      <RichText text={li} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>
      <SiteFooter locale={locale} path={path} />
    </div>
  );
}

// The screenshots for each step, shared with the English guide (components/guide-pages.tsx).
type ShotSpec = { src: string; width: number; height: number; marks?: Mark[] };
const shots: Record<GuideSlug, { first?: ShotSpec[]; second?: ShotSpec[] }> = {
  "create-cloudflare-account": {
    first: [{ src: "cloudflare-sign-up", width: 1383, height: 1123, marks: [{ circle: [17.4, 22.1, 65.0, 7.3] }, { cursor: [59.4, 27.3] }] }],
  },
  "turn-on-r2": {
    first: [{ src: "r2-get-started", width: 1600, height: 800, marks: [{ circle: [2.7, 52.8, 13.6, 4.2] }, { circle: [61.1, 37.1, 36.9, 5.2] }, { cursor: [75.0, 40.9] }] }],
    second: [{ src: "r2-add-card", width: 1600, height: 982, marks: [{ circle: [4.3, 55.5, 39.8, 15.2] }, { circle: [54.7, 77.8, 40.3, 4.7] }] }],
  },
  "connect-cloudflare": {
    first: [
      { src: "connect-screen", width: 1600, height: 992, marks: [{ circle: [79.0, 50.5, 16.5, 6.4] }, { cursor: [90.4, 55.7] }] },
      { src: "authorize", width: 1600, height: 1008, marks: [{ circle: [52.7, 77.0, 41.4, 5.7] }, { cursor: [77.2, 81.3] }] },
    ],
  },
  "wait-for-setup": { first: [{ src: "setting-up", width: 1123, height: 821 }] },
  "add-extension": {
    first: [{ src: "chrome-web-store", width: 1600, height: 480, marks: [{ circle: [79.6, 38.0, 11.8, 10.4] }, { cursor: [87.1, 46.6] }] }],
  },
  "connect-extension": {
    first: [
      { src: "cloudflare-done", width: 1600, height: 760, marks: [{ circle: [74.7, 53.1, 19.8, 10.2] }, { cursor: [88.3, 60.9] }] },
      { src: "extension-connected", width: 1123, height: 821 },
    ],
  },
  record: {
    first: [
      { src: "new-video", width: 1600, height: 682, marks: [{ circle: [87.5, 14.0, 9.4, 7.1] }, { cursor: [93.5, 19.6] }] },
      { src: "toolbar-icon", width: 1512, height: 648, marks: [{ circle: [66.2, 14.9, 3.4, 8.5] }, { cursor: [68.8, 21.9] }] },
      { src: "record-panel", width: 1600, height: 872, marks: [{ circle: [78.6, 29.4, 19.1, 5.8] }, { cursor: [90.0, 33.8] }] },
    ],
  },
  troubleshooting: {},
};

const order: GuideSlug[] = [
  "create-cloudflare-account",
  "turn-on-r2",
  "connect-cloudflare",
  "wait-for-setup",
  "add-extension",
  "connect-extension",
  "record",
  "troubleshooting",
];

function Notes({ notes }: { notes?: GuideNote[] }) {
  return notes?.map((n) => (
    <Note key={n.title} title={n.title}>
      {n.lines.map((line) => (
        <p key={line}>
          <RichText text={line} />
        </p>
      ))}
    </Note>
  ));
}

function Actions({ items, start }: { items?: string[]; start?: number }) {
  if (!items?.length) return null;
  return (
    <Do start={start}>
      {items.map((item) => (
        <li key={item}>
          <RichText text={item} />
        </li>
      ))}
    </Do>
  );
}

export function LocalizedGuide({ locale }: { locale: OtherLocale }) {
  const g = guideCopies[locale];
  const steps = order.length - 1;
  return (
    <div lang={locale}>
      <SiteNav locale={locale} />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        <h1 className="text-[38px] leading-[1.05] sm:text-[48px]" style={{ letterSpacing: "-0.025em" }}>
          {g.title}
        </h1>
        <Lead>{g.lead}</Lead>
        <Note title={g.need.title}>
          {g.need.lines.map((line) => (
            <p key={line}>· {line}</p>
          ))}
        </Note>
        <h2 className="mt-10 text-2xl">{g.stepsTitle}</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-[17px] marker:text-muted">
          {order.slice(0, -1).map((slug) => (
            <li key={slug}>
              <a href={`#${slug}`} className="hover:underline hover:underline-offset-2">
                {g.steps[slug].title}
              </a>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-faint">{g.english}</p>

        {order.map((slug, i) => {
          const step = g.steps[slug];
          const s = shots[slug];
          const n = i + 1;
          return (
            <section key={slug} id={slug} className="mt-16 scroll-mt-28 border-t border-line pt-10">
              {n <= steps && <p className="text-sm text-muted">{fill(g.step, { n })}</p>}
              <h2 className="mt-2 text-[30px] leading-[1.1] sm:text-[36px]" style={{ letterSpacing: "-0.02em" }}>
                {step.title}
              </h2>
              <Lead>{step.lead}</Lead>
              <Notes notes={step.notesBefore} />
              <Actions items={step.actions} />
              {s.first?.map((shot) => (
                <Shot key={shot.src} {...shot} alt={g.alts[shot.src] ?? ""} />
              ))}
              <Actions items={step.actionsAfterShot} start={(step.actions?.length ?? 0) + 1} />
              {s.second?.map((shot) => (
                <Shot key={shot.src} {...shot} alt={g.alts[shot.src] ?? ""} />
              ))}
              {step.after && (
                <p className="mt-6 text-[17px] leading-relaxed">
                  <RichText text={step.after} />
                </p>
              )}
              <Notes notes={step.notes} />
            </section>
          );
        })}
      </main>
      <SiteFooter locale={locale} path="/guide" />
    </div>
  );
}
