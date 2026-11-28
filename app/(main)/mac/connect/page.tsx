import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/header";
import { MacHandoff } from "@/components/mac-handoff";
import { buttonClass } from "@/components/ui";
import { createHandoff, macAccounts } from "@/lib/mac-handoff";
import { requestOrigin } from "@/lib/origin";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Connect the Mac app", robots: { index: false } };
export const dynamic = "force-dynamic";

// The Mac app opens this page in the browser. Signed in, it hands the app every place this
// person can record into and sends them back with showthrough://connect.
export default async function MacConnectPage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state = "" } = await searchParams;
  const safeState = /^[A-Za-z0-9_-]{8,64}$/.test(state) ? state : "";
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(`/mac/connect?state=${safeState}`)}`);
  const { user } = session;
  const { accounts, needsUpdate } = await macAccounts(user, await requestOrigin());

  let content;
  if (!safeState) {
    content = (
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">Start from the app</h1>
        <p className="mt-2 text-muted">Open Showthrough on your Mac and press Connect. It brings you back here.</p>
      </div>
    );
  } else if (!accounts.length) {
    content = (
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">
          {needsUpdate.length ? "Your team's video backend needs an update" : "Connect Cloudflare first"}
        </h1>
        <p className="mt-2 text-muted">
          {needsUpdate.length
            ? "Ask your admin to press Update in their dashboard, then press Connect in the app again."
            : "The app needs to know where to save your videos. Connect Cloudflare from your dashboard (one click), then press Connect in the app again. You can still save recordings on your Mac without connecting."}
        </p>
        <Link href="/dashboard" className={buttonClass("primary", "md", "mt-8")}>
          Go to dashboard
        </Link>
      </div>
    );
  } else {
    const code = await createHandoff(user.id, accounts);
    const href = `showthrough://connect?code=${encodeURIComponent(code)}&state=${encodeURIComponent(safeState)}`;
    content = <MacHandoff href={href} places={accounts.map((a) => a.teamName)} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-6xl px-5 py-5 sm:px-8">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-24">
        <div className="w-full max-w-[480px] rounded-panel border border-line bg-surface p-8 shadow-pop sm:p-10">{content}</div>
      </main>
    </div>
  );
}
