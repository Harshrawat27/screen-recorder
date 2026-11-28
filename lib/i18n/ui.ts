// Short strings for client components shared across the site (cookie banner, demo video,
// language menu). Kept separate from the page copy so client bundles stay small.
import type { Locale } from "@/lib/i18n";

export type UiCopy = {
  cookie: { text: string; privacy: string; decline: string; allow: string; settings: string };
  demo: { watch: string; length: string; play: string; close: string; title: string; poster: string; english: string };
  language: string;
};

export const ui: Record<Locale, UiCopy> = {
  en: {
    cookie: {
      text: "We use cookies to see how people use our website, so we can make it better. No ads.",
      privacy: "Privacy",
      decline: "Decline",
      allow: "Allow",
      settings: "Cookie settings",
    },
    demo: {
      watch: "Watch the demo",
      length: "46 sec",
      play: "Play the Showthrough demo video",
      close: "Close the video",
      title: "Showthrough demo",
      poster: "Showthrough recording a page in Chrome, with the camera bubble and the recording controls",
      english: "",
    },
    language: "Language",
  },
  de: {
    cookie: {
      text: "Wir nutzen Cookies, um zu sehen, wie unsere Website genutzt wird, damit wir sie verbessern können. Keine Werbung.",
      privacy: "Datenschutz",
      decline: "Ablehnen",
      allow: "Zulassen",
      settings: "Cookie-Einstellungen",
    },
    demo: {
      watch: "Demo ansehen",
      length: "46 Sek.",
      play: "Das Showthrough-Demovideo abspielen",
      close: "Video schließen",
      title: "Showthrough-Demo",
      poster: "Showthrough nimmt eine Seite in Chrome auf, mit Kamerablase und Aufnahmesteuerung",
      english: "Video auf Englisch",
    },
    language: "Sprache",
  },
  fr: {
    cookie: {
      text: "Nous utilisons des cookies pour comprendre comment notre site est utilisé et l’améliorer. Pas de publicité.",
      privacy: "Confidentialité",
      decline: "Refuser",
      allow: "Autoriser",
      settings: "Paramètres des cookies",
    },
    demo: {
      watch: "Voir la démo",
      length: "46 s",
      play: "Lire la vidéo de démonstration de Showthrough",
      close: "Fermer la vidéo",
      title: "Démo de Showthrough",
      poster: "Showthrough enregistre une page dans Chrome, avec la bulle caméra et les commandes d’enregistrement",
      english: "Vidéo en anglais",
    },
    language: "Langue",
  },
  ja: {
    cookie: {
      text: "サイトの使われ方を把握して改善するためにCookieを使用しています。広告はありません。",
      privacy: "プライバシー",
      decline: "拒否",
      allow: "許可",
      settings: "Cookie設定",
    },
    demo: {
      watch: "デモを見る",
      length: "46秒",
      play: "Showthroughのデモ動画を再生",
      close: "動画を閉じる",
      title: "Showthroughのデモ",
      poster: "ChromeでページをShowthroughで録画している様子。カメラバブルと録画コントロール付き",
      english: "英語の動画です",
    },
    language: "言語",
  },
};
