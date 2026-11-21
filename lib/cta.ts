// A recording's call-to-action buttons ("Book a call", "Try it free"). They're kept next to the
// video in the owner's own Cloudflare, as videos/<id>/cta.json ({ buttons: [...] }), written
// through the upload endpoint every Worker has, so they work without a Worker update.

export type Cta = { label: string; url: string };

export const CTA_LABEL_MAX = 40;
export const CTA_MAX = 10; // buttons per video
const URL_MAX = 2000;

/** Checks and tidies what the owner typed. Returns the cleaned button, or a message for them. */
export function cleanCta(input: unknown): Cta | string {
  const raw = (input ?? {}) as { label?: unknown; url?: unknown };
  const label = String(raw.label ?? "").replace(/\s+/g, " ").trim();
  let text = String(raw.url ?? "").trim();
  if (!label) return "Give the button a label.";
  if (label.length > CTA_LABEL_MAX) return `Keep the label under ${CTA_LABEL_MAX} characters.`;
  if (!text) return "Add the link the button opens.";
  if (!/^[a-z][a-z0-9+.-]*:/i.test(text)) text = `https://${text}`;
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return "That link doesn't look right. Try something like https://cal.com/you.";
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return "Links must start with https://.";
  const host = url.hostname;
  if (!host.includes(".") || /^[\d.]+$/.test(host) || host.includes(":") || host.endsWith(".local") || host === "localhost") {
    return "Use a website address, not an IP address or a local one.";
  }
  if (url.username || url.password) return "Links can't contain a username or password.";
  if (url.href.length > URL_MAX) return "That link is too long.";
  return { label, url: url.href };
}

/** Checks a whole list. The first problem comes back as a message, with which button it's on. */
export function cleanButtons(input: unknown): Cta[] | string {
  const list = Array.isArray(input) ? input : [];
  if (list.length > CTA_MAX) return `You can add up to ${CTA_MAX} buttons.`;
  const out: Cta[] = [];
  for (const [i, item] of list.entries()) {
    const cta = cleanCta(item);
    if (typeof cta === "string") return list.length > 1 ? `Button ${i + 1}: ${cta}` : cta;
    out.push(cta);
  }
  return out;
}

/** What's saved in cta.json. Early versions saved a single { label, url }. */
export function readButtons(saved: unknown): Cta[] {
  const raw = saved && typeof saved === "object" && "buttons" in saved ? (saved as { buttons: unknown }).buttons : saved ? [saved] : [];
  const buttons = cleanButtons(Array.isArray(raw) ? raw.slice(0, CTA_MAX) : []);
  return typeof buttons === "string" ? [] : buttons;
}

/** "cal.com" from "https://www.cal.com/you": shown next to the button so viewers know where it goes. */
export const ctaHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};
