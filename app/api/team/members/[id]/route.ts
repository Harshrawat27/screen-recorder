import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { removeMember } from "@/lib/team";

// DELETE: the admin removes someone from their team. Their extension stops working at once;
// the videos they recorded stay in the admin's Cloudflare.

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const removed = await removeMember(session.user.id, id);
  return removed ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "They're not on your team." }, { status: 404 });
}
