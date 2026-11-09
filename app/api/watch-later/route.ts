import { NextResponse } from "next/server";
import { getWorkspace } from "@/lib/db";
import { addPersonal, getPersonal, personalEnabled, removePersonal } from "@/lib/personal";
import { getSession } from "@/lib/session";

// Watch later for the signed-in person. Saved in their own workspace's D1.
//   GET    ?space=…&videoId=…   is it saved? (and can this person save at all)
//   POST   { space, videoId }   save
//   DELETE { space, videoId }   remove

export const dynamic = "force-dynamic";

const SPACE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const ID = /^[a-z0-9]{8,64}$/;

async function viewer() {
  const session = await getSession();
  if (!session) return null;
  const ws = await getWorkspace(session.user.id);
  return personalEnabled(ws) ? { userId: session.user.id, ws } : null;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const space = params.get("space") ?? "";
  const videoId = params.get("videoId") ?? "";
  const me = await viewer();
  if (!me || !SPACE.test(space) || !ID.test(videoId)) return NextResponse.json({ enabled: Boolean(me), saved: false });
  const items = await getPersonal(me.ws, me.userId, "watch_later");
  return NextResponse.json({ enabled: true, saved: items.some((i) => i.space === space && i.videoId === videoId) });
}

async function change(request: Request, add: boolean) {
  const me = await viewer();
  if (!me) return NextResponse.json({ error: "not_available" }, { status: 409 });
  const input = (await request.json().catch(() => ({}))) as { space?: string; videoId?: string };
  const space = String(input.space ?? "");
  const videoId = String(input.videoId ?? "");
  if (!SPACE.test(space) || !ID.test(videoId)) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  try {
    await (add ? addPersonal : removePersonal)(me.ws, me.userId, "watch_later", space, videoId);
    return NextResponse.json({ saved: add });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}

export const POST = (request: Request) => change(request, true);
export const DELETE = (request: Request) => change(request, false);
