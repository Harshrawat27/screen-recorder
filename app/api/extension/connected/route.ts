import { NextResponse, after } from "next/server";
import { track } from "@/lib/analytics";
import { markExtensionConnected } from "@/lib/db";
import { getTeamContext, markMemberExtensionConnected } from "@/lib/team";
import { getSession } from "@/lib/session";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  // Admins' connection is noted on their workspace; members' on their team membership.
  // The team shown in the dashboard is the one the extension was just connected to.
  const team = await getTeamContext(session.user);
  if (team.role === "member") await markMemberExtensionConnected(session.user.id, team.ownerId);
  else await markExtensionConnected(session.user.id);
  after(() => track(session.user.id, "extension_connected", {}, `extension-${session.user.id}`));
  return NextResponse.json({ ok: true });
}
