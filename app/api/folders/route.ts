import { NextResponse } from "next/server";
import { getWorkspace } from "@/lib/db";
import { FOLDER_NAME_MAX, createFolder, foldersEnabled, listFolders } from "@/lib/folders";
import { clearSearchCache } from "@/lib/search";
import { getSession } from "@/lib/session";

// GET: your folders. POST { name }: create one.

export const dynamic = "force-dynamic";

async function workspace() {
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "sign_in" }, { status: 401 }) };
  const ws = await getWorkspace(session.user.id);
  if (!ws) return { error: NextResponse.json({ error: "not_connected" }, { status: 409 }) };
  if (!foldersEnabled(ws)) return { error: NextResponse.json({ error: "update_needed" }, { status: 409 }) };
  return { ws };
}

export async function GET() {
  const found = await workspace();
  if ("error" in found) return found.error;
  return NextResponse.json({ folders: await listFolders(found.ws) });
}

export async function POST(request: Request) {
  const found = await workspace();
  if ("error" in found) return found.error;
  const input = (await request.json().catch(() => ({}))) as { name?: unknown };
  const name = String(input.name ?? "").replace(/\s+/g, " ").trim();
  if (!name) return NextResponse.json({ error: "empty" }, { status: 400 });
  if (name.length > FOLDER_NAME_MAX) return NextResponse.json({ error: "too_long" }, { status: 400 });
  try {
    const { status, data } = await createFolder(found.ws, name);
    if (status !== 200 || !data) return NextResponse.json({ error: "failed" }, { status: 502 });
    clearSearchCache(found.ws.id);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
