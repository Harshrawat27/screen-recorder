import { site } from "@/lib/site";
import type { Metadata } from "next";
import { ConnectCloudflareButton } from "@/components/connect-cloudflare";
import { ConnectionCheck } from "@/components/connection-check";
import { PageHeader } from "@/components/dashboard-ui";
import { pages } from "@/lib/dashboard-pages";
import { CheckIcon, Pill, buttonClass } from "@/components/ui";
import { listVideos } from "@/lib/cloudflare";
import { MEDIA_URL } from "@/lib/config";
import { firstName, getTeamContext, teamPeople, teamsEnabled } from "@/lib/team";
import { LibraryActions, LibraryView } from "@/components/library-ui";
import { foldersEnabled, listFolders } from "@/lib/folders";
import { toLibraryVideos, videosBy } from "@/lib/library";
import { getPersonal, personalEnabled } from "@/lib/personal";
import { requireSession } from "@/lib/session";
import { getAccess, syncPayment } from "@/lib/billing";
import { ownerFeatures } from "@/lib/plan";

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

/** A thin strip across the top of the library until Cloudflare is connected, pointing to the setup guide. */
function GuideBar() {
  return (
    <a
      href="/guide"
      target="_blank"
      className="-mx-5 -mt-8 mb-8 flex items-center justify-center gap-2 border-b border-line bg-surface px-5 py-2.5 text-center text-sm text-muted transition-colors hover:text-text sm:-mx-10 sm:-mt-10"
    >
      <span>
        New here? Setting up takes about 2 minutes. <span className="font-semibold text-text underline underline-offset-2">Follow the setup guide →</span>
      </span>
    </a>
  );
}

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const { user } = await requireSession();
  const params = await searchParams;

  // Back from Dodo checkout: confirm the payment with Dodo right away rather than waiting for the webhook.
  const returning = params.checkout === "done";
  const redeemed = params.redeemed === "appsumo";
  let access = await getAccess(user);
  if (returning && !access.paid && typeof params.payment_id === "string") {
    try {
      if (await syncPayment(params.payment_id, user.id)) access = await getAccess(user);
    } catch (err) {
      console.error("Could not confirm payment on return", err);
    }
  }

  // Free plan or paid: everyone can connect Cloudflare and record. Paid features depend on the
  // plan of whoever owns this workspace (lib/plan.ts).
  const pending = returning && !access.paid;

  const team = await getTeamContext(user);
  const member = team.role === "member";
  const workspace = team.workspace;
  const features = await ownerFeatures(team.ownerId);
  const [library, folders, later, people] = await Promise.all([
    workspace ? listVideos(workspace.worker_url, workspace.upload_key) : { videos: [], reachable: true },
    listFolders(workspace),
    personalEnabled(workspace) ? getPersonal(workspace, user.id, "watch_later") : null,
    features.team && teamsEnabled(workspace) ? teamPeople(team.ownerId) : [],
  ]);
  // Paid features keep their buttons on the free plan: using them opens the upgrade popup.
  const canFolder = foldersEnabled(workspace);
  // My library: only the recordings I made. Teammates' recordings are under Team.
  const videos = workspace ? videosBy(library.videos, workspace, user.id, user.id) : [];

  const connected = Boolean(workspace);
  const extension = team.extensionConnected;
  const recorded = videos.length > 0;
  const setupDone = connected && extension && recorded;

  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
        {!connected && !member && <GuideBar />}
        <PageHeader
          title={pages.library.title}
          description={member ? `Your recordings, stored in ${firstName(team.owner)}'s Cloudflare for the team.` : pages.library.description}
        >
          <LibraryActions
            foldersEnabled={canFolder}
            foldersLocked={!features.folders}
            updateHint={member ? `Your admin (${firstName(team.owner)}) hasn't installed this update yet` : undefined}
          />
        </PageHeader>

        {returning && access.paid && (
          <p role="status" className="mt-8 max-w-3xl rounded-control border border-line bg-surface px-4 py-3 text-sm">
            <span className="font-semibold">Payment received. Thank you!</span>{" "}
            {connected ? "Every paid feature is on now." : "Connect Cloudflare below to start recording."}
          </p>
        )}
        {pending && (
          <p role="status" className="mt-8 max-w-3xl rounded-control border border-line bg-surface px-4 py-3 text-sm">
            <span className="font-semibold">We&rsquo;re confirming your payment.</span> This usually takes a few seconds. Refresh the page if this
            message stays.
          </p>
        )}

        {/* Back from /appsumo after redeeming a code. */}
        {redeemed && (
          <p role="status" className="mt-8 max-w-3xl rounded-control border border-line bg-surface px-4 py-3 text-sm">
            <span className="font-semibold">Code redeemed. Welcome, Sumo-ling! 🎉</span> Your lifetime license is active, with every
            future update. {connected ? "You're all set to record." : "Connect Cloudflare below to start recording."}
          </p>
        )}

        {!setupDone && member && (
          <section aria-labelledby="setup" className="mt-10 max-w-3xl rounded-panel border border-line bg-surface p-6 sm:p-8">
            <h2 id="setup" className="text-xl font-bold tracking-tight">
              Get ready to record
            </h2>
            <p className="mt-1 text-muted">
              {connected
                ? `Two steps. Storage is managed by ${firstName(team.owner)}, your team's admin.`
                : `${firstName(team.owner)}, your team's admin, hasn't connected Cloudflare yet. You can connect your extension once they do.`}
            </p>
            <ol className="mt-6 divide-y divide-line">
              <Step n={1} done={extension} title="Connect the Chrome extension" body={extensionBody}>
                {extension ? (
                  <Pill>Done</Pill>
                ) : connected ? (
                  <a href="/extension/connect" className={buttonClass("primary", "md")}>
                    Connect extension
                  </a>
                ) : (
                  <Pill>Waiting for your admin</Pill>
                )}
              </Step>
              <Step n={2} done={recorded} title="Record your first video" body="Click the Showthrough icon, record, stop. The link is copied for you.">
                {recorded ? <Pill>Done</Pill> : <Pill>{extension ? "Ready when you are" : "After step 1"}</Pill>}
              </Step>
            </ol>
          </section>
        )}

        {!setupDone && !member && (
          <section aria-labelledby="setup" className="mt-10 max-w-3xl rounded-panel border border-line bg-surface p-6 sm:p-8">
            <h2 id="setup" className="text-xl font-bold tracking-tight">
              Get ready to record
            </h2>
            <p className="mt-1 text-muted">
              Three steps. You only do this once.{" "}
              <a href="/guide" target="_blank" className="underline underline-offset-2 hover:text-text">
                Step-by-step guide
              </a>
            </p>
            <ol className="mt-6 divide-y divide-line">
              <Step
                n={1}
                done={connected}
                title="Connect your Cloudflare"
                body={
                  connected
                    ? `Connected${workspace?.cf_account_name ? ` to ${workspace.cf_account_name}` : ""}. Your videos are stored there.`
                    : "Just one click: press Allow on Cloudflare and we handle the rest, setting up private storage for your videos in your own account. About 30 seconds."
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
            foldersLocked={!features.folders}
            scope={null}
            space={workspace.space}
            watchLater={later?.filter((i) => i.space === workspace.space).map((i) => i.videoId)}
            videos={toLibraryVideos(videos, workspace, user.id)}
            team={people.length > 1 ? { people: people.map(({ id, name, email }) => ({ id, name, email })), ownerId: team.ownerId } : null}
          />
        ) : null}

        {/* The check uses the admin's key in the browser, so it's for the admin only. */}
        {workspace && !setupDone && !member && (
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

const extensionBody = (
  <>
    <a href={site.chromeStoreUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-text">
      Add it from the Chrome Web Store
    </a>
    , then connect it so it knows where to save your recordings. No keys to copy.
  </>
);
