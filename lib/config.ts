// Settings shared by the browser and the server. NEXT_PUBLIC_* values are safe to expose.

export const CLOUDFLARE_CLIENT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_CLIENT_ID ?? "";

// Cloudflare OAuth scope names match API token permission names. Change via env if
// your OAuth client lists them differently (GET /client/v4/oauth/scopes).
export const CLOUDFLARE_SCOPES =
  process.env.NEXT_PUBLIC_CLOUDFLARE_SCOPES ?? "account-settings.read workers-scripts.write workers-r2.write";

export const CLOUDFLARE_AUTHORIZE_URL =
  process.env.NEXT_PUBLIC_CLOUDFLARE_AUTHORIZE_URL ?? "https://dash.cloudflare.com/oauth2/auth";

// Where everyone's videos are served from (the media proxy Worker).
export const MEDIA_URL = (process.env.NEXT_PUBLIC_MEDIA_URL ?? "https://media.showthrough.com").replace(/\/+$/, "");

export function cloudflareRedirectUri(origin: string) {
  return `${origin}/auth/callback`;
}
