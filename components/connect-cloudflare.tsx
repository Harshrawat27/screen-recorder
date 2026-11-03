"use client";

import { useState } from "react";
import { CLOUDFLARE_AUTHORIZE_URL, CLOUDFLARE_CLIENT_ID, CLOUDFLARE_SCOPES, cloudflareRedirectUri } from "@/lib/config";
import { buttonClass } from "@/components/ui";

export const OAUTH_STORAGE_KEY = "showthrough:cf-oauth";

function base64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Starts Cloudflare's "Allow" screen using PKCE (no client secret anywhere). */
export async function startCloudflareConnect() {
  if (!CLOUDFLARE_CLIENT_ID) throw new Error("Cloudflare connection isn’t configured yet (missing client ID).");
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const challenge = base64url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
  const state = base64url(crypto.getRandomValues(new Uint8Array(16)));
  sessionStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify({ state, verifier }));

  const url = new URL(CLOUDFLARE_AUTHORIZE_URL);
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: CLOUDFLARE_CLIENT_ID,
    redirect_uri: cloudflareRedirectUri(window.location.origin),
    scope: CLOUDFLARE_SCOPES,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  }).toString();
  window.location.assign(url.toString());
}

export function ConnectCloudflareButton({ label = "Connect Cloudflare", variant = "primary" as "primary" | "secondary" }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onClick() {
    setPending(true);
    setError("");
    try {
      await startCloudflareConnect();
    } catch (err) {
      setError((err as Error).message);
      setPending(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={onClick} disabled={pending} className={buttonClass(variant, "md")}>
        {pending ? "Opening Cloudflare…" : label}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
