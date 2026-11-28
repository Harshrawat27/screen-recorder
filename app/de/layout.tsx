import { LocaleRoot, layoutMetadata } from "@/components/localized-routes";

// Root layout for the German pages, so <html lang="de">.
export const metadata = layoutMetadata("de");
export { viewport } from "@/app/root-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LocaleRoot locale="de">{children}</LocaleRoot>;
}
