import { NextResponse } from "next/server";
import { MEDIA_URL } from "@/lib/config";
import { getWorkspaceBySpace } from "@/lib/db";
import { embedUrl } from "@/lib/embed";
import { site } from "@/lib/site";

// oEmbed (https://oembed.com): Notion, Medium, Ghost, WordPress and others ask this when someone
// pastes a Showthrough link, and show the player instead of a plain link. Share pages point here
// from their <head>.

const LINK = /^\/(?:v|embed)\/([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)\/([a-z0-9]{8,64})\/?$/;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  let path = "";
  try {
    const url = new URL(params.get("url") ?? "");
    if (url.hostname !== new URL(site.url).hostname && url.hostname !== new URL(site.url).hostname.replace(/^www\./, "")) throw new Error();
    path = url.pathname;
  } catch {
    return NextResponse.json({ error: "Not a Showthrough link" }, { status: 404 });
  }
  const match = LINK.exec(path);
  if (!match) return NextResponse.json({ error: "Not a Showthrough video" }, { status: 404 });
  const [, space, id] = match;
  if (!(await getWorkspaceBySpace(space).catch(() => null))) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const base = `${MEDIA_URL}/${space}/videos/${id}`;
  const meta = await fetch(`${base}/meta.json`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(2500) })
    .then((res) => (res.ok ? (res.json() as Promise<{ title?: string | null }>) : null))
    .catch(() => null);
  const maxWidth = Number(params.get("maxwidth")) || 0;
  const width = maxWidth > 0 ? Math.min(maxWidth, 1280) : 1280;
  const height = Math.round((width * 9) / 16);
  const title = meta?.title || "Screen recording";
  const esc = (text: string) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  return NextResponse.json(
    {
      version: "1.0",
      type: "video",
      provider_name: site.name,
      provider_url: site.url,
      title,
      width,
      height,
      thumbnail_url: `${base}/thumb.jpg`,
      thumbnail_width: 1280,
      thumbnail_height: 720,
      html: `<iframe src="${embedUrl(space, id)}" width="${width}" height="${height}" title="${esc(title)}" style="border:0;" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`,
    },
    { headers: { "cache-control": "public, max-age=300", "access-control-allow-origin": "*" } },
  );
}
