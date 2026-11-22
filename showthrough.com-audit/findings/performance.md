# Performance and Images findings: showthrough.com

Date: 2026-11-22. ALL numbers are LAB data (local Lighthouse 12.8.2 via npx, mobile emulation, headless Chrome, single run per URL, simulated throttling). No CrUX/field data: PSI keyless quota returned 429 and no API key is configured. Field CWV pass/fail is UNKNOWN. Single runs are noisy; TBT/LCP on the homepage in particular should be re-run. Lighthouse 12.8.2 is older than the 13.x current stable. No `sandbox` flag was reported by render_page.py.

**Performance score: 74/100** (page-weighted lab avg; Lighthouse: home 52, pricing 96, alternatives/loom 83, blog 99)
**Images score: 86/100**

## Lab Core Web Vitals (mobile)
| Page | LH perf | LCP | TBT (INP proxy) | CLS | TTFB |
|---|---|---|---|---|---|
| / | 52 | 5.0s FAIL | 2,630ms (poor) | 0.001 pass | ~100ms |
| /pricing | 96 | 2.4s pass | 140ms | 0 pass | ~100ms |
| /alternatives/loom | 83 | 4.0s borderline (needs improvement at best) | 240ms | 0 pass | ~95ms |
| /blog/loom-pricing | 99 | 1.9s pass | 90ms | 0 pass | ~95ms |

INP cannot be measured in a lab load; TBT is only a proxy. Homepage TBT of 2.6s strongly suggests INP risk there.

## Key bottlenecks
1. **Homepage LCP element is not the dashboard image.** Lighthouse flagged the hero paragraph (`main > section.sky p.mt-7`) as LCP at 5.0s, with TTFB ~104ms and **element render delay ~1.48s**. Text LCP delayed by main-thread blocking (hydration/JS), not by network. The preloaded dashboard image (`/_next/image?...dashboard-image.png`, 14KB WebP at w=750) is therefore not the LCP candidate in this run and its preload competes for bandwidth for nothing. Re-check on desktop where the image may be LCP.
2. **Homepage main-thread blocking.** 4.1s main-thread work, 2.36s of "unattributable" long task starting ~1.1s, TBT 2.6s. Scripts: 41 script tags; large chunks (2qip02ypaj1wi.js 72KB, 1x4q05j8eu1m-.js 122KB, 0xsspnxpobpgn.js 46KB) plus PostHog (`/ingest/static/...` surveys.js 48KB, posthog-recorder.js 74KB, dead-clicks-autocapture, web-vitals) loaded on page load. Unused JS ~195KB savings; legacy JS ~32KB (Next/browserslist transpilation).
3. **/alternatives/loom LCP 4.0s**: text paragraph, render delay ~1.1s; same JS/hydration cause. Other pages carry the same 28-34 scripts.
4. **Session recording/analytics cost.** posthog-recorder, surveys and dead-click autocapture are heavy and not needed before interaction. Load after `load`/idle or on first interaction; disable surveys if unused.
5. **Caching/CDN**: HTML for `/`, `/pricing`, `/alternatives/loom` served `private, no-cache, no-store` with `X-Vercel-Cache: MISS` (dynamic rendering, TTFB still ~30ms server / ~100ms measured, fine). Blog is `HIT`. Making the marketing pages static (remove cookies()/headers()/dynamic APIs) would allow edge caching and less variance. Also bfcache fails on all pages (3 reasons, likely `Cache-Control: no-store`), hurting back/forward navigations.
6. **Fonts**: Newsreader variable woff2 is 129KB (Instrument Sans 30KB). Blog preloads both. Subset Newsreader / limit axes or weights; confirm `display: swap` (next/font default). CLS is ~0 so no shift issue.
7. **Preconnect**: Lighthouse flags `uses-rel-preconnect` (~250ms) on home. Likely a third-party origin (ship-or-die.com/hackathon/verify.js is loaded: remove if not needed).
8. Blog: render-blocking CSS ~120ms insight, minor; LCP image discovery insight flagged (resource load delay ~252ms) although a preload exists. Consider `fetchPriority="high"` on the hero `<img>` and verify preload actually matches srcset/sizes.

## CLS
Lab CLS 0-0.001 on all four pages. Images carry width/height. Pass (lab). Field unknown.

## Images audit
- Formats: Next image optimizer serves WebP (no AVIF observed with `accept: image/avif,image/webp`; enable `images.formats: ['image/avif','image/webp']` in next.config for ~20-30% smaller). Source `dashboard-image.png` is 393KB PNG 1920x992; optimized WebP at w=1920 is 57KB, at w=750 is 14KB. Good result.
- Homepage: 2 `<img>`: dashboard (alt descriptive, width/height 1920x992, preloaded, not lazy: correct for above fold) and `hero-avatar.svg` (alt="" decorative, loading=lazy, 176x176, 7KB SVG; fine, though SVG not run through optimizer, check if it is above the fold: lazy-loading an above-fold image would delay it).
- `sizes="(min-width: 1200px) 1152px, 100vw"` is appropriate; srcset from Next is good.
- /pricing and /alternatives/loom have no content images (only 3KB icon.svg); nothing to optimize. No comparison logos/screenshots on /alternatives/loom, a content opportunity, not a perf issue.
- Blog hero `/blog/loom-pricing.webp`: 1600x900 WebP, source 80KB, served 21KB at w=750; descriptive alt (long, 120+ chars: trim to ~100); width/height set; no lazy (correct for LCP). Lighthouse image-delivery insight: ~16KB potential savings.
- Cache headers on `/_next/image` and static source images: `public, max-age=0, must-revalidate`. Images revalidate each visit. Set long `minimumCacheTTL` in next.config (e.g. 31536000) and cache headers for `/public` images (Lighthouse "uses-long-cache-ttl" flagged 1 resource).
- Deductions: no AVIF (-4), short cache TTLs (-5), long alt text and lazy avatar check (-2), only measured 4 pages / few images (-3).

## Prioritized recommendations
1. (High) Cut homepage JS/hydration: defer PostHog recorder/surveys/dead-clicks to idle; dynamic-import below-fold client components; remove unused ship-or-die verify script. Expected: TBT 2.6s to <300ms, LCP 5.0s to ~2.5s.
2. (High) Make LCP paragraph render earlier: ensure hero text is server-rendered and not gated by client JS/animations/opacity-0 until hydration; check fonts do not block render.
3. (Med) Make marketing routes static/ISR so HTML is edge-cached and bfcache-eligible.
4. (Med) Raise browserslist target to drop ~32KB legacy JS.
5. (Med) Enable AVIF and long `minimumCacheTTL`; add fetchPriority="high" to blog hero.
6. (Low) Subset Newsreader (129KB); drop homepage dashboard preload if it is not LCP on mobile.
7. Get a Google API key to collect CrUX field data (LCP/INP/CLS p75) and re-run Lighthouse 13.x multiple times.
