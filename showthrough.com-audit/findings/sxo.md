# SXO Findings: showthrough.com

Date: 2026-11-22 | Scope: `/`, `/pricing`, `/alternatives/loom`, `/blog/loom-pricing`
Score label: **SXO Gap Score** (separate from the SEO Health Score)

## 1. Primary finding: page-type mismatch

| Page | Target keyword | SERP dominant type (confidence) | Page type | Severity |
|---|---|---|---|---|
| `/` | screen recorder no subscription | Tool / Interactive: free in-browser recorders (6 of 9, about 67%) | Landing Page for a paid product, no free tier | **CRITICAL** |
| `/` | loom alternative | Comparison listicles, "N best Loom alternatives" (7 of 9, about 78%) | Landing Page | **HIGH** |
| `/alternatives/loom` | loom alternative | Comparison listicles with many tools (about 78%) | 1-vs-1 Comparison ("Showthrough vs Loom") | **HIGH** (format mismatch: 2 products where the SERP expects 6 to 12) |
| `/alternatives/loom` | loom alternative one time payment / pay once loom alternative | Mixed: listicles plus single-vendor "pay-once" landing pages (screensnap.pro ranks) | 1-vs-1 Comparison | ALIGNED |
| `/blog/loom-pricing` | loom pricing | Blog Post / pricing guide (7 of 9 vendor blogs, plus Vendr data page; loom.com/pricing expected at #1) | Blog Post (BlogPosting schema, byline, date) | ALIGNED |
| `/pricing` | showthrough pricing (branded, navigational) | n/a (branded) | Product Page (price plus Buy button) | ALIGNED |

**Key insight:** Google treats "loom alternative" as a research query and ranks third-party style roundups (TechSmith, Tango, Zight, tl;dv, Dubb, Clueso, ScreenCapture), plus the Cap GitHub repo. Neither the homepage nor `/alternatives/loom` is that type of page. The site's only listicle, `/blog/free-loom-alternatives`, targets "free" and leaves Showthrough out because it is paid. So the site has no page that can rank for the head term. Most "screen recorder no subscription" searchers want a free tool they can use right away. A paid landing page with no free tier will not satisfy that intent, so the homepage should stop targeting that phrase.

### SERP snapshots (WebSearch, 2026-11-22)
- **loom alternative:** techsmith.com/blog/loom-alternatives, tango.ai/blog/loom-alternatives, github.com/capsoftware/cap, zight.com/blog/best-loom-alternatives, tldv.io/blog/loom-alternatives, dubb.com/blog/loom-alternative, clueso.io/compare/loom-alternatives, screencapture.com/blog/loom-alternatives, plus one off-topic Wikipedia result (dobby loom). Titles almost all contain "Best" plus a count plus "2026". The angles are use-case segmentation (sales, editing, open source) and "free and paid".
- **screen recorder no subscription:** freescreencapture.com, screenrecordonline.com, screencapture.com, recordit.dev, innerscene.com/tools, screenrecording.app (all tool pages); aryanium.com and captio.work (listicles); screenpal.com (download page). The recurring modifiers are "free", "no watermark", "no sign up" and "no time limit".
- **loom pricing:** vendr.com, arcade.software, empyra.com, kommodo.ai ("Team Cost Calculator"), bingeable.ai, saascrmreview.com, usecarly.com ("the Seat Trap"), vorec.ai, vyds.io. 8 of 9 titles contain "2026".
- **loom alternative one time payment:** descript, screensnap.pro ("The Pay-Once Loom Alternative", a landing page), setapp, cut-the-saas, clickup, usecarly. Pay-once competitors named in these results: Snagit, Cap desktop, CleanShot X, Screen Studio, ScreenSnap Pro, Tella.
- **own-storage Chrome angle:** Cap (S3/self-host), Unloom, SuperchargeCapture and Screenity all compete on "your storage".

## 2. User stories (derived from SERP signals)

1. **Consideration:** "As a team lead paying Loom per seat, I want a ranked list of Loom alternatives grouped by use case, so I can shortlist 2 or 3 without reading 10 vendor sites." *Signal: 7/9 "loom alternative" results are use-case listicles (Clueso "by use case", Dubb "for sales teams").*
2. **Decision:** "As a freelancer or solo founder, I want a Loom-style recorder I pay for once, so a recurring bill doesn't eat my margins." *Signal: the "loom alternative one time payment" SERP ranks screensnap.pro "Pay-Once Loom Alternative" and lists 6 pay-once tools with prices.*
3. **Awareness / consideration:** "As a manager budgeting tools, I want to see what Loom costs for my team size per year, so I can justify switching." *Signal: kommodo.ai "Team Cost Calculator", usecarly "Seat Trap", Vendr negotiated-rate data on the "loom pricing" SERP.*
4. **Consideration:** "As a developer, I want my recordings in storage I control, so a vendor can't read or lose them." *Signal: Cap's GitHub repo ranks top 3 for "loom alternative"; Cap S3, Unloom and Screenity listings all promise own storage.*
5. **Awareness:** "As a casual user, I want to record my screen free right now with no watermark and no account." *Signal: 6/9 "screen recorder no subscription" results are free browser tools.* Showthrough cannot serve this story and should not try to on the homepage.

## 3. SXO Gap Scores (7 dimensions, 100 points)

| Dimension | `/` (loom alternative) | `/alternatives/loom` | `/blog/loom-pricing` | `/pricing` |
|---|---|---|---|---|
| Page Type (15) | 5: landing page vs listicle SERP | 8: 1-vs-1 vs multi-tool SERP | 14: aligned | 12: aligned (branded) |
| Content Depth (15) | 9: 1,257 words, strong FAQ, no multi-tool context | 9: 766 words, two tables, honest pros and cons | 12: 1,117 words, plan table, team-cost table, "how to pay less" | 9: 792 words, mostly FAQ duplicated from homepage |
| UX Signals (15) | 11: clear "Buy for $49", savings slider, anchor nav | 12: at-a-glance table, "Which one should you pick?" | 11: quick-answer box, tables; no TOC; soft CTA only ("See how it works") | 12: clear tiers, countdown, team-size slider; the three-price story is confusing |
| Schema (15) | 12: Organization, WebSite, SoftwareApplication+Offer, FAQPage | 8: Breadcrumb and FAQPage only; no SoftwareApplication or ItemList | 13: BlogPosting (dates, author), Breadcrumb, FAQPage | **2: no JSON-LD at all** although FAQ and prices are on the page |
| Media (15) | 6: 1 screenshot plus a decorative avatar; **no demo video on a video product** | **1: zero images or video** | 7: 1 hero graphic; no Loom pricing screenshot | 2: no images |
| Authority (15) | 4: no testimonials, ratings, user counts or Chrome Web Store rating; personal Gmail support address | 7: sources Loom's pricing page with a date and admits Loom's strengths; no social proof | 10: first-hand experience (author's team paid Loom $1,080 a year), byline | 4: no reviews, no guarantee badge, 7-day refund only |
| Freshness (10) | 7: Black Friday copy goes stale 27 Nov | 9: prices checked 10 Nov 2026 | 9: 19 Nov 2026; title lacks "2026" (8/9 competitors use it) | 7: countdown and "Launch $99" copy need an update after 27 Nov |
| **Total** | **54 / 100** | **54 / 100** | **76 / 100** | **48 / 100** |

## 4. Persona scores (site journey from each persona's likely entry page)

| Persona (entry page) | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Small team lead (`/alternatives/loom` to `/pricing`) | 13 | 17 | 10 | 15 | **55** | Needs Work |
| Privacy-conscious dev (`/`, FAQ) | 19 | 14 | 12 | 14 | **59** | Needs Work |
| Budget buyer (`/blog/loom-pricing`, `/pricing`) | 20 | 17 | 13 | 16 | **66** | Good |
| Solo founder (`/`) | 21 | 21 | 14 | 22 | **78** | Good |
| (SERP-derived) Free-tool seeker ("no subscription") | 4 | 15 | 10 | 3 | **32** | Critical Mismatch (do not chase on `/`) |

Persona evidence:
- **Small team lead.** SERP signals: "Team Cost Calculator", "Seat Trap", Dubb's "for sales teams". The site's headline promise is "one payment for your whole team", but its own comparison table lists "Team library and invites: Coming soon", and there is no admin, SSO or shared-workspace story. Trust gaps: no team logos or testimonials, a personal Gmail support address, and a visible single-founder setup.
- **Privacy-conscious dev.** SERP signals: Cap GitHub in the top 3; Cap, Unloom and Screenity listings promise own storage. Strengths: the "Can Showthrough see the rest of my Cloudflare account?" FAQ is excellent. Gaps: it sits inside an accordion; there is no security or architecture page, no list of extension permissions and no open-source code. All links are public (password and private links are only "on the roadmap"), viewers need Google sign-in to comment, and Cloudflare asks for a card before enabling storage.
- **Budget buyer.** SERP signals: "free and paid" listicle titles, Zight's per-seat price undercut, "no watermark" modifiers. Strengths: the savings slider ($6,480 vs $49 at 10 seats). Gaps: no free plan or trial; the price after 27 Nov ("$99, no future updates, each update costs a small fee") is vague; the blog's end CTA is only "See how it works" and has no price or buy link.
- **Solo founder.** SERP signal: pay-once SERP (ScreenSnap Pro $39, CleanShot $29). This persona is well served: one-click flow, $49, "link ready the moment you stop". The gap is the lack of proof: no demo video, no reviews.

### Weakest persona: Small team lead (55/100)
**Top issue:** the "whole team" price promise is undercut by "Team library and invites: Coming soon" and by the lack of any team social proof.
**Fix:** add a "For teams" section on `/pricing` and `/alternatives/loom` that states plainly what teams get today (shared links, comments, unlimited recorders on one purchase) and gives a ship date for the library and invites. Add a team-size default of 5 on the slider to match the blog's "team of 5" math. Add one team testimonial plus a business support address on the domain (not a Gmail address).

### Systemic issues
- **Trust (lowest dimension for every persona):** zero testimonials, reviews, ratings or install counts on all 4 pages. A Chrome Web Store rating badge and 3 named quotes would lift every persona.
- **Media:** no product demo video anywhere on a screen-recording product's site.

## 5. Priority actions

1. **[HIGH] Create `/blog/loom-alternatives`** ("9 best Loom alternatives in 2026, free and paid, by use case"). It should be a multi-tool listicle with an ItemList schema, a comparison matrix, "best for" segments (solo, teams, sales, open source and privacy, pay-once) and Showthrough listed honestly as the pay-once pick. Link it from `/alternatives/loom` and `/blog/free-loom-alternatives`. This is the only page type that can rank for the head term.
2. **[HIGH] Reposition `/alternatives/loom`** toward the long tail it can win: "pay once Loom alternative", "Loom alternative no subscription", "Showthrough vs Loom". Add screenshots and a 60-second demo video, SoftwareApplication schema, and a "Switching from Loom" section (import status, running both).
3. **[CRITICAL for the keyword] Drop "screen recorder no subscription" as a homepage target.** Retarget the homepage to "Chrome screen recorder, pay once" and "Loom alternative, one-time payment". If the free-tool audience matters, build a separate `/tools/screen-recorder` page with in-browser recording, a local download and an upsell to share links.
4. **[HIGH] Add JSON-LD to `/pricing`:** SoftwareApplication with Offer(s) for $49 and $99 (with priceValidUntil 2026-11-27 on the sale offer), plus FAQPage. Run `/seo schema`.
5. **[HIGH] Social proof sitewide:** Chrome Web Store rating and user count, 3 testimonials (one solo, one team, one dev), and a Product Hunt badge after launch.
6. **[MEDIUM] Homepage demo video** (a recording made with Showthrough itself, shared via a Showthrough link) above the fold or right below the hero.
7. **[MEDIUM] `/blog/loom-pricing`:** put "2026" in the title, embed the team-size cost slider (the competitor kommodo ranks with a calculator), add a TOC, and make the end CTA concrete ("Pay $49 once instead of $1,080 a year, see pricing").
8. **[MEDIUM] Privacy page** (`/security` or `/how-it-works/storage`): architecture diagram, extension permissions, OAuth scopes used and discarded, and what viewers' Google sign-in shares. Link it from the hero.
9. **[MEDIUM] Post-Black-Friday copy plan:** rewrite the countdown and "$99, no future updates, each update costs a small fee" before 28 Nov, and give a concrete update price.

Cross-skill: `/seo schema` (pricing, alternatives), `/seo content` (E-E-A-T and social proof), `/seo page` (`/alternatives/loom` depth).

## 6. Limitations
- WebSearch returns about 9 organic results per query with no positions, PAA, ads, AI Overview or featured-snippet data. SERP features are inferred, not observed. loom.com/pricing was not returned for "loom pricing" but almost certainly ranks #1 on Google.
- Competitor pages were not fetched, so word counts and media for competitors are estimates from the SERP.
- No rankings, Search Console, click-through or traffic data, so search-volume weighting of personas is qualitative.
- The homepage render fell back to raw HTML (`mode_used: raw`) even though a full browser render was requested. The other 3 pages were rendered in Chromium with the sandbox on. The JS gap was 0 to 0.6%, so there was no material difference.
- Above-the-fold assessment was made from DOM order, not from screenshots or a viewport check.
- Mobile UX, Core Web Vitals and the checkout flow (`/buy`) were not assessed.

## 7. Structured findings (audit-data.json, category "Search Experience")

```json
{
  "category": "Search Experience",
  "sxo_gap_scores": {"/": 54, "/alternatives/loom": 54, "/blog/loom-pricing": 76, "/pricing": 48},
  "findings": [
    {"id": "sxo-1", "severity": "critical", "page": "/", "keyword": "screen recorder no subscription", "title": "Paid landing page vs free-tool SERP (67% Tool/Interactive)", "fix": "Stop targeting on homepage; optional /tools/screen-recorder"},
    {"id": "sxo-2", "severity": "high", "page": "/", "keyword": "loom alternative", "title": "Landing page vs listicle SERP (78% Comparison listicles)", "fix": "Create /blog/loom-alternatives multi-tool listicle"},
    {"id": "sxo-3", "severity": "high", "page": "/alternatives/loom", "keyword": "loom alternative", "title": "1-vs-1 comparison where SERP expects 6-12 tool roundups", "fix": "Retarget to pay-once long tail; add media, SoftwareApplication schema"},
    {"id": "sxo-4", "severity": "high", "page": "/pricing", "title": "No JSON-LD on pricing page", "fix": "SoftwareApplication + Offer + FAQPage"},
    {"id": "sxo-5", "severity": "high", "page": "sitewide", "title": "Zero social proof (testimonials, ratings, install counts)", "fix": "CWS rating badge + 3 persona testimonials"},
    {"id": "sxo-6", "severity": "medium", "page": "/", "title": "No demo video on a video product", "fix": "Embed Showthrough-hosted demo near hero"},
    {"id": "sxo-7", "severity": "medium", "page": "/pricing,/alternatives/loom", "title": "Whole-team promise vs 'Team library and invites: Coming soon'", "fix": "For-teams section with what ships today + date"},
    {"id": "sxo-8", "severity": "medium", "page": "/blog/loom-pricing", "title": "Missing year in title, no calculator, soft CTA", "fix": "Add 2026, embed slider, concrete pricing CTA"},
    {"id": "sxo-9", "severity": "medium", "page": "sitewide", "title": "Privacy story buried in FAQ accordion; public-only links", "fix": "Dedicated security/storage page"},
    {"id": "sxo-10", "severity": "medium", "page": "/,/pricing", "title": "Black Friday copy goes stale 27 Nov; vague post-sale update fee", "fix": "Pre-write post-sale copy with concrete update pricing"}
  ],
  "personas": {"small_team_lead": 55, "privacy_conscious_dev": 59, "budget_buyer": 66, "solo_founder": 78, "free_tool_seeker": 32}
}
```
