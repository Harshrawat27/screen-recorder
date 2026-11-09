import { NextResponse } from "next/server";
import { getWorkspace } from "@/lib/db";
import { clearSearchCache } from "@/lib/search";
import { getSession } from "@/lib/session";
import { TITLE_MAX, VIDEO_ID, deleteVideo, renameVideo } from "@/lib/video-files";

// Rename (PATCH) or delete (DELETE) one of your own recordings.

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

async function ownWorkspace(params: Params["params"]) {
  const { id } = await params;
  if (!VIDEO_ID.test(id)) return { error: NextResponse.json({ error: "bad_id" }, { status: 400 }) };
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "sign_in" }, { status: 401 }) };
  const ws = await getWorkspace(session.user.id);
  if (!ws) return { error: NextResponse.json({ error: "not_connected" }, { status: 409 }) };
  return { ws, id };
}

export async function PATCH(request: Request, { params }: Params) {
  const found = await ownWorkspace(params);
  if ("error" in found) return found.error;
  const input = (await request.json().catch(() => ({}))) as { title?: unknown };
  const title = String(input.title ?? "").replace(/\s+/g, " ").trim();
  if (!title) return NextResponse.json({ error: "empty" }, { status: 400 });
  if (title.length > TITLE_MAX) return NextResponse.json({ error: "too_long" }, { status: 400 });
  try {
    const ok = await renameVideo(found.ws, found.id, title);
    clearSearchCache(found.ws.id);
    return ok ? NextResponse.json({ title }) : NextResponse.json({ error: "not_found" }, { status: 404 });
  } catch (err) {
    console.error("Rename failed", err);
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const found = await ownWorkspace(params);
  if ("error" in found) return found.error;
  try {
    await deleteVideo(found.ws, found.id);
    clearSearchCache(found.ws.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete failed", err);
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
