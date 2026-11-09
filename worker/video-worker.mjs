// Showthrough video backend. Deployed automatically into each user's own Cloudflare
// account when they connect Cloudflare, with their R2 bucket bound as VIDEOS and (from
// version 2) their D1 database bound as DB.
//
//   PUT    /api/upload/videos/<id>/<file>   upload a segment, playlist or meta.json (needs UPLOAD_KEY)
//   DELETE /api/upload/videos/<id>/<file>   delete a file (needs UPLOAD_KEY)
//   GET    /api/videos                      list recordings with view/comment counts (needs UPLOAD_KEY)
//   GET    /api/search?q=…                  search recordings by title (needs UPLOAD_KEY)
//   PATCH  /api/videos/<id>                 rename a recording (needs UPLOAD_KEY)
//   DELETE /api/videos/<id>                 delete a recording and everything about it (needs UPLOAD_KEY)
//   GET    /api/social/<id>                 comments, reactions and views of a video (needs UPLOAD_KEY)
//   POST   /api/social/<id>/comments        add a comment (needs UPLOAD_KEY)
//   DELETE /api/social/<id>/comments/<cid>  delete a comment (needs UPLOAD_KEY)
//   POST   /api/social/<id>/reactions       add a reaction (needs UPLOAD_KEY)
//   POST   /api/social/<id>/views           count a view (needs UPLOAD_KEY)
//   GET    /videos/<id>/<file>              public: stream a file (what share links play)
//   GET    /health                          version check
//
// From version 3 each recording also has a row in D1 (title, date, length, thumbnail), kept
// in step with its meta.json: the row is written when the extension uploads meta.json. The
// library and search read D1; share pages keep reading meta.json. Recordings made before
// version 3 are copied into D1 the first time they're needed.
//
// The bucket and database stay private; everything goes through this Worker. The social
// endpoints are only called by the Showthrough website, which checks who is signed in and
// passes their name along. Viewers never talk to these endpoints directly.

const VERSION = 3;
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

/** Every recording folder in R2, with its meta.json if it has one. Used once to fill D1. */
async function videosInBucket(env) {
  const ids = [];
  let cursor;
  do {
    const page = await env.VIDEOS.list({ prefix: "videos/", delimiter: "/", cursor, limit: 1000 });
    for (const prefix of page.delimitedPrefixes) ids.push(prefix.slice("videos/".length, -1));
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return Promise.all(
    ids.filter((id) => VIDEO_ID.test(id)).map(async (id) => {
      const meta = await env.VIDEOS.get(`videos/${id}/meta.json`);
      try {
        return { id, meta: meta ? await meta.json() : null };
      } catch {
        return { id, meta: null };
      }
    }),
  );
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
  // Version 3: one row per recording. status is 'uploading' until meta.json arrives.
  `create table if not exists videos (
     id text primary key, title text, created_at integer, duration_sec real, thumbnail text,
     status text not null default 'uploading', updated_at integer not null)`,
  `create index if not exists videos_created on videos (created_at desc)`,
  `create table if not exists settings (key text primary key, value text)`,
];
// Full-text index over titles (trigram, so any part of a word matches). Kept separate so a
// database without it still works: search then falls back to a plain scan.
const FTS_SCHEMA = `create virtual table if not exists videos_fts using fts5(id unindexed, title, tokenize = 'trigram')`;

let schemaReady = null;
let hasFts = false;
function ensureSchema(env) {
  schemaReady ??= env.DB.batch(SCHEMA.map((sql) => env.DB.prepare(sql)))
    .then(() =>
      env.DB.prepare(FTS_SCHEMA)
        .run()
        .then(() => (hasFts = true))
        .catch((err) => console.warn("Full-text index unavailable, search will scan titles", err)),
    )
    .catch((err) => {
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

// ---- Recordings in D1 (version 3) ---------------------------------------------------------

const cleanTitle = (value) => clean(value, 200).replace(/\s+/g, " ");

function videoRow(row) {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    durationSec: row.duration_sec,
    thumbnail: row.thumbnail,
    ready: row.status === "ready",
  };
}

/** Statements that save a recording's details (from its meta.json) and its search entry. */
function saveVideoStatements(env, id, meta) {
  const title = cleanTitle(meta.title) || null;
  const statements = [
    env.DB.prepare(
      `insert into videos (id, title, created_at, duration_sec, thumbnail, status, updated_at) values (?, ?, ?, ?, ?, 'ready', ?)
       on conflict (id) do update set title = excluded.title, created_at = coalesce(excluded.created_at, videos.created_at),
         duration_sec = excluded.duration_sec, thumbnail = excluded.thumbnail, status = 'ready', updated_at = excluded.updated_at`,
    ).bind(
      id,
      title,
      typeof meta.createdAt === "number" ? meta.createdAt : null,
      typeof meta.durationSec === "number" ? meta.durationSec : null,
      typeof meta.thumbnail === "string" ? meta.thumbnail : null,
      Date.now(),
    ),
  ];
  if (hasFts) {
    statements.push(env.DB.prepare("delete from videos_fts where id = ?").bind(id));
    statements.push(env.DB.prepare("insert into videos_fts (id, title) values (?, ?)").bind(id, title ?? ""));
  }
  return statements;
}

let indexed = null;
/** Copies recordings made before version 3 into D1, once per database. */
function ensureIndexed(env) {
  indexed ??= (async () => {
    await ensureSchema(env);
    const done = await env.DB.prepare("select value from settings where key = 'indexed'").first();
    if (done) return;
    const found = await videosInBucket(env);
    const statements = [];
    for (const { id, meta } of found) {
      if (meta) statements.push(...saveVideoStatements(env, id, meta));
      else
        statements.push(
          env.DB.prepare("insert or ignore into videos (id, status, created_at, updated_at) values (?, 'uploading', ?, ?)").bind(id, null, Date.now()),
        );
    }
    statements.push(env.DB.prepare("insert or replace into settings (key, value) values ('indexed', ?)").bind(String(Date.now())));
    for (let i = 0; i < statements.length; i += 90) await env.DB.batch(statements.slice(i, i + 90));
  })().catch((err) => {
    indexed = null;
    throw err;
  });
  return indexed;
}

async function listRecordings(env) {
  if (!env.DB) {
    // No database bound: read the bucket directly, like version 2 did.
    const found = await videosInBucket(env);
    return found
      .map(({ id, meta }) => ({
        id,
        title: meta?.title ?? null,
        createdAt: meta?.createdAt ?? null,
        durationSec: meta?.durationSec ?? null,
        thumbnail: meta?.thumbnail ?? null,
        ready: Boolean(meta),
      }))
      .sort((x, y) => (y.createdAt ?? 0) - (x.createdAt ?? 0));
  }
  await ensureIndexed(env);
  const { results } = await env.DB.prepare("select * from videos order by coalesce(created_at, updated_at) desc limit 5000").all();
  return results.map(videoRow);
}

/**
 * Title search. Every word must appear somewhere in the title, in any order. Words of three
 * letters or more use the full-text index; shorter ones are checked directly. Titles that
 * start with the query come first, then the newest.
 */
async function searchRecordings(env, query, limit) {
  await ensureIndexed(env);
  const phrase = clean(query, 200).toLowerCase().replace(/\s+/g, " ");
  if (!phrase) {
    const { results } = await env.DB.prepare("select * from videos where status = 'ready' order by created_at desc limit ?").bind(limit).all();
    return results.map(videoRow);
  }
  const words = [...new Set(phrase.split(" "))].slice(0, 8);
  const long = hasFts ? words.filter((w) => w.length >= 3) : [];
  const short = words.filter((w) => !long.includes(w));
  const like = (w) => `%${w.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;

  let sql = "select v.* from videos v where v.status = 'ready'";
  const args = [];
  if (long.length) {
    sql += " and v.id in (select id from videos_fts where videos_fts match ?)";
    args.push(long.map((w) => `"${w.replace(/"/g, '""')}"`).join(" AND "));
  }
  for (const w of short) {
    sql += " and lower(v.title) like ? escape '\\'";
    args.push(like(w));
  }
  sql += " order by (lower(v.title) like ? escape '\\') desc, v.created_at desc limit ?";
  args.push(`${phrase.replace(/[\\%_]/g, (c) => `\\${c}`)}%`, limit);
  const { results } = await env.DB.prepare(sql).bind(...args).all();
  return results.map(videoRow);
}

async function renameRecording(env, id, title) {
  const object = await env.VIDEOS.get(`videos/${id}/meta.json`);
  if (!object) return false;
  const meta = { ...(await object.json()), title };
  await env.VIDEOS.put(`videos/${id}/meta.json`, JSON.stringify(meta), {
    httpMetadata: { contentType: "application/json", cacheControl: "no-cache" },
  });
  await ensureSchema(env);
  await env.DB.batch(saveVideoStatements(env, id, meta));
  return true;
}

/** Removes a recording's files, its row, and its comments, reactions and views. */
async function deleteRecording(env, id) {
  let cursor;
  do {
    const page = await env.VIDEOS.list({ prefix: `videos/${id}/`, cursor, limit: 1000 });
    const keys = page.objects.map((o) => o.key);
    if (keys.length) await env.VIDEOS.delete(keys);
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  await forgetRecording(env, id);
}

async function forgetRecording(env, id) {
  await ensureSchema(env);
  const statements = ["videos", "comments", "reactions"].map((table) =>
    env.DB.prepare(`delete from ${table} where ${table === "videos" ? "id" : "video_id"} = ?`).bind(id),
  );
  statements.push(env.DB.prepare("delete from views where video_id = ?").bind(id));
  if (hasFts) statements.push(env.DB.prepare("delete from videos_fts where id = ?").bind(id));
  await env.DB.batch(statements);
}

/** Keeps D1 in step with what the extension uploads and deletes. */
async function afterUpload(env, key, method, body) {
  if (!env.DB) return;
  const [, id, file] = key.split("/");
  if (method === "PUT" && file === "meta.json") {
    await ensureSchema(env);
    await env.DB.batch(saveVideoStatements(env, id, JSON.parse(new TextDecoder().decode(body))));
  } else if (method === "PUT" && file === "master.m3u8") {
    // A recording has started: show it as uploading until meta.json arrives.
    await ensureSchema(env);
    await env.DB.prepare("insert or ignore into videos (id, status, created_at, updated_at) values (?, 'uploading', ?, ?)")
      .bind(id, Date.now(), Date.now())
      .run();
  } else if (method === "DELETE" && file === "master.m3u8") {
    // The extension cancelled the recording.
    await forgetRecording(env, id);
  }
}

async function handleVideo(request, env, id) {
  if (!VIDEO_ID.test(id)) return json({ error: "bad_id" }, 400);
  if (request.method === "PATCH") {
    const input = await request.json().catch(() => ({}));
    const title = cleanTitle(input.title);
    if (!title) return json({ error: "empty" }, 400);
    return (await renameRecording(env, id, title)) ? json({ title }) : json({ error: "not_found" }, 404);
  }
  if (request.method === "DELETE") {
    await deleteRecording(env, id);
    return json({ ok: true });
  }
  return json({ error: "not_found" }, 404);
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
        const [videos, stats] = await Promise.all([listRecordings(env), counts(env).catch(() => ({}))]);
        return json({ videos: videos.map((v) => ({ ...v, ...(stats[v.id] ?? { views: 0, comments: 0, reactions: 0 }) })) });
      }
      if ((path === "/api/search" || path.startsWith("/api/videos/")) && !env.DB) return json({ error: "no_database" }, 501);
      if (path === "/api/search" && method === "GET") {
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 8, 1), 50);
        return json({ videos: await searchRecordings(env, url.searchParams.get("q") || "", limit) });
      }
      if (path.startsWith("/api/videos/")) return handleVideo(request, env, path.slice("/api/videos/".length));
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
          // The upload has succeeded either way; a database hiccup must not fail it.
          await afterUpload(env, key, method, body).catch((err) => console.error("Could not update D1", err));
          return json({ ok: true, size: body.byteLength });
        }
        if (method === "DELETE") {
          await env.VIDEOS.delete(key);
          await afterUpload(env, key, method).catch((err) => console.error("Could not update D1", err));
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
