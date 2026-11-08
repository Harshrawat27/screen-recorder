// Shared building blocks. Every page and the future dashboard should use these
// instead of styling buttons and cards from scratch.

type Variant = "primary" | "secondary" | "ghost" | "brand";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Ink fill: black in light mode, white in dark mode. The main action on a screen.
  primary: "btn-primary bg-text text-canvas hover:bg-text/85",
  // Orange fill with ink text. Reserved for one special call to action; use sparingly.
  brand: "bg-brand text-on-brand hover:bg-brand-hover",
  // Neutral surface with a hairline: secondary actions.
  secondary: "border border-line bg-surface text-text hover:border-line-strong hover:bg-sunken",
  // Text only: tertiary actions, navigation.
  ghost: "text-muted hover:bg-sunken hover:text-text",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-6 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

// The mark: a white "record" dot with a soft halo on the orange tile. Flat shapes only (no
// gradients or filters with ids), so any number of copies can sit on one page, even hidden ones.
// app/icon.svg is the detailed version of the same mark, with texture and shading.
export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      <rect width="64" height="64" rx="16" fill="#F35733" />
      <rect x="0.6" y="0.6" width="62.8" height="62.8" rx="15.4" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="19.5" fill="#fff" fillOpacity=".28" />
      <circle cx="32" cy="32" r="19.5" fill="none" stroke="#fff" strokeOpacity=".32" strokeWidth=".8" />
      <circle cx="32" cy="33.4" r="15.3" fill="#8A2410" fillOpacity=".2" />
      <circle cx="32" cy="32" r="15" fill="#fff" />
    </svg>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-card border border-line bg-surface ${className}`}>{children}</div>;
}

export function Pill({ tone = "neutral", children }: { tone?: "neutral" | "brand"; children: React.ReactNode }) {
  const tones = {
    neutral: "bg-sunken text-muted",
    brand: "bg-brand-soft text-brand-ink",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export function CheckIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path d="M5 10.5l3.2 3.2L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
