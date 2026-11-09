import { NextResponse } from "next/server";
import { getWorkspace } from "@/lib/db";
import { FOLDER_ID, FOLDER_NAME_MAX, deleteFolder, foldersEnabled, renameFolder } from "@/lib/folders";
import { getSession } from "@/lib/session";

// PATCH { name }: rename a folder. DELETE: remove it; its videos go back to the library.

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

async function folder(params: Params["params"]) {
  const { id } = await params;
  if (!FOLDER_ID.test(id)) return { error: NextResponse.json({ error: "bad_id" }, { status: 400 }) };
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "sign_in" }, { status: 401 }) };
  const ws = await getWorkspace(session.user.id);
  if (!ws || !foldersEnabled(ws)) return { error: NextResponse.json({ error: "update_needed" }, { status: 409 }) };
  return { ws, id };
}

const answer = (status: number, data: unknown) =>
  status === 200 ? NextResponse.json(data) : NextResponse.json({ error: status === 404 ? "not_found" : "failed" }, { status: status === 404 ? 404 : 502 });

export async function PATCH(request: Request, { params }: Params) {
  const found = await folder(params);
  if ("error" in found) return found.error;
  const input = (await request.json().catch(() => ({}))) as { name?: unknown };
  const name = String(input.name ?? "").replace(/\s+/g, " ").trim();
  if (!name) return NextResponse.json({ error: "empty" }, { status: 400 });
  if (name.length > FOLDER_NAME_MAX) return NextResponse.json({ error: "too_long" }, { status: 400 });
  try {
    const { status, data } = await renameFolder(found.ws, found.id, name);
    return answer(status, data);
  } catch {
    return answer(502, null);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const found = await folder(params);
  if ("error" in found) return found.error;
  try {
    const { status, data } = await deleteFolder(found.ws, found.id);
    return answer(status, data);
  } catch {
    return answer(502, null);
  }
}
