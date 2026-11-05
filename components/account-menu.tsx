"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// The account menu at the bottom of the dashboard sidebar. More items will go here;
// for now it holds sign out.
export function AccountMenu({
  name,
  email,
  avatar,
  compact = false,
}: {
  name: string;
  email: string;
  avatar: React.ReactNode;
  compact?: boolean;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      {compact ? (
        <DropdownMenuTrigger aria-label="Account" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-text/20">
          {avatar}
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger className="flex w-full min-w-0 items-center gap-3 rounded-control px-2 py-2 text-left outline-none transition-colors hover:bg-sunken focus-visible:ring-2 focus-visible:ring-text/20 data-popup-open:bg-sunken">
          {avatar}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{name}</span>
            <span className="block truncate text-xs text-muted">{email}</span>
          </span>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 shrink-0 text-faint">
            <path d="M5 6.5L8 3.5l3 3M5 9.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent
        side={compact ? "bottom" : "top"}
        align={compact ? "end" : "start"}
        sideOffset={6}
        className={compact ? "w-60" : "w-(--anchor-width)"}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} disabled={signingOut}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M6 2.75H4A1.25 1.25 0 0 0 2.75 4v8A1.25 1.25 0 0 0 4 13.25h2M10.5 11l3-3-3-3M13.25 8H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {signingOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
