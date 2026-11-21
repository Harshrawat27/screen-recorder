import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSession } from "@/lib/session";

// Forget the signed-in person's Cloudflare connection. Only our record goes: their videos,
// bucket, database and worker stay in their own Cloudflare, untouched. Connecting the same
// Cloudflare account again finds all of it, at the same addresses.

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  await pool.query("delete from workspace where owner_id = $1", [session.user.id]);
  return NextResponse.json({ ok: true });
}
