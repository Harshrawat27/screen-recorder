import { NextResponse } from "next/server";
import { requestOrigin } from "@/lib/origin";
import { getSession } from "@/lib/session";
import { createInvite, revokeInvite, teamsEnabled } from "@/lib/team";
import { getWorkspace } from "@/lib/db";
import { ownerFeatures } from "@/lib/plan";
import { planRequired } from "@/lib/plan-response";

// The admin's invites. POST { email }: an invite link for that person (the same link if they
// were already invited). DELETE { token }: cancel an invite that hasn't been used.

export const dynamic = "force-dynamic";

async function admin() {
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "Sign in first." }, { status: 401 }) };
  // Invites are always to your own team: a paid feature of your own plan.
  if (!(await ownerFeatures(session.user.id)).team) return { error: planRequired() };
  const ws = await getWorkspace(session.user.id);
  if (!ws) return { error: NextResponse.json({ error: "Connect Cloudflare first." }, { status: 409 }) };
  if (!teamsEnabled(ws)) return { error: NextResponse.json({ error: "Press Update in the sidebar to invite your team." }, { status: 409 }) };
  return { userId: session.user.id };
}

export async function POST(request: Request) {
  const me = await admin();
  if ("error" in me) return me.error;
  const { email } = (await request.json().catch(() => ({}))) as { email?: unknown };
  const result = await createInvite(me.userId, String(email ?? ""));
  if (result === "bad_email") return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  if (result === "self") return NextResponse.json({ error: "That's your own email." }, { status: 400 });
  if (result === "already_member") return NextResponse.json({ error: "They're already on your team." }, { status: 409 });
  const origin = await requestOrigin();
  return NextResponse.json({ invite: { ...result, link: `${origin}/join/${result.token}` } });
}

export async function DELETE(request: Request) {
  const me = await admin();
  if ("error" in me) return me.error;
  const { token } = (await request.json().catch(() => ({}))) as { token?: unknown };
  await revokeInvite(me.userId, String(token ?? ""));
  return NextResponse.json({ ok: true });
}
