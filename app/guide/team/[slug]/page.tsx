import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideFrame } from "@/components/guide";
import { teamGuideContent } from "@/components/guide-team-pages";
import { teamGuide, teamGuidePages } from "@/lib/guide";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return teamGuidePages.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = teamGuidePages.find((p) => p.slug === slug);
  if (!page) return {};
  return {
    title: `${page.title} · Team guide`,
    description: page.description,
    alternates: { canonical: `/guide/team/${page.slug}` },
  };
}

export default async function TeamGuideStepPage({ params }: Props) {
  const { slug } = await params;
  if (!slug || !(slug in teamGuideContent)) notFound();
  return (
    <GuideFrame slug={slug} guide={teamGuide}>
      {teamGuideContent[slug]}
    </GuideFrame>
  );
}
