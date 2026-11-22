import { site } from "@/lib/site";

// The person behind Showthrough. Used by /about, the author box on blog posts and the
// structured data, so every page describes the same person with the same profiles.

export const author = {
  name: "Harsh Rawat",
  role: `Founder of ${site.name}`,
  location: "Delhi, India",
  initials: "HR",
  path: "/about",
  short:
    "Indie developer from Delhi and the founder of Showthrough. I freelanced for five years in design and frontend development, sending clients video updates almost every day, and built Showthrough to make that cheaper and simpler.",
  profiles: [
    { label: "X", href: "https://x.com/Harshrwt27" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/harsh-rawat-037a59202/" },
    { label: "GitHub", href: "https://github.com/Harshrawat27" },
  ],
};

export const authorId = `${site.url}/about#harsh-rawat`;

export function personSchema() {
  return {
    "@type": "Person",
    "@id": authorId,
    name: author.name,
    url: `${site.url}${author.path}`,
    jobTitle: author.role,
    homeLocation: { "@type": "Place", name: author.location },
    worksFor: { "@id": `${site.url}/#organization` },
    knowsAbout: ["Screen recording", "Async communication", "Freelancing", "Web design", "Frontend development", "Chrome extensions"],
    sameAs: author.profiles.map((p) => p.href),
  };
}
