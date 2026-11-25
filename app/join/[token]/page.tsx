import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/header";
import { JoinTeamButton, SwitchAccountButton } from "@/components/team-ui";
import { buttonClass } from "@/components/ui";
import { getSession } from "@/lib/session";
import { firstName, getInvite, getMembership } from "@/lib/team";

export const metadata: Metadata = { title: "Join a team", robots: { index: false } };

// An invite link: /join/<token>. Sign in first, then join with one click.
export default async function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(`/join/${token}`)}`);
  const invite = await getInvite(token);
  const alreadyIn = Boolean(invite && (await getMembership(session.user.id, invite.owner.id)));
  const back = `/join/${token}`;

  let body: React.ReactNode;
  if (!invite) {
    body = (
      <>
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">This invite doesn&rsquo;t work</h1>
        <p className="mt-2 text-muted">The link may have been cancelled. Ask the person who invited you for a new one.</p>
        <Link href="/dashboard" className={buttonClass("primary", "md", "mt-8")}>
          Go to dashboard
        </Link>
      </>
    );
  } else if (alreadyIn) {
    body = (
      <>
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">You&rsquo;re on {firstName(invite.owner)}&rsquo;s team</h1>
        <p className="mt-2 text-muted">You already joined. Your recordings go to the team&rsquo;s library.</p>
        <Link href="/dashboard" className={buttonClass("primary", "md", "mt-8")}>
          Go to dashboard
        </Link>
      </>
    );
  } else {
    const wrongEmail = invite.email.toLowerCase() !== session.user.email.toLowerCase();
    body = (
      <>
        <p className="text-sm font-semibold text-muted">Team invite</p>
        <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-[-0.02em]">
          Join {invite.owner.name}&rsquo;s team on Showthrough
        </h1>
        <p className="mt-3 text-muted">
          You&rsquo;ll record with your own account, and your videos are saved in the team&rsquo;s storage. Nothing to pay: the team&rsquo;s
          license covers you. Already on other teams, or have your own library? Keep them: you switch between them in the dashboard.
        </p>
        {wrongEmail ? (
          <>
            <p role="alert" className="mt-6 rounded-control border border-line bg-sunken px-4 py-3 text-sm">
              This invite is for <span className="font-semibold">{invite.email}</span>, but you&rsquo;re signed in as{" "}
              <span className="font-semibold">{session.user.email}</span>.
            </p>
            <div className="mt-4">
              <SwitchAccountButton back={back} label={`Sign in as ${invite.email}`} />
            </div>
          </>
        ) : (
          <JoinTeamButton token={invite.token} />
        )}
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-6xl px-5 py-5 sm:px-8">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-24">
        <div className="w-full max-w-[480px] rounded-panel border border-line bg-surface p-8 shadow-pop sm:p-10">{body}</div>
      </main>
    </div>
  );
}
