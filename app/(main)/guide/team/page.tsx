import type { Metadata } from "next";
import { GuideFrame } from "@/components/guide";
import { teamGuideContent } from "@/components/guide-team-pages";
import { teamGuide, teamGuidePages } from "@/lib/guide";

export const metadata: Metadata = {
  title: "Team guide",
  description: teamGuidePages[0].description,
  alternates: { canonical: "/guide/team" },
};

export default function TeamGuidePage() {
  return (
    <GuideFrame slug="" guide={teamGuide}>
      {teamGuideContent[""]}
    </GuideFrame>
  );
}
