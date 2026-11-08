import { NextResponse } from "next/server";
import { getAccess } from "@/lib/billing";
import { getWorkspace } from "@/lib/db";
import { getSession } from "@/lib/session";

// Where the extension sends people who haven't linked it yet. Each visit lands on the next
// step they still need: sign in → pay → connect Cloudflare → link the extension.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const to = (path: string) =>
    NextResponse.redirect(new URL(path, request.url));
  const session = await getSession();
  if (!session) return to("/login?next=/start");
  if (!(await getAccess(session.user)).paid) return to("/pricing");
  if (!(await getWorkspace(session.user.id))) return to("/dashboard");
  return to("/extension/connect");
}
