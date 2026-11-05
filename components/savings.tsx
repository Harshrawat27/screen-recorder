"use client";

import { useId, useState } from "react";
import { site } from "@/lib/site";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const YEARS = 3;

export function Savings({ price }: { price: number }) {
  const [people, setPeople] = useState(10);
  const id = useId();
  const loom = people * site.loom.perUserPerMonth * 12 * YEARS;
  const ours = price;
  const fill = `${((people - 1) / 99) * 100}%`;
  const ourBar = Math.max((ours / loom) * 100, 1.2);

  return (
    <div className="rounded-panel border border-line bg-surface p-6 shadow-pop sm:p-10">
      <div className="flex items-end justify-between gap-6">
        <label htmlFor={id} className="text-muted">
          People on your team who record
        </label>
        <span className="tabular text-4xl font-bold tracking-tight">{people}</span>
      </div>
      <input
        id={id}
        type="range"
        min={1}
        max={100}
        value={people}
        onChange={(e) => setPeople(Number(e.target.value))}
        className="range mt-3 w-full"
        style={{ "--fill": fill } as React.CSSProperties}
      />

      <dl className="mt-10 space-y-7">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="font-semibold">Loom over {YEARS} years</dt>
            <dd className="tabular text-2xl font-bold tracking-tight text-muted">{usd(loom)}</dd>
          </div>
          <div aria-hidden className="mt-2.5 h-3 rounded-full bg-line-strong" />
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="font-semibold">{site.name}, ever</dt>
            <dd className="tabular text-2xl font-bold tracking-tight">{usd(ours)}</dd>
          </div>
          <div aria-hidden className="mt-2.5 h-3 rounded-full bg-sunken">
            <div className="h-full rounded-full bg-text" style={{ width: `${ourBar}%` }} />
          </div>
        </div>
      </dl>

      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-6">
        <p className="text-muted">Your team keeps</p>
        <p className="tabular text-5xl font-bold tracking-tight sm:text-6xl">{usd(loom - ours)}</p>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-faint">
        Loom price is {site.loom.planName}, {usd(site.loom.perUserPerMonth)} per person per month, checked {site.loom.checked}. Storage
        runs on Cloudflare&rsquo;s free tier (10 GB). Beyond that, Cloudflare bills your own account about $0.015 per GB each month.
      </p>
    </div>
  );
}
