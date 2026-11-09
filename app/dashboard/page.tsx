import { site } from "@/lib/site";
import type { Metadata } from "next";
import { ConnectCloudflareButton } from "@/components/connect-cloudflare";
import { ConnectionCheck } from "@/components/connection-check";
import { PageHeader } from "@/components/dashboard-ui";
import { pages } from "@/lib/dashboard-pages";
import { CheckIcon, Pill, buttonClass } from "@/components/ui";
import { listVideos } from "@/lib/cloudflare";
import { MEDIA_URL } from "@/lib/config";
import { getWorkspace } from "@/lib/db";
import { LibraryActions, LibraryView } from "@/components/library-ui";
import { foldersEnabled, listFolders } from "@/lib/folders";
import { toLibraryVideos } from "@/lib/library";
import { requireSession } from "@/lib/session";
import { getAccess, syncPayment } from "@/lib/billing";

export const metadata: Metadata = { title: "Library", robots: { index: false } };

function Step({ n, done, title, body, children }: { n: number; done: boolean; title: string; body: React.ReactNode; children?: React.ReactNode }) {
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

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const { user } = await requireSession();
  const params = await searchParams;

  // Back from Dodo checkout: confirm the payment with Dodo right away rather than waiting for the webhook.
  const returning = params.checkout === "done";
  let access = await getAccess(user);
  if (returning && !access.paid && typeof params.payment_id === "string") {
    try {
      if (await syncPayment(params.payment_id, user.id)) access = await getAccess(user);
    } catch (err) {
      console.error("Could not confirm payment on return", err);
    }
  }

  if (!access.paid) return <LockedLibrary pending={returning} />;

  const workspace = await getWorkspace(user.id);
  const [library, folders] = await Promise.all([
    workspace ? listVideos(workspace.worker_url, workspace.upload_key) : { videos: [], reachable: true },
    listFolders(workspace),
  ]);
  const canFolder = foldersEnabled(workspace);
  const videos = library.videos;

  const connected = Boolean(workspace);
  const extension = Boolean(workspace?.extension_connected_at);
  const recorded = videos.length > 0;
  const setupDone = connected && extension && recorded;

  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
        <PageHeader title={pages.library.title} description={pages.library.description}>
          <LibraryActions foldersEnabled={canFolder} />
        </PageHeader>

        {returning && (
          <p role="status" className="mt-8 max-w-3xl rounded-control border border-line bg-surface px-4 py-3 text-sm">
            <span className="font-semibold">Payment received. Thank you!</span> Connect Cloudflare below to start recording.
          </p>
        )}

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
              <Step n={2} done={extension} title="Connect the Chrome extension" body={extensionBody}>
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
            folders={folders.map((f) => ({ id: f.id, name: f.name, videos: f.videos, people: [], href: `/dashboard/folders/${f.id}` }))}
            folderOptions={folders.map((f) => ({ id: f.id, name: f.name }))}
            foldersEnabled={canFolder}
            scope={null}
            videos={toLibraryVideos(videos, workspace)}
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

// Before purchase: the dashboard is visible, but nothing works yet. "Connect Cloudflare" leads to pricing.
function LockedLibrary({ pending }: { pending: boolean }) {
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      <PageHeader title={pages.library.title} description={pages.library.description} />

      {pending && (
        <p role="status" className="mt-8 max-w-3xl rounded-control border border-line bg-surface px-4 py-3 text-sm">
          <span className="font-semibold">We&rsquo;re confirming your payment.</span> This usually takes a few seconds. Refresh the page if this
          message stays.
        </p>
      )}

      <section aria-labelledby="setup" className="mt-10 max-w-3xl rounded-panel border border-line bg-surface p-6 sm:p-8">
        <h2 id="setup" className="text-xl font-bold tracking-tight">
          Get ready to record
        </h2>
        <p className="mt-1 text-muted">Three steps. You only do this once.</p>
        <ol className="mt-6 divide-y divide-line">
          <Step n={1} done={false} title="Connect your Cloudflare" body="Sets up private storage for your videos in your own account. About 30 seconds.">
            <a href="/pricing?locked" className={buttonClass("primary", "md")}>
              Connect Cloudflare
            </a>
          </Step>
          <Step n={2} done={false} title="Connect the Chrome extension" body={extensionBody}>
            <Pill>After step 1</Pill>
          </Step>
          <Step n={3} done={false} title="Record your first video" body="Click the Showthrough icon, record, stop. The link is copied for you.">
            <Pill>After step 2</Pill>
          </Step>
        </ol>
      </section>
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

const extensionBody = (
  <>
    <a href={site.chromeStoreUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-text">
      Add it from the Chrome Web Store
    </a>
    , then connect it so it knows where to save your recordings. No keys to copy.
  </>
);
