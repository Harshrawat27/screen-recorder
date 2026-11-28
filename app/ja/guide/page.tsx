import { GuideRoute, guideMetadata } from "@/components/localized-routes";

export const metadata = guideMetadata("ja");

export default function Page() {
  return <GuideRoute locale="ja" />;
}
