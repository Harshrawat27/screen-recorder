import { NextResponse } from "next/server";
import { getWorkspace } from "@/lib/db";
import { search } from "@/lib/search";
import { getSession } from "@/lib/session";

// GET /api/search?q=… for the dashboard's command palette. An empty query returns recent videos.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "sign_in" }, { status: 401 });
  const ws = await getWorkspace(session.user.id);
  if (!ws) return NextResponse.json({ videos: [] });
  const q = (new URL(request.url).searchParams.get("q") ?? "").slice(0, 200);
  try {
    return NextResponse.json(await search(ws, q));
  } catch {
    return NextResponse.json({ error: "unreachable" }, { status: 502 });
  }
}
