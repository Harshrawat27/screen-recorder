import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedLegal } from "@/components/localized-pages";
import { isOtherLocale } from "@/lib/i18n";
import { privacyDocs } from "@/lib/i18n/legal";
import { localeParams, localizedMetadata } from "@/lib/i18n/metadata";

type Props = { params: Promise<{ locale: string }> };

export const dynamicParams = false;
export const generateStaticParams = localeParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isOtherLocale(locale)) return {};
  const doc = privacyDocs[locale];
  return localizedMetadata(locale, "/privacy", doc.title, doc.description);
}

export default async function LocalizedPrivacy({ params }: Props) {
  const { locale } = await params;
  if (!isOtherLocale(locale)) notFound();
  return <LocalizedLegal locale={locale} doc={privacyDocs[locale]} path="/privacy" />;
}
