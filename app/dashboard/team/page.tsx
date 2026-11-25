import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, PageHeader } from "@/components/dashboard-ui";
import { LeaveTeamButton, RemoveMemberButton, TeamInvites } from "@/components/team-ui";
import { buttonClass } from "@/components/ui";
import { getAccess } from "@/lib/billing";
import { listVideos } from "@/lib/cloudflare";
import { pages } from "@/lib/dashboard-pages";
import { requestOrigin } from "@/lib/origin";
import { requireSession } from "@/lib/session";
import { canSee, recorderOf } from "@/lib/team-access";
import { type Person, firstName, getTeamContext, listInvites, listMembers, teamPeople, teamsEnabled } from "@/lib/team";

export const metadata: Metadata = { title: pages.team.title, robots: { index: false } };

function Message({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <section className="mt-10 max-w-2xl rounded-panel border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-xl">{title}</h2>
      <p className="mt-2 text-muted">{body}</p>
      {action}
    </section>
  );
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function PersonRow({
  person,
  note,
  videos,
  actions,
}: {
  person: Person;
  note: string;
  videos: number | null;
  actions?: React.ReactNode;
}) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
      <Avatar name={person.name} image={person.image} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{person.name}</p>
        <p className="truncate text-sm text-muted">
          {person.email} · {note}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {videos !== null && (
          <Link href={`/dashboard/team/${encodeURIComponent(person.id)}`} className={buttonClass("secondary", "sm")}>
            {plural(videos, "video")}
          </Link>
        )}
        {actions}
      </div>
    </li>
  );
}

export default async function TeamPage() {
  const { user } = await requireSession();
  const [team, access] = await Promise.all([getTeamContext(user), getAccess(user)]);
  const member = team.role === "member";
  const ws = team.workspace;
  const header = (
    <PageHeader
      title={member ? "Team" : pages.team.title}
      description={member ? `You're on ${firstName(team.owner)}'s team.` : pages.team.description}
    />
  );
  const frame = (body: React.ReactNode) => (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      {header}
      {body}
    </main>
  );

  if (!member && !access.paid) {
    return frame(
      <Message
        title="Buy Showthrough to add your team"
        body="One purchase covers everyone you invite, with no per-seat pricing."
        action={
          <Link href="/pricing" className={buttonClass("primary", "md", "mt-6")}>
            See pricing
          </Link>
        }
      />,
    );
  }
  if (!ws) {
    return frame(
      member ? (
        <Message title="Waiting for your admin" body={`${firstName(team.owner)} hasn't connected Cloudflare yet. Your team's videos will be stored there.`} />
      ) : (
        <Message
          title="Connect Cloudflare first"
          body="Your team records into your Cloudflare, so connect it first. It's one click from your library, and we handle the rest."
          action={
            <Link href="/dashboard" className={buttonClass("primary", "md", "mt-6")}>
              Go to your library
            </Link>
          }
        />
      ),
    );
  }
  if (!teamsEnabled(ws)) {
    return frame(
      <Message
        title="Update to add your team"
        body={
          member
            ? `Teams need the latest version of the video backend. Ask ${firstName(team.owner)} to update.`
            : "Team members come with the latest version of your video backend. Press Update in the sidebar; it takes about 30 seconds and keeps everything as it is."
        }
      />,
    );
  }

  const [members, people, library, invites, origin] = await Promise.all([
    listMembers(team.ownerId),
    teamPeople(team.ownerId),
    listVideos(ws.worker_url, ws.upload_key),
    member ? [] : listInvites(team.ownerId),
    requestOrigin(),
  ]);
  // How many of each person's videos the viewer can find.
  const count = (personId: string) =>
    library.videos.filter((v) => recorderOf(v, ws.owner_id) === personId && canSee(v, user.id, ws.owner_id)).length;
  const admin = people.find((p) => p.id === team.ownerId) ?? team.owner;

  return frame(
    <>
      {!member && <TeamInvites initial={invites.map((i) => ({ token: i.token, email: i.email, link: `${origin}/join/${i.token}` }))} />}

      <section className="mt-8 max-w-3xl rounded-panel border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-xl">People</h2>
        <p className="mt-1.5 text-muted">
          {member
            ? "Open someone's videos to watch what they've shared with the team."
            : "Open someone's videos to see everything they've recorded."}
        </p>
        <ul className="mt-4 divide-y divide-line border-t border-line">
          <PersonRow
            person={admin}
            note={admin.id === user.id ? "You · Admin" : "Admin"}
            videos={admin.id === user.id ? null : count(admin.id)}
          />
          {members.map((m) => (
            <PersonRow
              key={m.id}
              person={m}
              note={m.id === user.id ? "You" : m.extensionConnected ? "Recording" : "Hasn't connected the extension yet"}
              videos={m.id === user.id ? null : count(m.id)}
              actions={!member ? <RemoveMemberButton id={m.id} name={firstName(m)} /> : null}
            />
          ))}
        </ul>
        {!member && members.length === 0 && <p className="mt-4 text-sm text-muted">No one else yet. Invite someone above.</p>}
      </section>

      {member && (
        <section className="mt-8 max-w-3xl rounded-panel border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-xl">Leave the team</h2>
          <p className="mt-1.5 text-muted">Your recordings stay in the team&rsquo;s Cloudflare.</p>
          <div className="mt-5">
            <LeaveTeamButton admin={firstName(team.owner)} ownerId={team.ownerId} space={ws.space} />
          </div>
        </section>
      )}
    </>,
  );
}
