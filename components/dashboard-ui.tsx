// Building blocks shared by the dashboard pages.

export function Avatar({ name, image, size = "md" }: { name: string; image?: string | null; size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-8" : "size-9";
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" referrerPolicy="no-referrer" className={`${box} shrink-0 rounded-full object-cover`} />;
  }
  return (
    <span aria-hidden className={`${box} grid shrink-0 place-items-center rounded-full bg-sunken text-sm font-bold text-text`}>
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[34px] leading-tight sm:text-[40px]" style={{ letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        {description && <p className="mt-1.5 text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function EmptyState({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="mt-10 flex flex-col items-center rounded-[24px] border border-dashed border-line-strong px-6 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-full border border-line bg-surface text-muted">{icon}</span>
      <h2 className="mt-5 text-[24px] leading-tight">{title}</h2>
      <p className="mt-2 max-w-[44ch] leading-relaxed text-muted">{body}</p>
    </div>
  );
}

export const emptyIcon = (path: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6">
    {path}
  </svg>
);
