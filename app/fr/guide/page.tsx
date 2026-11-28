import { GuideRoute, guideMetadata } from "@/components/localized-routes";

export const metadata = guideMetadata("fr");

export default function Page() {
  return <GuideRoute locale="fr" />;
}
