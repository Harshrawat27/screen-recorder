import { NextResponse } from "next/server";
import { type Workspace, getWorkspaceBySpace } from "@/lib/db";
import { type Cta, cleanCta } from "@/lib/cta";
import { getSession } from "@/lib/session";

// The call-to-action button on a shared video.
//   GET     anyone: the button (or null), and whether you're the owner
//   PUT     owner only: { label, url }
//   DELETE  owner only: remove it
// It's stored in the owner's Cloudflare as videos/<id>/cta.json. Only this route writes it,
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

async function readCta(ws: Workspace, id: string): Promise<Cta | null> {
  try {
    const res = await fetch(fileUrl(ws, id), { cache: "no-store", signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const saved = cleanCta(await res.json());
    return typeof saved === "string" ? null : saved;
  } catch {
    return null;
  }
}

async function owner(params: Params["params"]) {
  const found = await resolve(params);
  if (!found) return { error: NextResponse.json({ error: "not_found" }, { status: 404 }) };
  const session = await getSession();
  if (!session || session.user.id !== found.ws.owner_id) return { error: NextResponse.json({ error: "not_owner" }, { status: 403 }) };
  return found;
}

export async function GET(_request: Request, { params }: Params) {
  const found = await resolve(params);
  if (!found) return NextResponse.json({ cta: null, isOwner: false });
  const [cta, session] = await Promise.all([readCta(found.ws, found.id), getSession()]);
  return NextResponse.json({ cta, isOwner: session?.user.id === found.ws.owner_id });
}

export async function PUT(request: Request, { params }: Params) {
  const found = await owner(params);
  if ("error" in found) return found.error;
  const cta = cleanCta(await request.json().catch(() => null));
  if (typeof cta === "string") return NextResponse.json({ error: cta }, { status: 400 });
  const res = await fetch(uploadUrl(found.ws, found.id), {
    method: "PUT",
    headers: { authorization: `Bearer ${found.ws.upload_key}`, "content-type": "application/json", "cache-control": "no-cache" },
    body: JSON.stringify(cta),
    signal: AbortSignal.timeout(8000),
  }).catch(() => null);
  if (!res?.ok) return NextResponse.json({ error: "Couldn't save the button. Try again in a moment." }, { status: 502 });
  return NextResponse.json({ cta });
}

export async function DELETE(_request: Request, { params }: Params) {
  const found = await owner(params);
  if ("error" in found) return found.error;
  const res = await fetch(uploadUrl(found.ws, found.id), {
    method: "DELETE",
    headers: { authorization: `Bearer ${found.ws.upload_key}` },
    signal: AbortSignal.timeout(8000),
  }).catch(() => null);
  if (!res?.ok) return NextResponse.json({ error: "Couldn't remove the button. Try again in a moment." }, { status: 502 });
  return NextResponse.json({ cta: null });
}
