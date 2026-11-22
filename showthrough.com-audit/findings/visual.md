# Visual audit: showthrough.com (captured 2026-11-22)
Screenshots: /Users/harshrawat/Documents/developer/side-projects/loom-alternative/web/showthrough.com-audit/screenshots/{home,pricing,alternatives-loom}/ (desktop, laptop, tablet, mobile each)
Method: screenshots reviewed visually. No DOM metrics were run (scrollWidth, computed tap-target sizes), so overflow and tap-target findings are from screenshot evidence only.

## Findings
- HIGH: Mobile nav (375px), all 3 pages. The "Get Showthrough" button overflows the nav pill and is clipped at the right viewport edge. Its right side is cut off and it extends past the pill. There is no hamburger menu, so "How it works / Pricing / Setup guide / Blog / Chrome extension / Sign in" are unreachable. This is almost certainly the cause of horizontal overflow/scroll on mobile (needs scrollWidth confirmation). Fix: hide the CTA text or shorten to "Get it" on small screens, and add a hamburger menu.
- MEDIUM: Black Friday banner appears only on the home page, as a pill above the H1 (desktop and mobile, visible above the fold). On /pricing the sale appears only in the middle card (desktop, at about 490px) and is below the fold on mobile. /alternatives/loom has no mention of the sale above the fold. The Black Friday banner is not a site-wide bar. The sale ends 27 Nov, so consider a sitewide announcement bar.
- MEDIUM: /alternatives/loom on mobile. The H1 and two long paragraphs fill the first viewport, and the "Buy for $49" CTA is only just peeking in at the bottom edge (about 805px of 812) and is effectively below the fold. Fix: shorten the intro or put the CTA right after the H1.
- LOW-MEDIUM: Tap targets on mobile are estimated as follows. The primary CTAs ("Buy for $49", "See how it works") are about 52px tall and OK. The dark-mode toggle is about 30px and fails 48px. The breadcrumb links on /alternatives/loom (Home / Alternatives) are small text with a tap height of about 20px and fail.
- LOW: Home mobile hero. The sub-headline changes to "Say no to video limits" and the chip to "Unlimited videos". Desktop says "time limits" / "Record as long as you like". This inconsistency is probably intentional A/B or responsive copy but worth verifying. On the mobile H1 ("Screen recording you own.") the right edge sits within about 20px of the viewport edge. Tight but not clipped.
- LOW: /pricing. The closed "First buyers" card is greyed to low contrast (light grey text on white), including the "For the people who found us before we found them." copy, which is likely below WCAG AA. This is mostly intentional de-emphasis.
- INFO: Desktop is clean. The H1, value prop, and primary CTA ("Buy for $49") are all above the fold on home at 1920x1080. The hero product mockup is partly cut off at the fold, which is normal. /pricing desktop shows the Black Friday card, countdown timer, and CTA above the fold. /alternatives/loom desktop shows the H1, the intro, and both CTAs above the fold, with a readable comparison table starting at the fold.

## Above-the-fold summary
| Page | H1 | Value prop | CTA | BF banner |
|---|---|---|---|---|
| Home desktop | yes | yes | yes ($49) | yes (pill) |
| Home mobile | yes | yes | yes, just below the fold (about 1240px of 1624 at 2x, i.e. about 620 CSS px, inside the 812 viewport) | yes |
| Pricing desktop | yes | yes | yes | yes (card) |
| Pricing mobile | yes | yes | no (only the nav CTA, which is clipped) | no |
| Alternatives/Loom desktop | yes | yes | yes | no |
| Alternatives/Loom mobile | yes | partial | no, at the bottom edge | no |
