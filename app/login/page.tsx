import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth-buttons";
import { Logo } from "@/components/header";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getSession()) redirect("/dashboard");
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-24">
        <div className="w-full max-w-[400px] rounded-panel border border-line bg-surface p-8 shadow-pop sm:p-10">
          <h1 className="text-[28px] font-bold tracking-[-0.02em]">Sign in to Showthrough</h1>
          <p className="mt-2 text-muted">Use your Google account. New here? This creates your account.</p>
          {error && (
            <p role="alert" className="mt-6 rounded-control bg-brand-soft px-4 py-3 text-sm text-brand-ink">
              Google sign-in didn&rsquo;t finish. Try again, and pick the account you want to use.
            </p>
          )}
          <div className="mt-8">
            <GoogleSignInButton />
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
