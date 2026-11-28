import { LocaleRoot, layoutMetadata } from "@/components/localized-routes";

// Root layout for the Japanese pages, so <html lang="ja">.
export const metadata = layoutMetadata("ja");
export { viewport } from "@/app/root-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LocaleRoot locale="ja">{children}</LocaleRoot>;
}
