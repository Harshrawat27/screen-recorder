import { NextResponse } from "next/server";
import { markExtensionConnected } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  await markExtensionConnected(session.user.id);
  return NextResponse.json({ ok: true });
}
