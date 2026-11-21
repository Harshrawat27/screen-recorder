import type { Metadata } from "next";
import { GuideFrame } from "@/components/guide";
import { guideContent } from "@/components/guide-pages";
import { guidePages } from "@/lib/guide";

const page = guidePages[0];

export const metadata: Metadata = {
  title: "Setup guide",
  description: page.description,
  alternates: { canonical: "/guide" },
};

export default function GuidePage() {
  return <GuideFrame slug="">{guideContent[""]}</GuideFrame>;
}
