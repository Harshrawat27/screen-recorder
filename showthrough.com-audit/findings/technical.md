# Technical + On-Page SEO audit: https://www.showthrough.com (2026-11-22)

Technical score: 82/100. On-Page score: 80/100.

## Technical
- Status: all 30 sitemap URLs return 200, no redirects, no noindex, all canonicals self-referencing (absolute, www). Pass.
- Sitemap: /sitemap.xml valid urlset, 30 URLs, 30 lastmod, declared in robots.txt. Pass. Homepage listed as `https://www.showthrough.com` (no slash) = same URL as `/`; matches its canonical. Fine, no fix needed.
- robots.txt: valid, blocks only /api/, /dashboard, /buy, /start. `Host:` is a Yandex-only, deprecated directive (harmless). Private pages (/login, /record, /brand, /appsumo, 404) carry meta noindex. Pass.
- Redirects: http://showthrough.com -> https://showthrough.com/ -> https://www.showthrough.com/ (2 hops, both 308). Apex https -> www is single 308. Pass with minor note.
- Trailing slash: /pricing/ returns 200 (not redirected) with canonical to /pricing. Cause: `skipTrailingSlashRedirect: true` in next.config.ts. Canonical covers it.
- Security headers: only Strict-Transport-Security (max-age=63072000, no includeSubDomains/preload). Missing CSP, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy.
- Caching: HTML responses are `private, no-cache, no-store` (dynamic render, x-vercel-cache MISS) on /pricing and homepage; hurts TTFB/LCP and CDN offload.
- Mobile: viewport meta present on all pages. LCP image is preloaded (dashboard-image.png via next/image, 3840w candidate list). SSR, content in raw HTML (no CSR dependency; 200-1600 words in source).
- Structured data: Organization, WebSite, SoftwareApplication+Offer, FAQPage (home); BlogPosting+BreadcrumbList+FAQPage (blog); BreadcrumbList+FAQPage (alternatives). Good. No hreflang (single-language site; not needed).
- 404 page: true 404 + noindex. /llms.txt: 404.
- Browser sandbox: not applicable (raw fetch only, no Playwright).

## On-Page
- Titles: unique across 30 pages, all present. 11 titles are 62-70 chars and may truncate (is-loom-free 70, cap 67, loom-pricing 66, vidyard/snagit 65, loom/chromebook/pricing 62-63).
- Descriptions: present and unique on 27; privacy and terms inherit the site-default description (duplicate of homepage). 11 are 162-169 chars (truncation risk); guide pages 58-84 chars are short but acceptable.
- H1: exactly one on every page, unique, descriptive.
- Guide pages (8 step pages): ~200-290 words, 0 H2s, no structured data; thin and near-template. Low-value for indexing.
- Internal linking: 18-30 unique internal links per page; nav/footer-driven. Guide pages link ~28 (mostly nav). Alt text: 0 images missing alt.
- OG tags on all pages; opengraph-image and twitter-image exist.

## Issues
### High
- None.
### Medium
1. Missing security headers (only HSTS). Fix: add `async headers()` in /Users/harshrawat/Documents/developer/side-projects/loom-alternative/web/next.config.ts with X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy, X-Frame-Options/CSP frame-ancestors (exclude any embeddable share route), and HSTS includeSubDomains; preload. Test CSP in report-only first (PostHog /ingest).
2. Marketing HTML is `no-store` (dynamic). Fix: find what opts /, /pricing into dynamic rendering (cookies()/headers()/auth session read in app/layout.tsx or shared components) and make marketing pages static/ISR so Vercel can cache them; improves TTFB and LCP.
3. Privacy and terms use the homepage description. Fix: add `description` to metadata in app/privacy/page.tsx and app/terms/page.tsx.
### Low
4. Titles >60 chars and descriptions >160 chars on ~11 pages each. Shorten (e.g. blog/is-loom-free in lib/blog.ts, lib/alternatives.ts).
5. Thin guide step pages (app/guide/*, lib/guide.ts): add H2 sections/screenshots/HowTo schema on /guide, or consider keeping only /guide in the sitemap (app/sitemap.ts) and leaving steps indexable but not listed.
6. http apex -> https apex -> www is two hops. Fix in Vercel Domains: redirect apex directly to https://www (single hop).
7. `skipTrailingSlashRedirect: true` lets /x/ serve 200 duplicate (canonical mitigates). Optionally redirect slash variants to non-slash in next.config.ts.
8. robots.ts `host` outputs a Yandex-only deprecated Host line; can remove. Optional /llms.txt for AI discoverability.
