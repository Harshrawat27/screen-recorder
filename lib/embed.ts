import { site } from "@/lib/site";

// Embedding a video on another website: the address of its embed page, and the snippet to paste.
// The snippet keeps the player 16:9 at any width.

export const embedUrl = (space: string, id: string) => `${site.url}/embed/${space}/${id}`;

const attr = (text: string) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export function embedCode(space: string, id: string, title?: string | null) {
  return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"><iframe src="${embedUrl(space, id)}" title="${attr(
    title || "Showthrough video",
  )}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
}
