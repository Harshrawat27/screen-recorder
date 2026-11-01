# Website

Marketing site plus the pages the Cloudflare OAuth app needs (`/privacy`, `/terms`, `/auth/callback`).
Next.js with a static export, so it can be hosted anywhere that serves files.

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
```

Product name, domain, price and contact email live in `lib/site.ts`.

## Deploy to Cloudflare Pages

Workers & Pages → Create → Pages → connect the repo (or upload `out/`).
Build command `npm run build`, output directory `out`, root directory `web`.
Then Custom domains → add `videos.harshraw.at`.
