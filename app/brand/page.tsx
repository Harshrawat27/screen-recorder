import type { Metadata } from "next";
import { Footer, Header } from "@/components/header";
import { Card, LogoMark, Pill, buttonClass } from "@/components/ui";

export const metadata: Metadata = { title: "Brand", robots: { index: false, follow: false } };

const colors = [
  { token: "brand", role: "Primary action, recording, progress", light: "#FA6717", dark: "#FA6717" },
  { token: "brand-hover", role: "Hover on orange", light: "#E8570B", dark: "#FF7A30" },
  { token: "brand-soft", role: "Tinted backgrounds, badges", light: "#FFF0E6", dark: "Orange 14%" },
  { token: "brand-ink", role: "Orange text and links", light: "#C2410C", dark: "#FF8A4C" },
  { token: "canvas", role: "Page background", light: "#F6F6F4", dark: "#141416" },
  { token: "surface", role: "Cards, panels, inputs", light: "#FFFFFF", dark: "#1C1C1F" },
  { token: "sunken", role: "Wells, skeletons, hover", light: "#EFEFEC", dark: "#232327" },
  { token: "line", role: "Borders and dividers", light: "#E3E3DF", dark: "#2C2C31" },
  { token: "text", role: "Primary text", light: "#18181B", dark: "#F4F4F5" },
  { token: "muted", role: "Secondary text", light: "#5B5B63", dark: "#A6A6AE" },
  { token: "faint", role: "Captions, hints", light: "#76767E", dark: "#8A8A92" },
  { token: "stage", role: "Frame behind video", light: "#1C1C1F", dark: "#0F0F11" },
];

const type = [
  { name: "Display", spec: "64 / 700 / -4%", className: "text-[44px] sm:text-[64px] font-bold leading-[1.02] tracking-[-0.04em]", sample: "Show it once." },
  { name: "Heading 1", spec: "48 / 700 / -3%", className: "text-4xl sm:text-5xl font-bold leading-[1.08] tracking-[-0.03em]", sample: "Skip the meeting." },
  { name: "Heading 2", spec: "28 / 700 / -2%", className: "text-[28px] font-bold leading-tight tracking-[-0.02em]", sample: "Your library" },
  { name: "Heading 3", spec: "20 / 700 / -1%", className: "text-xl font-bold tracking-tight", sample: "Record from Chrome" },
  { name: "Body large", spec: "18 / 400 / 1.6", className: "text-lg text-muted", sample: "The link is ready the moment you stop." },
  { name: "Body", spec: "16 / 400 / 1.6", className: "text-base", sample: "Videos stay in your own Cloudflare storage." },
  { name: "Label", spec: "14 / 600", className: "text-sm font-semibold", sample: "Copy link" },
  { name: "Caption", spec: "12 / 400", className: "text-xs text-faint", sample: "Recorded 2 minutes ago" },
];

const principles = [
  ["Orange is a signal.", "Use it for the one primary action, recording state, progress and a single key number. Never for decoration or large backgrounds."],
  ["Neutrals do the work.", "Layouts are built from canvas, surface and line. Hierarchy comes from type weight and spacing before color."],
  ["Video sits on stage.", "Recordings always appear on the dark stage color, in both themes, so screens look the same everywhere."],
  ["One family, clear steps.", "Figtree everywhere. Bold (700) for headings, semibold (600) for labels and buttons, regular (400) for reading."],
  ["Plain words.", "Name things by what people do: Record, Stop, Copy link. Sentence case, no all-caps labels."],
];

export default function BrandPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex items-center gap-4">
          <LogoMark className="size-14" />
          <div>
            <h1 className="text-4xl font-bold tracking-[-0.03em]">Showthrough brand</h1>
            <p className="mt-1 text-muted">Tokens and components for the site, the share page and the dashboard. Switch themes with the toggle above.</p>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-[28px] font-bold tracking-[-0.02em]">Principles</h2>
          <ul className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {principles.map(([title, body]) => (
              <li key={title}>
                <p className="font-bold">{title}</p>
                <p className="mt-1 text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="text-[28px] font-bold tracking-[-0.02em]">Color</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map((c) => (
              <Card key={c.token} className="overflow-hidden">
                <div className="h-20 border-b border-line" style={{ background: `var(--${c.token})` }} />
                <div className="p-4">
                  <p className="font-semibold">{c.token}</p>
                  <p className="text-sm text-muted">{c.role}</p>
                  <p className="tabular mt-2 text-xs text-faint">
                    Light {c.light}
                    <br />
                    Dark {c.dark}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[28px] font-bold tracking-[-0.02em]">Type: Figtree</h2>
          <div className="mt-6 divide-y divide-line rounded-card border border-line bg-surface">
            {type.map((t) => (
              <div key={t.name} className="grid gap-2 p-5 sm:grid-cols-[180px_1fr] sm:items-baseline">
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="tabular text-xs text-faint">{t.spec}</p>
                </div>
                <p className={t.className}>{t.sample}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[28px] font-bold tracking-[-0.02em]">Components</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <p className="text-sm font-semibold text-muted">Buttons</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="button" className={buttonClass("primary", "lg")}>Record</button>
                <button type="button" className={buttonClass("secondary", "lg")}>Copy link</button>
                <button type="button" className={buttonClass("ghost", "lg")}>Cancel</button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="button" className={buttonClass("primary", "md")}>Record</button>
                <button type="button" className={buttonClass("secondary", "md")}>Copy link</button>
                <button type="button" className={buttonClass("primary", "sm")}>Record</button>
                <button type="button" className={buttonClass("secondary", "sm")}>Copy link</button>
              </div>
              <p className="mt-4 text-xs text-faint">One primary button per screen. Ink text on orange keeps 5.9:1 contrast.</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-semibold text-muted">Inputs and badges</p>
              <label className="mt-4 block">
                <span className="text-sm font-semibold">Video title</span>
                <input
                  defaultValue="Homepage redesign walkthrough"
                  className="mt-1.5 h-11 w-full rounded-control border border-line bg-surface px-3.5 text-[15px] outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
                />
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill tone="brand">
                  <span className="rec-dot size-1.5 rounded-full bg-rec" />
                  Recording
                </Pill>
                <Pill>Draft</Pill>
                <Pill>4:12</Pill>
              </div>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <p className="text-sm font-semibold text-muted">Radius and elevation</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-control border border-line bg-surface p-4 text-sm">
                  <b>Control, 10px</b>
                  <br />
                  <span className="text-muted">Buttons, inputs</span>
                </div>
                <div className="rounded-card border border-line bg-surface p-4 text-sm">
                  <b>Card, 16px</b>
                  <br />
                  <span className="text-muted">Cards, menus, video thumbnails</span>
                </div>
                <div className="rounded-panel border border-line bg-surface p-4 text-sm shadow-pop">
                  <b>Panel, 24px + pop shadow</b>
                  <br />
                  <span className="text-muted">Large panels, floating UI only</span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
