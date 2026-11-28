import { HomeRoute, homeMetadata } from "@/components/localized-routes";

// The home page in Japanese. Rendered on every request so the price is always current.
export const dynamic = "force-dynamic";
export const metadata = homeMetadata("ja");

export default function Page() {
  return <HomeRoute locale="ja" />;
}
