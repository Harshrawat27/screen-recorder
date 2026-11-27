import { NextResponse } from "next/server";
import { can, ownerAccess, setHideBadge } from "@/lib/plan";
import { getSession } from "@/lib/session";
import { planRequired } from "@/lib/plan-response";

// Paid plan: hide or show "Recorded with Showthrough" on your own videos' share pages.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  if (!can(await ownerAccess(session.user.id), "hideBadge")) return planRequired();
  const input = (await request.json().catch(() => ({}))) as { hide?: unknown };
  await setHideBadge(session.user.id, input.hide === true);
  return NextResponse.json({ ok: true, hide: input.hide === true });
}
