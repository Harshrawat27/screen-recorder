# Schema audit: https://www.showthrough.com (2026-11-22)

Method: rendered homepage JSON (homepage-render.json, 1 valid block, 4,931 B) plus source review of the Next.js app. The JSON-LD is server-rendered (not SPA). Other pages were checked from source, not fetched live.

## Schema score: 58 / 100

## Detection
| Page | Schema present |
|---|---|
| / | @graph: Organization, WebSite, SoftwareApplication+Offer, FAQPage (app/page.tsx) |
| /pricing | none |
| /alternatives | ItemList (ListItem has `url` and `name`, no `item`) |
| /alternatives/{slug} (8) | BreadcrumbList + FAQPage |
| /guide, /guide/* (9) | none |
| /blog | none |
| /blog/* (5 posts) | BlogPosting + BreadcrumbList + FAQPage |
| /support | FAQPage only (not in the requested list) |

## Validation
- Context is https://schema.org, URLs are absolute, dates are ISO 8601 (date-only is valid). Pass.
- BlogPosting: headline, image (absolute, WebP), datePublished, dateModified, author (Person), publisher (Organization+logo) and mainEntityOfPage are all present. Pass. Warnings:
  - author.url points to x.com; there is no first-party author page and no `@id`, so the Person is not reusable.
  - publisher is duplicated inline instead of `{"@id": ".../#organization"}`, so the Organization graph is not linked.
  - Google recommends several image aspect ratios (16x9, 4x3, 1x1); only one image is given.
  - `mainEntityOfPage` is a bare URL string. It is valid but weaker than a `WebPage` @id node.
  - No `isPartOf`/`WebSite` link.
- BreadcrumbList on blog and alternatives pages: valid, with 3 positions and absolute URLs. Last item includes `item` (fine). Missing on /pricing, /guide/*, /blog and /alternatives index.
- Homepage Organization: name, url, logo and sameAs are present. Logo is /apple-icon.png at 180x180 (meets the 112px minimum, but a 512px square is better). sameAs has only X and the Chrome Store, no GitHub or LinkedIn.
- Homepage SoftwareApplication: see issues below.

## Issues (priority order)

### High
1. **Offer is incomplete and likely invalid for Google's merchant/software snippet.** Offer has `price` and `priceCurrency` only. No `availability`, no `priceValidUntil`, no `itemCondition`. `app/page.tsx:40`.
   - The $49 Black Friday price ends 2026-11-27T23:59:59-08:00 (`EARLY_ENDS` in lib/pricing.ts). Add `priceValidUntil` while the sale is open. Google flags a sale price with no end date.
   - After that moment `openTier()` returns null, and `currentOffer()` falls back to $99. Sales are paused until 30 Nov. The schema would then advertise $99 as `InStock` when checkout is closed. Emit `availability: PreOrder` or `OutOfStock` in that window, and use `InStock` once the launch tier opens.
   - Wrapping each tier in an `AggregateOffer` or a two-Offer array (49 until the deadline, then 99 from 2026-11-30) is not needed. One Offer built from the current tier is enough.
2. **SoftwareApplication has no `aggregateRating`/`review`** (fine, since there are no verified reviews; do not invent them). Google's SoftwareApplication rich result requires `name`, `offers.price`, and either aggregateRating or review. Without one of those it is not rich-result eligible. This is Info, not an error, unless real ratings (e.g. Chrome Web Store) can be shown on-page.
3. **Pricing page has no schema.** Add a Product or SoftwareApplication with the same Offer (reuse `@id`), plus a BreadcrumbList.

### Medium
4. SoftwareApplication field consistency:
   - `operatingSystem: "Chrome on Windows, macOS, Linux and ChromeOS"` is free text. Use `"Windows, macOS, Linux, ChromeOS"` and add `browserRequirements: "Requires Google Chrome"`.
   - `applicationCategory: "MultimediaApplication"` is valid. `"BrowserApplication"` plus a `softwareRequirements` note would be closer to the product. Optional.
   - Missing `@id`, `image`/`screenshot`, `softwareVersion` (WORKER_VERSION exists in lib/cloudflare.ts), `featureList`, `downloadUrl`.
   - The description says "one payment" and the Offer price tracks the tier. That is consistent with the page copy ($49 sale, $99 later). Check that `String(price)` is "49" (it is) and that the visible price and schema price are the same at every moment, including the paused window.
   - `url` equals the site root, as does WebSite. Give the app its own `@id` (`/#software`) and link it via `mainEntityOfPage` or `about` from the WebPage.
5. No `WebPage`/`CollectionPage` nodes anywhere, so `isPartOf`, `breadcrumb` and `primaryImageOfPage` links are missing.
6. /alternatives/{slug} pages have no Article/WebPage schema. OG type is "article" but there is no structured counterpart. Add a WebPage with `dateModified` (alt.updated exists) and `breadcrumb`.
7. /guide pages have no BreadcrumbList. Do NOT use HowTo (deprecated). Use WebPage + BreadcrumbList (optionally TechArticle).
8. /blog index has no CollectionPage/Blog schema or breadcrumb.
9. /alternatives ItemList: each ListItem should use `item` (URL) rather than a `url` property on ListItem. Google's carousel documentation requires `item` or `url` for ItemList, so `url` is acceptable. This is low risk. It is also not eligible for a carousel without Recipe/Course/Movie/Restaurant types, so treat it as informational.

### Info
10. FAQPage is present on /, 5 blog posts, 8 alternatives pages and /support. FAQ rich results were retired for all sites on 2026-05-07, so this gives no Google SERP benefit. Any AI/GEO benefit is unconfirmed. No action recommended. Leave as is. /support is a genuine question list written by the site owner, so FAQPage is the right type.
11. Blog `dateModified` equals `datePublished` for all 5 posts. That is accurate. Keep it updated when facts change (loom-pricing is date-sensitive). The sitemap lastModified matches.
12. Blog dates are date-only. Valid, but adding a time and UTC offset is more precise.
13. Person author has `url` only. Add `sameAs` and ideally an /about or /author/harsh-rawat page.

## Per-URL result
| URL | Result |
|---|---|
| / | Pass with errors: Offer lacks priceValidUntil and availability |
| /pricing | Fail: no schema |
| /alternatives | Warning: ItemList only, no breadcrumb or CollectionPage |
| /alternatives/loom (and 7 siblings) | Partial: Breadcrumb OK, no WebPage |
| /guide, /guide/record | Fail: no schema |
| /blog | Fail: no schema |
| /blog/* (5) | Pass (BlogPosting valid), with the linking warnings above |

## Fixes (file pointers and ready JSON-LD)

### 1. Offer with dates and availability (app/page.tsx, and reuse in app/pricing/page.tsx)
Add a helper in lib/pricing.ts or a new lib/offer-schema.ts:
```ts
import { EARLY_ENDS, LAUNCH_PRICE } from "@/lib/pricing";
export function offerSchema(tierId: string | null, price: number, url: string) {
  const open = tierId !== null;
  return {
    "@type": "Offer",
    price: String(price),
    priceCurrency: "USD",
    url,
    itemCondition: "https://schema.org/NewCondition",
    availability: open ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    ...(tierId === "first100" ? { priceValidUntil: EARLY_ENDS.slice(0, 10) } : {}),
    ...(!open ? { availabilityStarts: "2026-11-30" } : {}),
  };
}
```
`currentOffer()` already returns `tier`, so use `const { sold, tier, price } = await currentOffer();` and `offers: offerSchema(tier?.id ?? null, price, \`${site.url}/pricing\`)`. Note that `priceValidUntil` should be an ISO date, so "2026-11-27". While the sale is open, the output is:
```json
{
  "@type": "SoftwareApplication",
  "@id": "https://www.showthrough.com/#software",
  "name": "Showthrough",
  "url": "https://www.showthrough.com",
  "description": "A Chrome screen recorder: record your screen, camera and voice and share the link the moment you stop. Videos are stored in your own Cloudflare account. One payment, no subscription.",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Windows, macOS, Linux, ChromeOS",
  "browserRequirements": "Requires Google Chrome",
  "installUrl": "https://chromewebstore.google.com/detail/showthrough-screen-record/ngiiiademidnkjamgbaoijmfiphlmlpe",
  "image": "https://www.showthrough.com/opengraph-image.png",
  "publisher": { "@id": "https://www.showthrough.com/#organization" },
  "offers": {
    "@type": "Offer",
    "price": "49",
    "priceCurrency": "USD",
    "url": "https://www.showthrough.com/pricing",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2026-11-27"
  }
}
```
The `priceValidUntil` is inclusive by date. The sale ends 27 Nov 23:59 PT, and the date-only value is accurate.

### 2. Blog posts (app/blog/[slug]/page.tsx lines 57-66)
Link the graph and make the author reusable:
```json
{
  "@type": "BlogPosting",
  "@id": "https://www.showthrough.com/blog/SLUG#article",
  "headline": "...",
  "description": "...",
  "image": ["https://www.showthrough.com/blog/SLUG.webp"],
  "datePublished": "2026-11-21T00:00:00-08:00",
  "dateModified": "2026-11-21T00:00:00-08:00",
  "author": { "@type": "Person", "@id": "https://www.showthrough.com/#author", "name": "Harsh Rawat", "url": "https://x.com/Harshrwt27", "sameAs": ["https://x.com/Harshrwt27"] },
  "publisher": { "@id": "https://www.showthrough.com/#organization" },
  "isPartOf": { "@id": "https://www.showthrough.com/#website" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.showthrough.com/blog/SLUG" }
}
```
The Organization node lives only on the homepage. Either move it into a shared `lib/schema.ts` and include it in each page's graph, or keep the inline publisher object. A bare `@id` reference to a node that is not on the page does not resolve for Google.

### 3. BreadcrumbList for /pricing, /blog, /guide, /guide/{slug}
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Showthrough", "item": "https://www.showthrough.com" },
    { "@type": "ListItem", "position": 2, "name": "Setup guide", "item": "https://www.showthrough.com/guide" },
    { "@type": "ListItem", "position": 3, "name": "Record your first video", "item": "https://www.showthrough.com/guide/record" }
  ]
}
```
- /pricing: Showthrough > Pricing (`https://www.showthrough.com/pricing`).
- /blog: Showthrough > Blog.
- Files: app/pricing/page.tsx, app/blog/page.tsx, app/guide/[slug]/page.tsx (a /guide root page is app/guide/page.tsx; it needs its own).
- Use `guidePages` in lib/guide.ts for titles. For the guide root (slug ""), emit only positions 1 and 2.
- Add the visible breadcrumb nav as on blog and alternatives pages so markup matches content.

### 4. Pricing page product node (app/pricing/page.tsx)
Reuse the same SoftwareApplication `@id` and Offer from fix 1, so the two pages agree.

### 5. Blog index (app/blog/page.tsx)
```json
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://www.showthrough.com/blog#blog",
  "name": "Showthrough blog",
  "url": "https://www.showthrough.com/blog",
  "publisher": { "@id": "https://www.showthrough.com/#organization" },
  "blogPost": [ { "@type": "BlogPosting", "headline": "...", "url": "https://www.showthrough.com/blog/SLUG", "datePublished": "2026-11-21" } ]
}
```
Generate `blogPost` from `posts` in lib/blog.tsx.

### 6. Organization polish (app/page.tsx line 22-28)
Use a 512x512 PNG logo (add `app/logo-512.png` or `public/logo.png`) and add `contactPoint` with `{"@type":"ContactPoint","contactType":"customer support","email":"harshrawat.dev@gmail.com"}`. Both are optional.

## Not recommended
- HowTo for /guide (deprecated Sept 2023).
- Removing or adding FAQPage (retired rich results, Info only).
- Inventing `aggregateRating`/`review` without real, visible ratings.

## Caveats
Only the homepage was verified from its rendered output. All other pages were assessed from the source in /Users/harshrawat/Documents/developer/side-projects/loom-alternative/web, so a live rendering check (Rich Results Test) is worth running after changes. Today's date is 2026-11-22, so the sale is currently open.
