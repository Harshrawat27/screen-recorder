import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { CURRENT_TEAM_COOKIE, teamChoices } from "@/lib/team";

// POST { ownerId }: which team the dashboard shows (their own is their own id).

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { ownerId } = (await request.json().catch(() => ({}))) as { ownerId?: unknown };
  const choices = await teamChoices(session.user, true);
  if (typeof ownerId !== "string" || !choices.some((c) => c.ownerId === ownerId)) {
    return NextResponse.json({ error: "You're not on that team." }, { status: 404 });
  }
  (await cookies()).set(CURRENT_TEAM_COOKIE, ownerId, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production" });
  return NextResponse.json({ ok: true });
}
