import type { Metadata } from "next";
import { GoogleSignInButton } from "@/components/auth-buttons";
import { Logo } from "@/components/header";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClass } from "@/components/ui";
import { getAccess } from "@/lib/billing";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Redeem your AppSumo code", robots: { index: false } };
export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  invalid: "That doesn't look like a Showthrough code. Copy it again from your AppSumo account.",
  not_found: "We couldn't find that code. Check it against your AppSumo account, or email harshrawat.dev@gmail.com.",
  used: "That code has already been redeemed on another account. Email harshrawat.dev@gmail.com if that wasn't you.",
  refunded: "That code is no longer active, usually because the purchase was refunded.",
  failed: "Something went wrong on our side. Try again in a minute.",
};

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function AppsumoPage({ searchParams }: PageProps<"/appsumo">) {
  const params = await searchParams;
  const code = first(params.code).slice(0, 200);
  const error = errors[first(params.error)];
  const session = await getSession();
  const access = session ? await getAccess(session.user) : null;
  const next = `/appsumo${code ? `?code=${encodeURIComponent(code)}` : ""}`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-24">
        <div className="w-full max-w-[440px] rounded-panel border border-line bg-surface p-8 shadow-pop sm:p-10">
          <h1 className="text-[28px] font-bold tracking-[-0.02em]">Redeem your AppSumo code</h1>

          {!session ? (
            <>
              <p className="mt-2 text-muted">
                Your lifetime license is tied to your Showthrough account. Sign in with Google first, then paste your code.
              </p>
              <div className="mt-8">
                <GoogleSignInButton callbackURL={next} />
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-muted">
                Signed in as {session.user.email}. Paste the code from your AppSumo account to unlock Showthrough for life,
                with every future update.
              </p>
              {access?.paid && (
                <p className="mt-6 rounded-control bg-sunken px-4 py-3 text-sm">
                  This account already has a lifetime license.{" "}
                  <a href="/dashboard" className="font-semibold underline underline-offset-2">
                    Go to your dashboard
                  </a>
                </p>
              )}
              {error && (
                <p role="alert" className="mt-6 rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-ink">
                  {error}
                </p>
              )}
              <form action="/api/appsumo/redeem" method="post" className="mt-8 space-y-4">
                <label className="block text-sm font-semibold" htmlFor="code">
                  AppSumo code
                </label>
                <input
                  id="code"
                  name="code"
                  required
                  defaultValue={code}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="ST-XXXX-XXXX-XXXX"
                  className="h-11 w-full rounded-control border border-line bg-canvas px-4 font-mono text-[15px] uppercase outline-none focus:border-line-strong"
                />
                <button type="submit" className={buttonClass("primary", "md", "w-full")}>
                  Redeem code
                </button>
              </form>
              <p className="mt-6 text-xs leading-relaxed text-faint">
                Next you&rsquo;ll connect your Cloudflare account. It&rsquo;s a simple click on your side, and we handle the rest.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
