# Content Quality / E-E-A-T: showthrough.com

Audit date: 2026-11-22. Scope: 30 sitemap URLs fetched with `render_page.py --mode never` (raw HTML, no browser launched). All returned 200. The scoring uses the trafilatura `extracted_text`. Where extraction dropped content (some guide steps, the blog `<time>` element), we checked the raw `<main>` HTML and the source (`components/guide-pages.tsx`, `lib/blog.tsx`, `lib/alternatives.ts`).

## Scores

| Metric | Score |
|---|---|
| **Content Quality (overall)** | **68 / 100** |
| E-E-A-T composite | 59 / 100 |
| AI citation readiness | 74 / 100 |
| Metadata templating risk | low (0 of 30 templated, no shared CTA phrases) |

### E-E-A-T breakdown (this skill's internal weights, not Google's)

| Factor | Weight | Score | Basis |
|---|---|---|---|
| Experience | 20% | 72 | Founder first-person story in all 5 posts ("When I started freelancing... the 25-video and 5-minute limits came up within a week or two"). Guide steps use annotated real screenshots. Comparisons are honest and include "Where X is better" sections. No original tests or measurements, for example file sizes, upload speed, or side-by-side timings. |
| Expertise | 25% | 58 | Blog posts have a byline ("By Harsh Rawat", plus Person schema linked to X). There is no bio, no credentials, and no author page. One technical claim is wrong by about 10x (storage hours, see F1). |
| Authoritativeness | 25% | 40 | New brand with no testimonials, reviews, user counts, Chrome Web Store rating, press or third-party mentions. Organization `sameAs` lists only X and the Chrome Web Store. |
| Trustworthiness | 30% | 68 | Strong points: the contact email appears on guide, terms and pricing; there is a 7-day refund policy; the privacy page and the Cloudflare-access FAQ are specific; competitor prices are dated and sourced. Weak points: no About page, no legal entity or address, a Gmail contact address, a team-feature claim that doesn't match what's built (F2), and the storage claim (F1). |

Weighted: 14.4 + 14.5 + 10.0 + 20.4 = 59.3.

## Page inventory

| Group | Words (extracted) | Flesch reading ease | Notes |
|---|---|---|---|
| Homepage | 1,100 | 80 | Above the 500 floor. 4 H2s. H1 is 17 words long. |
| Pricing | 756 | 80 | OK |
| Alternatives hub | 406 | 45 | Mostly a comparison table. Low reading ease is a table artifact. |
| 8 alternatives pages | 453-750 | 64-78 | 80-88% unique 5-grams. Max pairwise Jaccard 0.075 (Screencastify vs Zight). |
| 5 blog posts | 810-1,442 | 67-78 | All below the 1,500 blog floor. Depth matches intent except where noted. |
| 9 guide pages | about 20-100 unique words each | 61-96 | Roughly 50-60% of each page's text is the shared 8-step sidebar. |
| Support | about 140 (5 Q&As in HTML) | 69 | Thin, but intent-appropriate. |
| Roadmap | 349 | 61 | No dates or timeline. |
| Privacy / Terms | 1,108 / 404 | 71 / 67 | Both reuse the homepage meta description. |

AI-typical phrasing scan ("delve", "seamless", "leverage", "landscape", "in today's", "unlock", "robust", em dashes, and similar): **0 hits across all 30 pages.** Sentences are short (12-17 words) and concrete.

## Findings

### F1. HIGH: Storage claim is overstated by about 10x
- Evidence: `/guide/turn-on-r2` (source `components/guide-pages.tsx`, "You add a card, but you pay $0" note) says "Your first 10 GB every month are free. That's roughly 100 hours of recordings." The extension encodes at `videoBitrate = 2_500_000` plus 128 kbps audio (`extension/lib/hls-recorder.js:19,56`). That is about 2.6 Mbps, or about 1.2 GB per hour, so 10 GB holds about 8-9 hours. Screen content with variable bitrate may come in lower, but nowhere near 100 hours. Homepage copy ("That's a lot of screen recordings") leans on the same idea.
- Why it matters: it is a checkable factual error on a cost claim, which is the core of the trust pitch.
- Fix: measure the real average MB per minute across actual recordings and state it. For example: "about X hours at our default quality (measured on N recordings)". Or drop the hours figure.

### F2. HIGH (trust): "Whole team" pricing is promoted ahead of the team feature
- Evidence: the homepage says "One payment for your whole team", "$49 for your whole team. No seats" and "Every team member, no per-seat pricing". But `/alternatives/loom` lists "Team library and invites: Coming soon", and `/roadmap` lists "Team members: Planned".
- Fix: wherever the team price is claimed, add a short note, such as "Team library and invites coming soon, included free". The comparison pages already do this. Visitors shouldn't need to find the roadmap to learn it.

### F3. HIGH: No About page and no author bio. Authority signals are thin.
- Evidence: there is no `/about` route. Blog bylines are plain text with no bio box, and the Person `url` points to X only. The Organization schema has no `founder`, and `sameAs` has only X and the Chrome Web Store. The homepage carries no social proof: no reviews, Chrome Web Store rating, user count, or testimonials.
- Fix: add `/about`, a founder page covering who builds it, why, where it's based, a photo and links (X, GitHub, LinkedIn, Product Hunt). Link the byline to it. Add a 2-3 sentence author box under each post. Add `founder`, more `sameAs` profiles and a `contactPoint` to the Organization schema. Show the Chrome Web Store rating and any real customer quotes. Consider a domain email instead of Gmail.

### F4. MEDIUM: Guide is split into 9 thin URLs
- Evidence: unique text per step is about 20-100 words (`/guide/wait-for-setup` has about 20). Roughly 50-60% of each page's text is the shared sidebar, and the steps are 40-46% unique against each other. The annotated screenshots are a real strength.
- Fix: consolidate into one `/guide` page with anchored H2 steps, keeping the screenshots, and 301 the step URLs to the anchors. If the one-step-per-page UX must stay, add `noindex,follow` to the step pages and keep `/guide` and `/guide/troubleshooting` indexable. Expand troubleshooting with error messages quoted word for word, which are high-value long-tail queries.

### F5. MEDIUM: Alternatives pages lack machine-readable dates and authorship
- Evidence: the visible "Loom prices checked on 10 November 2026 from Loom's pricing page" line is excellent, and the source link is present. But the JSON-LD has only BreadcrumbList and FAQPage: no `dateModified`, no `author`, no WebPage or Article. The `alt.updated` value feeds the sitemap only.
- Fix: add WebPage or Article JSON-LD with `dateModified` = the checked date and `author`/`publisher`. Show "By Harsh Rawat, updated <date>" on the page.

### F6. MEDIUM: Competitor facts are dated, but some aren't linked to a primary source
- Evidence (positive): every alternatives page carries a "checked on" date and a link to the vendor's pricing page. The blog posts carry "checked on" dates, and `/blog/is-loom-free` links Atlassian help-centre pages.
- Gaps: `/blog/free-loom-alternatives` makes 7 tools' worth of free-plan claims (Screenity GPLv3, Cap 25 links/month, Vidyard 5/month, ScreenPal no system audio, Zight 1 GB/50 captures). It says "checked on each tool's own website" but has no per-claim links. ScreenPal's "according to its help centre" and Snagit's "according to its store page" are not linked. Snagit's "$39 per user per year" and "Snagit with Camtasia: From $39" look inconsistent (a bundle is unlikely to start at the same price).
- Fix: link each vendor claim to its exact source page. Re-verify the Snagit/Camtasia bundle price. Keep a re-check cadence (for example monthly) and update the dates when you do.

### F7. MEDIUM: Freshness risk from Black Friday copy
- Evidence: the homepage, pricing page and roadmap say "Until Black Friday, 27 November, 11:59 PM PT" and "Everyone who buys by Black Friday (27 November) gets every one of these updates free, forever." This copy expires in 5 days.
- Fix: check that the copy switches automatically through `currentOffer()`, including the roadmap's hardcoded sentence. Stale promotion text after the date reads as neglect to users and raters. The roadmap would also benefit from a "last updated" date or rough quarter targets.

### F8. LOW-MEDIUM: Blog posts are under the 1,500-word floor
- Evidence: is-loom-free 810, loom-pricing 1,070, async-communication 1,174, free-loom-alternatives 1,311, chromebook 1,442.
- Assessment: the short answer-style posts (is-loom-free, loom-pricing) fit their intent, so don't pad them. The gaps that matter are in free-loom-alternatives, where competing listicles run 2,500+ words: add your own test notes for each tool (time to first share link, actual file sizes, watermark screenshots), which would also lift Experience. In async-communication, add templates and real example messages.

### F9. LOW: Duplicate meta descriptions on legal pages
- Evidence: `/privacy` and `/terms` both use the homepage description ("Record your screen, camera and voice from Chrome...").
- Fix: write unique descriptions, for example "What Showthrough stores, what stays in your Cloudflare, and who we share data with."

### F10. LOW: Repeated stock phrasing across pages
- Evidence: "connected in one click (while) we handle the rest" or close variants appear 23 times across 11 pages, including 6 times on the homepage. Three sentences are identical on all 8 alternatives pages ("Showthrough is one payment, currently $49.", the Cloudflare cost sentence, and "Prices change; check there before you buy."). The pages are otherwise highly unique (80-88%).
- Fix: keep the boilerplate on comparison pages, since it's fine there. On the homepage, cut the "we handle the rest" phrase to one or two uses.

### F11. INFO: Metadata templating check
- `metadata_template.py` over the 30 pairs returned `site_risk: low`, `templated_ratio: 0.0` and `shared_cta_phrases: {}`. The `brand_suffix_in_description` flags on the guide, roadmap, support and blog pages are false positives: "Showthrough" is used as a noun in a real sentence, not appended as a suffix. No action needed.

## AI citation readiness (74)
Strengths:
- "Quick answer" lead paragraphs.
- Comparison and pricing tables with explicit numbers.
- Dated "checked on" lines.
- FAQ sections with FAQPage schema on the alternatives pages, blog posts, home and support.
- Clear question-style H2/H3 headings and short, quotable sentences.
- Worked arithmetic ("5 × $18 × 12 = $1,080").

Gaps:
- No `dateModified` on the alternatives pages (F5).
- The guide is spread across 9 URLs (F4).
- No About or entity page for engines to resolve the brand and founder (F3).
- The 100-hours claim could be quoted back incorrectly (F1).

## Priority fixes
1. Correct the 10 GB / 100 hours claim (F1).
2. Add team-feature status next to every "whole team" claim (F2).
3. Ship `/about`, an author bio box and richer Organization/Person schema (F3).
4. Add Article/WebPage schema with `dateModified` to the alternatives pages (F5), and per-claim source links in free-loom-alternatives (F6).
5. Consolidate or noindex the guide step pages (F4).
6. Check the Black Friday copy rolls over on 28 Nov (F7). Write unique privacy and terms descriptions (F9).

## Structured findings (audit-data.json, category "Content Quality")

```json
{
  "category": "Content Quality",
  "score": 68,
  "eeat": {"experience": 72, "expertise": 58, "authoritativeness": 40, "trustworthiness": 68, "composite": 59},
  "ai_citation_readiness": 74,
  "metadata_template": {"site_risk": "low", "templated_ratio": 0.0, "shared_cta_phrases": {}},
  "findings": [
    {"id": "F1", "severity": "high", "title": "10 GB = 'roughly 100 hours' claim overstated ~10x", "url": "/guide/turn-on-r2", "evidence": "extension/lib/hls-recorder.js videoBitrate 2.5 Mbps + 128 kbps audio = ~1.2 GB/hour, so ~8-9 hours per 10 GB", "fix": "State measured MB/min or remove the hours figure"},
    {"id": "F2", "severity": "high", "title": "'Whole team' pricing promoted while team members feature is Planned", "url": "/", "evidence": "Homepage 'Every team member, no per-seat pricing' vs /roadmap 'Team members: Planned'", "fix": "Add 'team library coming soon, included free' next to team claims"},
    {"id": "F3", "severity": "high", "title": "No About page or author bio; weak authority signals", "url": "site-wide", "evidence": "No /about route, byline unlinked, Organization sameAs only X + CWS, no reviews/testimonials", "fix": "Add /about founder page, author box, founder/sameAs/contactPoint schema, CWS rating, testimonials"},
    {"id": "F4", "severity": "medium", "title": "Guide split into 9 thin URLs", "url": "/guide/*", "evidence": "20-100 unique words per step; ~50-60% of each page is the shared sidebar", "fix": "Consolidate into /guide with anchors and 301, or noindex the step pages"},
    {"id": "F5", "severity": "medium", "title": "Alternatives pages lack dateModified/author schema", "url": "/alternatives/*", "evidence": "JSON-LD only BreadcrumbList + FAQPage; checked date visible only", "fix": "Add WebPage/Article JSON-LD with dateModified and author"},
    {"id": "F6", "severity": "medium", "title": "Some competitor claims not linked to primary source", "url": "/blog/free-loom-alternatives, /alternatives/snagit, /alternatives/screenpal", "evidence": "7 tools' free-plan claims with no per-claim links; Snagit with Camtasia 'From $39' looks inconsistent", "fix": "Link each claim; re-verify the Snagit bundle price; set a re-check cadence"},
    {"id": "F7", "severity": "medium", "title": "Black Friday copy expires 27 Nov", "url": "/, /pricing, /roadmap", "evidence": "'Everyone who buys by Black Friday (27 November)...'", "fix": "Confirm automatic rollover, including the roadmap sentence; add an updated date to the roadmap"},
    {"id": "F8", "severity": "low", "title": "Blog posts below the 1,500-word floor", "url": "/blog/*", "evidence": "810-1,442 words", "fix": "Deepen free-loom-alternatives with original test data; don't pad the answer posts"},
    {"id": "F9", "severity": "low", "title": "Privacy and terms reuse the homepage meta description", "url": "/privacy, /terms", "evidence": "Identical description to /", "fix": "Write unique descriptions"},
    {"id": "F10", "severity": "low", "title": "Repeated stock phrase 'one click... we handle the rest'", "url": "site-wide", "evidence": "23 occurrences across 11 pages, 6 on the homepage", "fix": "Cut it to 1-2 uses on the homepage"}
  ]
}
```
