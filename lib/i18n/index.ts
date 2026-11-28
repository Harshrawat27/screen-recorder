// Languages for the localized marketing pages (home, privacy, terms, setup guide).
// English lives at the normal paths; the others under /de, /fr and /ja.

export const locales = ["en", "de", "fr", "ja"] as const;
export type Locale = (typeof locales)[number];
export const otherLocales = ["de", "fr", "ja"] as const;
export type OtherLocale = (typeof otherLocales)[number];

export const localeNames: Record<Locale, string> = { en: "English", de: "Deutsch", fr: "Français", ja: "日本語" };
export const ogLocales: Record<Locale, string> = { en: "en_US", de: "de_DE", fr: "fr_FR", ja: "ja_JP" };

export const isOtherLocale = (value: string): value is OtherLocale => (otherLocales as readonly string[]).includes(value);

/** The path of a page in a language: "/privacy" → "/de/privacy", "/" → "/de". */
export function localePath(locale: Locale, path: string) {
  if (locale === "en") return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** The hreflang alternates for a page that exists in every language. */
export function languageAlternates(path: string) {
  const languages: Record<string, string> = { "x-default": path };
  for (const locale of locales) languages[locale] = localePath(locale, path);
  return languages;
}

/** Replaces {name} placeholders in copy. */
export function fill(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}
