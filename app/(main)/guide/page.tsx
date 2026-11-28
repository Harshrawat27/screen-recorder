import type { Metadata } from "next";
import { languageAlternates } from "@/lib/i18n";
import { GuideFrame } from "@/components/guide";
import { guideContent } from "@/components/guide-pages";
import { guidePages } from "@/lib/guide";

const page = guidePages[0];

export const metadata: Metadata = {
  title: "Setup guide",
  description: page.description,
  alternates: { canonical: "/guide", languages: languageAlternates("/guide") },
};

export default function GuidePage() {
  return <GuideFrame slug="">{guideContent[""]}</GuideFrame>;
}
