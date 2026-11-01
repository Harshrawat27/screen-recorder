import type { Metadata } from "next";
import { CallbackStatus } from "./status";

export const metadata: Metadata = { title: "Connecting Cloudflare", robots: { index: false } };

export default function CallbackPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <CallbackStatus />
    </main>
  );
}
