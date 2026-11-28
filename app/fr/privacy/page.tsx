import { PrivacyRoute, privacyMetadata } from "@/components/localized-routes";

export const metadata = privacyMetadata("fr");

export default function Page() {
  return <PrivacyRoute locale="fr" />;
}
