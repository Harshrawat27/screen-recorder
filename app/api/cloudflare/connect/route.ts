import { NextResponse } from "next/server";
import { SetupError, WORKER_VERSION, exchangeCode, provision, waitForWorker } from "@/lib/cloudflare";
import { saveWorkspace } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getAccess } from "@/lib/billing";

export const maxDuration = 60;

// Finishes "Connect Cloudflare": swaps the one-time code for an access token, sets up
// the user's storage and video backend, then forgets the token.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  if (!(await getAccess(session.user)).paid) {
    return NextResponse.json({ error: "Buy Showthrough to connect Cloudflare." }, { status: 402 });
  }

  const body = (await request.json().catch(() => null)) as { code?: string; verifier?: string; redirectUri?: string } | null;
  if (!body?.code || !body.verifier || !body.redirectUri) {
    return NextResponse.json({ error: "The Cloudflare response was incomplete. Connect again." }, { status: 400 });
  }

  try {
    const token = await exchangeCode({ code: body.code, verifier: body.verifier, redirectUri: body.redirectUri });
    const result = await provision(token);
    const ready = await waitForWorker(result.workerUrl);
    await saveWorkspace({
      owner_id: session.user.id,
      cf_account_id: result.accountId,
      cf_account_name: result.accountName,
      space: result.space,
      worker_url: result.workerUrl,
      bucket: result.bucket,
      upload_key: result.uploadKey,
      worker_version: WORKER_VERSION,
    });
    return NextResponse.json({ ok: true, space: result.space, accountName: result.accountName, ready });
  } catch (err) {
    if (err instanceof SetupError) {
      console.error("Cloudflare setup failed", err.step, err.detail);
      return NextResponse.json({ error: err.message, step: err.step, detail: err.detail }, { status: 502 });
    }
    console.error("Cloudflare setup crashed", err);
    return NextResponse.json({ error: "Setup failed unexpectedly. Try again in a minute." }, { status: 500 });
  }
}
