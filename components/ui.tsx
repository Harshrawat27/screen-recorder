// Shared building blocks. Every page and the future dashboard should use these
// instead of styling buttons and cards from scratch.

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Orange fill with ink text: the one primary action on a screen.
  primary: "bg-brand text-on-brand hover:bg-brand-hover",
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

export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="8" fill="var(--brand)" />
      <rect x="7" y="8" width="18" height="13" rx="3" fill="#fff" />
      <circle cx="11.5" cy="21" r="4.5" fill="#18181B" stroke="var(--brand)" strokeWidth="2" />
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
