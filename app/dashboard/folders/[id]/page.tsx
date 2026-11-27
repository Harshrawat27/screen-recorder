import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard-ui";
import { FolderActions } from "@/components/folder-ui";
import { LibraryView } from "@/components/library-ui";
import { listVideos } from "@/lib/cloudflare";
import { getTeamContext, teamPeople, teamsEnabled } from "@/lib/team";
import { FOLDER_ID, foldersEnabled, listFolders } from "@/lib/folders";
import { toLibraryVideos, visibleTo } from "@/lib/library";
import { getPersonal, personalEnabled } from "@/lib/personal";
import { requireSession } from "@/lib/session";
import { ownerFeatures } from "@/lib/plan";

export const metadata: Metadata = { title: "Folder", robots: { index: false } };

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!FOLDER_ID.test(id)) notFound();
  const { user } = await requireSession();
  const team = await getTeamContext(user);
  const workspace = team.workspace;
  const features = await ownerFeatures(team.ownerId);
  if (!workspace || !foldersEnabled(workspace)) notFound();

  const [folders, library, later, people] = await Promise.all([
    listFolders(workspace),
    listVideos(workspace.worker_url, workspace.upload_key),
    personalEnabled(workspace) ? getPersonal(workspace, user.id, "watch_later") : null,
    features.team && teamsEnabled(workspace) ? teamPeople(team.ownerId) : [],
  ]);
  const folder = folders.find((f) => f.id === id);
  if (!folder) notFound();

  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
        <Link href="/dashboard" className="hover:text-text hover:underline hover:underline-offset-2">
          My library
        </Link>
        <span aria-hidden className="mx-2 text-faint">
          /
        </span>
        <span className="text-text">{folder.name}</span>
      </nav>
      <PageHeader title={folder.name} description={`${folder.videos} video${folder.videos === 1 ? "" : "s"}`}>
        {/* A team's folders are shared; renaming or deleting them is for the admin. */}
        {team.role === "owner" && <FolderActions id={folder.id} name={folder.name} />}
      </PageHeader>

      {!library.reachable && (
        <p role="alert" className="mt-8 max-w-3xl rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-ink">
          We couldn&rsquo;t reach your video backend just now. Refresh in a moment.
        </p>
      )}

      <LibraryView
        author={{ name: user.name, image: user.image }}
        folders={[]}
        folderOptions={folders.map((f) => ({ id: f.id, name: f.name }))}
        foldersEnabled
        scope={folder.id}
        space={workspace.space}
        watchLater={later?.filter((i) => i.space === workspace.space).map((i) => i.videoId)}
        videos={toLibraryVideos(visibleTo(library.videos, workspace, user.id), workspace, user.id)}
        team={people.length > 1 ? { people: people.map(({ id, name, email }) => ({ id, name, email })), ownerId: team.ownerId } : null}
      />
    </main>
  );
}
