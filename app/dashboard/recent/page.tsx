import type { Metadata } from "next";
import { EmptyState, PageHeader, emptyIcon } from "@/components/dashboard-ui";
import { SavedVideos } from "@/components/saved-videos";
import { pages } from "@/lib/dashboard-pages";
import { getWorkspace } from "@/lib/db";
import { getPersonal, personalEnabled, resolveVideos } from "@/lib/personal";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: pages.recent.title, robots: { index: false } };

export default async function RecentPage() {
  const { user } = await requireSession();
  const workspace = await getWorkspace(user.id);
  const header = <PageHeader title={pages.recent.title} description={pages.recent.description} />;
  const icon = emptyIcon(<><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" /><path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></>);

  if (!personalEnabled(workspace)) {
    return (
      <main className="px-5 py-8 sm:px-10 sm:py-10">
        {header}
        <EmptyState
          icon={icon}
          title={workspace ? "Update to turn this on" : "Connect Cloudflare first"}
          body={
            workspace
              ? "This list is kept in your own Cloudflare. Press Update in the sidebar to add it; it takes about 30 seconds."
              : "This list is kept in your own Cloudflare, so it starts working once you connect it from your library."
          }
        />
      </main>
    );
  }

  const videos = await resolveVideos(await getPersonal(workspace, user.id, "recent"));
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      {header}
      {videos.length ? <SavedVideos videos={videos} kind="recent" /> : <EmptyState icon={icon} title="Nothing here yet" body="Videos you watch, yours or shared with you, show up here. The last 25 are kept." />}
    </main>
  );
}
