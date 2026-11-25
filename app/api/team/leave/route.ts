import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getMembership, removeMember } from "@/lib/team";

// POST { ownerId }: a member leaves that team. Their videos stay in the admin's Cloudflare.

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { ownerId } = (await request.json().catch(() => ({}))) as { ownerId?: unknown };
  const membership = typeof ownerId === "string" ? await getMembership(session.user.id, ownerId) : null;
  if (!membership) return NextResponse.json({ error: "You're not on that team." }, { status: 404 });
  await removeMember(membership.owner_id, session.user.id);
  return NextResponse.json({ ok: true });
}
