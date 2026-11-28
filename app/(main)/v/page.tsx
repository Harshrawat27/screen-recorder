import type { Metadata } from "next";
import { Logo } from "@/components/header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Player } from "@/components/player";

export const metadata: Metadata = {
  title: "Video",
  robots: { index: false, follow: false },
};

// Share links look like /v#src=<playlist URL>. The part after # never reaches our
// server, so we serve the same empty page for every video and never learn which one.
export default function VideoPage() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <Player />
      </main>
    </div>
  );
}
