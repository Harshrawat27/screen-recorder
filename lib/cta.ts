// A recording's call-to-action button ("Book a call", "Try it free"). It's kept next to the
// video in the owner's own Cloudflare, as videos/<id>/cta.json, written through the upload
// endpoint every Worker has, so it works without a Worker update.

export type Cta = { label: string; url: string };

export const CTA_LABEL_MAX = 40;
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

/** "cal.com" from "https://www.cal.com/you": shown next to the button so viewers know where it goes. */
export const ctaHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};
