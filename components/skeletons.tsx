import { PageHeader } from "@/components/dashboard-ui";
import { type DashboardPage, pages } from "@/lib/dashboard-pages";
import { LibraryActions } from "@/components/library-ui";
import "./skeleton.css";

// Loading screens for the dashboard. The page heading is real (it never changes); only the
// parts that wait for data are placeholders, shaped like what they stand in for.

export function Block({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton rounded-md ${className}`} />;
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
export function VideoPageSkeleton({ page }: { page: DashboardPage }) {
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10" aria-busy="true">
      <PageHeader title={pages[page].title} description={pages[page].description} />
      <VideoGridSkeleton />
    </main>
  );
}

/** The library: real heading and buttons, then placeholders for the toolbar, folders and cards. */
export function LibrarySkeleton() {
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10" aria-busy="true">
      <PageHeader title={pages.library.title} description={pages.library.description}>
        <LibraryActions />
      </PageHeader>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Block className="h-10 w-64 rounded-full" />
        <Block className="h-10 w-64 rounded-control" />
      </div>
      <Block className="mt-9 h-6 w-36" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {[0, 1].map((i) => (
          <Block key={i} className="mt-4 h-[108px] rounded-[18px]" />
        ))}
      </div>
      <Block className="mt-9 h-6 w-36" />
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-[18px] border border-line bg-surface p-2.5">
            <Block className="aspect-video w-full rounded-[12px]" />
            <div className="px-1.5 pb-1.5 pt-3">
              <Block className="h-3.5 w-1/2" />
              <Block className="mt-3 h-4 w-3/4" />
              <Block className="mt-4 h-3.5 w-2/5" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

/** For settings-style pages: Manage team and Billing. */
export function PanelPageSkeleton({ page }: { page: DashboardPage }) {
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10" aria-busy="true">
      <PageHeader title={pages[page].title} description={pages[page].description} />
      <Block className="mt-10 h-72 w-full rounded-[24px]" />
    </main>
  );
}
