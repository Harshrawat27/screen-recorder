import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard-ui";
import { buttonClass } from "@/components/ui";
import { listVideos } from "@/lib/cloudflare";
import { pages } from "@/lib/dashboard-pages";
import { getWorkspace } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { FREE, PRICE, getUsage } from "@/lib/usage";

export const metadata: Metadata = { title: pages.usage.title, robots: { index: false } };

const number = (n: number) => n.toLocaleString("en-US");

function size(bytes: number) {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(bytes >= 1e10 ? 1 : 2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(bytes >= 1e8 ? 0 : 1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1e3))} KB`;
}

function hours(sec: number) {
  if (sec < 3600) return `${Math.max(1, Math.round(sec / 60))} minutes`;
  const h = sec / 3600;
  return `${h < 10 ? h.toFixed(1) : Math.round(h)} hours`;
}

const money = (n: number) => (n < 0.01 ? "under 1 cent" : `$${n.toFixed(2)}`);

function Meter({ used, limit }: { used: number; limit: number }) {
  const share = Math.min(1, used / limit);
  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-sunken" role="meter" aria-valuemin={0} aria-valuemax={limit} aria-valuenow={used}>
      <div className="h-full rounded-full bg-text transition-[width]" style={{ width: `${Math.max(share * 100, used > 0 ? 1.5 : 0)}%` }} />
    </div>
  );
}

function Card({
  title,
  used,
  limit,
  children,
}: {
  title: string;
  used: string;
  limit: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="rounded-card border border-line bg-surface p-5 sm:p-6">
      <h2 className="font-sans text-[15px] font-medium text-muted">{title}</h2>
      <p className="tabular mt-2 text-[28px] font-semibold leading-none tracking-[-0.02em]">
        {used} <span className="text-base font-normal text-muted">of {limit}</span>
      </p>
      {children}
    </section>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-muted">{children}</p>;
}

function Message({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <section className="mt-10 max-w-2xl rounded-panel border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-xl">{title}</h2>
      <p className="mt-2 text-muted">{body}</p>
      {action}
    </section>
  );
}

export default async function UsagePage() {
  const { user } = await requireSession();
  const workspace = await getWorkspace(user.id);
  const header = <PageHeader title={pages.usage.title} description={pages.usage.description} />;

  if (!workspace) {
    return (
      <main className="px-5 py-8 sm:px-10 sm:py-10">
        {header}
        <Message
          title="Connect Cloudflare first"
          body="Your usage shows up here once your videos are stored in your own Cloudflare. Connecting it is one click from your library, and we handle the rest."
          action={
            <Link href="/dashboard" className={buttonClass("primary", "md", "mt-6")}>
              Go to your library
            </Link>
          }
        />
      </main>
    );
  }
  if (workspace.worker_version < 4) {
    return (
      <main className="px-5 py-8 sm:px-10 sm:py-10">
        {header}
        <Message
          title="Update to see your usage"
          body="Usage comes with the latest version of your video backend. Press Update in the sidebar; it takes about 30 seconds and keeps everything as it is."
        />
      </main>
    );
  }

  const [result, library] = await Promise.all([getUsage(workspace), listVideos(workspace.worker_url, workspace.upload_key)]);
  if ("error" in result) {
    return (
      <main className="px-5 py-8 sm:px-10 sm:py-10">
        {header}
        <Message
          title="Couldn’t load your usage"
          body={`Your video backend didn’t answer properly. Refresh the page in a moment. If it keeps happening, send us this: ${result.error}`}
        />
      </main>
    );
  }
  const { usage } = result;

  const { storage, today, month } = usage;
  const recordedSec = library.videos.reduce((total, v) => total + (v.durationSec ?? 0), 0);
  const bytesPerSec = recordedSec > 60 && storage.pending === 0 ? storage.bytes / recordedSec : null;
  const freeLeft = FREE.storageBytes - storage.bytes;
  const overGb = Math.max(0, storage.bytes - FREE.storageBytes) / 1e9;
  const extraA = Math.max(0, month.classA - FREE.classAPerMonth);
  const extraB = Math.max(0, month.classB - FREE.classBPerMonth);
  const monthCost = overGb * PRICE.storagePerGbMonth + (extraA / 1e6) * PRICE.classAPerMillion + (extraB / 1e6) * PRICE.classBPerMillion;
  const resetAt = new Date(`${today.day}T00:00:00Z`);
  resetAt.setUTCDate(resetAt.getUTCDate() + 1);
  const dash = `https://dash.cloudflare.com/${workspace.cf_account_id}`;
  const busiest = Math.max(1, ...month.days.map((d) => d.requests));

  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      <PageHeader title={pages.usage.title} description={pages.usage.description}>
        <a href="/dashboard/usage" className={buttonClass("secondary", "md")}>
          Refresh
        </a>
      </PageHeader>

      <section className="mt-8 max-w-5xl rounded-card border border-line bg-surface p-5 sm:p-6">
        <p className="text-[15px] text-muted">Estimated Cloudflare bill this month</p>
        <p className="tabular mt-1.5 text-[34px] font-semibold leading-none tracking-[-0.02em]">{monthCost === 0 ? "$0.00" : money(monthCost)}</p>
        <Note>
          {monthCost === 0
            ? "Everything is inside Cloudflare’s free plan. Viewers watching your videos is always free: Cloudflare doesn’t charge for downloads."
            : "For what’s above Cloudflare’s free plan. Viewers watching your videos is always free: Cloudflare doesn’t charge for downloads."}
        </Note>
      </section>

      <div className="mt-4 grid max-w-5xl gap-4 md:grid-cols-2">
        <Card title="Storage" used={size(storage.bytes)} limit="10 GB free">
          <Meter used={storage.bytes} limit={FREE.storageBytes} />
          <Note>
            {number(storage.recordings)} recording{storage.recordings === 1 ? "" : "s"}.{" "}
            {storage.pending > 0
              ? `Still measuring ${number(storage.pending)} older recording${storage.pending === 1 ? "" : "s"}; refresh to measure more.`
              : freeLeft > 0
              ? bytesPerSec
                ? `About ${hours(freeLeft / bytesPerSec)} more recording before you pass the free 10 GB.`
                : "Plenty of room left."
              : `Past the free 10 GB: about ${money(overGb * PRICE.storagePerGbMonth)} a month for the extra ${overGb.toFixed(1)} GB.`}
          </Note>
        </Card>

        <Card title="Requests today" used={number(today.requests)} limit={`${number(FREE.requestsPerDay)} a day`}>
          <Meter used={today.requests} limit={FREE.requestsPerDay} />
          <Note>
            Every uploaded piece of a recording and every piece of a video someone watches counts as one. Resets at{" "}
            {resetAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short", timeZone: "UTC" })}.
            {today.requests > FREE.requestsPerDay * 0.8 &&
              " You’re close to the daily limit: past it, uploads and playback pause until the reset, unless you switch to Cloudflare’s $5 Workers Paid plan."}
          </Note>
        </Card>

        <Card title="Uploads and changes this month" used={number(month.classA)} limit={`${number(FREE.classAPerMonth)} free`}>
          <Meter used={month.classA} limit={FREE.classAPerMonth} />
          <Note>Cloudflare calls these Class A operations: saving each piece of a recording, renaming, and looking through your storage.</Note>
        </Card>

        <Card title="Reads this month" used={number(month.classB)} limit={`${number(FREE.classBPerMonth)} free`}>
          <Meter used={month.classB} limit={FREE.classBPerMonth} />
          <Note>Class B operations: reading a piece of a video from storage. Our media address keeps a short-lived copy of what was just watched, so repeat views often don’t reach your storage.</Note>
        </Card>
      </div>

      {month.days.length > 1 && (
        <section className="mt-4 max-w-5xl rounded-card border border-line bg-surface p-5 sm:p-6">
          <h2 className="font-sans text-[15px] font-medium text-muted">Requests per day this month</h2>
          <div className="mt-5 flex h-28 items-end gap-1">
            {month.days.map((d) => (
              <div key={d.day} className="group relative flex h-full flex-1 items-end" title={`${d.day}: ${number(d.requests)} requests`}>
                <div className="w-full rounded-t-[4px] bg-text/80 group-hover:bg-text" style={{ height: `${Math.max(2, (d.requests / busiest) * 100)}%` }} />
              </div>
            ))}
          </div>
          <div className="tabular mt-2 flex justify-between text-xs text-faint">
            <span>{month.days[0].day.slice(5)}</span>
            <span>{month.days[month.days.length - 1].day.slice(5)}</span>
          </div>
        </section>
      )}

      {storage.largest.length > 0 && (
        <section className="mt-4 max-w-5xl rounded-card border border-line bg-surface p-5 sm:p-6">
          <h2 className="font-sans text-[15px] font-medium text-muted">Largest recordings</h2>
          <ol className="mt-3 divide-y divide-line">
            {storage.largest.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-4 py-3">
                <a href={`/v/${workspace.space}/${v.id}`} target="_blank" className="min-w-0 truncate font-medium hover:underline hover:underline-offset-2">
                  {v.title || "Untitled recording"}
                </a>
                <span className="tabular shrink-0 text-sm text-muted">{size(v.bytes)}</span>
              </li>
            ))}
          </ol>
          <Note>Deleting a recording from your library frees its space straight away.</Note>
        </section>
      )}

      <p className="mt-8 max-w-5xl text-sm leading-relaxed text-faint">
        Each recording&rsquo;s size is measured when it finishes
        {usage.database.bytes !== null && `, and your database uses ${size(usage.database.bytes)} of its free 5 GB`}. Requests and operations
        are counted by your video backend since {new Date(`${usage.countingSince}T00:00:00Z`).toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" })}, so they&rsquo;re close but not exact. Cloudflare has the exact numbers:{" "}
        <a href={`${dash}/r2/overview`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-text">
          R2 storage
        </a>{" "}
        and{" "}
        <a href={`${dash}/workers-and-pages`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-text">
          Workers
        </a>
        .
      </p>
    </main>
  );
}
