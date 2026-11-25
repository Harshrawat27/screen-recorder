import { NextResponse } from "next/server";
import { type Workspace, getWorkspaceBySpace } from "@/lib/db";
import { type Cta, cleanButtons, readButtons } from "@/lib/cta";
import { getSession } from "@/lib/session";
import { managesVideo } from "@/lib/video-files";

// The call-to-action buttons on a shared video.
//   GET  anyone: the buttons, and whether you're the owner
//   PUT  owner only: { buttons: [{ label, url }, ...] }   (an empty list removes them all)
// They're stored in the owner's Cloudflare as videos/<id>/cta.json. Only this route writes it,
// with the upload key we hold; viewers never get that key.

export const dynamic = "force-dynamic";

const SPACE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const ID = /^[a-z0-9]{8,64}$/;

type Params = { params: Promise<{ space: string; id: string }> };

async function resolve(params: Params["params"]) {
  const { space, id } = await params;
  if (!SPACE.test(space) || !ID.test(id)) return null;
  const ws = await getWorkspaceBySpace(space);
  return ws ? { ws, id } : null;
}

const fileUrl = (ws: Workspace, id: string) => `${ws.worker_url}/videos/${id}/cta.json`;
const uploadUrl = (ws: Workspace, id: string) => `${ws.worker_url}/api/upload/videos/${id}/cta.json`;

async function readCta(ws: Workspace, id: string): Promise<Cta[]> {
  try {
    const res = await fetch(fileUrl(ws, id), { cache: "no-store", signal: AbortSignal.timeout(4000) });
    return res.ok ? readButtons(await res.json()) : [];
  } catch {
    return [];
  }
}

export async function GET(_request: Request, { params }: Params) {
  const found = await resolve(params);
  if (!found) return NextResponse.json({ buttons: [], isOwner: false });
  const [buttons, session] = await Promise.all([readCta(found.ws, found.id), getSession()]);
  return NextResponse.json({ buttons, isOwner: await managesVideo(found.ws, found.id, session?.user.id) });
}

export async function PUT(request: Request, { params }: Params) {
  const found = await resolve(params);
  if (!found) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const session = await getSession();
  // The admin, or (on a team) whoever recorded the video.
  if (!(await managesVideo(found.ws, found.id, session?.user.id))) return NextResponse.json({ error: "not_owner" }, { status: 403 });

  const input = (await request.json().catch(() => null)) as { buttons?: unknown } | null;
  const buttons = cleanButtons(input?.buttons);
  if (typeof buttons === "string") return NextResponse.json({ error: buttons }, { status: 400 });

  const headers = { authorization: `Bearer ${found.ws.upload_key}` };
  const res = await fetch(uploadUrl(found.ws, found.id), {
    ...(buttons.length
      ? { method: "PUT", headers: { ...headers, "content-type": "application/json", "cache-control": "no-cache" }, body: JSON.stringify({ buttons }) }
      : { method: "DELETE", headers }),
    signal: AbortSignal.timeout(8000),
  }).catch(() => null);
  if (!res?.ok) return NextResponse.json({ error: "Couldn't save the buttons. Try again in a moment." }, { status: 502 });
  return NextResponse.json({ buttons });
}
