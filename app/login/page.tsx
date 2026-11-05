import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth-buttons";
import { Logo } from "@/components/header";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

// Only same-site paths, so a crafted link can't send people somewhere else after sign-in.
function safeNext(value: string | string[] | undefined) {
  const next = Array.isArray(value) ? value[0] : value;
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (await getSession()) redirect(next);
  const { error } = params;
  const buying = next === "/buy";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-24">
        <div className="w-full max-w-[400px] rounded-panel border border-line bg-surface p-8 shadow-pop sm:p-10">
          <h1 className="text-[28px] font-bold tracking-[-0.02em]">{buying ? "Sign in to continue" : "Sign in to Showthrough"}</h1>
          <p className="mt-2 text-muted">
            {buying
              ? "Your purchase is tied to your account. Sign in with Google and we'll take you straight to checkout."
              : "Use your Google account. New here? This creates your account."}
          </p>
          {error && (
            <p role="alert" className="mt-6 rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-ink">
              Google sign-in didn&rsquo;t finish. Try again, and pick the account you want to use.
            </p>
          )}
          <div className="mt-8">
            <GoogleSignInButton callbackURL={next} />
          </div>
          <p className="mt-8 text-xs leading-relaxed text-faint">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-text">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-text">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
