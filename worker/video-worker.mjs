// Showthrough video backend. Deployed automatically into each user's own Cloudflare
// account when they connect Cloudflare, with their R2 bucket bound as VIDEOS and (from
// version 2) their D1 database bound as DB.
//
//   PUT    /api/upload/videos/<id>/<file>   upload a segment, playlist or meta.json (needs UPLOAD_KEY)
//   DELETE /api/upload/videos/<id>/<file>   delete a file (needs UPLOAD_KEY)
//   GET    /api/videos                      list recordings with view/comment counts (needs UPLOAD_KEY)
//   GET    /api/social/<id>                 comments, reactions and views of a video (needs UPLOAD_KEY)
//   POST   /api/social/<id>/comments        add a comment (needs UPLOAD_KEY)
//   DELETE /api/social/<id>/comments/<cid>  delete a comment (needs UPLOAD_KEY)
//   POST   /api/social/<id>/reactions       add a reaction (needs UPLOAD_KEY)
//   POST   /api/social/<id>/views           count a view (needs UPLOAD_KEY)
//   GET    /videos/<id>/<file>              public: stream a file (what share links play)
//   GET    /health                          version check
//
// The bucket and database stay private; everything goes through this Worker. The social
// endpoints are only called by the Showthrough website, which checks who is signed in and
// passes their name along. Viewers never talk to these endpoints directly.

const VERSION = 2;
const VIDEO_ID = /^[a-z0-9]{8,64}$/;
const EMOJIS = ["👍", "❤️", "😂", "🎉", "😮", "🔥"];
const FILE = /^videos\/[a-z0-9]{8,64}\/[A-Za-z0-9._-]{1,100}$/;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, PUT, POST, DELETE, OPTIONS",
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

// ---- Comments, reactions and views (D1) ----------------------------------------------------

const SCHEMA = [
  `create table if not exists comments (
     id text primary key, video_id text not null, user_id text not null, user_name text not null,
     user_image text, body text not null, at_sec real, created_at integer not null)`,
  `create index if not exists comments_video on comments (video_id, created_at)`,
  `create table if not exists reactions (
     id text primary key, video_id text not null, user_id text not null, emoji text not null,
     at_sec real, created_at integer not null)`,
  `create index if not exists reactions_video on reactions (video_id)`,
  `create table if not exists views (video_id text primary key, count integer not null default 0)`,
];

let schemaReady = null;
function ensureSchema(env) {
  schemaReady ??= env.DB.batch(SCHEMA.map((sql) => env.DB.prepare(sql))).catch((err) => {
    schemaReady = null;
    throw err;
  });
  return schemaReady;
}

const clean = (value, max) => String(value ?? "").trim().slice(0, max);
const seconds = (value) => (typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.round(value * 10) / 10 : null);

function commentRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.user_name,
    image: row.user_image,
    body: row.body,
    atSec: row.at_sec,
    createdAt: row.created_at,
  };
}

async function social(env, videoId) {
  await ensureSchema(env);
  const [comments, reactions, views] = await env.DB.batch([
    env.DB.prepare("select * from comments where video_id = ? order by created_at asc limit 1000").bind(videoId),
    env.DB.prepare("select emoji, user_id, at_sec from reactions where video_id = ? order by created_at asc limit 5000").bind(videoId),
    env.DB.prepare("select count from views where video_id = ?").bind(videoId),
  ]);
  return {
    comments: comments.results.map(commentRow),
    reactions: reactions.results.map((r) => ({ emoji: r.emoji, userId: r.user_id, atSec: r.at_sec })),
    views: views.results[0]?.count ?? 0,
  };
}

async function addComment(env, videoId, input) {
  const body = clean(input.body, 2000);
  const user = input.user ?? {};
  if (!body || !user.id) return null;
  await ensureSchema(env);
  const row = {
    id: crypto.randomUUID(),
    video_id: videoId,
    user_id: clean(user.id, 100),
    user_name: clean(user.name, 100) || "Someone",
    user_image: user.image ? clean(user.image, 500) : null,
    body,
    at_sec: seconds(input.atSec),
    created_at: Date.now(),
  };
  await env.DB.prepare(
    "insert into comments (id, video_id, user_id, user_name, user_image, body, at_sec, created_at) values (?, ?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(row.id, row.video_id, row.user_id, row.user_name, row.user_image, row.body, row.at_sec, row.created_at)
    .run();
  return commentRow(row);
}

async function deleteComment(env, videoId, commentId, input) {
  await ensureSchema(env);
  const row = await env.DB.prepare("select user_id from comments where id = ? and video_id = ?").bind(commentId, videoId).first();
  if (!row) return "not_found";
  // The video owner can delete any comment; anyone else only their own.
  if (!input.isOwner && row.user_id !== input.userId) return "forbidden";
  await env.DB.prepare("delete from comments where id = ?").bind(commentId).run();
  return "ok";
}

async function addReaction(env, videoId, input) {
  if (!EMOJIS.includes(input.emoji) || !input.user?.id) return false;
  await ensureSchema(env);
  await env.DB.prepare("insert into reactions (id, video_id, user_id, emoji, at_sec, created_at) values (?, ?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), videoId, clean(input.user.id, 100), input.emoji, seconds(input.atSec), Date.now())
    .run();
  return true;
}

async function addView(env, videoId) {
  await ensureSchema(env);
  const row = await env.DB.prepare(
    "insert into views (video_id, count) values (?, 1) on conflict (video_id) do update set count = count + 1 returning count",
  )
    .bind(videoId)
    .first();
  return row?.count ?? 1;
}

/** View and comment counts for the library, keyed by video id. */
async function counts(env) {
  if (!env.DB) return {};
  await ensureSchema(env);
  const [views, comments, reactions] = await env.DB.batch([
    env.DB.prepare("select video_id, count from views"),
    env.DB.prepare("select video_id, count(*) as n from comments group by video_id"),
    env.DB.prepare("select video_id, count(*) as n from reactions group by video_id"),
  ]);
  const out = {};
  const get = (id) => (out[id] ??= { views: 0, comments: 0, reactions: 0 });
  for (const r of views.results) get(r.video_id).views = r.count;
  for (const r of comments.results) get(r.video_id).comments = r.n;
  for (const r of reactions.results) get(r.video_id).reactions = r.n;
  return out;
}

async function handleSocial(request, env, path) {
  if (!env.DB) return json({ error: "no_database" }, 501);
  const parts = path.slice("/api/social/".length).split("/");
  const videoId = parts[0];
  if (!VIDEO_ID.test(videoId)) return json({ error: "bad_id" }, 400);
  const method = request.method;
  const input = method === "POST" || method === "DELETE" ? await request.json().catch(() => ({})) : {};

  if (parts.length === 1 && method === "GET") return json(await social(env, videoId));
  if (parts[1] === "comments" && parts.length === 2 && method === "POST") {
    const comment = await addComment(env, videoId, input);
    return comment ? json({ comment }) : json({ error: "empty" }, 400);
  }
  if (parts[1] === "comments" && parts.length === 3 && method === "DELETE") {
    const result = await deleteComment(env, videoId, parts[2], input);
    return result === "ok" ? json({ ok: true }) : json({ error: result }, result === "forbidden" ? 403 : 404);
  }
  if (parts[1] === "reactions" && parts.length === 2 && method === "POST") {
    return (await addReaction(env, videoId, input)) ? json({ ok: true }) : json({ error: "bad_reaction" }, 400);
  }
  if (parts[1] === "views" && parts.length === 2 && method === "POST") {
    return json({ views: await addView(env, videoId) });
  }
  return json({ error: "not_found" }, 404);
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

      if (path === "/api/videos" && method === "GET") {
        const [videos, stats] = await Promise.all([listVideos(env), counts(env).catch(() => ({}))]);
        return json({ videos: videos.map((v) => ({ ...v, ...(stats[v.id] ?? { views: 0, comments: 0, reactions: 0 }) })) });
      }
      if (path.startsWith("/api/social/")) return handleSocial(request, env, path);

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
