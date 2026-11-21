"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Counts down to one fixed moment, so it shows the same time left on every device. When it
// reaches zero the page reloads its data and the next price takes over.

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown({ to, label }: { to: string; label: string }) {
  const router = useRouter();
  const end = Date.parse(to);
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const ms = end - Date.now();
      setLeft(Math.max(0, ms));
      if (ms <= 0) {
        clearInterval(timer);
        router.refresh();
      }
    };
    const timer = setInterval(tick, 1000);
    tick();
    return () => clearInterval(timer);
  }, [end, router]);

  if (left === null) return <span className="tabular-nums">Ends {label}</span>;
  if (left === 0) return <span>This price has ended</span>;
  const s = Math.floor(left / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return (
    <span className="tabular-nums" title={`Ends ${label}`}>
      Ends in {d > 0 && `${d}d `}
      {pad(h)}h {pad(m)}m {pad(s % 60)}s
    </span>
  );
}
