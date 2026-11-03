// Showthrough video backend. Deployed automatically into each user's own Cloudflare
// account when they connect Cloudflare, with their R2 bucket bound as VIDEOS.
//
//   PUT    /api/upload/videos/<id>/<file>   upload a segment, playlist or meta.json (needs UPLOAD_KEY)
//   DELETE /api/upload/videos/<id>/<file>   delete a file (needs UPLOAD_KEY)
//   GET    /api/videos                      list recordings, newest first (needs UPLOAD_KEY)
//   GET    /videos/<id>/<file>              public: stream a file (what share links play)
//   GET    /health                          version check
//
// The bucket itself stays private; everything goes through this Worker.

const VERSION = 1;
const FILE = /^videos\/[a-z0-9]{8,64}\/[A-Za-z0-9._-]{1,100}$/;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Cache-Control",
  "Access-Control-Max-Age": "86400",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "content-type": "application/json", "cache-control": "no-store" },
  });
}

function authorized(request, env) {
  const given = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const expected = env.UPLOAD_KEY || "";
  if (!expected || given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

async function listVideos(env) {
  const ids = [];
  let cursor;
  do {
    const page = await env.VIDEOS.list({ prefix: "videos/", delimiter: "/", cursor, limit: 1000 });
    for (const prefix of page.delimitedPrefixes) ids.push(prefix.slice("videos/".length, -1));
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  const videos = await Promise.all(
    ids.map(async (id) => {
      const meta = await env.VIDEOS.get(`videos/${id}/meta.json`);
      if (!meta) return { id, title: null, createdAt: null, durationSec: null, ready: false };
      try {
        const data = await meta.json();
        return { id, title: data.title ?? null, createdAt: data.createdAt ?? null, durationSec: data.durationSec ?? null, ready: true };
      } catch {
        return { id, title: null, createdAt: null, durationSec: null, ready: false };
      }
    }),
  );
  return videos.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname);
    const method = request.method;

    if (method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (path === "/health") return json({ ok: true, version: VERSION });

    if (path.startsWith("/api/")) {
      if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);

      if (path === "/api/videos" && method === "GET") return json({ videos: await listVideos(env) });

      if (path.startsWith("/api/upload/")) {
        const key = path.slice("/api/upload/".length);
        if (!FILE.test(key)) return json({ error: "bad_key" }, 400);
        if (method === "PUT") {
          const body = await request.arrayBuffer();
          await env.VIDEOS.put(key, body, {
            httpMetadata: {
              contentType: request.headers.get("content-type") || "application/octet-stream",
              cacheControl: request.headers.get("cache-control") || undefined,
            },
          });
          return json({ ok: true, size: body.byteLength });
        }
        if (method === "DELETE") {
          await env.VIDEOS.delete(key);
          return json({ ok: true });
        }
      }
      return json({ error: "not_found" }, 404);
    }

    if ((method === "GET" || method === "HEAD") && path.startsWith("/videos/")) {
      const key = path.slice(1);
      if (!FILE.test(key)) return json({ error: "not_found" }, 404);
      const object = method === "HEAD" ? await env.VIDEOS.head(key) : await env.VIDEOS.get(key);
      if (!object) {
        return new Response("Not found", { status: 404, headers: { ...CORS, "cache-control": "no-store" } });
      }
      const headers = new Headers(CORS);
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      if (!headers.has("cache-control")) headers.set("cache-control", "public, max-age=60");
      return new Response(method === "HEAD" ? null : object.body, { headers });
    }

    return json({ error: "not_found" }, 404);
  },
};

export default worker;
