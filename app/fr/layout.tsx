import { LocaleRoot, layoutMetadata } from "@/components/localized-routes";

// Root layout for the French pages, so <html lang="fr">.
export const metadata = layoutMetadata("fr");
export { viewport } from "@/app/root-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LocaleRoot locale="fr">{children}</LocaleRoot>;
}
