import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmbedPlayer } from "@/components/embed-player";
import { MEDIA_URL } from "@/lib/config";
import { getWorkspaceBySpace } from "@/lib/db";
import { showsBadge } from "@/lib/plan";

// The page inside an embed (<iframe>) on another website: just the player. Built once and kept for
// five minutes, so a busy embed costs almost nothing to serve. Framing is allowed for this path
// only (next.config.ts).

export const revalidate = 300;
// No pages are built ahead of time; each is built the first time it's opened, then cached.
export async function generateStaticParams() {
  return [];
}

const SPACE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const ID = /^[a-z0-9]{8,64}$/;

type Params = { params: Promise<{ space: string; id: string }> };

async function readTitle(base: string): Promise<string | null> {
  try {
    const res = await fetch(`${base}/meta.json`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(2500) });
    return res.ok ? (((await res.json()) as { title?: string | null }).title ?? null) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { space, id } = await params;
  const title = SPACE.test(space) && ID.test(id) ? await readTitle(`${MEDIA_URL}/${space}/videos/${id}`) : null;
  return { title: title || "Video", robots: { index: false, follow: false } };
}

export default async function EmbedPage({ params }: Params) {
  const { space, id } = await params;
  if (!SPACE.test(space) || !ID.test(id)) notFound();
  const ws = await getWorkspaceBySpace(space).catch(() => null);
  if (!ws) notFound();
  const base = `${MEDIA_URL}/${space}/videos/${id}`;
  return (
    <main className="h-dvh overflow-hidden bg-black">
      <EmbedPlayer space={space} id={id} src={`${base}/master.m3u8`} poster={`${base}/thumb.jpg`} badge={await showsBadge(ws.owner_id)} />
    </main>
  );
}
