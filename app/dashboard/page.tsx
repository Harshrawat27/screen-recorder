import type { Metadata } from "next";
import { ConnectCloudflareButton } from "@/components/connect-cloudflare";
import { ConnectionCheck } from "@/components/connection-check";
import { PageHeader } from "@/components/dashboard-ui";
import { pages } from "@/lib/dashboard-pages";
import { CheckIcon, Pill, buttonClass } from "@/components/ui";
import { listVideos } from "@/lib/cloudflare";
import { MEDIA_URL } from "@/lib/config";
import { getWorkspace } from "@/lib/db";
import { type LibraryFolder, type LibraryVideo, LibraryActions, LibraryView } from "@/components/library-ui";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Library", robots: { index: false } };

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

// Sample folders so the layout can be shown before folders are built.
const exampleFolders: LibraryFolder[] = [
  { id: "product", name: "Product walkthroughs", videos: 4, people: ["Maya", "Leo"] },
  { id: "weekly", name: "Weekly updates", videos: 2, people: ["Sam"] },
];

export default async function DashboardPage() {
  const { user } = await requireSession();
  const workspace = await getWorkspace(user.id);
  const library = workspace ? await listVideos(workspace.worker_url, workspace.upload_key) : { videos: [], reachable: true };
  const videos = library.videos;

  const connected = Boolean(workspace);
  const extension = Boolean(workspace?.extension_connected_at);
  const recorded = videos.length > 0;
  const setupDone = connected && extension && recorded;

  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
        <PageHeader title={pages.library.title} description={pages.library.description}>
          <LibraryActions />
        </PageHeader>

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

        {setupDone && workspace ? (
          <LibraryView
            author={{ name: user.name, image: user.image }}
            folders={exampleFolders}
            videos={videos.map(
              (video): LibraryVideo => ({
                id: video.id,
                title: video.title || "Untitled recording",
                href: `/v/${workspace.space}/${video.id}`,
                thumb: `${MEDIA_URL}/${workspace.space}/videos/${video.id}/thumb-small.jpg`,
                length: duration(video.durationSec),
                when: when(video.createdAt),
                ready: video.ready,
                // Not tracked yet.
                views: 0,
                comments: 0,
                reactions: 0,
              }),
            )}
          />
        ) : null}

        {workspace && !setupDone && (
          <ConnectionCheck workerUrl={workspace.worker_url} uploadKey={workspace.upload_key} space={workspace.space} mediaBase={MEDIA_URL} />
        )}

        {setupDone && (
          <p className="mt-12 text-sm text-faint">
            Need to reconnect? <ConnectInline />
          </p>
        )}
    </main>
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
