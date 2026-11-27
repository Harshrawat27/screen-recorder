import { NextResponse } from "next/server";
import { getTeamContext } from "@/lib/team";
import { FOLDER_NAME_MAX, createFolder, foldersEnabled, listFolders } from "@/lib/folders";
import { clearSearchCache } from "@/lib/search";
import { getSession } from "@/lib/session";
import { ownerFeatures } from "@/lib/plan";
import { planRequired } from "@/lib/plan-response";

// GET: your folders. POST { name }: create one.

export const dynamic = "force-dynamic";

async function workspace() {
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "sign_in" }, { status: 401 }) };
  // Folders are shared by the whole team: anyone in it can see them and create new ones.
  const team = await getTeamContext(session.user);
  const ws = team.workspace;
  if (!ws) return { error: NextResponse.json({ error: "not_connected" }, { status: 409 }) };
  if (!(await ownerFeatures(team.ownerId)).folders) return { error: planRequired() };

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
