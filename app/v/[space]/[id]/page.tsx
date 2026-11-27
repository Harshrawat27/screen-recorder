import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoSocial } from "@/components/video-social";
import { MEDIA_URL } from "@/lib/config";
import { site } from "@/lib/site";
import { getWorkspaceBySpace } from "@/lib/db";
import { ownerFeatures, showsBadge } from "@/lib/plan";
import { getSession } from "@/lib/session";
import { managesVideo } from "@/lib/video-files";

const SPACE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const ID = /^[a-z0-9]{8,64}$/;

type Meta = { title?: string | null; thumbnail?: string | null; createdAt?: number | null };

async function readMeta(base: string): Promise<Meta | null> {
  try {
    const res = await fetch(`${base}/meta.json`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(2500) });
    return res.ok ? ((await res.json()) as Meta) : null;
  } catch {
    return null;
  }
}

// Link previews (Slack, WhatsApp, X, iMessage): the recording's title and thumbnail.
export async function generateMetadata({ params }: PageProps<"/v/[space]/[id]">): Promise<Metadata> {
  const { space, id } = await params;
  const robots = { index: false, follow: false };
  if (!SPACE.test(space) || !ID.test(id)) return { title: "Video", robots };
  const base = `${MEDIA_URL}/${space}/videos/${id}`;
  const meta = await readMeta(base);
  const title = meta?.title || "Screen recording";
  const image = meta?.thumbnail ? `${base}/${meta.thumbnail}` : undefined;
  const description = "A screen recording shared with Showthrough. Opens in your browser, no account needed.";
  // Pasting the link into Notion, Medium and the like embeds the player (app/api/oembed).
  const oembed = `${site.url}/api/oembed?url=${encodeURIComponent(`${site.url}/v/${space}/${id}`)}`;
  return {
    title,
    description,
    robots,
    alternates: { types: { "application/json+oembed": oembed } },
    openGraph: { title, description, type: "video.other", siteName: "Showthrough", images: image ? [{ url: image, width: 1280, height: 720 }] : undefined },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : undefined },
  };
}

// Short share links: /v/<space>/<id>. The video streams from media.showthrough.com,
// which fetches it from the sender's own Cloudflare account.
export default async function SharedVideoPage({ params, searchParams }: PageProps<"/v/[space]/[id]">) {
  const { space, id } = await params;
  // Opened by the extension the moment recording finished: the last seconds may still be uploading.
  const finishing = (await searchParams).finishing !== undefined;
  if (!SPACE.test(space) || !ID.test(id)) notFound();
  const base = `${MEDIA_URL}/${space}/videos/${id}`;
  // Read on the server so the page arrives with its title and its final layout: comments need
  // version 2 of the owner's Worker.
  const [meta, ws] = await Promise.all([readMeta(base), getWorkspaceBySpace(space).catch(() => null)]);
  // What the sender's plan includes: comments (paid), and whether "Recorded with" shows.
  const [features, badge] = ws ? await Promise.all([ownerFeatures(ws.owner_id), showsBadge(ws.owner_id)]) : [null, true];
  // On the free plan only the sender sees the comments panel (locked: using it offers the upgrade).
  const ownerOnFree = Boolean(ws && features && !features.comments && (await managesVideo(ws, id, (await getSession())?.user.id)));

  return (
    <div className="min-h-screen">
      <VideoSocial
        space={space}
        id={id}
        src={`${base}/master.m3u8`}
        metaUrl={`${base}/meta.json`}
        poster={`${base}/thumb.jpg`}
        finishing={finishing}
        title={meta?.title || null}
        createdAt={typeof meta?.createdAt === "number" ? meta.createdAt : null}
        commentsOn={Boolean(ws && ws.worker_version >= 2 && (features?.comments || ownerOnFree))}
        badge={badge}
      />
    </div>
  );
}
