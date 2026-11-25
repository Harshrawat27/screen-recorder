import { NextResponse } from "next/server";
import { getWorkspaceBySpace } from "@/lib/db";
import { getSession } from "@/lib/session";
import { teamPeople } from "@/lib/team";
import { canManage } from "@/lib/team-access";
import { getVideo, setVisibility } from "@/lib/video-files";

// "Who can see this" on the video page. Found by the video's own space, not by the team the
// viewer has open in the dashboard, so it works from any share link. Only the admin and whoever
// recorded the video can see or change it, and only on a team.

export const dynamic = "force-dynamic";

const SPACE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const ID = /^[a-z0-9]{8,64}$/;
type Params = { params: Promise<{ space: string; id: string }> };

async function load(params: Params["params"]) {
  const { space, id } = await params;
  if (!SPACE.test(space) || !ID.test(id)) return null;
  const session = await getSession();
  if (!session) return null;
  const ws = await getWorkspaceBySpace(space);
  if (!ws || ws.worker_version < 7) return null;
  const video = await getVideo(ws, id).catch(() => null);
  if (!video || !canManage(video, session.user.id, ws.owner_id)) return null;
  const people = await teamPeople(ws.owner_id);
  if (people.length < 2) return null; // no team yet: nothing to choose
  return { ws, id, video, people };
}

export async function GET(_request: Request, { params }: Params) {
  const found = await load(params);
  if (!found) return NextResponse.json({ enabled: false });
  const { ws, video, people } = found;
  return NextResponse.json({
    enabled: true,
    title: video.title ?? "Untitled video",
    recordedBy: video.recordedBy ?? null,
    visibility: video.visibility ?? "team",
    sharedWith: video.sharedWith ?? [],
    team: { ownerId: ws.owner_id, people: people.map(({ id, name, email }) => ({ id, name, email })) },
  });
}

export async function PATCH(request: Request, { params }: Params) {
  const found = await load(params);
  if (!found) return NextResponse.json({ error: "not_allowed" }, { status: 403 });
  const input = (await request.json().catch(() => ({}))) as { visibility?: unknown; sharedWith?: unknown };
  const visibility = input.visibility === "chosen" ? "chosen" : "team";
  const sharedWith = Array.isArray(input.sharedWith) ? input.sharedWith.filter((v): v is string => typeof v === "string").slice(0, 200) : [];
  try {
    const status = await setVisibility(found.ws, found.id, visibility, sharedWith);
    return status === 200 ? NextResponse.json({ visibility, sharedWith }) : NextResponse.json({ error: "not_found" }, { status: 404 });
  } catch (err) {
    console.error("Could not save who can see the video", err);
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
