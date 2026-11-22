# SEO Audit: showthrough.com

Date: 2026-11-22 · Business type: SaaS (pay-once Chrome screen recorder) · Pages: 30 (sitemap-complete)

## SEO Health Score: 74 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 82 | 18.0 |
| Content Quality | 23% | 68 | 15.6 |
| On-Page SEO | 20% | 80 | 16.0 |
| Schema / Structured Data | 10% | 58 | 5.8 |
| Performance (CWV, lab only) | 10% | 74 | 7.4 |
| AI Search Readiness | 10% | 65 | 6.5 |
| Images | 5% | 86 | 4.3 |
| **Total** | | | **73.7** |

Not scored: backlinks (no Moz/Bing/GSC data; domain absent from Common Crawl cc-main-2026-aug-sep-oct, normal for a new site).

### Data limits
- Core Web Vitals are **lab-only** (local Lighthouse 12.8.2, single run, mobile). PSI returned 429; no CrUX field data.
- SERP observations come from a web search tool, not a clean Google top-10; overlap scores are estimates.
- No Search Console, GA4, Moz or Bing data.

## Executive summary

The foundation is clean: all 30 URLs return 200, are self-canonical, server-rendered, uniquely titled, in the sitemap, and open to every search and AI crawler. Writing quality is high (no templated or AI-typical copy; competitor prices are dated and sourced; honest "where X is better" sections).

What holds the site back is not technical. It is **(1) page-type mismatch on the money keyword, (2) missing trust and authority signals, and (3) a slow homepage**.

### Top 5 issues
1. **"loom alternative" is targeted by three pages, and none matches the SERP.** ~78% of results are multi-tool roundups; you have a landing page, a one-vs-one page and a free-only roundup that excludes Showthrough. (`/alternatives`, `/alternatives/loom`, `/blog/free-loom-alternatives`)
2. **Homepage is slow on mobile (lab):** LCP 5.0 s, TBT 2.6 s, Lighthouse 52. Cause is main-thread JS (PostHog recorder/surveys/dead-clicks, third-party `ship-or-die.com/hackathon/verify.js`, hydration), not the server.
3. **Inaccurate/unsupported claims hurt trust:** `/guide/turn-on-r2` says 10 GB ≈ "100 hours" (actual ≈ 8–9 h at 2.5 Mbps + 128 kbps; `components/guide-pages.tsx:65`, verified against `extension/lib/hls-recorder.js:19`). "One payment for your whole team" is promoted while team library/invites are "Coming soon".
4. **No authority signals:** no About/founder page, no author bio, Gmail support address, no reviews/ratings/testimonials, no demo video, `sameAs` only X + Chrome Web Store.
5. **Black Friday pricing goes stale on 27 Nov:** Offer schema has no `priceValidUntil`/`availability`; after the sale the schema would advertise $99 in stock while checkout is paused until 30 Nov. Sale copy on home, pricing and roadmap must roll over.

### Top 5 quick wins
1. Add `priceValidUntil`, `availability` to the homepage Offer and reuse it on `/pricing` (ready helper in `findings/schema.md`).
2. Fix the "100 hours" claim (`components/guide-pages.tsx:65`).
3. Add a "Showthrough is a pay-once Chrome extension for screen recording…" definition sentence near the top of the homepage.
4. Give `/privacy` and `/terms` their own meta descriptions.
5. Defer PostHog session recording, surveys and dead-click autocapture until idle; remove the hackathon verify script if no longer needed.

## Technical SEO — 82
**Works:** 200s everywhere, self-canonicals, no stray noindex, private routes (`/login`, `/record`, `/brand`, `/appsumo`) noindexed, robots.txt correct, valid sitemap, full SSR, HSTS on.

| Sev | Finding | Fix |
|---|---|---|
| Medium | Marketing HTML (`/`, `/pricing`, `/alternatives/loom`) served `private, no-cache, no-store`, `X-Vercel-Cache: MISS`; also breaks bfcache | Find the dynamic API (cookies()/headers()/session) in `app/layout.tsx` or a shared component; make marketing routes static/ISR |
| Medium | Only HSTS sent; no X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP/frame-ancestors | `headers()` in `next.config.ts`; CSP report-only first (PostHog `/ingest` rewrite) |
| Low | `http://showthrough.com` → 2 redirect hops | Point apex straight at `https://www` in Vercel domains |
| Low | `/pricing/` returns 200 (`skipTrailingSlashRedirect: true`) | Canonical covers it; optionally 308 slash variants |
| Low | Non-standard `Host:` line in `app/robots.ts` | Remove |
| Low | 404 page has two `<title>` tags | Fix not-found metadata |
| Low | Sitemap lastmod hand-maintained; `/`, `/pricing`, `/roadmap` stale (2026-11-10 vs commits 2026-11-21) | Update `app/sitemap.ts`; per-page `updated` in `lib/guide.ts` |

## On-Page SEO — 80
**Works:** unique titles and H1s on all pages, OG/Twitter images everywhere, 18–30 internal links per page.

| Sev | Finding | Fix |
|---|---|---|
| High | Keyword cannibalisation on "loom alternative(s)" across 3 URLs (see Content Architecture) | Re-scope each page |
| Medium | `/privacy`, `/terms` inherit homepage meta description | Add `description` in their `page.tsx` metadata |
| Medium | `/alternatives` and `/alternatives/loom` link to no blog posts; competitor pages only interlink via nav/footer | In-body contextual links per link matrix in `findings/cluster.md` |
| Low | ~11 titles 62–70 chars, ~11 descriptions 162–169 chars (`blog/is-loom-free` title 70) | Trim in `lib/blog.ts`, `lib/alternatives.ts` |
| Low | Homepage H1 is a slogan with no category words | Keep the H1; add the definition sentence beneath it |

## Content Quality — 68 (E-E-A-T 59: Exp 72 · Expertise 58 · Authority 40 · Trust 68)
**Works:** 8 alternatives pages are 80–88% unique; competitor pricing dated and linked; first-hand founder experience in every post; Flesch 64–80; zero AI-typical phrasing.

| Sev | Finding | Fix |
|---|---|---|
| High | "10 GB ≈ 100 hours" is ~12× too high | State a measured MB/min, or "about 8 hours" |
| High | Team pricing promoted before team features exist | Add "team library coming soon, included" beside each team claim |
| High | No About/author page, no bio, Gmail contact, no social proof | `/about`, author box, domain email, CWS rating, real testimonials |
| Medium | Setup guide split into 9 thin pages (~20–100 unique words each) | Merge into `/guide` with anchors + 301s, or `noindex,follow` the steps |
| Medium | Alternatives pages show no visible/structured modified date or author | WebPage schema with `dateModified` + author |
| Medium | Some competitor claims unlinked; "Snagit with Camtasia: From $39" equals standalone Snagit price | Link each claim; re-check bundle price |
| Medium | Black Friday copy (home, pricing, roadmap sentence "Everyone who buys by Black Friday…") | Confirm automatic rollover; schedule a check on 28 Nov |
| Low | Posts 810–1,442 words | Deepen `free-loom-alternatives` with your own test data; leave answer posts short |
| Low | "connected in one click… we handle the rest" ×23 across 11 pages | Keep 1–2 on homepage |

## Content Architecture & Search Experience
SERP for "loom alternative": ~78% multi-tool roundups (TechSmith, Zight, tl;dv, Tango, Descript, ClickUp), Cap's GitHub in the top 3. "pay once / one-time loom alternative" results do include product pages (e.g. screensnap.pro) → aligned with `/alternatives/loom`.

| Page | Target | Verdict | Action |
|---|---|---|---|
| `/alternatives` | best loom alternatives | Mismatch (≈600 words, hub only) | **Make this the roundup pillar**: 2,500–3,500 words, use-case grouping, comparison matrix, Showthrough honestly included as the pay-once pick, ItemList schema |
| `/alternatives/loom` | loom alternative pay once / no subscription | Aligned for long-tail | Rename hub H2 to "Showthrough vs Loom"; add screenshots, demo video, "Switching from Loom"; trim duplicated pricing section and link to `/blog/loom-pricing` |
| `/blog/free-loom-alternatives` | free loom alternatives | Aligned | Keep scoped to "free" |
| `/` | screen recorder no subscription | Critical mismatch (SERP = free in-browser tools) | Drop as a target; don't chase with the homepage |
| `/blog/loom-pricing` | loom pricing | Aligned (SXO 76) | Add "2026" to title; end with a price/buy CTA, not "See how it works" |
| `/pricing` | brand | Aligned (SXO 48) | Add schema, social proof, concrete post-sale update pricing |

Note: SXO suggested a new `/blog/loom-alternatives`; the cluster analysis recommends using the existing `/alternatives` as that roundup instead. **Use `/alternatives`**: a 4th URL would deepen the cannibalisation.

**Content gaps (new posts):** self-hosted / own-storage Loom alternative (thin SERP, your core differentiator; link to `/guide/turn-on-r2`, `/guide/connect-cloudflare`), Loom 5-minute limit (SERP is almost all Loom help docs), best screen recorder Chrome extension (listicle).

**Persona scores:** solo founder 78 · budget buyer 66 · privacy-conscious dev 59 · small team lead 55. Trust is the weakest dimension for every persona.

## Schema — 58
Detected: Organization + WebSite + SoftwareApplication/Offer + FAQPage (home); BlogPosting + BreadcrumbList + FAQPage (posts); ItemList (`/alternatives`); BreadcrumbList + FAQPage (alternatives/*); FAQPage (`/support`). None on `/pricing`, `/blog`, `/guide`, `/guide/*`.

| Sev | Finding | Fix |
|---|---|---|
| High | Offer lacks `priceValidUntil`, `availability`; post-sale state would be wrong (should be PreOrder with `availabilityStarts` 2026-11-30 while checkout is paused) | `offerSchema()` helper driven by `currentOffer()` in `lib/pricing.ts` |
| High | `/pricing` has no schema | Reference homepage SoftwareApplication `@id` + same Offer + BreadcrumbList |
| Medium | No BreadcrumbList on `/pricing`, `/blog`, `/guide`, `/guide/*` | WebPage + BreadcrumbList (do **not** use HowTo, deprecated) |
| Medium | SoftwareApplication: free-text `operatingSystem`, no `@id`, `image`, `softwareVersion`, `browserRequirements` | Ready JSON-LD in `findings/schema.md` |
| Medium | Blog graph: publisher duplicated inline, author Person without `@id`, bare `mainEntityOfPage` | Link by `@id` |
| Low | Logo 180 px; thin `sameAs` | 512 px logo; add profiles as they're created |
| Info | FAQPage on home, posts, alternatives, support | No Google rich result since 7 May 2026; no confirmed AI benefit. Leave as is; don't add more |

## Performance — 74 (lab, mobile)
| Page | LH | LCP | TBT | CLS |
|---|---|---|---|---|
| `/` | 52 | 5.0 s ❌ | 2,630 ms | 0.001 |
| `/pricing` | 96 | 2.4 s | 140 ms | 0 |
| `/alternatives/loom` | 83 | 4.0 s ⚠️ | 240 ms | 0 |
| `/blog/loom-pricing` | 99 | 1.9 s | 90 ms | 0 |

INP is not measurable in lab; homepage TBT strongly suggests INP risk. TTFB ~100 ms, so this is client-side.

- LCP element on mobile is the hero paragraph, with 1.48 s render delay from main-thread blocking. The preloaded dashboard image isn't LCP on mobile.
- Heavy on-load scripts: PostHog recorder (74 KB), surveys (48 KB), dead-click autocapture, `ship-or-die.com/hackathon/verify.js`; ~195 KB unused JS; ~32 KB legacy transpilation.
- Newsreader variable font 129 KB.

## Images — 86
Width/height set everywhere, descriptive alt text, WebP via Next optimizer, LCP image not lazy. Gaps: no AVIF (`images.formats`), short `minimumCacheTTL` (images revalidate every visit), blog hero alt >120 chars, no screenshots on `/alternatives/loom`.

## AI Search Readiness — 65
| Dimension | Score |
|---|---|
| Citability | 80 |
| Structural readability | 82 |
| Technical access | 85 |
| Multi-modal | 35 |
| Authority & brand | 30 |

All AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, CCBot, Bingbot) receive 200 with identical content. Blog posts score 85–90 for citability (quick-answer blocks, dated prices). Agent-readiness heuristic 100/100 on home and pricing.

Gaps: no YouTube/demo video, no Product Hunt / HN / AlternativeTo / Reddit / Wikidata presence found, "Showthrough" is also a printing term (always pair with the category), no `/llms.txt` (optional, ignored by Google), Chrome Web Store listing doesn't say "Loom alternative" and shows no ratings yet.

## Mobile / Visual
| Sev | Finding | Fix |
|---|---|---|
| High (conversion) | At 375 px the "Get Showthrough" button overflows the nav pill; nav links hidden below `lg` with no menu button (`components/site-nav.tsx:30`). Links remain in HTML, so crawl is unaffected | Add a mobile menu, or shrink the CTA label to "Get it" below `sm` |
| Medium | Black Friday message only above the fold on the homepage | Sitewide announcement bar until 27 Nov |
| Medium | `/alternatives/loom` mobile: CTA barely above the fold | Shorten intro or add CTA after first paragraph |
| Low | Theme toggle (~30 px) and breadcrumb links (~20 px) are small tap targets | ≥44 px hit area |

## Backlinks — not scored
No referring-domain data available. Next: verify in Bing Webmaster Tools and check the GSC Links report. Best-fit sources: Chrome Web Store reviews, Product Hunt / Show HN / Indie Hackers, AlternativeTo / SaaSHub / G2 / Capterra, pitches to "best Loom alternatives" roundup authors.

## Rejected subagent recommendations
- **HowTo schema for the guide pages:** deprecated (Sept 2023). Use WebPage + BreadcrumbList.
- **New FAQPage on `/pricing`:** FAQ rich results retired 7 May 2026.
- **"Pages missing meta descriptions" (cluster agent):** false; the technical crawl found descriptions on all pages.
- **New `/blog/loom-alternatives`:** superseded by expanding `/alternatives`.

## Not SEO, but worth knowing
The Chrome Web Store listing publicly shows a personal home address. Consider switching to a business address.

Per-category detail: `findings/*.md` · Screenshots: `screenshots/`
