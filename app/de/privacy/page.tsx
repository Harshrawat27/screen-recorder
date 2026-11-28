import { PrivacyRoute, privacyMetadata } from "@/components/localized-routes";

export const metadata = privacyMetadata("de");

export default function Page() {
  return <PrivacyRoute locale="de" />;
}
