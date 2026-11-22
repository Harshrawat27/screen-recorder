# GEO / AI Search Readiness: showthrough.com

Audit date: 2026-11-22. Pages analysed: `/`, `/pricing`, `/alternatives/loom`, `/blog/loom-pricing`, `/blog/free-loom-alternatives`, `/blog/is-loom-free`, plus the Chrome Web Store listing.
Method: bundled `render_page.py --mode auto` (every page was served as raw SSR HTML; no SPA shell was detected, so Playwright was not needed). Passage scoring used trafilatura `extracted_text`. AI user agents were tested with curl.

## AI Search Readiness Score: 65 / 100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 80 | 20.0 |
| Structural Readability | 20% | 82 | 16.4 |
| Multi-Modal Content | 15% | 35 | 5.3 |
| Authority & Brand Signals | 20% | 30 | 6.0 |
| Technical Accessibility | 20% | 85 | 17.0 |
| **Total** | | | **64.7, rounded to 65** |

In short: the on-page content is already among the most citable you'll find for a new SaaS. The two big gaps are off-site entity and brand presence, and the lack of video or visual content.

## Platform scores (estimates)

| Platform | Score | Main constraint |
|---|---|---|
| Perplexity | 62 | Content is fresh, dated and sourced, which suits it. But Perplexity leans on Reddit and third-party sources, and the brand has none yet. |
| Google AI Overviews | 55 | Follows Googlebot and organic ranking. A new domain with low authority competes against loom.com, G2 and Zapier for queries like "loom pricing" and "is loom free". |
| ChatGPT Search | 50 | Uses OAI-SearchBot and the Bing index, and brand-entity recognition matters. No Wikipedia, Wikidata, Reddit or YouTube footprint. Bing indexing could not be checked (the search engine blocks scripted requests). |
| Bing Copilot | 52 | Same Bing index dependency. Verify the site in Bing Webmaster Tools and submit through IndexNow. |

## AI crawler access

robots.txt has `User-Agent: *` / `Allow: /`, disallows only `/api/`, `/dashboard`, `/buy` and `/start`, and declares the sitemap. There are no bot-specific rules. Every UA below was tested live against `/blog/loom-pricing` and got HTTP 200 with an identical 59,593-byte body, so no WAF or bot-fight blocking was seen on Vercel.

| Crawler | What it governs | Status |
|---|---|---|
| OAI-SearchBot | ChatGPT Search citations | Allowed (200) |
| ChatGPT-User | User-initiated ChatGPT fetches | Allowed (200) |
| GPTBot | OpenAI model training only | Allowed (200) |
| Claude-SearchBot | Claude search citations | Allowed (wildcard; 200) |
| ClaudeBot | Anthropic model training only | Allowed (200) |
| PerplexityBot | Perplexity search index | Allowed (200) |
| Googlebot | Google Search and AI Overviews | Allowed (wildcard) |
| Google-Extended | Gemini/Vertex training and grounding. Not AIO inclusion. | Allowed (wildcard) |
| Bingbot | Bing, Copilot, and ChatGPT's Bing-backed retrieval | Allowed (200) |
| Applebot / Applebot-Extended | Siri/Spotlight / Apple Intelligence training | Allowed (wildcard) |
| CCBot, cohere-ai | Training only | Allowed (wildcard) |

Verdict: fully open. For a challenger brand this is the right choice, because training-crawler exposure helps future models learn the "Showthrough = pay-once Loom alternative" entity. No change is needed.

## llms.txt and RSL

- `/llms.txt`: **missing** (404). `/llms-full.txt`: missing (404).
- RSL 1.0 (`/license.xml` or a robots `License:` directive): **absent**. This is fine for a marketing site that wants maximum reuse.
- Small issue: the 404 HTML carries the homepage `<title>` and OG tags as well as a 404 title, so there are two `<title>` tags.

## Technical accessibility

- Next.js SSR/SSG. All body text, FAQ answers and tables are in the raw HTML. `is_spa: false`.
- Canonicals are correct on every page. The apex redirects to www with a 308. The sitemap lists 30+ URLs with lastmod.
- JSON-LD by page:
  - Home: Organization, WebSite, SoftwareApplication (with Offer at $49) and FAQPage (10 Q&As).
  - `/alternatives/loom`: BreadcrumbList and FAQPage.
  - Each blog post: BlogPosting with a Person author, BreadcrumbList and FAQPage.
  - **`/pricing`: no JSON-LD at all.** This is the page AI engines read for "how much does Showthrough cost".
- `Cache-Control: private, no-store` on HTML. This doesn't block crawlers, but it means every bot hit is a cold render. Consider ISR or static caching.
- Blog bylines include `<time datetime>`. trafilatura drops it, but the BlogPosting `datePublished`/`dateModified` carries the date, so this is fine.

## Passage-level citability

| Page | Words | Score | Notes |
|---|---|---|---|
| `/blog/is-loom-free` | 830 | 90 | The first sentence answers the query ("Yes, Loom has a free plan…"). It has a "Quick answer" block, a "Checked on 21 Nov 2026 against Loom's pricing page and help centre" line, outbound links to atlassian.com help docs, a limits table, 6 question H3s, and a first-hand experience paragraph. Close to ideal. |
| `/blog/loom-pricing` | 1,117 | 88 | Gives a quick answer with four plans and prices, a plan table, a cost-by-team-size table, a stated price-check date, and links to loom.com/pricing. It openly labels the yearly figures as tracker-sourced, which is good for trust. |
| `/blog/free-loom-alternatives` | 1,352 | 85 | Has a comparison table, one H2 per tool with a self-contained 50–90 word "what + catch" block, and every vendor's pricing page cited. The tool H2s are statements, not questions. That's fine here, because listicle formatting is well extracted. |
| `/alternatives/loom` | 816 | 82 | The opening paragraph defines both products. It includes a vs-table, a Loom pricing table, an honest "Where Loom is better" section (a strong trust signal), a verdict and a dated source. It has no author, no date in the visible content, and no Article/WebPage schema with `dateModified`. |
| `/` (home) | 1,086 | 62 | The H1 is a slogan ("Screen recording you own. Say no to…") rather than a definition. No sentence says "Showthrough is a Chrome extension that…" in the opening 60 words; the SoftwareApplication description has one, but the visible copy doesn't. The feature H3s are 10–30 word fragments, too short to cite on their own. The FAQ answers are excellent, at 40–120 words and self-contained. The savings calculator's "10 people" assumption sits in a range input, so the extracted text reads "Loom over 3 years $6,480" with no team size. |
| `/pricing` | 747 | 65 | The answers are clear, but the time-bound Black Friday copy ($49 until 27 Nov, then $99) will go stale in AI answers that have already cached it. There's no "Showthrough costs $X once" summary sentence at the top, and no schema. |

Strengths worth keeping: "Quick answer" blocks, explicit "prices checked on <date>" lines, outbound primary-source links, first-person experience paragraphs (E-E-A-T "experience"), and honest concessions.

## Entity clarity

- The brand name is consistent: "Showthrough" everywhere (title suffixes, og:site_name, application-name, Organization and SoftwareApplication). It's written as one word, with no "ShowThrough" or "Show Through" variants on the site.
- Ambiguity risk: "show-through" is an established printing and paper term, and Wikipedia search suggests "shot through". Always pair the name with its category ("Showthrough, the pay-once Chrome screen recorder") in titles, intros and off-site profiles.
- `sameAs` has only the founder's X account and the Chrome Web Store listing. There's no LinkedIn company page, GitHub, Product Hunt, YouTube, Crunchbase, Wikidata or a brand-owned X handle. The founder's personal X is also used as the Organization identity.
- Author: Person "Harsh Rawat" with `url` pointing to x.com. There's no `/about` or author page, no `sameAs` on the Person, no LinkedIn, and no bio on the posts.
- Chrome Web Store listing: name "Showthrough - Screen Recorder & Screen Capture", v0.8.1, updated 10 Nov 2026. The description is long and consistent with the site's positioning. No user count or ratings are visible yet. The listing doesn't call itself a Loom alternative in the title or summary; "Loom alternative" appears nowhere in its first 2,500 characters.
- Support contact is a personal gmail address. A support address on the domain would be a stronger trust signal.

## Brand mention signals

| Source | Status |
|---|---|
| Wikipedia | None (0 hits) |
| Wikidata | None |
| Reddit | Could not verify (Reddit blocks automated fetches). Check by hand: `site:reddit.com showthrough`. |
| YouTube | No Showthrough results for "showthrough screen recorder". This is the strongest correlated signal (~0.737), and it's empty. |
| Product Hunt | Not launched yet (search finds nothing; the site says a PH launch is coming). |
| Hacker News | 0 mentions |
| LinkedIn | No company page linked |
| Third-party listicles / G2 / AlternativeTo | Not found / not checked live |

## Top 5 highest-impact changes

1. **Build a YouTube and video presence (high impact, medium effort).** Publish a 60–90 second demo and short "Is Loom free?" and "Loom pricing explained" companion videos on a Showthrough YouTube channel. Embed them on the home page, `/alternatives/loom` and the matching posts with VideoObject schema, and add the channel to `sameAs`. A screen-recorder site with no demo video is a gap for both conversion and multi-modal scoring. You could record the videos with Showthrough itself.
2. **Seed off-site entity mentions (high impact, medium–high effort).** Launch on Product Hunt, then list on AlternativeTo, G2, Capterra, SaaSHub and "Loom alternatives" roundups. Answer relevant Reddit threads (r/SaaS, r/freelance, r/Entrepreneur, "loom alternative" threads) with disclosure. Create a LinkedIn company page and a Wikidata item (instance of: software; developer; official website; CWS ID). Add every new URL to Organization `sameAs`.
3. **Open the homepage with a definition (high impact, low effort).** Add a visible sentence in the first 40 words, such as: "Showthrough is a Chrome extension for screen recording that you pay for once. It records your screen, camera and voice, and stores videos in your own Cloudflare account." Make it the H1 or the line straight after it. Expand the feature blocks to 40–80 words each, and put the team-size assumption in text ("For a team of 10 on Loom Business…").
4. **Add `/llms.txt` and pricing schema (medium impact, low effort).** For llms.txt, include a one-line definition, the price model, and links to pricing, the Loom comparison, all alternatives pages, the blog posts and the setup guide. On `/pricing`, add SoftwareApplication or Product JSON-LD with an Offer (`price`, `priceCurrency`, `priceValidUntil: 2026-11-27`), then a second Offer at $99 once the sale ends, plus FAQPage. Also add a top summary sentence that isn't tied to a date. Remove the Black Friday copy promptly after 27 Nov so AI answers don't quote a stale $49.
5. **Strengthen authorship (medium impact, low effort).** Create `/about`, covering the founder story, Showthrough and why it's pay-once, and an author page. Give the Person schema `sameAs` links (X, LinkedIn, GitHub) and a `jobTitle`. Add a short bio box to blog posts and an author with `dateModified` to `/alternatives/*`. Move support to an address on the domain.

Quick wins: put "Loom alternative" in the Chrome Web Store short description. Fix the double `<title>` on the 404 page. Verify the site in Bing Webmaster Tools and enable IndexNow on Vercel, since this feeds ChatGPT and Copilot. Turn the tool H2s in the listicle into "Is X a good free Loom alternative?" style questions where it reads naturally.

## Structured findings (audit-data.json, category: AI Search Readiness)

```json
{
  "category": "AI Search Readiness",
  "score": 65,
  "dimensions": {"citability": 80, "structural_readability": 82, "multimodal": 35, "authority_brand": 30, "technical_accessibility": 85},
  "platform_scores": {"google_aio": 55, "chatgpt": 50, "perplexity": 62, "bing_copilot": 52},
  "findings": [
    {"id": "geo-crawlers-open", "severity": "pass", "title": "All AI search and training crawlers allowed; all UAs return 200"},
    {"id": "geo-llmstxt-missing", "severity": "medium", "title": "/llms.txt returns 404"},
    {"id": "geo-rsl-absent", "severity": "info", "title": "No RSL license file (acceptable)"},
    {"id": "geo-ssr", "severity": "pass", "title": "Content fully server-rendered; no SPA shell"},
    {"id": "geo-pricing-no-schema", "severity": "medium", "title": "/pricing has no JSON-LD (no Offer/FAQPage)"},
    {"id": "geo-home-no-definition", "severity": "high", "title": "Homepage H1/intro lacks a citable 'Showthrough is...' definition"},
    {"id": "geo-time-bound-pricing", "severity": "medium", "title": "Black Friday $49 copy will become stale in AI answers after 27 Nov 2026"},
    {"id": "geo-blog-citability", "severity": "pass", "title": "Blog posts have quick answers, dated source checks, outbound citations, FAQ schema"},
    {"id": "geo-no-video", "severity": "high", "title": "No demo video / YouTube presence on a screen-recorder site"},
    {"id": "geo-entity-thin", "severity": "high", "title": "sameAs limited to founder X and CWS; no Wikidata/LinkedIn/PH/YouTube"},
    {"id": "geo-brand-mentions-none", "severity": "high", "title": "No Wikipedia, Wikidata, HN, YouTube or Product Hunt mentions found; Reddit unverified"},
    {"id": "geo-author-thin", "severity": "medium", "title": "No about/author page; Person schema lacks sameAs and bio"},
    {"id": "geo-name-ambiguity", "severity": "low", "title": "'show-through' is a printing term; always pair brand with category"},
    {"id": "geo-cws-positioning", "severity": "low", "title": "Chrome Web Store listing omits 'Loom alternative'; no ratings yet"}
  ]
}
```
