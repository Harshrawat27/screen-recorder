import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EmptyState, PageHeader, emptyIcon } from "@/components/dashboard-ui";
import { LibraryView } from "@/components/library-ui";
import { listVideos } from "@/lib/cloudflare";
import { foldersEnabled, listFolders } from "@/lib/folders";
import { toLibraryVideos, videosBy } from "@/lib/library";
import { getPersonal, personalEnabled } from "@/lib/personal";
import { requireSession } from "@/lib/session";
import { firstName, getTeamContext, teamPeople, teamsEnabled } from "@/lib/team";

export const metadata: Metadata = { title: "Team member", robots: { index: false } };

// One person's recordings, as the viewer is allowed to see them: everything for the admin,
// what's shared with the team (or with the viewer) for members.
export default async function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requireSession();
  if (id === user.id) redirect("/dashboard");
  const team = await getTeamContext(user);
  const ws = team.workspace;
  if (!ws || !teamsEnabled(ws)) notFound();
  const people = await teamPeople(team.ownerId);
  const person = people.find((p) => p.id === id);
  if (!person) notFound();

  const [library, folders, later] = await Promise.all([
    listVideos(ws.worker_url, ws.upload_key),
    listFolders(ws),
    personalEnabled(ws) ? getPersonal(ws, user.id, "watch_later") : null,
  ]);
  const videos = videosBy(library.videos, ws, person.id, user.id);
  const isAdmin = team.role === "owner";

  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
        <Link href="/dashboard/team" className="hover:text-text hover:underline hover:underline-offset-2">
          Team
        </Link>
        <span aria-hidden className="mx-2 text-faint">
          /
        </span>
        <span className="text-text">{person.name}</span>
      </nav>
      <PageHeader
        title={`${firstName(person)}'s videos`}
        description={isAdmin ? "Everything they've recorded." : "What they've shared with the team or with you."}
      />

      {!library.reachable && (
        <p role="alert" className="mt-8 max-w-3xl rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-ink">
          We couldn&rsquo;t reach the team&rsquo;s video backend just now. Refresh in a moment.
        </p>
      )}

      {videos.length ? (
        <LibraryView
          author={{ name: person.name, image: person.image }}
          folders={[]}
          folderOptions={folders.map((f) => ({ id: f.id, name: f.name }))}
          foldersEnabled={foldersEnabled(ws)}
          scope={null}
          space={ws.space}
          watchLater={later?.filter((i) => i.space === ws.space).map((i) => i.videoId)}
          videos={toLibraryVideos(videos, ws, user.id)}
          team={{ people: people.map(({ id: pid, name, email }) => ({ id: pid, name, email })), ownerId: team.ownerId }}
        />
      ) : (
        <EmptyState
          icon={emptyIcon(
            <>
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
              <path d="M10 9.5v5l4-2.5z" fill="currentColor" />
            </>,
          )}
          title="No videos yet"
          body={isAdmin ? `${firstName(person)} hasn't recorded anything yet.` : `${firstName(person)} hasn't shared any videos with you yet.`}
        />
      )}
    </main>
  );
}
