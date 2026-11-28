import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { LocalizedHome } from "@/components/localized-pages";
import { currentOffer } from "@/lib/billing";
import { isOtherLocale, localePath } from "@/lib/i18n";
import { homeCopy } from "@/lib/i18n/home";
import { localizedMetadata } from "@/lib/i18n/metadata";
import { softwareAppSchema } from "@/lib/schema";
import { site } from "@/lib/site";

// The home page in German, French and Japanese (/de, /fr, /ja).
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isOtherLocale(locale)) return {};
  const t = homeCopy(locale).meta;
  return localizedMetadata(locale, "/", t.title, t.description, true);
}

export default async function LocalizedHomePage({ params }: Props) {
  const { locale } = await params;
  if (!isOtherLocale(locale)) notFound();
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
