import { TermsRoute, termsMetadata } from "@/components/localized-routes";

export const metadata = termsMetadata("fr");

export default function Page() {
  return <TermsRoute locale="fr" />;
}
