import type { Metadata } from "next";
import { Logo } from "@/components/header";
import { CallbackStatus } from "./status";

export const metadata: Metadata = { title: "Connecting Cloudflare", robots: { index: false } };

export default function CallbackPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-6xl px-5 py-5 sm:px-8">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-24">
        <div className="w-full max-w-[460px] rounded-panel border border-line bg-surface p-8 shadow-pop sm:p-10">
          <CallbackStatus />
        </div>
      </main>
    </div>
  );
}
