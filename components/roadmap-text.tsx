import Link from "next/link";

// Plain text where every mention of "roadmap" or "coming soon" links to the roadmap page. Used for copy that
// lives as plain strings (so it can also go into search-engine data unchanged).
export function RoadmapText({ children }: { children: string }) {
  const parts = children.split(/\b(roadmap|coming soon)\b/i);
  if (parts.length === 1) return <>{children}</>;
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Link key={i} href="/roadmap" className="underline underline-offset-2 hover:text-text">
            {part}
          </Link>
        ) : (
          part
        ),
      )}
    </span>
  );
}
