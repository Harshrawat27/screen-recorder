// Server-side Cloudflare setup. The access token from "Connect Cloudflare" is used
// for the calls below during one request and then dropped: it is never stored.
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { CLOUDFLARE_CLIENT_ID } from "@/lib/config";

const API = process.env.CLOUDFLARE_API_BASE ?? "https://api.cloudflare.com/client/v4";
const TOKEN_URL = process.env.CLOUDFLARE_TOKEN_URL ?? "https://dash.cloudflare.com/oauth2/token";
// Tests point this at a local Worker; in production it's the user's workers.dev address.
const WORKER_URL_TEMPLATE = process.env.WORKER_URL_TEMPLATE ?? "https://showthrough.{space}.workers.dev";

export const SCRIPT_NAME = "showthrough";
export const BUCKET_NAME = "showthrough-videos";
export const DATABASE_NAME = "showthrough";
// The version of worker/video-worker.mjs. Raise it whenever the Worker changes: users on an
// older version then see "New version available" in the dashboard (see lib/updates.ts).
export const WORKER_VERSION = 4;

export class SetupError extends Error {
  constructor(
    message: string,
    public step: string,
    public detail?: string,
  ) {
    super(message);
  }
}

type CfResponse<T> = { success: boolean; errors?: { code: number; message: string }[]; result: T };

export async function exchangeCode({ code, verifier, redirectUri }: { code: string; verifier: string; redirectUri: string }) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: CLOUDFLARE_CLIENT_ID,
      code_verifier: verifier,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { access_token?: string; error?: string; error_description?: string };
  if (!res.ok || !data.access_token) {
    throw new SetupError(
      "Cloudflare didn’t accept the sign-in. Try connecting again.",
      "token",
      data.error_description || data.error || `HTTP ${res.status}`,
    );
  }
  return data.access_token;
}

async function cf<T>(token: string, step: string, method: string, url: string, body?: BodyInit | object): Promise<CfResponse<T>> {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(`${API}${url}`, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      ...(body && !isForm ? { "content-type": "application/json" } : {}),
    },
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({ success: false, errors: [{ code: res.status, message: `HTTP ${res.status}` }] }))) as CfResponse<T>;
  if (!res.ok || !data.success) {
    const first = data.errors?.[0];
    const err = new SetupError(friendly(step, first?.code, first?.message), step, first ? `${first.code}: ${first.message}` : `HTTP ${res.status}`);
    (err as SetupError & { code?: number }).code = first?.code;
    throw err;
  }
  return data;
}

function friendly(step: string, code?: number, message = "") {
  if (/enable R2|R2 is not enabled|purchase.*R2/i.test(message) || code === 10042) {
    return "R2 isn’t turned on in your Cloudflare account yet. Open Cloudflare → R2 → Get started (it’s free), then connect again.";
  }
  if (code === 10000 || /auth/i.test(message)) {
    return "Cloudflare didn’t give us permission for this step. Connect again and make sure you click Allow.";
  }
  const steps: Record<string, string> = {
    account: "We couldn’t find your Cloudflare account.",
    bucket: "We couldn’t create your video storage.",
    database: "We couldn’t create the database for comments and views.",
    worker: "We couldn’t set up your video backend.",
    subdomain: "We couldn’t turn on your video address.",
  };
  return `${steps[step] ?? "Setup failed."} Cloudflare said: ${message || "unknown error"}.`;
}

function workerSource() {
  return readFileSync(path.join(process.cwd(), "worker/video-worker.mjs"), "utf8");
}

export type Provisioned = {
  accountId: string;
  accountName: string | null;
  space: string;
  workerUrl: string;
  bucket: string;
  uploadKey: string;
};

/** Finds the Showthrough D1 database in the account, or creates it. Returns its id. */
async function ensureDatabase(token: string, base: string): Promise<string> {
  const existing = await cf<{ uuid: string; name: string }[]>(token, "database", "GET", `${base}/d1/database?name=${DATABASE_NAME}`);
  const found = existing.result?.find((db) => db.name === DATABASE_NAME);
  if (found) return found.uuid;
  const created = await cf<{ uuid: string }>(token, "database", "POST", `${base}/d1/database`, { name: DATABASE_NAME });
  return created.result.uuid;
}

/**
 * Creates (or reuses) the bucket and database, deploys the video Worker and turns on its
 * workers.dev address. Running it again updates an existing setup: pass the current upload
 * key so the extension stays connected (it's kept when the Cloudflare account is the same).
 */
export async function provision(token: string, current?: { accountId: string; uploadKey: string } | null): Promise<Provisioned> {
  // 1. Which account
  const accounts = await cf<{ id: string; name: string }[]>(token, "account", "GET", "/accounts?per_page=50");
  const account = accounts.result?.[0];
  if (!account) throw new SetupError("We couldn’t find a Cloudflare account to use.", "account");
  const base = `/accounts/${account.id}`;

  // 2. Private storage (reuse if it already exists)
  try {
    await cf(token, "bucket", "POST", `${base}/r2/buckets`, { name: BUCKET_NAME });
  } catch (err) {
    const e = err as SetupError & { code?: number };
    if (!(e.code === 10004 || /already exists|already own/i.test(e.detail ?? ""))) throw err;
  }

  // 3. Database for comments, reactions and views (reuse if it already exists)
  const databaseId = await ensureDatabase(token, base);

  // 4. Video backend Worker with the bucket and database bound. Same account: keep the
  //    upload key, so the extension keeps working after an update.
  const uploadKey = current && current.accountId === account.id ? current.uploadKey : randomBytes(32).toString("base64url");
  const form = new FormData();
  form.append(
    "metadata",
    new Blob(
      [
        JSON.stringify({
          main_module: "worker.mjs",
          compatibility_date: "2025-09-01",
          bindings: [
            { type: "r2_bucket", name: "VIDEOS", bucket_name: BUCKET_NAME },
            { type: "d1", name: "DB", id: databaseId },
            { type: "secret_text", name: "UPLOAD_KEY", text: uploadKey },
          ],
        }),
      ],
      { type: "application/json" },
    ),
  );
  form.append("worker.mjs", new Blob([workerSource()], { type: "application/javascript+module" }), "worker.mjs");
  await cf(token, "worker", "PUT", `${base}/workers/scripts/${SCRIPT_NAME}`, form);

  // 5. The account's workers.dev subdomain (new accounts don't have one yet)
  let space: string | undefined;
  try {
    const sub = await cf<{ subdomain: string }>(token, "subdomain", "GET", `${base}/workers/subdomain`);
    space = sub.result?.subdomain;
  } catch {
    space = undefined;
  }
  for (let attempt = 0; !space && attempt < 3; attempt++) {
    const candidate = `st-${randomBytes(5).toString("hex")}`;
    try {
      const created = await cf<{ subdomain: string }>(token, "subdomain", "PUT", `${base}/workers/subdomain`, { subdomain: candidate });
      space = created.result?.subdomain ?? candidate;
    } catch (err) {
      if (attempt === 2) throw err;
    }
  }
  if (!space) throw new SetupError("We couldn’t turn on your video address.", "subdomain");

  // 6. Serve this Worker on workers.dev
  await cf(token, "subdomain", "POST", `${base}/workers/scripts/${SCRIPT_NAME}/subdomain`, { enabled: true, previews_enabled: false });

  return {
    accountId: account.id,
    accountName: account.name ?? null,
    space,
    workerUrl: WORKER_URL_TEMPLATE.replace("{space}", space),
    bucket: BUCKET_NAME,
    uploadKey,
  };
}

/** New workers.dev addresses can take a little while to answer (and a redeploy a moment to go live). */
export async function waitForWorker(workerUrl: string, timeoutMs = 25_000, version = 0) {
  const until = Date.now() + timeoutMs;
  while (Date.now() < until) {
    try {
      const res = await fetch(`${workerUrl}/health`, { cache: "no-store" });
      const data = res.ok ? ((await res.json().catch(() => ({}))) as { version?: number }) : null;
      if (data && (data.version ?? 0) >= version) return true;
    } catch {
      // not reachable yet
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

export type VideoSummary = {
  id: string;
  title: string | null;
  createdAt: number | null;
  durationSec: number | null;
  ready: boolean;
  thumbnail?: string | null;
  // From version 3: the folder it's in, if any.
  folderId?: string | null;
  // From version 2 of the Worker; missing on older ones.
  views?: number;
  comments?: number;
  reactions?: number;
};

export async function listVideos(workerUrl: string, uploadKey: string): Promise<{ videos: VideoSummary[]; reachable: boolean }> {
  try {
    const res = await fetch(`${workerUrl}/api/videos`, {
      headers: { authorization: `Bearer ${uploadKey}` },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return { videos: [], reachable: false };
    const data = (await res.json()) as { videos: VideoSummary[] };
    // Leftover connection-check files (videos/stcheck…/) are not recordings.
    return { videos: (data.videos ?? []).filter((v) => !v.id.startsWith("stcheck")), reachable: true };
  } catch {
    return { videos: [], reachable: false };
  }
}
