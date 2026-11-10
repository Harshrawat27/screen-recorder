import { NextResponse } from "next/server";
import { AVATAR_MAX_BYTES, avatarEnabled, deleteAvatar, saveAvatar } from "@/lib/avatar";
import { getWorkspace } from "@/lib/db";
import { getSession } from "@/lib/session";

// The signed-in person's profile photo, kept in their own Cloudflare.
//   POST   body: the cropped photo as WebP (the browser makes it)   save
//   DELETE                                                          remove

export const dynamic = "force-dynamic";

async function owner() {
  const session = await getSession();
  if (!session) return null;
  const ws = await getWorkspace(session.user.id);
  return avatarEnabled(ws) ? { userId: session.user.id, ws } : null;
}

export async function POST(request: Request) {
  const me = await owner();
  if (!me) return NextResponse.json({ error: "not_available" }, { status: 409 });
  const body = await request.arrayBuffer();
  if (body.byteLength > AVATAR_MAX_BYTES) return NextResponse.json({ error: "too_large" }, { status: 413 });
  const head = new Uint8Array(body.slice(0, 12));
  const text = (from: number, to: number) => String.fromCharCode(...head.slice(from, to));
  if (head.length < 12 || text(0, 4) !== "RIFF" || text(8, 12) !== "WEBP") return NextResponse.json({ error: "not_webp" }, { status: 400 });
  try {
    return NextResponse.json({ avatar: await saveAvatar(me.ws, me.userId, body) });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}

export async function DELETE() {
  const me = await owner();
  if (!me) return NextResponse.json({ error: "not_available" }, { status: 409 });
  try {
    await deleteAvatar(me.ws, me.userId);
    return NextResponse.json({ avatar: null });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
