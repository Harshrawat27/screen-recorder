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
