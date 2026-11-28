import type { Metadata } from "next";
import { Logo } from "@/components/header";
import { RecordStage } from "@/components/record-stage";

export const metadata: Metadata = { title: "Record", robots: { index: false } };

// Opened by the extension when the current tab can't show the recording controls (Chrome's own
// pages, the Web Store, new tabs). The extension opens its panel on this page by itself.
export default function RecordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-6xl px-5 py-5 sm:px-8">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-24">
        <RecordStage />
      </main>
    </div>
  );
}
