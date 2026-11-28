import { PrivacyRoute, privacyMetadata } from "@/components/localized-routes";

export const metadata = privacyMetadata("ja");

export default function Page() {
  return <PrivacyRoute locale="ja" />;
}
