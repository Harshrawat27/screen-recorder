import "./skeleton.css";

// Loading placeholders for the dashboard. Each one has the shape of what it stands in for,
// so nothing jumps when the real content arrives.

function Block({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton rounded-md ${className}`} />;
}

export function PageHeaderSkeleton() {
  return (
    <div>
      <Block className="h-10 w-52 rounded-lg" />
      <Block className="mt-3 h-4 w-80 max-w-full" />
    </div>
  );
}

export function VideoCardSkeleton() {
  return (
    <div>
      <Block className="aspect-video w-full rounded-card" />
      <Block className="mt-3 h-4 w-3/4" />
      <Block className="mt-2 h-3.5 w-1/3" />
    </div>
  );
}

/** Same grid as the library, so cards land exactly where the placeholders were. */
export function VideoGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** For pages that list videos: Recent and Watch later. */
export function VideoPageSkeleton() {
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10" aria-busy="true" aria-label="Loading">
      <PageHeaderSkeleton />
      <VideoGridSkeleton />
    </main>
  );
}

/** The library. Kept separate so it can grow (stats on top, filters) without touching the others. */
export function LibrarySkeleton() {
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10" aria-busy="true" aria-label="Loading your library">
      <PageHeaderSkeleton />
      <VideoGridSkeleton />
    </main>
  );
}

/** For settings-style pages: Manage team and Billing. */
export function PanelPageSkeleton() {
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10" aria-busy="true" aria-label="Loading">
      <PageHeaderSkeleton />
      <Block className="mt-10 h-72 w-full rounded-[24px]" />
    </main>
  );
}
