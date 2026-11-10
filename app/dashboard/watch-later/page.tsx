import type { Metadata } from "next";
import { EmptyState, PageHeader, emptyIcon } from "@/components/dashboard-ui";
import { SavedVideos } from "@/components/saved-videos";
import { pages } from "@/lib/dashboard-pages";
import { getWorkspace } from "@/lib/db";
import { getPersonal, personalEnabled, resolveVideos } from "@/lib/personal";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: pages.watchLater.title, robots: { index: false } };

export default async function WatchLaterPage() {
  const { user } = await requireSession();
  const workspace = await getWorkspace(user.id);
  const header = <PageHeader title={pages.watchLater.title} description={pages.watchLater.description} />;
  const icon = emptyIcon(<path d="M7 4h10a1.2 1.2 0 0 1 1.2 1.2V20L12 16l-6.2 4V5.2A1.2 1.2 0 0 1 7 4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />);

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
              : "This list is kept in your own Cloudflare, so it starts working once you connect it from your library. That’s one click, and we handle the rest."
          }
        />
      </main>
    );
  }

  const videos = await resolveVideos(await getPersonal(workspace, user.id, "watch_later"));
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      {header}
      {videos.length ? <SavedVideos videos={videos} kind="watch_later" /> : <EmptyState icon={icon} title="No saved videos" body="Choose Watch later in a video’s menu, or under any video you’re watching, and it waits for you here." />}
    </main>
  );
}
