import { LogoMark } from "@/components/ui";

// A still picture of the Showthrough library, used on the home page.
// Plain markup (no screenshot) so it stays crisp and follows the light and dark themes.

type Scene = "site" | "bug" | "slides" | "doc";

const videos: { title: string; who: string; when: string; length: string; scene: Scene }[] = [
  { title: "Homepage redesign walkthrough", who: "Harsh", when: "2 minutes ago", length: "4:12", scene: "site" },
  { title: "Checkout button breaks on Safari", who: "Priya", when: "1 hour ago", length: "1:38", scene: "bug" },
  { title: "Q4 roadmap for the sales team", who: "Marco", when: "Yesterday", length: "7:05", scene: "slides" },
  { title: "Welcome to the design team", who: "Harsh", when: "Monday", length: "3:21", scene: "doc" },
  { title: "How we review pull requests", who: "Ana", when: "Last week", length: "5:46", scene: "doc" },
  { title: "Pricing page, first draft", who: "Priya", when: "Last week", length: "2:09", scene: "site" },
];

function Bar({ w, className = "bg-white/15" }: { w: string; className?: string }) {
  return <span className={`block h-1.5 rounded-full ${className}`} style={{ width: w }} />;
}

function Thumb({ scene, length }: { scene: Scene; length: string }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-[12px] bg-stage">
      <div className="absolute inset-3 overflow-hidden rounded-md bg-white/[0.06] p-2.5">
        {scene === "site" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Bar w="22%" />
              <Bar w="30%" className="bg-white/10" />
            </div>
            <div className="pt-2">
              <Bar w="70%" className="h-2.5 bg-white/30" />
            </div>
            <Bar w="52%" className="h-2.5 bg-white/30" />
            <div className="flex gap-1.5 pt-1.5">
              <span className="h-3 w-9 rounded-sm bg-white/70" />
              <span className="h-3 w-9 rounded-sm bg-white/15" />
            </div>
          </div>
        )}
        {scene === "bug" && (
          <div className="space-y-2">
            <Bar w="40%" />
            <Bar w="62%" className="bg-white/10" />
            <div className="mt-3 flex items-center gap-2">
              <span className="h-4 w-14 rounded-sm bg-white/25 outline-2 outline-offset-2 outline-white/70" />
              <Bar w="30%" className="bg-white/10" />
            </div>
          </div>
        )}
        {scene === "slides" && (
          <div className="flex h-full flex-col">
            <Bar w="45%" className="h-2 bg-white/30" />
            <div className="mt-auto flex h-3/5 items-end gap-1.5 px-1">
              {[35, 50, 42, 68, 80].map((h, i) => (
                <span key={h} className={`flex-1 rounded-t-sm ${i === 4 ? "bg-white/60" : "bg-white/20"}`} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        )}
        {scene === "doc" && (
          <div className="mx-auto w-3/4 space-y-1.5 rounded-sm bg-white/[0.07] p-2">
            <Bar w="55%" className="h-2 bg-white/30" />
            <Bar w="90%" className="bg-white/10" />
            <Bar w="84%" className="bg-white/10" />
            <Bar w="70%" className="bg-white/10" />
          </div>
        )}
      </div>
      {/* Camera bubble */}
      <span className="absolute bottom-2.5 left-2.5 size-7 rounded-full border-2 border-white/80 bg-gradient-to-b from-neutral-500 to-neutral-700" />
      <span className="tabular absolute bottom-2.5 right-2.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">{length}</span>
    </div>
  );
}

function NavItem({ label, active = false, icon }: { label: string; active?: boolean; icon: React.ReactNode }) {
  return (
    <span
      className={`flex items-center gap-2.5 rounded-control px-2.5 py-2 text-sm ${active ? "bg-sunken font-semibold text-text" : "text-muted"}`}
    >
      {icon}
      {label}
    </span>
  );
}

const icons = {
  library: (
    <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
      <rect x="3" y="4" width="14" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 7.8v4.4L12.3 10z" fill="currentColor" />
    </svg>
  ),
  shared: (
    <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
      <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="13.5" cy="9" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 16c.6-2.4 2.4-3.8 4.5-3.8s3.9 1.4 4.5 3.8M12.5 13.2c1.9-.2 3.6.9 4.2 2.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
      <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 3v2M10 15v2M3 10h2M15 10h2M5 5l1.4 1.4M13.6 13.6L15 15M5 15l1.4-1.4M13.6 6.4L15 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export function LibraryMock() {
  return (
    <div
      aria-label="The Showthrough library: your recordings, stored in your own Cloudflare"
      role="img"
      className="mx-auto max-w-5xl overflow-hidden rounded-t-[24px] border border-b-0 border-line bg-canvas shadow-pop"
    >
      <div className="grid md:grid-cols-[208px_1fr]">
        {/* Sidebar */}
        <div className="hidden flex-col border-r border-line bg-surface p-4 md:flex">
          <div className="flex gap-1.5 px-1 pb-5">
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
          </div>
          <span className="flex items-center gap-2 px-1 pb-5 font-bold">
            <LogoMark className="size-6" />
            Showthrough
          </span>
          <div className="space-y-0.5">
            <NavItem label="Library" active icon={icons.library} />
            <NavItem label="Shared with me" icon={icons.shared} />
            <NavItem label="Settings" icon={icons.settings} />
          </div>
          <div className="mt-auto rounded-[12px] border border-line p-3 pt-2.5">
            <p className="text-xs font-semibold">Your Cloudflare</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sunken">
              <div className="h-full w-[21%] rounded-full bg-brand" />
            </div>
            <p className="mt-1.5 text-xs text-muted">2.1 GB of 10 GB free</p>
          </div>
        </div>

        {/* Library */}
        <div className="min-w-0 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <p className="font-display text-[26px] font-medium tracking-[-0.015em] sm:text-[30px]">Your library</p>
            <div className="flex items-center gap-2.5">
              <span className="hidden h-9 w-52 items-center gap-2 rounded-full border border-line bg-surface px-3 text-sm text-faint sm:flex">
                <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
                  <circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                Search videos
              </span>
              <span className="btn-primary inline-flex h-9 items-center gap-1.5 rounded-full bg-text px-4 text-sm font-semibold text-canvas">
                <span className="size-2 rounded-full bg-canvas" />
                New video
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 lg:grid-cols-3">
            {videos.map((video, i) => (
              <div key={video.title} className={i >= 4 ? "hidden lg:block" : ""}>
                <Thumb scene={video.scene} length={video.length} />
                <p className="mt-2.5 truncate text-sm font-semibold">{video.title}</p>
                <p className="text-xs text-muted">
                  {video.who}, {video.when}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
