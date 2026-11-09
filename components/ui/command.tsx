"use client";

// shadcn/ui's Command (Base UI version): cmdk inside our Base UI Dialog, styled with
// Showthrough's design tokens. Same component names and props as
// https://ui.shadcn.com/docs/components/base/command

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const join = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ");

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return <CommandPrimitive data-slot="command" className={join("flex size-full flex-col overflow-hidden bg-surface text-text", className)} {...props} />;
}

function CommandDialog({
  title = "Command palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={join("top-[14vh]! max-w-xl! translate-y-0! overflow-hidden p-0! sm:p-0!", className)}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="flex h-14 items-center gap-3 border-b border-line px-4">
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-[18px] shrink-0 text-muted">
        <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M13.2 13.2L17 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      <CommandPrimitive.Input
        data-slot="command-input"
        className={join("h-full w-full bg-transparent text-[15px] outline-none! placeholder:text-faint disabled:opacity-50", className)}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={join("max-h-[min(420px,60vh)] scroll-py-2 overflow-y-auto overflow-x-hidden p-2", className)}
      {...props}
    />
  );
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty data-slot="command-empty" className={join("py-10 text-center text-sm text-muted", className)} {...props} />;
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={join(
        "overflow-hidden text-text [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-faint",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator data-slot="command-separator" className={join("-mx-2 my-1.5 h-px bg-line", className)} {...props} />;
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={join(
        "relative flex cursor-default select-none items-center gap-3 rounded-xl px-2.5 py-2 text-[14px] outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-sunken data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="command-shortcut" className={join("ml-auto text-xs tracking-widest text-faint", className)} {...props} />;
}

export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut };
