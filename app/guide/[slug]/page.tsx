import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideFrame } from "@/components/guide";
import { guideContent } from "@/components/guide-pages";
import { guidePages } from "@/lib/guide";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return guidePages.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = guidePages.find((p) => p.slug === slug);
  if (!page) return {};
  return {
    title: `${page.title} · Setup guide`,
    description: page.description,
    alternates: { canonical: `/guide/${page.slug}` },
  };
}

export default async function GuideStepPage({ params }: Props) {
  const { slug } = await params;
  if (!slug || !(slug in guideContent)) notFound();
  return <GuideFrame slug={slug}>{guideContent[slug]}</GuideFrame>;
}
