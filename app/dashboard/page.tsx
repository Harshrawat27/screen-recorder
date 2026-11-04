import type { Metadata } from "next";
import Link from "next/link";
import { SignOutButton } from "@/components/auth-buttons";
import { ConnectCloudflareButton } from "@/components/connect-cloudflare";
import { ConnectionCheck } from "@/components/connection-check";
import { Logo } from "@/components/header";
import { ThemeToggle } from "@/components/theme-toggle";
import { CheckIcon, Pill, buttonClass } from "@/components/ui";
import { type VideoSummary, listVideos } from "@/lib/cloudflare";
import { MEDIA_URL } from "@/lib/config";
import { getWorkspace } from "@/lib/db";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Library", robots: { index: false } };

function Avatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" referrerPolicy="no-referrer" className="size-9 rounded-full object-cover" />;
  }
  return (
    <span aria-hidden className="grid size-9 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand-ink">
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

function duration(sec: number | null) {
  if (!sec) return null;
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function when(ms: number | null) {
  if (!ms) return "";
  const minutes = Math.round((Date.now() - ms) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function Step({ n, done, title, body, children }: { n: number; done: boolean; title: string; body: string; children?: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-start gap-4 py-5 first:pt-0 last:pb-0 sm:flex-nowrap">
      <span
        className={`tabular grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${done ? "bg-success text-white" : "bg-sunken text-muted"}`}
      >
        {done ? <CheckIcon /> : n}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 text-sm text-muted">{body}</p>
      </div>
      <div className="shrink-0 pl-12 sm:pl-0">{children}</div>
    </li>
  );
}

function VideoCard({ video, href }: { video: VideoSummary; href: string }) {
  const length = duration(video.durationSec);
  return (
    <Link href={href} target="_blank" className="group block">
      <div className="relative aspect-video overflow-hidden rounded-card bg-stage">
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-12 place-items-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-white group-hover:text-black">
            <svg viewBox="0 0 12 12" className="ml-0.5 size-4" fill="currentColor" aria-hidden>
              <path d="M3 1.8v8.4L10 6z" />
            </svg>
          </span>
        </span>
        {length && <span className="tabular absolute bottom-2.5 right-2.5 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-white">{length}</span>}
      </div>
      <p className="mt-3 truncate font-semibold group-hover:text-brand-ink">{video.title || "Untitled recording"}</p>
      <p className="text-sm text-muted">{video.ready ? when(video.createdAt) : "Still uploading or interrupted"}</p>
    </Link>
  );
}

export default async function DashboardPage() {
  const { user } = await requireSession();
  const firstName = user.name?.split(" ")[0] || "there";
  const workspace = await getWorkspace(user.id);
  const library = workspace ? await listVideos(workspace.worker_url, workspace.upload_key) : { videos: [], reachable: true };
  const videos = library.videos;

  const connected = Boolean(workspace);
  const extension = Boolean(workspace?.extension_connected_at);
  const recorded = videos.length > 0;
  const setupDone = connected && extension && recorded;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_1fr]">
      <aside className="flex flex-col border-b border-line bg-surface lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5">
          <Logo />
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>
        <nav className="hidden flex-1 px-3 lg:block" aria-label="Main">
          <a
            href="/dashboard"
            aria-current="page"
            className="flex items-center gap-3 rounded-control bg-brand-soft px-3 py-2.5 text-[15px] font-semibold text-brand-ink"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-[18px]">
              <rect x="3" y="4" width="14" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8.5 7.8v4.4L12.3 10z" fill="currentColor" />
            </svg>
            Library
          </a>
        </nav>
        <div className="hidden items-center gap-3 border-t border-line px-5 py-4 lg:flex">
          <Avatar name={user.name} image={user.image} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      <main className="px-5 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.02em]">Your library</h1>
            <p className="mt-1 text-muted">
              {recorded ? `${videos.length} recording${videos.length === 1 ? "" : "s"}, stored in your Cloudflare.` : `Welcome, ${firstName}. Your recordings will show up here.`}
            </p>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <Avatar name={user.name} image={user.image} />
            <SignOutButton />
          </div>
          <div className="hidden lg:block">
            <SignOutButton />
          </div>
        </div>

        {!setupDone && (
          <section aria-labelledby="setup" className="mt-10 max-w-3xl rounded-panel border border-line bg-surface p-6 sm:p-8">
            <h2 id="setup" className="text-xl font-bold tracking-tight">
              Get ready to record
            </h2>
            <p className="mt-1 text-muted">Three steps. You only do this once.</p>
            <ol className="mt-6 divide-y divide-line">
              <Step
                n={1}
                done={connected}
                title="Connect your Cloudflare"
                body={
                  connected
                    ? `Connected${workspace?.cf_account_name ? ` to ${workspace.cf_account_name}` : ""}. Your videos are stored there.`
                    : "Sets up private storage for your videos in your own account. About 30 seconds."
                }
              >
                {connected ? <Pill>Done</Pill> : <ConnectCloudflareButton />}
              </Step>
              <Step n={2} done={extension} title="Connect the Chrome extension" body="So it knows where to save your recordings. No keys to copy.">
                {extension ? (
                  <Pill>Done</Pill>
                ) : connected ? (
                  // A full page load (not client-side navigation) so the extension's helper script runs.
                  <a href="/extension/connect" className={buttonClass("primary", "md")}>
                    Connect extension
                  </a>
                ) : (
                  <Pill>After step 1</Pill>
                )}
              </Step>
              <Step n={3} done={recorded} title="Record your first video" body="Click the Showthrough icon, record, stop. The link is copied for you.">
                {recorded ? <Pill>Done</Pill> : <Pill>{extension ? "Ready when you are" : "After step 2"}</Pill>}
              </Step>
            </ol>
          </section>
        )}

        {workspace && !library.reachable && (
          <p role="alert" className="mt-8 max-w-3xl rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-ink">
            We couldn&rsquo;t reach your video backend just now. If you connected Cloudflare a moment ago, give it a minute and refresh.
          </p>
        )}

        {recorded && workspace && (
          <section aria-label="Recordings" className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} href={`/v/${workspace.space}/${video.id}`} />
            ))}
          </section>
        )}

        {workspace && (
          <ConnectionCheck workerUrl={workspace.worker_url} uploadKey={workspace.upload_key} space={workspace.space} mediaBase={MEDIA_URL} />
        )}

        {setupDone && (
          <p className="mt-12 text-sm text-faint">
            Need to reconnect? <ConnectInline />
          </p>
        )}
      </main>
    </div>
  );
}

function ConnectInline() {
  return (
    <>
      <a href="/extension/connect" className="underline underline-offset-2 hover:text-text">
        Reconnect the extension
      </a>
    </>
  );
}
