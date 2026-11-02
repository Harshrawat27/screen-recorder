import type { ReactNode } from "react";
import { Footer, Header } from "@/components/header";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-10 sm:px-8">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated {updated}</p>
        <div className="prose-legal mt-8">{children}</div>
      </main>
      <Footer />
    </>
  );
}
