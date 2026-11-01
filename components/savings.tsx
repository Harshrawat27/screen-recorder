"use client";

import { useId, useState } from "react";
import { site } from "@/lib/site";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export function Savings() {
  const [people, setPeople] = useState(10);
  const id = useId();
  const loomYear = people * site.loom.perUserPerMonth * 12;
  const loomThreeYears = loomYear * 3;

  return (
    <div className="rounded-3xl bg-ink px-6 py-10 text-paper sm:px-12 sm:py-14">
      <label htmlFor={id} className="block text-lg text-paper/70">
        People on your team who record
      </label>
      <div className="mt-3 flex items-center gap-5">
        <span className="w-16 text-5xl font-semibold tracking-tight">{people}</span>
        <input
          id={id}
          type="range"
          min={1}
          max={100}
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
          className="range-light flex-1"
        />
      </div>

      <dl className="mt-12 grid gap-10 sm:grid-cols-2">
        <div>
          <dt className="text-paper/70">Loom, every year</dt>
          <dd className="mt-2 text-6xl font-semibold tracking-tight sm:text-7xl">{usd(loomYear)}</dd>
          <dd className="mt-3 text-sm text-paper/60">
            {usd(site.loom.perUserPerMonth)} per person per month. That’s {usd(loomThreeYears)} over three years.
          </dd>
        </div>
        <div>
          <dt className="text-paper/70">{site.name}, ever</dt>
          <dd className="mt-2 text-6xl font-semibold tracking-tight sm:text-7xl">{usd(site.price.amount)}</dd>
          <dd className="mt-3 text-sm text-paper/60">
            Paid {site.price.label}. Videos are stored on your Cloudflare free tier, which includes 10 GB.
          </dd>
        </div>
      </dl>

      <p className="mt-10 text-xs text-paper/50">
        Loom price is {site.loom.planName}, checked {site.loom.checked}. Beyond 10 GB, Cloudflare charges about
        $0.015 per GB each month, billed to your own account.
      </p>
    </div>
  );
}
