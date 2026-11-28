import { TermsRoute, termsMetadata } from "@/components/localized-routes";

export const metadata = termsMetadata("de");

export default function Page() {
  return <TermsRoute locale="de" />;
}
