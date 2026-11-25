import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { type AcceptResult, CURRENT_TEAM_COOKIE, acceptInvite, getInvite } from "@/lib/team";

// POST { token }: join the team behind an invite link. The dashboard then shows that team.

export const dynamic = "force-dynamic";

const messages: Record<Exclude<AcceptResult, "ok">, string> = {
  not_found: "This invite link doesn't work any more. Ask for a new one.",
  used: "This invite has already been used. Ask for a new one.",
  wrong_email: "This invite is for a different email. Sign in with the account it was sent to.",
  own_invite: "This is your own team's invite.",
  admin_needs_update: "The team's admin needs to update their video backend first. Ask them to press Update in their dashboard.",
  admin_not_connected: "The team's admin hasn't connected Cloudflare yet. Try again once they have.",
};

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { token } = (await request.json().catch(() => ({}))) as { token?: unknown };
  const result = await acceptInvite(String(token ?? ""), session.user);
  if (result !== "ok") return NextResponse.json({ error: messages[result], reason: result }, { status: 409 });
  const invite = await getInvite(String(token));
  if (invite) (await cookies()).set(CURRENT_TEAM_COOKIE, invite.owner.id, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production" });
  return NextResponse.json({ ok: true });
}
