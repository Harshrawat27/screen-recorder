# Website

Marketing site plus the pages the Cloudflare OAuth app needs (`/privacy`, `/terms`, `/auth/callback`).
Next.js, hosted on Vercel.

```sh
npm install
npm run dev        # http://localhost:3000
npm run build
```

Product name, domain, price and contact email live in `lib/site.ts`.

## Deploy to Vercel

1. vercel.com → Add New → Project → import the repo.
2. Root Directory: `web`. Framework preset: Next.js (detected automatically). Deploy.
3. Project → Settings → Domains → add `videos.harshraw.at`.
4. Add the DNS record Vercel shows (a CNAME for `videos`) wherever `harshraw.at`'s DNS is managed.

## Accounts (Better Auth + Google)

Sign-in lives at `/login`; `/dashboard` requires a session. Config is in `lib/auth.ts`, the API at `app/api/auth/[...all]`.

Environment variables (`.env.local` locally, and in Vercel → Settings → Environment Variables):

| Name | Local | Production |
| --- | --- | --- |
| `DATABASE_URL` | Neon connection string | same |
| `BETTER_AUTH_SECRET` | random, `openssl rand -base64 32` | a different random value |
| `BETTER_AUTH_URL` | `http://localhost:3000` | `https://www.showthrough.com` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | from Google Cloud Console | same |

Google OAuth client (Web application) → Authorized redirect URIs:
`http://localhost:3000/api/auth/callback/google` and `https://www.showthrough.com/api/auth/callback/google`.

Create or update the auth tables in the database (reads `.env.local`):

```sh
npx auth@latest migrate
```

## Connect Cloudflare (how setup works)

1. Dashboard → **Connect Cloudflare** sends the user to Cloudflare's Allow screen (OAuth with PKCE, no client secret).
2. Cloudflare returns to `/auth/callback`. The page posts the one-time code to `/api/cloudflare/connect`, which (in that one request) swaps it for an access token and, in the user's account:
   - creates the private R2 bucket `showthrough-videos` (or reuses it),
   - deploys the video Worker `showthrough` from `worker/video-worker.mjs`, with the bucket bound and a fresh upload key,
   - registers a workers.dev subdomain if the account has none, and turns it on for the Worker.
   The token is then dropped. We store only: account id/name, the subdomain ("space"), the Worker URL, the bucket name and the upload key (table `workspace`, created automatically).
3. `/extension/connect` hands the upload settings to the extension (its content script reads them from the page). No keys to copy.
4. Share links are `/v/<space>/<id>`; video streams from `https://media.showthrough.com/<space>/…` (see `../media-proxy`).

Extra environment variables:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_CLOUDFLARE_CLIENT_ID` | Client ID of the Cloudflare OAuth client |
| `NEXT_PUBLIC_MEDIA_URL` | `https://media.showthrough.com` |
| `NEXT_PUBLIC_CLOUDFLARE_SCOPES` | Optional. Default `account-settings.read workers-scripts.write workers-r2.write` |

If Cloudflare rejects a scope name, list the real ones with `GET https://api.cloudflare.com/client/v4/oauth/scopes` and set `NEXT_PUBLIC_CLOUDFLARE_SCOPES`.
