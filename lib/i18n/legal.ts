import type { OtherLocale } from "@/lib/i18n";
import type { LegalDoc } from "@/lib/i18n/legal-types";
import { privacyDe, termsDe } from "@/lib/i18n/legal-de";
import { privacyFr, termsFr } from "@/lib/i18n/legal-fr";
import { privacyJa, termsJa } from "@/lib/i18n/legal-ja";

export const privacyDocs: Record<OtherLocale, LegalDoc> = { de: privacyDe, fr: privacyFr, ja: privacyJa };
export const termsDocs: Record<OtherLocale, LegalDoc> = { de: termsDe, fr: termsFr, ja: termsJa };
