"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { buttonClass } from "@/components/ui";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.5 5.5 0 01-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0012 24z" />
      <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 010-4.8V6.5h-4a12 12 0 000 11l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 001.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
    </svg>
  );
}

export function GoogleSignInButton({ callbackURL = "/dashboard" }: { callbackURL?: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    setPending(true);
    setError("");
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL,
      errorCallbackURL: `/login?error=google&next=${encodeURIComponent(callbackURL)}`,
    });
    if (error) {
      setError(error.message || "Google sign-in didn’t start. Try again.");
      setPending(false);
    }
    // On success the browser is already on its way to Google.
  }

  return (
    <div>
      <button type="button" onClick={signIn} disabled={pending} className={buttonClass("secondary", "lg", "w-full")}>
        <GoogleIcon />
        {pending ? "Opening Google…" : "Continue with Google"}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} disabled={pending} className={buttonClass("ghost", "sm")}>
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
