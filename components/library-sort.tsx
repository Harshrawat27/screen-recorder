"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sort control for the library. For now it only remembers the choice; sorting comes later.
const options = [
  { value: "created", label: "Date created" },
  { value: "name", label: "Name" },
  { value: "length", label: "Length" },
];

export function LibrarySort() {
  const [value, setValue] = useState("created");
  const current = options.find((o) => o.value === value)?.label;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-10 items-center gap-2 rounded-control border border-line bg-surface px-3.5 text-sm outline-none transition-colors hover:bg-sunken focus-visible:ring-2 focus-visible:ring-text/20 data-popup-open:bg-sunken">
        <span className="text-muted">Sort:</span>
        <span className="font-medium">{current}</span>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 text-muted">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => setValue(String(next))}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
