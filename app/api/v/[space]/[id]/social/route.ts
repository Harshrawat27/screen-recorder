import { cookies } from "next/headers";
import { NextResponse, after } from "next/server";
import { type Workspace, getWorkspaceBySpace } from "@/lib/db";
import { getMembership, getTeamContext, people } from "@/lib/team";
import { managesVideo } from "@/lib/video-files";
import { addPersonal, personalEnabled } from "@/lib/personal";
import { getSession } from "@/lib/session";

// Comments, reactions and views for a shared video. They're stored in the video owner's own
// Cloudflare (D1, through their Worker). This route is the only way in: it checks who is
// signed in, then calls the owner's Worker with the key we hold for it. Viewers never get
// that key, and the Worker never has to trust a stranger.

export const dynamic = "force-dynamic";

const SPACE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const ID = /^[a-z0-9]{8,64}$/;
const EMOJIS = ["👍", "❤️", "😂", "🎉", "😮", "🔥"];
const VIEW_WINDOW_SECONDS = 30 * 60; // the same browser counts once per half hour

type Params = { params: Promise<{ space: string; id: string }> };

type WorkerComment = { id: string; userId: string; name: string; image: string | null; body: string; atSec: number | null; createdAt: number };
type WorkerSocial = { comments: WorkerComment[]; reactions: { emoji: string; userId: string; atSec: number | null }[]; views: number };

async function workerCall<T>(ws: Workspace, path: string, init?: { method?: string; body?: unknown }): Promise<{ ok: boolean; status: number; data: T | null }> {
  try {
    const res = await fetch(`${ws.worker_url}/api/social/${path}`, {
      method: init?.method ?? "GET",
      headers: { authorization: `Bearer ${ws.upload_key}`, "content-type": "application/json" },
      body: init?.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    return { ok: res.ok, status: res.status, data: (await res.json().catch(() => null)) as T | null };
  } catch {
    return { ok: false, status: 502, data: null };
  }
}

async function resolve(params: Params["params"]) {
  const { space, id } = await params;
  if (!SPACE.test(space) || !ID.test(id)) return null;
  const ws = await getWorkspaceBySpace(space);
  return ws ? { ws, id } : null;
}

const viewer = (user: { id: string; name: string; image?: string | null }) => ({ id: user.id, name: user.name, image: user.image ?? null });

/**
 * Reactions with the moment they were tapped, for the comments panel ("Priya 🔥 at 0:42").
 * Repeated taps of the same emoji by the same person within a second show once.
 */
async function moments(data: WorkerSocial, meId: string | null) {
  const seen = new Set<string>();
  const list = data.reactions.filter((r) => {
    const key = `${r.userId}|${r.emoji}|${r.atSec === null ? "-" : Math.floor(r.atSec)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const recent = list.slice(-300);
  const names = await people([...new Set(recent.map((r) => r.userId))]).catch(() => new Map());
  return recent.map((r, i) => {
    const person = names.get(r.userId);
    return {
      key: `r${i}`,
      name: person?.name ?? "Someone",
      image: person?.image ?? null,
      emoji: r.emoji,
      atSec: r.atSec,
      mine: Boolean(meId && r.userId === meId),
    };
  });
}

/** What a viewer sees. Other people's account ids are never sent to the browser. */
function shape(data: WorkerSocial, meId: string | null, isOwner: boolean) {
  const counts: Record<string, number> = Object.fromEntries(EMOJIS.map((e) => [e, 0]));
  const mine = new Set<string>();
  for (const r of data.reactions) {
    counts[r.emoji] = (counts[r.emoji] ?? 0) + 1;
    if (meId && r.userId === meId) mine.add(r.emoji);
  }
  return {
    views: data.views,
    comments: data.comments.map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      body: c.body,
      atSec: c.atSec,
      createdAt: c.createdAt,
      mine: Boolean(meId && c.userId === meId),
      canDelete: isOwner || Boolean(meId && c.userId === meId),
    })),
    reactions: EMOJIS.map((emoji) => ({ emoji, count: counts[emoji] ?? 0, mine: mine.has(emoji) })),
  };
}

export async function GET(_request: Request, { params }: Params) {
  const found = await resolve(params);
  if (!found) return NextResponse.json({ enabled: false, reason: "not_found" });
  const { ws, id } = found;
  const session = await getSession();
  // The admin, or (on a team) whoever recorded this video.
  const isOwner = await managesVideo(ws, id, session?.user.id);
  const me = session ? viewer(session.user) : null;
  // Comments arrived with version 2 of the Worker; older ones need the owner to update.
  if (ws.worker_version < 2) return NextResponse.json({ enabled: false, reason: "update", isOwner, me });
  const res = await workerCall<WorkerSocial>(ws, id);
  if (!res.ok || !res.data) return NextResponse.json({ enabled: false, reason: "unreachable", isOwner, me });
  return NextResponse.json({
    enabled: true,
    isOwner,
    me,
    ...shape(res.data, me?.id ?? null, isOwner),
    moments: await moments(res.data, me?.id ?? null),
  });
}

export async function POST(request: Request, { params }: Params) {
  const found = await resolve(params);
  if (!found) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const { ws, id } = found;
  if (ws.worker_version < 2) return NextResponse.json({ error: "not_enabled" }, { status: 409 });
  const input = (await request.json().catch(() => ({}))) as {
    action?: string;
    body?: string;
    atSec?: number | null;
    emoji?: string;
    commentId?: string;
  };
  const session = await getSession();

  // Views: anyone, counted once per browser per half hour. The owner's own plays don't count.
  if (input.action === "view") {
    // Every play by a signed-in person also goes into their Recent (in their own workspace),
    // after the answer is sent.
    if (session) {
      const viewerId = session.user.id;
      after(async () => {
        const mine = session.user.id === ws.owner_id ? ws : (await getTeamContext(session.user)).workspace;
        if (personalEnabled(mine)) await addPersonal(mine, viewerId, "recent", ws.space, id).catch(() => {});
      });
    }
    // Someone on this team (the admin or a member) watching: whoever recorded it gets "Rahul
    // watched" (version 7). Outsiders stay anonymous; their first view is announced without a name.
    const teammate =
      session && (session.user.id === ws.owner_id || (await getMembership(session.user.id, ws.owner_id).catch(() => null)))
        ? viewer(session.user)
        : null;
    const about = { ownerId: ws.owner_id, viewer: teammate };
    if (await managesVideo(ws, id, session?.user.id)) {
      // Their plays don't count as views, but the admin watching a member's video still tells them.
      if (teammate && ws.worker_version >= 7) after(() => workerCall(ws, `${id}/views`, { method: "POST", body: { ...about, count: false } }).then(() => {}));
      return NextResponse.json({ counted: false });
    }
    const jar = await cookies();
    const cookie = `stv_${id}`;
    if (jar.get(cookie)) return NextResponse.json({ counted: false });
    const res = await workerCall<{ views: number }>(ws, `${id}/views`, { method: "POST", body: about });
    if (!res.ok) return NextResponse.json({ counted: false }, { status: 502 });
    jar.set(cookie, "1", { maxAge: VIEW_WINDOW_SECONDS, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
    return NextResponse.json({ counted: true, views: res.data?.views ?? null });
  }

  // Everything else needs a signed-in account.
  if (!session) return NextResponse.json({ error: "sign_in" }, { status: 401 });
  const me = viewer(session.user);

  if (input.action === "comment") {
    const body = String(input.body ?? "").trim();
    if (!body) return NextResponse.json({ error: "empty" }, { status: 400 });
    if (body.length > 2000) return NextResponse.json({ error: "too_long" }, { status: 400 });
    const res = await workerCall<{ comment: WorkerComment }>(ws, `${id}/comments`, {
      method: "POST",
      body: { body, atSec: typeof input.atSec === "number" ? input.atSec : null, user: me, ownerId: ws.owner_id },
    });
    if (!res.ok || !res.data) return NextResponse.json({ error: "failed" }, { status: 502 });
    const c = res.data.comment;
    return NextResponse.json({
      comment: { id: c.id, name: c.name, image: c.image, body: c.body, atSec: c.atSec, createdAt: c.createdAt, mine: true, canDelete: true },
    });
  }

  if (input.action === "react") {
    if (!input.emoji || !EMOJIS.includes(input.emoji)) return NextResponse.json({ error: "bad_reaction" }, { status: 400 });
    const res = await workerCall(ws, `${id}/reactions`, {
      method: "POST",
      body: { emoji: input.emoji, atSec: typeof input.atSec === "number" ? input.atSec : null, user: me, ownerId: ws.owner_id },
    });
    return res.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "failed" }, { status: 502 });
  }

  if (input.action === "delete") {
    if (!input.commentId || !/^[0-9a-f-]{36}$/.test(input.commentId)) return NextResponse.json({ error: "bad_id" }, { status: 400 });
    const res = await workerCall(ws, `${id}/comments/${input.commentId}`, {
      method: "DELETE",
      body: { userId: me.id, isOwner: await managesVideo(ws, id, me.id) },
    });
    return res.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "failed" }, { status: res.status === 403 ? 403 : 502 });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400 });
}
