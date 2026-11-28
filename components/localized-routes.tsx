import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LocalizedGuide, LocalizedHome, LocalizedLegal } from "@/components/localized-pages";
import { RootShell, baseMetadata } from "@/app/root-shell";
import { currentOffer } from "@/lib/billing";
import { type OtherLocale, localePath, ogLocales } from "@/lib/i18n";
import { guideCopies } from "@/lib/i18n/guide";
import { homeCopy } from "@/lib/i18n/home";
import { privacyDocs, termsDocs } from "@/lib/i18n/legal";
import { localizedMetadata } from "@/lib/i18n/metadata";
import { softwareAppSchema } from "@/lib/schema";
import { site } from "@/lib/site";

// The pages under app/de, app/fr and app/ja. Each language has its own folder (not one [locale]
// folder) so that it can have its own root layout with the right <html lang>, while any other
// first segment, such as /foo, stays an ordinary 404.

export function layoutMetadata(locale: OtherLocale): Metadata {
  return { ...baseMetadata, openGraph: { ...baseMetadata.openGraph, locale: ogLocales[locale] } };
}

export function LocaleRoot({ locale, children }: { locale: OtherLocale; children: React.ReactNode }) {
  return (
    <RootShell lang={locale} locale={locale}>
      {children}
    </RootShell>
  );
}

export function homeMetadata(locale: OtherLocale): Metadata {
  const t = homeCopy(locale).meta;
  return localizedMetadata(locale, "/", t.title, t.description, true);
}

export async function HomeRoute({ locale }: { locale: OtherLocale }) {
  const { sold, price } = await currentOffer();
  const t = homeCopy(locale);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { ...softwareAppSchema(price), inLanguage: locale, url: `${site.url}${localePath(locale, "/")}` },
            {
              "@type": "FAQPage",
              inLanguage: locale,
              mainEntity: t.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />
      <LocalizedHome locale={locale} price={price} sold={sold} />
    </>
  );
}

export const privacyMetadata = (locale: OtherLocale) =>
  localizedMetadata(locale, "/privacy", privacyDocs[locale].title, privacyDocs[locale].description);
export const PrivacyRoute = ({ locale }: { locale: OtherLocale }) => <LocalizedLegal locale={locale} doc={privacyDocs[locale]} path="/privacy" />;

export const termsMetadata = (locale: OtherLocale) =>
  localizedMetadata(locale, "/terms", termsDocs[locale].title, termsDocs[locale].description);
export const TermsRoute = ({ locale }: { locale: OtherLocale }) => <LocalizedLegal locale={locale} doc={termsDocs[locale]} path="/terms" />;

export const guideMetadata = (locale: OtherLocale) => localizedMetadata(locale, "/guide", guideCopies[locale].title, guideCopies[locale].description);
export const GuideRoute = ({ locale }: { locale: OtherLocale }) => <LocalizedGuide locale={locale} />;
