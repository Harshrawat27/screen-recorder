import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo } from "@/components/header";
import { Player } from "@/components/player";
import { ThemeToggle } from "@/components/theme-toggle";
import { MEDIA_URL } from "@/lib/config";

export const metadata: Metadata = { title: "Video", robots: { index: false, follow: false } };

const SPACE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const ID = /^[a-z0-9]{8,64}$/;

// Short share links: /v/<space>/<id>. The video streams from media.showthrough.com,
// which fetches it from the sender's own Cloudflare account.
export default async function SharedVideoPage({ params }: PageProps<"/v/[space]/[id]">) {
  const { space, id } = await params;
  if (!SPACE.test(space) || !ID.test(id)) notFound();
  const base = `${MEDIA_URL}/${space}/videos/${id}`;

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <Player src={`${base}/master.m3u8`} metaUrl={`${base}/meta.json`} />
      </main>
    </div>
  );
}
