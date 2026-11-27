import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { getTeamContext } from "@/lib/team";
import { getSession } from "@/lib/session";
import { ownerFeatures } from "@/lib/plan";

// The dashboard bell. Notifications are stored in the team's own Cloudflare (D1, through its
// Worker, from version 7); this route only passes the question along with the key we hold, for
// whoever is signed in. The dashboard asks when it opens and when you come back to the tab,
// never on a timer, so it costs next to nothing. Each answer also carries a short-lived ticket
// for a live connection straight to the team's Worker, which pushes new ones as they happen.

export const dynamic = "force-dynamic";

const NOTIFICATIONS_VERSION = 7;
const TICKET_MS = 5 * 60 * 1000; // only needed to open the connection

/** wss://…/live?ticket=… for this person, signed with the Worker's key (which stays here). */
function liveUrl(workerUrl: string, uploadKey: string, userId: string) {
  const expires = Date.now() + TICKET_MS;
  const sig = createHmac("sha256", uploadKey).update(`live.${userId}.${expires}`).digest("base64url");
  return `${workerUrl.replace(/^http/, "ws")}/live?ticket=${encodeURIComponent(`${userId}.${expires}.${sig}`)}`;
}

type Item = {
  id: string;
  kind: "comment" | "reaction";
  videoId: string;
  videoTitle: string | null;
  commentId: string | null;
  actor: { name: string; image: string | null };
  body: string | null;
  emoji: string | null;
  atSec: number | null;
  createdAt: number;
  read: boolean;
};

async function context() {
  const session = await getSession();
  if (!session) return null;
  const team = await getTeamContext(session.user);
  return { user: session.user, team, ws: team.workspace };
}

export async function GET() {
  const ctx = await context();
  if (!ctx) return NextResponse.json({ error: "sign_in" }, { status: 401 });
  const { user, team, ws } = ctx;
  if (!ws) return NextResponse.json({ enabled: false, reason: "no_workspace", items: [], unread: 0 });
  if (!(await ownerFeatures(team.ownerId)).notifications) return NextResponse.json({ enabled: false, reason: "plan", items: [], unread: 0 });
  if (ws.worker_version < NOTIFICATIONS_VERSION) {
    return NextResponse.json({ enabled: false, reason: team.role === "member" ? "admin_update" : "update", items: [], unread: 0 });
  }
  try {
    const res = await fetch(`${ws.worker_url}/api/notifications?user=${encodeURIComponent(user.id)}&limit=50`, {
      headers: { authorization: `Bearer ${ws.upload_key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return NextResponse.json({ enabled: false, reason: "unreachable", items: [], unread: 0 });
    const data = (await res.json()) as { items: Item[]; unread: number };
    return NextResponse.json({
      enabled: true,
      space: ws.space,
      live: liveUrl(ws.worker_url, ws.upload_key, user.id),
      unread: data.unread ?? 0,
      items: (data.items ?? []).map((n) => ({
        ...n,
        href: `/v/${ws.space}/${n.videoId}${n.commentId ? `?c=${n.commentId}` : ""}`,
      })),
    });
  } catch {
    return NextResponse.json({ enabled: false, reason: "unreachable", items: [], unread: 0 });
  }
}

/** Marks everything read (when the bell is opened). */
export async function POST() {
  const ctx = await context();
  if (!ctx) return NextResponse.json({ error: "sign_in" }, { status: 401 });
  const { user, ws } = ctx;
  if (!ws || ws.worker_version < NOTIFICATIONS_VERSION) return NextResponse.json({ ok: false });
  const res = await fetch(`${ws.worker_url}/api/notifications/read`, {
    method: "POST",
    headers: { authorization: `Bearer ${ws.upload_key}`, "content-type": "application/json" },
    body: JSON.stringify({ user: user.id }),
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  }).catch(() => null);
  return NextResponse.json({ ok: Boolean(res?.ok) });
}
