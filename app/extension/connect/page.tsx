import type { Metadata } from "next";
import Link from "next/link";
import { ExtensionHandoff } from "@/components/extension-handoff";
import { Logo } from "@/components/header";
import { buttonClass } from "@/components/ui";
import { MEDIA_URL } from "@/lib/config";
import { getWorkspace } from "@/lib/db";
import { requestOrigin } from "@/lib/origin";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Connect the extension", robots: { index: false } };

export default async function ExtensionConnectPage() {
  const { user } = await requireSession();
  const workspace = await getWorkspace(user.id);
  const origin = await requestOrigin();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-6xl px-5 py-5 sm:px-8">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-24">
        <div className="w-full max-w-[480px] rounded-panel border border-line bg-surface p-8 shadow-pop sm:p-10">
          {workspace ? (
            <ExtensionHandoff
              config={{
                version: 1,
                email: user.email,
                space: workspace.space,
                uploadUrl: workspace.worker_url,
                uploadKey: workspace.upload_key,
                mediaBase: `${MEDIA_URL}/${workspace.space}`,
                playerBase: `${origin}/v/${workspace.space}`,
              }}
            />
          ) : (
            <div>
              <h1 className="text-[28px] font-bold tracking-[-0.02em]">Connect Cloudflare first</h1>
              <p className="mt-2 text-muted">The extension needs to know where to save your videos. Connect Cloudflare from your dashboard, then come back.</p>
              <Link href="/dashboard" className={buttonClass("primary", "md", "mt-8")}>
                Go to dashboard
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
