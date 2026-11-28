import type { Locale } from "@/lib/i18n";
import type { HomeCopy } from "@/lib/i18n/home-types";
import { en } from "@/lib/i18n/home-en";
import { de } from "@/lib/i18n/home-de";
import { fr } from "@/lib/i18n/home-fr";
import { ja } from "@/lib/i18n/home-ja";

const copies: Record<Locale, HomeCopy> = { en, de, fr, ja };

export function homeCopy(locale: Locale = "en"): HomeCopy {
  return copies[locale] ?? en;
}
