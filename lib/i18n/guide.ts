import type { OtherLocale } from "@/lib/i18n";
import type { GuideCopy } from "@/lib/i18n/guide-types";
import { guideDe } from "@/lib/i18n/guide-de";
import { guideFr } from "@/lib/i18n/guide-fr";
import { guideJa } from "@/lib/i18n/guide-ja";

export const guideCopies: Record<OtherLocale, GuideCopy> = { de: guideDe, fr: guideFr, ja: guideJa };
