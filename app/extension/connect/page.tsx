import type { Metadata } from "next";
import Link from "next/link";
import { ExtensionHandoff } from "@/components/extension-handoff";
import { Logo } from "@/components/header";
import { buttonClass } from "@/components/ui";
import { MEDIA_URL } from "@/lib/config";
import { firstName, getMemberships, getTeamContext, listMembers, memberKey } from "@/lib/team";
import { getWorkspace } from "@/lib/db";
import { requestOrigin } from "@/lib/origin";
import { requireSession } from "@/lib/session";
import { getAccess } from "@/lib/billing";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Connect the extension", robots: { index: false } };

export default async function ExtensionConnectPage({ searchParams }: { searchParams: Promise<{ after?: string }> }) {
  // Straight after joining a team: connect quietly, then carry on to the dashboard.
  const afterJoin = (await searchParams).after === "join";
  const { user } = await requireSession();
  if (!(await getAccess(user)).paid) redirect("/pricing?locked");
  const team = await getTeamContext(user);
  const workspace = team.workspace;
  const origin = await requestOrigin();
  // Admins' extensions use the workspace key. A team member's extension gets its own key, which
  // can only upload their recordings (and stops working if they're removed from the team).
  let uploadKey = workspace?.upload_key ?? "";
  let keyError = false;
  if (workspace && team.role === "member") {
    uploadKey = await memberKey(workspace, user.id).catch((err) => {
      console.error("Could not create the member's extension key", err);
      keyError = true;
      return "";
    });
  }

  // Every team they're still on, so the extension can forget the ones they've left.
  const ownerIds = [user.id, ...(await getMemberships(user.id)).map((m) => m.owner_id)];
  const teams = (await Promise.all(ownerIds.map((id) => getWorkspace(id)))).flatMap((ws) => (ws ? [ws.space] : []));

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-6xl px-5 py-5 sm:px-8">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-24">
        <div className="w-full max-w-[480px] rounded-panel border border-line bg-surface p-8 shadow-pop sm:p-10">
          {workspace && keyError ? (
            <div>
              <h1 className="text-[28px] font-bold tracking-[-0.02em]">Your team&rsquo;s video backend needs an update</h1>
              <p className="mt-2 text-muted">Ask your admin to press Update in their dashboard, then come back here.</p>
              <Link href="/dashboard" className={buttonClass("primary", "md", "mt-8")}>
                Go to dashboard
              </Link>
            </div>
          ) : workspace ? (
            <ExtensionHandoff
              afterJoin={afterJoin}
              config={{
                version: 1,
                email: user.email,
                userId: user.id,
                space: workspace.space,
                uploadUrl: workspace.worker_url,
                uploadKey,
                // Which team this connection records into, for the extension's "Save to" picker.
                ownerId: team.ownerId,
                teamName: team.role === "member" ? `${firstName(team.owner)}'s team` : (await listMembers(user.id)).length ? "Your team" : "Personal",
                mediaBase: `${MEDIA_URL}/${workspace.space}`,
                playerBase: `${origin}/v/${workspace.space}`,
                teams,
              }}
            />
          ) : (
            <div>
              <h1 className="text-[28px] font-bold tracking-[-0.02em]">Connect Cloudflare first</h1>
              <p className="mt-2 text-muted">
                {team.role === "member"
                  ? "Your team's admin hasn't connected Cloudflare yet. Once they do, come back here to connect your extension."
                  : "The extension needs to know where to save your videos. Connect Cloudflare from your dashboard (just one click, we handle the rest), then come back."}
              </p>
              <Link href="/dashboard" className={buttonClass("primary", "md", "mt-8")}>
                Go to dashboard
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
