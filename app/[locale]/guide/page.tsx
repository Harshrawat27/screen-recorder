import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedGuide } from "@/components/localized-pages";
import { isOtherLocale } from "@/lib/i18n";
import { guideCopies } from "@/lib/i18n/guide";
import { localeParams, localizedMetadata } from "@/lib/i18n/metadata";

type Props = { params: Promise<{ locale: string }> };

export const dynamicParams = false;
export const generateStaticParams = localeParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isOtherLocale(locale)) return {};
  const g = guideCopies[locale];
  return localizedMetadata(locale, "/guide", g.title, g.description);
}

export default async function LocalizedGuidePage({ params }: Props) {
  const { locale } = await params;
  if (!isOtherLocale(locale)) notFound();
  return <LocalizedGuide locale={locale} />;
}
