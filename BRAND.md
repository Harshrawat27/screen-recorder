# Showthrough brand guidelines

The live version, with every token and component rendered in both themes, is at **/brand** (not indexed).
Tokens live in `app/globals.css`; shared components in `components/ui.tsx`.

## Name and voice

- **Showthrough**, one word, capital S. Never "ShowThrough" or "Show Through".
- Tagline: *Screen recording you own.* Headline line: *Show it once. Skip the meeting.*
- In a sentence: "Send me a Showthrough." The product records; people *share a link*.
- Voice: plain, direct, a little warm. Say what happens ("The link is copied the moment you stop"), not what the system does.
- Sentence case everywhere. No all-caps labels, no exclamation marks in the UI, no "→" on buttons.
- Errors say what happened and how to fix it. Empty states invite the next action ("Record your first video").

## Color

Orange is a **signal**: the one primary action on a screen, the recording state, progress bars, and a single key number.
Everything else is built from neutrals. Never use orange for large backgrounds or decoration.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `brand` | `#F35733` | `#F35733` | Primary buttons, recording dot, progress, focus ring |
| `brand-hover` | `#E1441F` | `#FF6E4D` | Hover on orange |
| `brand-soft` | `#FEEDE8` | orange at 14% | Badges, icon backgrounds, selected rows |
| `brand-ink` | `#C2381A` | `#FF8466` | Orange text and links (passes AA) |
| `on-brand` | `#18181B` | `#18181B` | Text on orange fills |
| `canvas` | `#FAFAFA` | `#080808` | Page background |
| `surface` | `#FFFFFF` | `#111111` | Cards, panels, inputs, menus |
| `sunken` | `#F2F2F2` | `#1A1A1A` | Wells, skeletons, hover fills, slider tracks |
| `line` / `line-strong` | `#E1E1E1` / `#CFCFCF` | `#2D2D2D` / `#3D3D3D` | Borders, dividers |
| `text` | `#18181B` | `#F4F4F5` | Primary text |
| `muted` | `#5B5B63` | `#A6A6AE` | Secondary text |
| `faint` | `#76767E` | `#8A8A92` | Captions, hints, timestamps |
| `stage` | `#1C1C1F` | `#000000` | Frame behind any video, in both themes |

**Why ink text on orange buttons:** white on `#F35733` is only 3.4:1 contrast and fails accessibility for normal-size text. Ink on it is 5.2:1. Keep it.

In code, use the token names (`bg-brand`, `text-muted`, `border-line`), never hex values. Dark mode then works automatically.

## Typography

**Figtree**, one family for everything (self-hosted in `app/fonts`). It's friendly without being playful, very readable at small UI sizes, and has tabular numbers for timers and prices (`.tabular`).

| Style | Size / weight / tracking | Use |
| --- | --- | --- |
| Display | 64 (44 on mobile) / 700 / -4% | Homepage hero only |
| Heading 1 | 48 (36 on mobile) / 700 / -3% | Section and page titles |
| Heading 2 | 28 / 700 / -2% | Dashboard page titles, panel titles |
| Heading 3 | 20 / 700 / -1% | Card and step titles |
| Body large | 18 / 400 / 1.6 line height | Intros under headings |
| Body | 16 / 400 / 1.6 | Default text |
| Label | 14 / 600 | Buttons, form labels, nav |
| Caption | 12 / 400 | Timestamps, fine print |

Keep reading text under ~75 characters per line (`max-w-[48ch]` to `max-w-[62ch]`).

## Shape and space

- Radius: **10px** controls (buttons, inputs), **16px** cards and thumbnails, **24px** large panels and video frames. Pills are fully round.
- Borders before shadows. Use `shadow-pop` only for things that float: menus, the recording pill, toasts, the hero mock.
- Spacing on a 4px grid. Sections: 96px vertical on desktop. Page gutters: 20px mobile, 32px desktop. Max width 1152px (`max-w-6xl`).

## Components

Use `buttonClass(variant, size)` from `components/ui.tsx`:

- `primary`: orange, one per screen (Record, Join the beta, Save).
- `secondary`: surface with a hairline (Copy link, Cancel next to a primary).
- `ghost`: text only (navigation, tertiary actions).
- Sizes `sm` (36px), `md` (44px), `lg` (52px).

Also: `Card`, `Pill` (`neutral` or `brand`), `LogoMark`, `ThemeToggle`. Inputs: 44px tall, `rounded-control`, `border-line`, orange border and soft ring on focus.

## Motion

Only the recording dot loops. Everything else moves in response to the user (menus opening, a toast confirming "Link copied"), 150–300ms, and respects reduced-motion settings.

## Logo

The mark is a screen with a camera bubble in its corner, on an orange tile: the product in one shape. Use it with the wordmark in Figtree Bold. Minimum size 16px. Don't recolor the tile, outline it, or place it on orange.

## Dashboard direction

Follow the same tokens: `canvas` page, `surface` sidebar and cards, `line` dividers, video thumbnails on `stage` at 16px radius, a single orange **New video** button top-right, orange only for active nav item indicator, recording states and progress. Light and dark from day one.
