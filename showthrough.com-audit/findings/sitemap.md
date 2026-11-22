# Sitemap audit: https://www.showthrough.com/sitemap.xml
Source: /Users/harshrawat/Documents/developer/side-projects/loom-alternative/web/app/sitemap.ts

| Check | Result | Severity |
|---|---|---|
| XML valid, 200, 30 URLs, 3 KB, no dupes, no cross-host, no invalid loc | PASS | - |
| All 30 URLs return 200, no redirects | PASS | - |
| Self-canonical on all 30 (exact match to loc) | PASS | - |
| Indexable (no meta robots noindex, no X-Robots-Tag on sampled pages) | PASS | - |
| Homepage loc has no trailing slash (https://www.showthrough.com), canonical matches | PASS | - |
| robots.txt `Sitemap: https://www.showthrough.com/sitemap.xml` correct, resolves 200 | PASS | - |
| Missing pages | PASS: crawl of home, blog, guide, alternatives, pricing, support, roadmap found no indexable internal page absent from sitemap. Only /login (noindex, intentionally excluded) and /buy (disallowed redirect) | - |
| priority/changefreq absent | PASS | - |
| lastmod accuracy | ISSUE (below) | Low-Medium |
| robots.txt `Host:` directive | Non-standard, ignored by Google and Bing (Yandex only legacy) | Info |

## lastmod issues
- 13 of 30 (43%) share 2026-11-10; the rest 11-18 to 11-22, so not blanket-identical, but the dates are hand-maintained and stale.
- `/`, `/pricing`, `/roadmap` are hardcoded 2026-11-10 in `pages[]`, but git shows app/page.tsx, app/pricing, app/roadmap last changed 2026-11-21. Understated (Medium-Low).
- All 8 guide pages use one literal "2026-11-21" in sitemap.ts (guidePages.map), not per-page dates. Low.
- Alternatives dates (2026-11-10) match last commit on lib/alternatives.ts, fine; note that one file edit changes all 7 pages' real dates, so only bump when a page's own data changes.
- /support 2026-11-10 matches git.
- Recent commits (navbar/header, 2026-11-22) are boilerplate; correctly not reflected in lastmod. Keep it that way.

Fixes: in app/sitemap.ts update `/`, `/pricing`, `/roadmap` to 2026-11-21 (or newer if content changed); add an `updated` field per guide page in lib/guide.ts and use it instead of the literal. Optionally derive dates from git/content metadata at build time to avoid drift. Remove `host` from app/robots.ts (optional).

## Quality gates
No location pages. Alternatives (7) and guide/blog pages are well below the 30-page threshold. No gate triggered.

## Severity summary
Critical: none. High: none. Medium: none. Low: stale/hardcoded lastmod on 3 core pages and shared guide date. Info: robots `Host:` line.
