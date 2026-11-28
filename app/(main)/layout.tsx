import { RootShell, baseMetadata } from "@/app/root-shell";

// Root layout for the English site (every page except /de, /fr and /ja).
// The group folder "(main)" doesn't appear in URLs.
export const metadata = baseMetadata;
export { viewport } from "@/app/root-shell";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
