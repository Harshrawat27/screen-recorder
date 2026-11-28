import type { Metadata } from "next";
import { type OtherLocale, languageAlternates, localePath, ogLocales } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Metadata for a translated page: canonical, hreflang, and the language's share image. */
export function localizedMetadata(locale: OtherLocale, path: string, title: string, description: string, absoluteTitle = false): Metadata {
  const url = localePath(locale, path);
  const image = { url: `/og/${locale}.png`, width: 1200, height: 630, alt: title };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: site.name, locale: ogLocales[locale], url, title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export const localeParams = () => [{ locale: "de" }, { locale: "fr" }, { locale: "ja" }];
