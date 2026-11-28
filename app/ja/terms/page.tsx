import { TermsRoute, termsMetadata } from "@/components/localized-routes";

export const metadata = termsMetadata("ja");

export default function Page() {
  return <TermsRoute locale="ja" />;
}
