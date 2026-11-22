# Agent-readiness: https://www.showthrough.com/ (checked 2026-11-22)

## Lighthouse Agentic Browsing
Not measured: PSI returned HTTP 429 (daily quota exceeded) for mobile and desktop. Configure a Google API key (/seo google setup) and re-run. No X/N reported.

## Agent-UX heuristic (separate from Lighthouse), status complete
- Homepage: 100/100 (731 a11y nodes, 30 interactive, 0 unnamed, 10 landmarks, 0 div-onclick widgets)
- /pricing: 100/100 (430 nodes, 27 interactive, 0 unnamed, 7 landmarks)
- Note: 1 input without aria attribute on each page (labels present); minor.

## Findings
- P0: none. Server-rendered (1296 words without JS), robots.txt 200, no AI/search crawler blocked, real 404s.
- P1: robots.txt has no Content-Signal (draft/preference, checked 2026-09-23) and no named AI groups; all agents fall to `*`. Fix in app/robots.ts: add per-purpose rules and optionally Content-Signal. Also note robots.txt emits "User-Agent: *" and a nonstandard "Host:" line (ignored by most crawlers; harmless, can drop).
- P1 (opportunity): no /llms.txt (404). Publishing a valid one (H1, > summary, Markdown links) adds a counted Lighthouse audit. Add public/llms.txt or app/llms.txt/route.ts listing /pricing, /guide, /blog, /alternatives.
- P1 (opportunity): no Markdown delivery (Accept: text/markdown and /index.md both return HTML). Optional Next.js route handler/rewrite.
- P2 (opportunity): WebMCP absent (draft proposal, checked 2026-09-23): 0 registerTool, 0 forms annotated. Candidate: signup/start flow.
- P3 (n/a): no ai-catalog.json (draft), api-catalog, oauth, agent-card, ucp; only needed if the matching services exist.

## Access policy
- Training: no explicit rule (falls to `*` Allow /; disallow /api/, /dashboard, /buy, /start)
- Search: allowed (same)
- User-triggered agents: not blocked; documented behavior: Claude-User honours robots, ChatGPT-User may not apply, Perplexity-User and Google-Agent generally ignore.

No WebMCP/ai-catalog/Web Bot Auth effects on ranking, citation or traffic are promised. Browser sandbox: no warning seen.
