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
//   GET    /api/usage                       storage used, requests and storage operations (needs UPLOAD_KEY)
//   GET    /api/personal?user=…&kind=…     someone's Recent or Watch later list (needs UPLOAD_KEY)
//   POST   /api/personal                    add to Recent or Watch later (needs UPLOAD_KEY)
//   DELETE /api/personal                    remove from Watch later (needs UPLOAD_KEY)
//   GET    /api/folders                     folders with their video counts (needs UPLOAD_KEY)
//   POST   /api/folders                     create a folder (needs UPLOAD_KEY)
//   PATCH  /api/folders/<id>                rename a folder (needs UPLOAD_KEY)
//   DELETE /api/folders/<id>                delete a folder; its videos go back to the library (needs UPLOAD_KEY)
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

const VERSION = 5;
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
     status text not null default 'uploading', updated_at integer not null, folder_id text, bytes integer)`,
  `create index if not exists videos_created on videos (created_at desc)`,
  `create table if not exists settings (key text primary key, value text)`,
  `create table if not exists folders (id text primary key, name text not null, created_at integer not null, updated_at integer not null)`,
  // Version 5: each person's Recent and Watch later. Videos can be from any workspace, so they
  // are stored by space and id. Keyed by account, so team members each keep their own lists.
  `create table if not exists personal (
     user_id text not null, kind text not null, space text not null, video_id text not null, at integer not null,
     primary key (user_id, kind, space, video_id))`,
  `create index if not exists personal_recent on personal (user_id, kind, at desc)`,
  // Version 3: this Worker's own count of its requests and storage operations, per UTC day.
  `create table if not exists usage_daily (
     day text primary key, requests integer not null default 0, class_a integer not null default 0,
     class_b integer not null default 0)`,
];
// Full-text index over titles (trigram, so any part of a word matches). Kept separate so a
// database without it still works: search then falls back to a plain scan.
const FTS_SCHEMA = `create virtual table if not exists videos_fts using fts5(id unindexed, title, tokenize = 'trigram')`;

let schemaReady = null;
let hasFts = false;
function ensureSchema(env) {
  schemaReady ??= env.DB.batch(SCHEMA.map((sql) => env.DB.prepare(sql)))
    // Databases made by an early build of version 3 have no folder column yet.
    .then(() => env.DB.prepare("alter table videos add column folder_id text").run().catch(() => {}))
    .then(() => env.DB.prepare("alter table videos add column bytes integer").run().catch(() => {}))
    .then(() => env.DB.prepare("create index if not exists videos_folder on videos (folder_id)").run())
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
    folderId: row.folder_id ?? null,
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
    // The recording is complete: note its size once, for the Usage page.
    await measureVideo(env, id);
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
    // Move to a folder (or back to the library with null).
    if ("folderId" in input) {
      await ensureIndexed(env);
      const folderId = input.folderId === null ? null : String(input.folderId);
      if (folderId && !(await env.DB.prepare("select id from folders where id = ?").bind(folderId).first())) {
        return json({ error: "no_folder" }, 404);
      }
      const moved = await env.DB.prepare("update videos set folder_id = ? where id = ?").bind(folderId, id).run();
      if (moved.meta && moved.meta.changes === 0) return json({ error: "not_found" }, 404);
      if (folderId) await env.DB.prepare("update folders set updated_at = ? where id = ?").bind(Date.now(), folderId).run();
      if (input.title === undefined) return json({ folderId });
    }
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

// ---- Folders -----------------------------------------------------------------------------
//
// One level of folders. A recording is in at most one folder (videos.folder_id); deleting a
// folder puts its recordings back in the library, it never deletes them.

const FOLDER_ID = /^[a-z0-9]{8,64}$/;
const cleanName = (value) => clean(value, 80).replace(/\s+/g, " ");

async function listFolders(env) {
  await ensureIndexed(env);
  const { results } = await env.DB.prepare(
    `select f.id, f.name, f.created_at, f.updated_at, count(v.id) as videos
     from folders f left join videos v on v.folder_id = f.id and v.status = 'ready'
     group by f.id order by lower(f.name)`,
  ).all();
  return results.map((r) => ({ id: r.id, name: r.name, createdAt: r.created_at, updatedAt: r.updated_at, videos: r.videos }));
}

async function handleFolders(request, env, path) {
  const id = path.slice("/api/folders".length).replace(/^\//, "");
  const method = request.method;
  await ensureIndexed(env);
  if (!id && method === "GET") return json({ folders: await listFolders(env) });
  if (!id && method === "POST") {
    const name = cleanName((await request.json().catch(() => ({}))).name);
    if (!name) return json({ error: "empty" }, 400);
    const now = Date.now();
    const folder = { id: crypto.randomUUID().replace(/-/g, "").slice(0, 20), name, createdAt: now, updatedAt: now, videos: 0 };
    await env.DB.prepare("insert into folders (id, name, created_at, updated_at) values (?, ?, ?, ?)").bind(folder.id, name, now, now).run();
    return json({ folder });
  }
  if (!FOLDER_ID.test(id)) return json({ error: "bad_id" }, 400);
  const exists = await env.DB.prepare("select id from folders where id = ?").bind(id).first();
  if (!exists) return json({ error: "not_found" }, 404);
  if (method === "PATCH") {
    const name = cleanName((await request.json().catch(() => ({}))).name);
    if (!name) return json({ error: "empty" }, 400);
    await env.DB.prepare("update folders set name = ?, updated_at = ? where id = ?").bind(name, Date.now(), id).run();
    return json({ name });
  }
  if (method === "DELETE") {
    await env.DB.batch([
      env.DB.prepare("update videos set folder_id = null where folder_id = ?").bind(id),
      env.DB.prepare("delete from folders where id = ?").bind(id),
    ]);
    return json({ ok: true });
  }
  return json({ error: "not_found" }, 404);
}

/** Folders whose name contains every word of the query. */
async function searchFolders(env, query, limit) {
  const words = [...new Set(clean(query, 200).toLowerCase().split(/\s+/).filter(Boolean))].slice(0, 8);
  if (!words.length) return [];
  await ensureIndexed(env);
  const like = (w) => `%${w.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const { results } = await env.DB.prepare(
    `select f.id, f.name, (select count(*) from videos v where v.folder_id = f.id and v.status = 'ready') as videos
     from folders f where ${words.map(() => "lower(f.name) like ? escape '\\'").join(" and ")} order by lower(f.name) limit ?`,
  )
    .bind(...words.map(like), limit)
    .all();
  return results.map((r) => ({ id: r.id, name: r.name, videos: r.videos }));
}

// ---- Recent and Watch later ----------------------------------------------------------------

const KINDS = new Set(["recent", "watch_later"]);
const LIMITS = { recent: 25, watch_later: 500 };
const SPACE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const USER_ID = /^[A-Za-z0-9_-]{1,100}$/;

async function handlePersonal(request, env, url) {
  await ensureSchema(env);
  if (request.method === "GET") {
    const user = url.searchParams.get("user") || "";
    const kind = url.searchParams.get("kind") || "";
    if (!USER_ID.test(user) || !KINDS.has(kind)) return json({ error: "bad_request" }, 400);
    const { results } = await env.DB.prepare("select space, video_id, at from personal where user_id = ? and kind = ? order by at desc limit ?")
      .bind(user, kind, LIMITS[kind])
      .all();
    return json({ items: results.map((r) => ({ space: r.space, videoId: r.video_id, at: r.at })) });
  }
  const input = await request.json().catch(() => ({}));
  const { userId, kind, space, videoId } = input;
  if (!USER_ID.test(String(userId)) || !KINDS.has(kind) || !SPACE.test(String(space)) || !VIDEO_ID.test(String(videoId))) {
    return json({ error: "bad_request" }, 400);
  }
  if (request.method === "POST") {
    await env.DB.batch([
      env.DB.prepare(
        "insert into personal (user_id, kind, space, video_id, at) values (?, ?, ?, ?, ?) on conflict (user_id, kind, space, video_id) do update set at = excluded.at",
      ).bind(userId, kind, space, videoId, Date.now()),
      // Keep each list to its limit: Recent holds the last 25 videos.
      env.DB.prepare(
        `delete from personal where rowid in (
           select rowid from personal where user_id = ? and kind = ? order by at desc limit -1 offset ?)`,
      ).bind(userId, kind, LIMITS[kind]),
    ]);
    return json({ ok: true });
  }
  if (request.method === "DELETE") {
    await env.DB.prepare("delete from personal where user_id = ? and kind = ? and space = ? and video_id = ?").bind(userId, kind, space, videoId).run();
    return json({ ok: true });
  }
  return json({ error: "not_found" }, 404);
}

// ---- Usage -------------------------------------------------------------------------------
//
// Cloudflare's free plan limits Worker requests per day and storage operations per month. The
// Worker counts its own requests and the storage calls it makes, in memory, and adds them to
// D1 every half minute or so (one small write), so counting costs almost nothing. Counts from
// an instance that shuts down before its next write are lost, so the numbers are close, not
// exact; Cloudflare's dashboard has the exact ones.

const tally = { day: "", requests: 0, classA: 0, classB: 0, lastWrite: Date.now() };
const today = () => new Date().toISOString().slice(0, 10);

function count(field, n = 1) {
  const day = today();
  if (tally.day !== day) {
    // A new day: whatever is still pending belongs to the previous one.
    if (tally.day && (tally.requests || tally.classA || tally.classB)) tally.carry = { ...tally };
    Object.assign(tally, { day, requests: 0, classA: 0, classB: 0 });
  }
  tally[field] += n;
}

/** The bucket, with every call counted the way R2 bills it (deletes are free). */
function countedBucket(bucket) {
  const classA = new Set(["put", "list", "createMultipartUpload", "resumeMultipartUpload"]);
  const classB = new Set(["get", "head"]);
  return new Proxy(bucket, {
    get(target, prop) {
      const value = target[prop];
      if (typeof value !== "function") return value;
      return (...args) => {
        if (classA.has(prop)) count("classA");
        else if (classB.has(prop)) count("classB");
        return value.apply(target, args);
      };
    },
  });
}

async function writeTally(env) {
  if (!env.DB) return;
  const batches = [];
  if (tally.carry) {
    batches.push(tally.carry);
    delete tally.carry;
  }
  if (tally.requests || tally.classA || tally.classB) batches.push({ ...tally });
  Object.assign(tally, { requests: 0, classA: 0, classB: 0, lastWrite: Date.now() });
  if (!batches.length) return;
  await ensureSchema(env);
  await env.DB.batch(
    batches.map((t) =>
      env.DB.prepare(
        `insert into usage_daily (day, requests, class_a, class_b) values (?, ?, ?, ?)
         on conflict (day) do update set requests = requests + excluded.requests,
           class_a = class_a + excluded.class_a, class_b = class_b + excluded.class_b`,
      ).bind(t.day, t.requests, t.classA, t.classB),
    ),
  );
}

/**
 * Adds up one recording's files and saves the total. Done once per recording, when it
 * finishes, so the Usage page only has to add up numbers. (Listing the whole bucket in one
 * request would run past the free plan's CPU limit once there are a few thousand files.)
 */
async function measureVideo(env, id) {
  let bytes = 0;
  let cursor;
  do {
    const page = await env.VIDEOS.list({ prefix: `videos/${id}/`, cursor, limit: 1000 });
    for (const object of page.objects) bytes += object.size;
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  await env.DB.prepare("update videos set bytes = ? where id = ?").bind(bytes, id).run();
  return bytes;
}

// Recordings made before sizes were saved are measured a few at a time, on each Usage visit.
const MEASURE_PER_VISIT = 4;

async function usage(env) {
  await ensureIndexed(env);
  await writeTally(env); // include this instance's latest counts
  const unmeasured = await env.DB.prepare("select id from videos where status = 'ready' and bytes is null limit ?").bind(MEASURE_PER_VISIT).all();
  for (const row of unmeasured.results) await measureVideo(env, row.id);

  const day = today();
  const month = day.slice(0, 7);
  const [totals, largest, rows, size, first] = await Promise.all([
    env.DB.prepare(
      `select coalesce(sum(bytes), 0) as bytes, count(*) as recordings, sum(case when bytes is null then 1 else 0 end) as pending
       from videos where status = 'ready'`,
    ).first(),
    env.DB.prepare("select id, title, created_at, bytes from videos where bytes is not null order by bytes desc limit 8").all(),
    env.DB.prepare("select day, requests, class_a, class_b from usage_daily where day >= ? order by day").bind(`${month}-01`).all(),
    env.DB.prepare("select count(*) as n from videos").run(),
    env.DB.prepare("select min(day) as day from usage_daily").first(),
  ]);
  const days = rows.results;
  const sum = (field) => days.reduce((total, row) => total + row[field], 0);
  const todayRow = days.find((row) => row.day === day);
  return {
    storage: {
      bytes: totals.bytes,
      recordings: totals.recordings,
      // Older recordings not measured yet; each visit measures a few more.
      pending: totals.pending ?? 0,
      measuredAt: Date.now(),
      largest: largest.results.map((r) => ({ id: r.id, title: r.title, createdAt: r.created_at, bytes: r.bytes })),
    },
    today: { day, requests: todayRow?.requests ?? 0, classA: todayRow?.class_a ?? 0, classB: todayRow?.class_b ?? 0 },
    month: { month, requests: sum("requests"), classA: sum("class_a"), classB: sum("class_b"), days },
    database: { bytes: size.meta?.size_after ?? null },
    countingSince: first?.day ?? day,
  };
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
  async fetch(request, rawEnv, ctx) {
    count("requests");
    const env = { ...rawEnv, VIDEOS: countedBucket(rawEnv.VIDEOS) };
    if (env.DB && ctx?.waitUntil && Date.now() - tally.lastWrite > 30_000) {
      ctx.waitUntil(writeTally(env).catch((err) => console.error("Could not save usage", err)));
    }
    return route(request, env);
  },
};

async function route(request, env) {
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
    if ((path === "/api/search" || path.startsWith("/api/videos/") || path.startsWith("/api/folders") || path === "/api/personal") && !env.DB) {
      return json({ error: "no_database" }, 501);
    }
    if (path === "/api/usage" && method === "GET") {
      if (!env.DB) return json({ error: "no_database" }, 501);
      return json(await usage(env));
    }
    if (path === "/api/search" && method === "GET") {
      const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 8, 1), 50);
      const q = url.searchParams.get("q") || "";
      const [videos, folders] = await Promise.all([searchRecordings(env, q, limit), searchFolders(env, q, 5)]);
      return json({ videos, folders });
    }
    if (path === "/api/folders" || path.startsWith("/api/folders/")) return handleFolders(request, env, path);
    if (path === "/api/personal") return handlePersonal(request, env, url);
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
}

export default worker;
