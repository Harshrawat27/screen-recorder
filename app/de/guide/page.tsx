import { GuideRoute, guideMetadata } from "@/components/localized-routes";

export const metadata = guideMetadata("de");

export default function Page() {
  return <GuideRoute locale="de" />;
}
