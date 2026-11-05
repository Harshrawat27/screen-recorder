import { NextResponse } from "next/server";
import { markExtensionConnected } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getAccess } from "@/lib/billing";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  if (!(await getAccess(session.user)).paid) return NextResponse.json({ error: "Not purchased." }, { status: 402 });
  await markExtensionConnected(session.user.id);
  return NextResponse.json({ ok: true });
}
