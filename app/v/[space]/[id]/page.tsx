import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo } from "@/components/header";
import { VideoSocial } from "@/components/video-social";
import { ThemeToggle } from "@/components/theme-toggle";
import { MEDIA_URL } from "@/lib/config";

const SPACE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const ID = /^[a-z0-9]{8,64}$/;

type Meta = { title?: string | null; thumbnail?: string | null };

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
  return {
    title,
    description,
    robots,
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

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <VideoSocial
          space={space}
          id={id}
          src={`${base}/master.m3u8`}
          metaUrl={`${base}/meta.json`}
          poster={`${base}/thumb.jpg`}
          finishing={finishing}
        />
      </main>
    </div>
  );
}
