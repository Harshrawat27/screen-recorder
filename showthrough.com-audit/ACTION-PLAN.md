# Action Plan: showthrough.com

Each item lists why it matters, what it depends on, how you'd know it failed, and a leading indicator to watch.

## Phase 0: Before 27 Nov (time-sensitive)

**0.1 Fix the Offer schema and sale rollover** · `app/page.tsx:40`, `lib/pricing.ts`
- Why: structured data must match visible price/availability. After 27 Nov it would claim $99 in stock while checkout is closed.
- Do: `offerSchema()` from `currentOffer()` with `priceValidUntil: 2026-11-27` during the sale, then `PreOrder` + `availabilityStarts: 2026-11-30`. Reuse on `/pricing`.
- Failed if: Rich Results Test on 28 Nov shows `InStock` at $99, or a price that differs from the page.
- Watch: GSC → Enhancements / Merchant listings warnings.

**0.2 Black Friday copy rollover** · home, `/pricing`, `/roadmap`
- Do: confirm the banner, pricing card and the roadmap sentence ("Everyone who buys by Black Friday…") all change automatically. Put a concrete post-sale update price on the page.
- Failed if: any page still says "$49 until 27 Nov" on 28 Nov.

**0.3 (Optional) sitewide sale bar** · `components/site-nav.tsx`
- Why: the offer is only above the fold on the homepage.

## Phase 1: Week 1 (critical trust and quick wins)

| # | Task | File | Depends on | Failed if |
|---|---|---|---|---|
| 1.1 | Fix the "10 GB ≈ 100 hours" claim (≈ 8 h) | `components/guide-pages.tsx:65` | none | A test 1-hour recording ÷ 10 GB still disagrees with the copy |
| 1.2 | Qualify team claims ("team library coming soon, included") | homepage, `/pricing` | none | Any "whole team" claim without the qualifier |
| 1.3 | Mobile nav: menu button or shorter CTA below `sm` | `components/site-nav.tsx` | none | `document.documentElement.scrollWidth > 375` at 375 px |
| 1.4 | Meta descriptions for `/privacy`, `/terms` | `app/privacy/page.tsx`, `app/terms/page.tsx` | none | Duplicate description in a recrawl |
| 1.5 | Homepage definition sentence ("Showthrough is a pay-once Chrome extension for screen recording…") | `app/page.tsx` | none | ChatGPT/Perplexity still describe it vaguely or confuse it with printing |
| 1.6 | Defer PostHog recorder, surveys, dead-clicks to idle; remove hackathon verify script if unneeded | PostHog init, `app/layout.tsx` | none | Homepage lab TBT still >600 ms |
| 1.7 | Verify in Bing Webmaster Tools; check GSC Links | external | none | n/a (enables backlink scoring) |

Watch: homepage Lighthouse mobile ≥ 80; GSC "Pages" with no new exclusions.

## Phase 2: Weeks 2–3 (high-impact)

**2.1 Resolve "loom alternative" cannibalisation** (biggest ranking lever)
- `/alternatives` → 2,500–3,500-word roundup pillar with comparison matrix, use-case grouping, Showthrough honestly included as the pay-once pick, ItemList schema.
- `/alternatives/loom` → "Showthrough vs Loom" for pay-once / no-subscription intent; add screenshots, "Switching from Loom", trim duplicated pricing and link to `/blog/loom-pricing`.
- `/blog/free-loom-alternatives` → "free" only.
- Depends on: none. Unblocks: 3.1 internal link matrix.
- Failed if: after 6–8 weeks, GSC shows more than one of these URLs getting impressions for "loom alternatives".
- Watch: GSC query "loom alternative*" impressions per URL.

**2.2 Make marketing routes static/ISR** · find dynamic API in `app/layout.tsx` or shared components
- Failed if: `/` still returns `X-Vercel-Cache: MISS` with `no-store`.

**2.3 Schema completion**: `/pricing` SoftwareApplication reference + breadcrumbs; WebPage + BreadcrumbList on `/blog`, `/guide`, `/guide/*`; SoftwareApplication `@id`, `browserRequirements`, `softwareVersion`; blog graph `@id` linking. Ready JSON-LD in `findings/schema.md`. No HowTo, no new FAQPage.
- Failed if: Rich Results Test errors on any template.

**2.4 Authority basics**: `/about` (founder story already used in posts), author box on posts, domain support email, Organization `founder`, `contactPoint`, `sameAs`.

**2.5 Security headers** in `next.config.ts` (CSP report-only first).

## Phase 3: Month 2 (content and authority)

| # | Task | Notes |
|---|---|---|
| 3.1 | In-body internal links per `findings/cluster.md` link matrix | Every spoke ≥3 inbound links |
| 3.2 | New post: self-hosted / own-storage Loom alternative | Core differentiator, thin SERP; link to R2 guide steps |
| 3.3 | New post: Loom 5-minute limit | SERP is mostly Loom's own help docs |
| 3.4 | New post: best screen recorder Chrome extension | Listicle; covers "loom alternative chrome extension" |
| 3.5 | Demo video (YouTube channel) embedded on home + `/alternatives/loom` with VideoObject | Conversion + AI citation |
| 3.6 | Social proof: CWS rating/users, 3 testimonials (solo, team, dev) | Weakest dimension for all personas |
| 3.7 | Launches/listings: Product Hunt, Show HN, AlternativeTo, SaaSHub, G2; add to `sameAs` | Backlinks + entity signals |
| 3.8 | Guide: merge 9 thin step pages into `/guide` with anchors + 301s (or `noindex,follow` steps) | Expand troubleshooting with exact errors |
| 3.9 | `/blog/loom-pricing`: add "2026" to title, pricing CTA | |
| 3.10 | Link every competitor claim; re-check Snagit+Camtasia price | |

## Phase 4: Ongoing

- Re-check competitor prices monthly; update "prices checked on" dates.
- Get a Google API key and run `/seo google` for CrUX field data and GSC queries.
- `/seo drift baseline https://www.showthrough.com/` now, then `/seo drift compare` after each deploy.
- Low-priority tidy-ups: AVIF + long `minimumCacheTTL`, subset Newsreader font, trim long titles/descriptions, apex redirect to one hop, remove `Host:` from robots, fix duplicate 404 title, auto lastmod in sitemap, optional `/llms.txt`.
