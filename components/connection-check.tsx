"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckIcon, buttonClass } from "@/components/ui";

// Checks the user's own video backend from *this* browser, the same path the
// extension uploads through: reach the workers.dev address, upload a chunk,
// play it back through media.showthrough.com, then delete it again.
// Test files live under videos/stcheck…/ and are hidden from the library.

type State = "waiting" | "running" | "ok" | "fail";
type Row = { state: State; detail: string };
type Steps = { address: Row; upload: Row; playback: Row };

type Stress = {
  state: "idle" | "running" | "done";
  done: number;
  total: number;
  times: number[];
  failures: string[];
  results: boolean[];
};

const CHUNK_BYTES = 700_000; // about one 2-second piece of a recording
const STRESS_CHUNKS = 15; // about 30 seconds of recording
const TIMEOUT_MS = 20_000;

const initialSteps = (): Steps => ({
  address: { state: "waiting", detail: "" },
  upload: { state: "waiting", detail: "" },
  playback: { state: "waiting", detail: "" },
});

function testId() {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return `stcheck${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

function randomBytes(size: number) {
  const out = new Uint8Array(size);
  for (let i = 0; i < size; i += 65_536) crypto.getRandomValues(out.subarray(i, Math.min(i + 65_536, size)));
  return out;
}

function ms(n: number) {
  return n < 1000 ? `${Math.round(n)} ms` : `${(n / 1000).toFixed(1)} s`;
}

function explain(status: number, what: string) {
  if (status === 0) return `Couldn't reach it from this browser. If you connected Cloudflare in the last few minutes, wait a minute and run the check again.`;
  if (status === 401) return "The upload key doesn't match. Connect Cloudflare again to refresh it.";
  if (status === 404) return `${what} isn't there. Connect Cloudflare again to redeploy it.`;
  if (status === 503 || status === 1102 || status === 429) return `Cloudflare turned the request away (HTTP ${status}). This usually means a free-plan limit on the Worker.`;
  return `${what} answered with HTTP ${status}.`;
}

async function timed(input: string, init?: RequestInit) {
  const start = performance.now();
  try {
    const res = await fetch(input, { cache: "no-store", ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
    const body = await res.arrayBuffer();
    return { status: res.status, ok: res.ok, body, time: performance.now() - start };
  } catch {
    return { status: 0, ok: false, body: new ArrayBuffer(0), time: performance.now() - start };
  }
}

function Dot({ state }: { state: State }) {
  if (state === "ok")
    return (
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-success text-white">
        <CheckIcon className="size-3.5" />
      </span>
    );
  if (state === "fail")
    return (
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-danger text-white" aria-hidden>
        <svg viewBox="0 0 20 20" className="size-3.5" fill="none">
          <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
    );
  if (state === "running")
    return <span className="size-6 shrink-0 animate-spin rounded-full border-[2.5px] border-line border-t-brand" aria-hidden />;
  return <span className="size-6 shrink-0 rounded-full border-[2.5px] border-line" aria-hidden />;
}

export function ConnectionCheck({
  workerUrl,
  uploadKey,
  space,
  mediaBase,
}: {
  workerUrl: string;
  uploadKey: string;
  space: string;
  mediaBase: string;
}) {
  const [steps, setSteps] = useState<Steps>(initialSteps);
  const [running, setRunning] = useState(false);
  const [checkedAt, setCheckedAt] = useState<number | null>(null);
  const [stress, setStress] = useState<Stress>({ state: "idle", done: 0, total: STRESS_CHUNKS, times: [], failures: [], results: [] });
  const started = useRef(false);

  const auth = { authorization: `Bearer ${uploadKey}` };
  const fileUrl = (id: string, name: string) => `${workerUrl}/api/upload/videos/${id}/${name}`;

  const run = useCallback(async () => {
    setRunning(true);
    setSteps(initialSteps());
    const set = (key: keyof Steps, row: Row) => setSteps((s) => ({ ...s, [key]: row }));
    const skip = (...keys: (keyof Steps)[]) => keys.forEach((k) => set(k, { state: "fail", detail: "Skipped because the step above failed." }));

    // 1. The workers.dev address answers
    set("address", { state: "running", detail: "Contacting your video address…" });
    const health = await timed(`${workerUrl}/health`);
    let version: number | undefined;
    try {
      version = JSON.parse(new TextDecoder().decode(health.body)).version;
    } catch {}
    if (!health.ok) {
      set("address", { state: "fail", detail: explain(health.status, "Your video backend") });
      skip("upload", "playback");
      setRunning(false);
      setCheckedAt(Date.now());
      return;
    }
    set("address", { state: "ok", detail: `Answered in ${ms(health.time)}${version ? `, backend version ${version}` : ""}.` });

    // 2. Upload one chunk the size the recorder sends
    const id = testId();
    const payload = randomBytes(CHUNK_BYTES);
    set("upload", { state: "running", detail: "Uploading a test chunk…" });
    const put = await timed(fileUrl(id, "check.bin"), {
      method: "PUT",
      headers: { ...auth, "content-type": "application/octet-stream", "cache-control": "no-store" },
      body: payload,
    });
    if (!put.ok) {
      set("upload", { state: "fail", detail: explain(put.status, "The upload") });
      skip("playback");
      setRunning(false);
      setCheckedAt(Date.now());
      return;
    }
    const mbps = (CHUNK_BYTES * 8) / 1_000_000 / (put.time / 1000);
    set("upload", {
      state: "ok",
      detail: `${Math.round(CHUNK_BYTES / 1000)} KB in ${ms(put.time)} (${mbps.toFixed(1)} Mbps). ${put.time < 2000 ? "Fast enough to keep up while recording." : "Slower than recording speed, so uploads will fall behind."}`,
    });

    // 3. Play it back through media.showthrough.com, like a share link
    set("playback", { state: "running", detail: "Fetching it through your share link address…" });
    const get = await timed(`${mediaBase}/${space}/videos/${id}/check.bin`);
    if (!get.ok) set("playback", { state: "fail", detail: explain(get.status, "media.showthrough.com") });
    else if (get.body.byteLength !== CHUNK_BYTES)
      set("playback", { state: "fail", detail: `Got ${get.body.byteLength} bytes back instead of ${CHUNK_BYTES}.` });
    else set("playback", { state: "ok", detail: `Played back in ${ms(get.time)}.` });

    // 4. Clean up
    await timed(fileUrl(id, "check.bin"), { method: "DELETE", headers: auth });
    setRunning(false);
    setCheckedAt(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerUrl, uploadKey, space, mediaBase]);

  const runStress = useCallback(async () => {
    const id = testId();
    const payload = randomBytes(CHUNK_BYTES);
    const times: number[] = [];
    const failures: string[] = [];
    const results: boolean[] = [];
    setStress({ state: "running", done: 0, total: STRESS_CHUNKS, times, failures, results });
    // One at a time, in order: the same way the extension uploads.
    for (let i = 0; i < STRESS_CHUNKS; i++) {
      const put = await timed(fileUrl(id, `seg${i}.bin`), {
        method: "PUT",
        headers: { ...auth, "content-type": "application/octet-stream", "cache-control": "no-store" },
        body: payload,
      });
      results.push(put.ok);
      if (put.ok) times.push(put.time);
      else failures.push(put.status === 0 ? "network error" : `HTTP ${put.status}`);
      setStress({ state: "running", done: i + 1, total: STRESS_CHUNKS, times: [...times], failures: [...failures], results: [...results] });
    }
    await Promise.all(
      Array.from({ length: STRESS_CHUNKS }, (_, i) => timed(fileUrl(id, `seg${i}.bin`), { method: "DELETE", headers: auth })),
    );
    setStress({ state: "done", done: STRESS_CHUNKS, total: STRESS_CHUNKS, times, failures, results });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerUrl, uploadKey]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    Promise.resolve().then(run);
  }, [run]);

  const rows: { key: keyof Steps; title: string }[] = [
    { key: "address", title: "Video address is online" },
    { key: "upload", title: "Uploads work" },
    { key: "playback", title: "Share links play" },
  ];
  const allOk = rows.every((r) => steps[r.key].state === "ok");
  const anyFail = rows.some((r) => steps[r.key].state === "fail");
  const host = workerUrl.replace(/^https?:\/\//, "");

  const avg = stress.times.length ? stress.times.reduce((a, b) => a + b, 0) / stress.times.length : 0;
  const slowest = stress.times.length ? Math.max(...stress.times) : 0;
  const failureSummary = Object.entries(
    stress.failures.reduce<Record<string, number>>((acc, f) => ({ ...acc, [f]: (acc[f] ?? 0) + 1 }), {}),
  )
    .map(([f, n]) => `${f} ×${n}`)
    .join(", ");

  return (
    <section aria-labelledby="connection" className="mt-12 max-w-3xl rounded-panel border border-line bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 id="connection" className="text-xl font-bold tracking-tight">
              Connection
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                running ? "bg-sunken text-muted" : allOk ? "bg-success/15 text-success" : anyFail ? "bg-danger/15 text-danger" : "bg-sunken text-muted"
              }`}
            >
              {running ? "Checking…" : allOk ? "All good" : anyFail ? "Problem found" : "Not checked"}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-muted">
            Tested from this browser against <span className="font-mono text-[13px] text-text">{host}</span>
          </p>
        </div>
        <button type="button" onClick={run} disabled={running || stress.state === "running"} className={buttonClass("secondary", "sm")}>
          {running ? "Checking…" : "Check again"}
        </button>
      </div>

      <ol className="mt-6 space-y-4">
        {rows.map(({ key, title }) => (
          <li key={key} className="flex gap-3">
            <Dot state={steps[key].state} />
            <div className="min-w-0">
              <p className={`font-semibold ${steps[key].state === "waiting" ? "text-faint" : ""}`}>{title}</p>
              {steps[key].detail && <p className="mt-0.5 text-sm text-muted">{steps[key].detail}</p>}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 border-t border-line pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold">Recording test</p>
            <p className="mt-0.5 text-sm text-muted">Uploads {STRESS_CHUNKS} chunks one after another, like 30 seconds of recording.</p>
          </div>
          <button type="button" onClick={runStress} disabled={running || stress.state === "running"} className={buttonClass("secondary", "sm")}>
            {stress.state === "running" ? `Uploading ${stress.done}/${stress.total}…` : stress.state === "done" ? "Run again" : "Run test"}
          </button>
        </div>

        {stress.state !== "idle" && (
          <div className="mt-4">
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: stress.total }, (_, i) => (
                <span
                  key={i}
                  className={`h-2 flex-1 rounded-full ${i >= stress.results.length ? "bg-sunken" : stress.results[i] ? "bg-success" : "bg-danger"}`}
                />
              ))}
            </div>
            {stress.state === "done" && (
              <p className={`mt-3 text-sm ${stress.failures.length ? "text-danger" : "text-muted"}`}>
                {stress.times.length} of {stress.total} uploaded
                {stress.times.length > 0 && `, average ${ms(avg)}, slowest ${ms(slowest)}`}.
                {stress.failures.length > 0
                  ? ` ${stress.failures.length} failed (${failureSummary}). Failed chunks are what make the extension pause and catch up later.`
                  : slowest < 2000
                    ? " Every chunk finished faster than the recorder makes them, so links stay live."
                    : " Some chunks took longer than 2 seconds, so uploads will fall behind on long recordings."}
              </p>
            )}
          </div>
        )}
      </div>

      {checkedAt && !running && (
        <p className="mt-5 text-xs text-faint">Last checked {new Date(checkedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}. Test files are deleted afterwards.</p>
      )}
    </section>
  );
}
