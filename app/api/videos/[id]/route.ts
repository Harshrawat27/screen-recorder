import { NextResponse } from "next/server";
import { canManage } from "@/lib/team-access";
import { getTeamContext, teamsEnabled } from "@/lib/team";
import { FOLDER_ID, foldersEnabled } from "@/lib/folders";
import { clearSearchCache } from "@/lib/search";
import { getSession } from "@/lib/session";
import { TITLE_MAX, VIDEO_ID, deleteVideo, getVideo, moveVideo, renameVideo, setVisibility } from "@/lib/video-files";

// Rename (PATCH) or delete (DELETE) one of your own recordings.

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * The workspace a recording is in, if the signed-in person may change it: the admin may change
 * any recording; a team member only the ones they recorded.
 */
async function ownWorkspace(params: Params["params"]) {
  const { id } = await params;
  if (!VIDEO_ID.test(id)) return { error: NextResponse.json({ error: "bad_id" }, { status: 400 }) };
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "sign_in" }, { status: 401 }) };
  const team = await getTeamContext(session.user);
  const ws = team.workspace;
  if (!ws) return { error: NextResponse.json({ error: "not_connected" }, { status: 409 }) };
  if (team.role === "member") {
    const video = await getVideo(ws, id).catch(() => null);
    if (!video) return { error: NextResponse.json({ error: "not_found" }, { status: 404 }) };
    if (!canManage(video, session.user.id, ws.owner_id)) return { error: NextResponse.json({ error: "not_yours" }, { status: 403 }) };
  }
  return { ws, id };
}

export async function PATCH(request: Request, { params }: Params) {
  const found = await ownWorkspace(params);
  if ("error" in found) return found.error;
  const input = (await request.json().catch(() => ({}))) as { title?: unknown; folderId?: unknown; visibility?: unknown; sharedWith?: unknown };

  // Who can find it in the team's dashboard.
  if ("visibility" in input) {
    if (!teamsEnabled(found.ws)) return NextResponse.json({ error: "update_needed" }, { status: 409 });
    const visibility = input.visibility === "chosen" ? "chosen" : "team";
    const sharedWith = Array.isArray(input.sharedWith) ? input.sharedWith.filter((v): v is string => typeof v === "string").slice(0, 200) : [];
    try {
      const status = await setVisibility(found.ws, found.id, visibility, sharedWith);
      return status === 200 ? NextResponse.json({ visibility, sharedWith }) : NextResponse.json({ error: "not_found" }, { status: 404 });
    } catch (err) {
      console.error("Visibility change failed", err);
      return NextResponse.json({ error: "failed" }, { status: 502 });
    }
  }

  // Move to a folder, or back to the library with folderId: null.
  if ("folderId" in input) {
    const folderId = input.folderId === null ? null : String(input.folderId);
    if (folderId !== null && !FOLDER_ID.test(folderId)) return NextResponse.json({ error: "bad_folder" }, { status: 400 });
    if (!foldersEnabled(found.ws)) return NextResponse.json({ error: "update_needed" }, { status: 409 });
    try {
      const status = await moveVideo(found.ws, found.id, folderId);
      return status === 200 ? NextResponse.json({ folderId }) : NextResponse.json({ error: "not_found" }, { status: 404 });
    } catch (err) {
      console.error("Move failed", err);
      return NextResponse.json({ error: "failed" }, { status: 502 });
    }
  }

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
