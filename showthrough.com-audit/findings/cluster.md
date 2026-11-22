# Content Architecture: Semantic Cluster Analysis (showthrough.com)

Seed: `loom alternative` | Date: 2026-11-22 | Scope: 22 keywords, 15 live SERP samples

## Method and data caveat

- 15 SERPs were sampled with the WebSearch tool. That tool does not return a clean Google top-10. It returns 15-30 mixed results that include ccTLD duplicates (capterra.co.uk/.ie/.in and so on). So the overlap scores below combine **exact shared URLs** with **shared ranking domains**, and the scores are **estimates**. Check the 3 most important pairs in a rank tracker (Ahrefs/Semrush SERP compare) before merging or retiring any URL.
- No search-volume data was available. Volume fields are `null`. The pillar was chosen on breadth of SERP (most generic, aggregator-dominated results).
- The 9 `/guide/*` pages are onboarding and support content (navigational/product). They are left out of clustering and used only as outbound link targets.

## 1. Keyword set and intent

| # | Keyword | Intent | SERP format observed | Existing URL |
|---|---------|--------|----------------------|--------------|
| 1 | loom alternative(s) | Commercial | Aggregators (Capterra, G2, AlternativeTo, SoftwareAdvice, GetApp) and listicles | /alternatives (hub), /alternatives/loom |
| 2 | best loom alternatives 2026 | Commercial | Vendor listicles (Arcade, Zight, Builder.io) and Capterra | none (absorbed by #1) |
| 3 | free loom alternatives | Commercial | Listicles (UserGuiding, Movavi), directories | /blog/free-loom-alternatives |
| 4 | loom alternative no subscription / pay once / one time purchase | Commercial-Transactional | Product landing pages (screensnap.pro/loom-alternative), Setapp, Descript | /alternatives/loom (title already says "pay for once") |
| 5 | loom alternative lifetime deal | Transactional | Deal sites (StackSocial, AppSumo) | none (secondary of #4) |
| 6 | self-hosted loom alternative / own storage S3 R2 | Commercial | cap.so, GitHub repos, Railway, SendRec | **GAP** |
| 7 | loom alternative chrome extension | Commercial | Chrome Web Store listings, AlternativeTo | none (secondary of #8) |
| 8 | best screen recorder chrome extension | Commercial | Listicles (ClickUp, Movavi, Beebom, Android Authority) | **GAP** |
| 9 | free screen recorder chrome extension | Commercial | Listicles (CapCut) | secondary of #8 |
| 10 | loom pricing | Commercial-Info | Pricing explainers (Arcade, Spendflo, Vendr, G2, Capterra) | /blog/loom-pricing |
| 11 | is loom free | Informational | Loom support, Capterra pricing, explainers | /blog/is-loom-free |
| 12 | loom free plan limits | Informational | same as #11 | secondary of #11 |
| 13 | loom 5 minute limit (workaround) | Informational | Atlassian/Loom support dominated | **GAP** |
| 14 | loom vs vidyard | Commercial (compare) | Vendor comparison pages, G2/Capterra compare | partial: /alternatives/vidyard |
| 15 | vidyard alternative | Commercial | not sampled | /alternatives/vidyard |
| 16 | screencastify alternative | Commercial | TechSmith, AlternativeTo, Capterra, Zight | /alternatives/screencastify |
| 17 | snagit / tella / zight / screenpal / cap alternative | Commercial | not sampled (assumed same pattern as #16) | /alternatives/{slug} |
| 18 | how to screen record on chromebook | Informational (how) | OEM/tech press how-tos (Lenovo, HowToGeek, Android Central) | /blog/how-to-screen-record-on-chromebook |
| 19 | async video communication / async communication | Informational (concept) | Vendor blogs (Atlassian, Zoom, Vimeo, Zight) | /blog/async-communication |
| 20 | loom (brand) | Navigational | (removed) | n/a |
| 21 | loom login / loom download | Navigational | (removed) | n/a |

## 2. SERP overlap matrix (estimated)

Score = exact shared URLs, with shared ranking domains in brackets. "Judged" applies the methodology thresholds after weighting for the tool's noise.

| Pair | Exact | Domains | Judged | Decision |
|------|-------|---------|--------|----------|
| loom alternative / best loom alternatives 2026 | 1 (capterra.com/.../alternatives) | 3 (capterra, softwareadvice, builder.io) | 7+ (same post) | **Same post.** One URL should own both. |
| loom alternative / free loom alternatives | 2 (userguiding, getapp.sg) | 4 (alternativeto, userguiding, getapp, capterra) | 4-6 | Same cluster, separate posts. The "free" modifier holds a distinct sub-SERP. |
| loom alternative / loom alternative chrome extension | 2 (alternativeto p=16, loom.com/blog) | 3 | 4-5 | Same cluster |
| best loom alternatives / no-subscription | 1-2 (builder.io, zight) | 3 | 3-4 | Same cluster (edge). The SERP rewards **product pages**, not listicles. |
| loom alternative / no-subscription | 0 | 1 | 2-3 | Interlink. Different page type. |
| loom alternative / self-hosted R2 | 0 | 0 | 0-1 | Separate SERP, but the same commercial funnel. Cluster on topical grounds. |
| loom alternative chrome ext / best screen recorder chrome ext | 0 | 1 | 2 | Interlink. Different posts or clusters. |
| best screen recorder chrome ext / free screen recorder chrome ext | 0 (capcut x2 same domain) | 2 | 5-7 | Merge as a secondary keyword |
| loom pricing / is loom free | 2 (arcade loom-pricing, capterra pricing) | 3 | 4-6 | Same cluster, separate posts (OK as is) |
| is loom free / loom 5 minute limit | 0 | 1 (loom support) | 2-3 | Same cluster on topic (support-dominated SERP) |
| loom pricing / loom alternative | 0 | 1 (capterra) | 1 | Separate. Interlink only. |
| is loom free / free loom alternatives | 0 | 1 (vmaker) | 1-2 | Interlink (high-value bridge) |
| loom vs vidyard / loom alternative | 0 | 2 (g2, capterra different paths) | 1-2 | Separate |
| screencastify alternative / loom alternative | 0 | 4 (alternativeto, capterra, g2, zight) | 2-3 | Interlink. Each competitor alternative is its own post. |
| chromebook how-to / any loom kw | 0 | 1 (atlassian loom blog) | 0-1 | Separate |
| async communication / any loom kw | 0 | 1 (atlassian) | 0-1 | Separate (weak topical fit) |

## 3. Cannibalization check

| Risk | URLs | Severity | Finding | Fix |
|------|------|----------|---------|-----|
| C1 | /alternatives vs /alternatives/loom vs /blog/free-loom-alternatives | **High** | All three target "loom alternative(s)". The hub's H1 is "Loom alternatives and other screen recorders", /alternatives/loom's H1 is "A Loom alternative with no video limits...", and the blog title is "7 free Loom alternatives". The head-term SERP is aggregator and listicle, so Google has no clear multi-option page to rank and may rotate the three. | Give each URL one keyword: **/alternatives = "loom alternatives" / "best loom alternatives" (pillar, best-of listicle)**. **/alternatives/loom = "loom alternative no subscription / pay once" (comparison and landing page: Loom vs Showthrough).** **/blog/free-loom-alternatives = "free loom alternatives" only.** Retitle /alternatives/loom to something like "Loom vs Showthrough: the pay-once Loom alternative". Remove the generic "Loom alternatives" wording from its H1 and title. |
| C2 | /alternatives hub "Loom alternative" H2 section vs /alternatives/loom | Medium | The hub's first H2 is literally "Loom alternative". That restates the exact term on 2 URLs. | Rename the H2 to "Showthrough vs Loom" and link to /alternatives/loom with anchor "pay-once Loom alternative". |
| C3 | /blog/loom-pricing vs /blog/is-loom-free | Low-Med | Overlap of 4-6 is within bounds for separate posts, but both will cover Starter-plan limits. | Keep is-loom-free focused on Starter limits (25 videos, 5-min cap, downloads) and loom-pricing focused on paid tiers and per-seat cost math. Cross-link them. Don't duplicate the full plan table: summarise it and link. |
| C4 | /alternatives/loom "Loom pricing" H2 vs /blog/loom-pricing | Low | The product page carries a pricing section. | Keep it short (3-4 lines) and link to /blog/loom-pricing for detail. |
| C5 | Planned "best screen recorder chrome extension" vs "loom alternative chrome extension" | Low | Overlap of about 2 | One post. Use "loom alternative chrome extension" as an H2 or secondary keyword. Don't create a second post (that SERP is Chrome Web Store listings and can't be won with a blog). |

Unique-primary-keyword check: passed once the fixes above are applied (no two URLs share a primary keyword).

## 4. Hub-and-spoke architecture

**Pillar:** `/alternatives`, keyword "loom alternatives" (absorbs "best loom alternatives 2026" and "loom alternative"). Template: `best-of` hybrid with ultimate-guide structure, 2,500-3,500 words. Today it is about 600 words and a link directory. Expand it with: a comparison table of 8-10 tools, sections by need (free, pay-once, own storage, Chrome extension, sales, education), a short Loom pricing and limits recap, and FAQ. Schema: Article + BreadcrumbList + ItemList. It should stay the hub for the competitor `/alternatives/*` pages.

| Cluster | Post (URL) | Primary keyword | Status | Template | Words | Intent rationale |
|---------|-----------|-----------------|--------|----------|-------|------------------|
| **A. Loom alternatives by need** | /alternatives/loom | loom alternative no subscription (pay once) | Existing, retitle | comparison / landing-page | 1,200-1,800 | The SERP shows product pages (screensnap.pro/loom-alternative), so a Loom vs Showthrough comparison with a CTA fits |
| | /blog/free-loom-alternatives | free loom alternatives | Existing | listicle | 1,300 (ok) | The free-modifier SERP is listicles |
| | **NEW** /blog/self-hosted-loom-alternative | self-hosted loom alternative (own storage, S3/R2) | Gap | best-of | 1,400-1,800 | The SERP is Cap, SendRec and GitHub. This is Showthrough's strongest differentiator (your own R2) and has thin vendor competition |
| **B. Loom pricing and limits** | /blog/loom-pricing | loom pricing | Existing | explainer | 1,200-1,800 | Pricing-explainer SERP |
| | /blog/is-loom-free | is loom free (+ loom free plan limits) | Existing | explainer | 1,200-1,500 | Question-intent SERP |
| | **NEW** /blog/loom-5-minute-limit | loom 5 minute limit | Gap | how-to / explainer | 1,200 | The SERP is all Loom support pages, with no third-party "why and what to do instead" content. High-intent pain point that bridges to cluster A |
| **C. Competitor alternatives: browser and education** | /alternatives/screencastify | screencastify alternative | Existing | comparison | 1,200-1,800 | Comparison SERP |
| | /alternatives/screenpal | screenpal alternative | Existing | comparison | 1,200-1,800 | |
| | /alternatives/vidyard | vidyard alternative (+ loom vs vidyard secondary) | Existing | comparison | 1,200-1,800 | |
| **D. Competitor alternatives: desktop and creator** | /alternatives/snagit | snagit alternative | Existing | comparison | 1,200-1,800 | |
| | /alternatives/zight | zight alternative | Existing | comparison | 1,200-1,800 | |
| | /alternatives/tella | tella alternative | Existing | comparison | 1,200-1,800 | |
| | /alternatives/cap | cap alternative | Existing | comparison | 1,200-1,800 | Also links to the self-hosted post (Cap is the main self-host competitor) |
| **E. Chrome screen recording (TOFU)** | **NEW** /blog/best-screen-recorder-chrome-extension | best screen recorder chrome extension (+ free..., loom alternative chrome extension) | Gap | best-of | 1,500-1,800 | Listicle SERP. Showthrough is a Chrome extension, so it should be on this list |
| | /blog/how-to-screen-record-on-chromebook | how to screen record on chromebook | Existing | how-to | 1,200-1,500 | How-to SERP (OEM/tech press) |
| | /blog/async-communication | async video communication | Existing | explainer | 1,200-1,800 | Weak topical fit. Keep it as a TOFU bridge and make sure it covers async *video* |

Totals: 1 pillar, 5 clusters, 15 spokes (11 existing, 4 new). Within limits (2-5 clusters, 2-4 posts each).

Overlap caveat on the checklist: clusters C, D and E (and A for the self-hosted spoke) are grouped on topic and template, not on 4+ SERP overlap. Competitor-alternative SERPs only share domains with each other. That is expected for brand-modifier keywords and fine, because each keeps its own primary keyword.

## 5. Internal link matrix

Legend: M = mandatory (pillar and spoke, both directions), R = recommended (within the cluster), O = optional (across clusters). The "Currently" column is based on fetched link lists for the 3 pages checked.

| From | To (type, suggested anchor) | Currently |
|------|-----------------------------|-----------|
| /alternatives (pillar) | every spoke below (M) | Links only to the 8 /alternatives/* pages. **Missing all 5 blog posts and the 4 new posts.** |
| /alternatives/loom | /alternatives (M "Loom alternatives compared"), /blog/free-loom-alternatives (R "free Loom alternatives"), /blog/self-hosted-loom-alternative (R "store videos in your own storage"), /blog/loom-pricing (O "Loom pricing breakdown"), /blog/loom-5-minute-limit (O) | Links to the hub and alternatives, **none of the blog posts** |
| /blog/free-loom-alternatives | /alternatives (M "best Loom alternatives"), /alternatives/loom (R "pay-once Loom alternative"), /blog/self-hosted-loom-alternative (R), /blog/is-loom-free (O) | Has /alternatives, /alternatives/loom, /blog/is-loom-free. Add self-hosted. |
| NEW /blog/self-hosted-loom-alternative | /alternatives (M), /alternatives/loom (R), /blog/free-loom-alternatives (R), /alternatives/cap (O), /guide/turn-on-r2 and /guide/connect-cloudflare (product) | n/a |
| /blog/loom-pricing | /alternatives (M), /blog/is-loom-free (R), /blog/loom-5-minute-limit (R), /alternatives/loom (O "Loom alternative with no monthly bill") | verify |
| /blog/is-loom-free | /alternatives (M), /blog/loom-pricing (R), /blog/loom-5-minute-limit (R), /blog/free-loom-alternatives (O) | verify |
| NEW /blog/loom-5-minute-limit | /alternatives (M), /blog/is-loom-free (R), /blog/loom-pricing (R), /alternatives/loom (O "record without a time limit") | n/a |
| /alternatives/screencastify | /alternatives (M), /alternatives/screenpal (R), /alternatives/vidyard (R), /blog/how-to-screen-record-on-chromebook (O) | Shared footer links all /alternatives/*. Add contextual in-body links. |
| /alternatives/screenpal | /alternatives (M), /alternatives/screencastify (R), /alternatives/vidyard (R) | as above |
| /alternatives/vidyard | /alternatives (M), /alternatives/screencastify (R), /alternatives/screenpal (R), /alternatives/loom (O) | as above |
| /alternatives/snagit | /alternatives (M), /alternatives/zight (R), /alternatives/tella (R) | as above |
| /alternatives/zight | /alternatives (M), /alternatives/snagit (R), /alternatives/cap (R) | as above |
| /alternatives/tella | /alternatives (M), /alternatives/cap (R), /alternatives/snagit (R) | as above |
| /alternatives/cap | /alternatives (M), /alternatives/tella (R), /alternatives/zight (R), /blog/self-hosted-loom-alternative (O) | as above |
| NEW /blog/best-screen-recorder-chrome-extension | /alternatives (M), /blog/how-to-screen-record-on-chromebook (R), /blog/async-communication (R), /alternatives/screencastify (O), /alternatives/loom (O) | n/a |
| /blog/how-to-screen-record-on-chromebook | /alternatives (M), /blog/best-screen-recorder-chrome-extension (R), /blog/async-communication (R) | verify |
| /blog/async-communication | /alternatives (M), /blog/best-screen-recorder-chrome-extension (R), /blog/how-to-screen-record-on-chromebook (R) | verify |

Incoming-link check: each spoke receives 1 (pillar) + 2-3 (siblings) + 0-2 (optional), so at least 3 for all 15. No orphans. Everything is within 1 click of the pillar.

Anchor diversity: links into /alternatives/loom should rotate between "pay-once Loom alternative", "Loom vs Showthrough", "Loom alternative with no monthly bill" and "record without limits". No single anchor should exceed 40%.

## 6. Priority order

1. **Fix C1 first** (retitle and re-scope /alternatives/loom, expand the /alternatives pillar, add the missing pillar-to-blog links). These are existing URLs, so it is low effort and has the biggest effect on the head term.
2. Add the missing links from /alternatives/loom to the blog posts.
3. NEW /blog/self-hosted-loom-alternative (differentiator, low competition).
4. NEW /blog/loom-5-minute-limit (pain point, support-dominated SERP).
5. NEW /blog/best-screen-recorder-chrome-extension (higher competition, TOFU).
6. Add in-body sibling links on the competitor /alternatives/* pages (currently footer-only).

## 7. cluster-plan.json

```json
{
  "version": "2.2.5",
  "seed_keyword": "loom alternative",
  "created_at": "2026-11-22T00:00:00Z",
  "data_caveat": "SERP overlap estimated from WebSearch tool samples (not clean Google top-10); volumes unavailable",
  "pillar": {"title": "Best Loom Alternatives (2026): Free, Pay-Once and Self-Hosted Options Compared", "keyword": "loom alternatives", "secondary": ["best loom alternatives 2026", "loom alternative"], "volume": null, "template": "best-of", "wordCount": 3000, "url": "/alternatives", "status": "written-needs-expansion"},
  "clusters": [
    {"name": "Loom alternatives by need", "posts": [
      {"url": "/alternatives/loom", "keyword": "loom alternative no subscription", "secondary": ["pay once loom alternative", "loom alternative one time purchase", "loom alternative lifetime deal"], "intent": "commercial-transactional", "template": "comparison", "wordCount": 1500, "status": "written-retitle"},
      {"url": "/blog/free-loom-alternatives", "keyword": "free loom alternatives", "intent": "commercial", "template": "listicle", "wordCount": 1300, "status": "written"},
      {"url": "/blog/self-hosted-loom-alternative", "keyword": "self-hosted loom alternative", "secondary": ["loom alternative own storage", "screen recorder cloudflare r2"], "intent": "commercial", "template": "best-of", "wordCount": 1600, "status": "planned"}]},
    {"name": "Loom pricing and limits", "posts": [
      {"url": "/blog/loom-pricing", "keyword": "loom pricing", "intent": "commercial-informational", "template": "explainer", "wordCount": 1500, "status": "written"},
      {"url": "/blog/is-loom-free", "keyword": "is loom free", "secondary": ["loom free plan limits"], "intent": "informational", "template": "explainer", "wordCount": 1300, "status": "written"},
      {"url": "/blog/loom-5-minute-limit", "keyword": "loom 5 minute limit", "intent": "informational", "template": "how-to", "wordCount": 1200, "status": "planned"}]},
    {"name": "Competitor alternatives: browser and education", "posts": [
      {"url": "/alternatives/screencastify", "keyword": "screencastify alternative", "intent": "commercial", "template": "comparison", "wordCount": 1400, "status": "written"},
      {"url": "/alternatives/screenpal", "keyword": "screenpal alternative", "intent": "commercial", "template": "comparison", "wordCount": 1400, "status": "written"},
      {"url": "/alternatives/vidyard", "keyword": "vidyard alternative", "secondary": ["loom vs vidyard"], "intent": "commercial", "template": "comparison", "wordCount": 1400, "status": "written"}]},
    {"name": "Competitor alternatives: desktop and creator", "posts": [
      {"url": "/alternatives/snagit", "keyword": "snagit alternative", "intent": "commercial", "template": "comparison", "wordCount": 1400, "status": "written"},
      {"url": "/alternatives/zight", "keyword": "zight alternative", "intent": "commercial", "template": "comparison", "wordCount": 1400, "status": "written"},
      {"url": "/alternatives/tella", "keyword": "tella alternative", "intent": "commercial", "template": "comparison", "wordCount": 1400, "status": "written"},
      {"url": "/alternatives/cap", "keyword": "cap alternative", "intent": "commercial", "template": "comparison", "wordCount": 1400, "status": "written"}]},
    {"name": "Chrome screen recording (TOFU)", "posts": [
      {"url": "/blog/best-screen-recorder-chrome-extension", "keyword": "best screen recorder chrome extension", "secondary": ["free screen recorder chrome extension", "loom alternative chrome extension"], "intent": "commercial", "template": "best-of", "wordCount": 1700, "status": "planned"},
      {"url": "/blog/how-to-screen-record-on-chromebook", "keyword": "how to screen record on chromebook", "intent": "informational", "template": "how-to", "wordCount": 1300, "status": "written"},
      {"url": "/blog/async-communication", "keyword": "async video communication", "intent": "informational", "template": "explainer", "wordCount": 1400, "status": "written"}]}
  ],
  "serp_overlap": [
    {"a": "loom alternative", "b": "best loom alternatives 2026", "exact": 1, "domains": 3, "judged": "7+", "decision": "merge"},
    {"a": "loom alternative", "b": "free loom alternatives", "exact": 2, "domains": 4, "judged": "4-6", "decision": "same_cluster"},
    {"a": "loom alternative", "b": "loom alternative chrome extension", "exact": 2, "domains": 3, "judged": "4-5", "decision": "same_cluster"},
    {"a": "best loom alternatives 2026", "b": "loom alternative no subscription", "exact": 1, "domains": 3, "judged": "3-4", "decision": "same_cluster_edge"},
    {"a": "loom alternative", "b": "self-hosted loom alternative", "exact": 0, "domains": 0, "judged": "0-1", "decision": "separate_topical_cluster"},
    {"a": "loom alternative chrome extension", "b": "best screen recorder chrome extension", "exact": 0, "domains": 1, "judged": "2", "decision": "interlink_secondary_kw"},
    {"a": "loom pricing", "b": "is loom free", "exact": 2, "domains": 3, "judged": "4-6", "decision": "same_cluster"},
    {"a": "is loom free", "b": "loom 5 minute limit", "exact": 0, "domains": 1, "judged": "2-3", "decision": "interlink_topical_cluster"},
    {"a": "loom pricing", "b": "loom alternative", "exact": 0, "domains": 1, "judged": "1", "decision": "separate"},
    {"a": "screencastify alternative", "b": "loom alternative", "exact": 0, "domains": 4, "judged": "2-3", "decision": "interlink"},
    {"a": "how to screen record on chromebook", "b": "loom alternative", "exact": 0, "domains": 1, "judged": "0-1", "decision": "separate"},
    {"a": "async video communication", "b": "loom alternative", "exact": 0, "domains": 1, "judged": "0-1", "decision": "separate"}
  ],
  "cannibalization": [
    {"id": "C1", "urls": ["/alternatives", "/alternatives/loom", "/blog/free-loom-alternatives"], "keyword": "loom alternative(s)", "severity": "high", "fix": "pillar=/alternatives (loom alternatives); /alternatives/loom=pay-once comparison; blog=free only"},
    {"id": "C2", "urls": ["/alternatives", "/alternatives/loom"], "severity": "medium", "fix": "rename hub H2 'Loom alternative' to 'Showthrough vs Loom'"},
    {"id": "C3", "urls": ["/blog/loom-pricing", "/blog/is-loom-free"], "severity": "low-medium", "fix": "split paid-tier vs free-tier scope; cross-link"},
    {"id": "C4", "urls": ["/alternatives/loom", "/blog/loom-pricing"], "severity": "low", "fix": "shorten pricing H2 on product page; link out"}
  ]
}
```

## 8. audit-data.json fragment (Content Architecture)

```json
{
  "category": "Content Architecture",
  "findings": [
    {"id": "CA-1", "severity": "high", "title": "Three URLs compete for 'loom alternative(s)'", "urls": ["/alternatives", "/alternatives/loom", "/blog/free-loom-alternatives"], "recommendation": "Assign one primary keyword per URL; make /alternatives the best-of pillar; retitle /alternatives/loom as pay-once Loom vs Showthrough"},
    {"id": "CA-2", "severity": "high", "title": "Pillar /alternatives is thin (~600 words) and does not link to any blog post", "recommendation": "Expand to 2,500-3,500 words best-of with comparison table; link to all 15 spokes"},
    {"id": "CA-3", "severity": "medium", "title": "/alternatives/loom links to no blog content", "recommendation": "Add contextual links to free-loom-alternatives, loom-pricing, self-hosted and 5-minute-limit posts"},
    {"id": "CA-4", "severity": "medium", "title": "Content gap: self-hosted / own-storage Loom alternative", "recommendation": "New post /blog/self-hosted-loom-alternative; link to R2 guides"},
    {"id": "CA-5", "severity": "medium", "title": "Content gap: Loom 5-minute limit", "recommendation": "New post /blog/loom-5-minute-limit; SERP is support-only"},
    {"id": "CA-6", "severity": "medium", "title": "Content gap: best screen recorder Chrome extension listicle", "recommendation": "New best-of post absorbing 'loom alternative chrome extension'"},
    {"id": "CA-7", "severity": "low", "title": "Competitor /alternatives/* pages interlink only via shared footer/nav", "recommendation": "Add 2-3 in-body sibling links per page"},
    {"id": "CA-8", "severity": "low", "title": "Meta descriptions missing on fetched pages (/alternatives, /alternatives/loom, /blog/free-loom-alternatives)", "recommendation": "Verify in rendered HTML; add keyword-differentiated descriptions"}
  ]
}
```
