import type { LegalDoc } from "@/lib/i18n/legal-types";

export const privacyDe: LegalDoc = {
  title: "Datenschutz",
  description:
    "Was Showthrough speichert, was es nie sieht und wie Analyse und Cookies funktionieren. Deine Videos bleiben in deinem eigenen Cloudflare-Konto, nicht auf unseren Servern.",
  updated: "21. November 2026",
  intro: [
    "Showthrough ist ein Bildschirmrekorder (eine Website und eine Chrome-Erweiterung), der so gebaut ist, dass deine Aufnahmen in deinem eigenen Cloudflare-Konto liegen, nicht in unserem. Diese Seite erklärt, was wir speichern, was durch unsere Dienste läuft und was die Erweiterung auf deinem Computer tut.",
  ],
  sections: [
    {
      h: "Was wir über dich speichern",
      ul: [
        "**Dein Konto:** dein Name, deine E-Mail-Adresse und dein Profilbild von Google, damit du dich anmelden kannst. Unser Anmeldesystem speichert außerdem die Anmeldedaten, die Google ihm gibt, und nutzt sie nur für die Anmeldung.",
        "**Ein Anmelde-Cookie**, das dich auf unserer Website angemeldet hält.",
        "**Dein Kauf:** dein Plan, der gezahlte Betrag und die Währung, das Datum und die Zahlungs-ID unseres Zahlungsanbieters. Deine Kartendaten sehen oder speichern wir nie.",
        "**Deine Cloudflare-Verbindung:** deine Cloudflare-Konto-ID und der Name, der Name des Speicher-Buckets und die Adresse der kleinen Video-App (ein Cloudflare Worker) in deinem Konto sowie der Upload-Schlüssel für diese App. Mit dem Schlüssel lädt die Erweiterung Aufnahmen hoch und dein Dashboard listet sie auf. Er funktioniert nur mit dieser Video-App und ihrem Speicher, nicht mit dem Rest deines Cloudflare-Kontos.",
        "Wann du die Chrome-Erweiterung mit deinem Konto verbunden hast.",
      ],
    },
    {
      h: "Cloudflare-Zugriff bei der Einrichtung",
      p: [
        "Wenn du auf „Cloudflare verbinden“ klickst (oder auf „Aktualisieren“, wenn eine neue Version verfügbar ist), gibt Cloudflare uns ein vorübergehendes Zugriffstoken. Unser Server nutzt es einmal, für einige Sekunden, um deinen Speicher-Bucket, deine Datenbank und deine Video-App zu erstellen oder zu aktualisieren, und verwirft es dann. Wir speichern es nicht und können es danach nicht mehr nutzen. Wir rühren nichts anderes in deinem Cloudflare-Konto an, etwa Websites, DNS oder Abrechnung.",
      ],
    },
    {
      h: "Deine Videos",
      ul: [
        "Aufnahmen, Vorschaubilder und Videodetails werden in deinem Cloudflare-Konto gespeichert, nicht auf unseren Servern.",
        "Wenn jemand einen Link öffnet, wird das Video aus deinem Cloudflare-Speicher über unsere Medienadresse (media.showthrough.com) gestreamt, die eine kurzlebige Kopie zwischenspeichern kann, damit die Wiedergabe schnell startet.",
        "Wenn du dein Dashboard öffnest, fragt unser Server deine Video-App nach der Liste deiner Videos (Titel, Datum und Länge), um sie dir anzuzeigen. Diese Liste behalten wir nicht.",
        "Wir kopieren, speichern, sehen oder analysieren deine Videos nicht.",
        "Kommentare, Reaktionen und Aufrufzahlen werden im Cloudflare-Konto der Person gespeichert, der das Video gehört (in einer bei der Einrichtung erstellten Datenbank), nicht auf unseren Servern.",
        "Jeder mit einem Link kann das Video ansehen. Teile Links nur mit Personen, die es sehen sollen.",
      ],
    },
    {
      h: "Kommentare, Reaktionen und Aufrufe",
      ul: [
        "Zum Kommentieren oder Reagieren musst du dich anmelden. Dein Kommentar oder deine Reaktion wird im Cloudflare der Person gespeichert, der das Video gehört, zusammen mit deinem Namen, Profilbild und einer Showthrough-Konto-ID, damit sie sieht, von wem er stammt. Jeder, der das Video öffnen kann, sieht deinen Namen, dein Foto und deine Kommentare.",
        "Unser Server leitet deinen Kommentar an das Cloudflare der Person weiter, der das Video gehört, und prüft, ob du angemeldet bist; eine Kopie behält er nicht.",
        "Du kannst deine eigenen Kommentare löschen, und die Person, der das Video gehört, kann jeden Kommentar zu ihren Videos löschen.",
        "Wenn du einen Showthrough-Arbeitsbereich hast, werden die letzten 25 Videos, die du angesehen hast, und deine „Später ansehen“-Videos in deiner eigenen Cloudflare-Datenbank gespeichert, damit du sie wiederfindest. Wir behalten sie nicht.",
        "Um Aufrufe zu zählen, setzen wir nach dem Abspielen eines Videos für 30 Minuten ein Cookie, damit derselbe Browser nicht doppelt gezählt wird. Aufrufzahlen sind nur Zahlen; wir speichern nicht, wer zugeschaut hat.",
      ],
    },
    {
      h: "Die Chrome-Erweiterung",
      ul: [
        "Sie nutzt Bildschirm, Kamera und Mikrofon nur während der Einrichtung oder einer Aufnahme und erst, nachdem du es in Chrome erlaubt hast.",
        "Die Aufnahmesteuerung erscheint nur in dem Tab, in dem du auf das Showthrough-Symbol klickst. Die Erweiterung liest oder sammelt nicht den Inhalt der Seiten, die du besuchst.",
        "Während du aufnimmst, werden Teile der Aufnahme im Speicher deines Browsers gehalten, bis sie in dein Cloudflare hochgeladen sind. Wird ein Upload unterbrochen, bleiben sie dort, damit er später fertig werden kann.",
        "Sie speichert deine Verbindungsdaten (die Adresse deiner Video-App und ihren Upload-Schlüssel) sowie deine Kamera-, Mikrofon- und Audioeinstellungen in deinem Browser.",
        "Aufnahmen werden nur in die Video-App in deinem eigenen Cloudflare-Konto hochgeladen.",
        "Die Erweiterung enthält keine Werbung, keine Tracker und keine Analyse, und wir verkaufen oder teilen deine Daten nicht.",
      ],
    },
    {
      h: "Unsere Website",
      id: "analytics",
      ul: [
        "Wir nutzen Vercel Web Analytics, um Seitenaufrufe zu zählen. Es verwendet keine Cookies.",
        "Außerdem nutzen wir PostHog, um zu verstehen, wie Menschen unsere Website nutzen: welche Seiten sie besuchen, wo sie klicken und wie sie von der Startseite zur Anmeldung, zum Kauf und zur Einrichtung gelangen. PostHog setzt ein Cookie (namens ph_…_posthog) und erhält deine IP-Adresse, deinen Browser und die besuchten Seiten. Es kann deinen Besuch als Wiedergabe von Klicks und Scrollen aufzeichnen, wobei alles, was du eintippst, verborgen bleibt. PostHog speichert diese Daten in den USA und verarbeitet sie nach seiner eigenen Datenschutzerklärung. Es gibt keine Werbung.",
        "Wenn du dich anmeldest, verknüpfen wir diese Besuche über eine interne ID mit deinem Showthrough-Konto, nie über deine E-Mail-Adresse. Wir vermerken außerdem, wann du kaufst, Cloudflare verbindest und die Erweiterung verbindest, damit wir sehen, wo Menschen hängen bleiben.",
        "PostHog läuft nicht auf geteilten Videoseiten, Personen, die deine Aufnahmen ansehen, werden also nicht erfasst.",
        "Besucher in Europa (EU, EWR, Vereinigtes Königreich und Schweiz) werden zuerst gefragt, und PostHog lädt nur, wenn sie „Zulassen“ wählen. Alle anderen können es jederzeit abschalten: Wähle „Cookie settings“ unten auf jeder Seite und dann „Decline“, und das PostHog-Cookie wird entfernt.",
        "Wer einen Link ansieht, braucht kein Konto. Wie bei jeder Website verarbeiten unsere Hosting-Anbieter (Vercel und Cloudflare) grundlegende Anfragedaten wie IP-Adressen, um die Seite und das Video auszuliefern.",
      ],
    },
    {
      h: "Dienste, die wir nutzen",
      ul: [
        "Google, für die Anmeldung.",
        "Dodo Payments, für Zahlungen. Es erhält deinen Namen und deine E-Mail-Adresse für Bezahlung und Belege.",
        "Vercel, für unsere Website und Datenbank.",
        "PostHog, für die Website-Analyse wie oben beschrieben.",
        "Cloudflare, für deinen Speicher und deine Video-App (in deinem eigenen Konto) und für unsere Medienadresse.",
      ],
    },
    {
      h: "Zugriff entziehen und Daten löschen",
      p: [
        "Du kannst die Showthrough-Video-App und den Speicher-Bucket jederzeit in deinem Cloudflare-Dashboard löschen. Der Upload-Schlüssel, den wir haben, funktioniert dann nicht mehr, und deine Links ebenfalls nicht.",
        "Um dein Showthrough-Konto und alles unter „Was wir über dich speichern“ zu löschen, schreib an {email}. Deine Videos liegen in deinem Cloudflare-Konto und gehören dir, dort kannst du sie behalten oder löschen.",
      ],
    },
    { h: "Kontakt", p: ["Fragen zum Datenschutz? Schreib an {email}."] },
  ],
};

export const termsDe: LegalDoc = {
  title: "Nutzungsbedingungen",
  description: "Die Bedingungen für Showthrough: Lizenz, Zahlungen, 7-Tage-Rückerstattung, dein Cloudflare-Konto und deine Inhalte.",
  updated: "28. November 2026",
  intro: [
    "Diese Bedingungen gelten für Showthrough: die Website, das Dashboard, die Teilen-Seiten und die Chrome-Erweiterung. Mit der Nutzung von Showthrough stimmst du ihnen zu. Sie sind mit Absicht kurz.",
  ],
  sections: [
    {
      h: "Deine Lizenz",
      p: [
        "Showthrough ist ein einmaliger Kauf, kein Abo. Deine Zahlung gibt deinem Team eine Lizenz, Showthrough zu nutzen, solange es das Produkt gibt.",
        "Käufe zu 29 $ oder 39 $ (einschließlich des Black-Friday-Angebots und des aktuellen Lifetime-Preises von 39 $) enthalten alle künftigen Updates. Ändert sich der Preis später, zum Beispiel auf 79 $ mit dem Start der Mac-App, können Käufe zum neuen Preis nur die zum Kaufzeitpunkt verfügbare Version enthalten, wie zu diesem Zeitpunkt auf der Preisseite angegeben; diese Version funktioniert weiter.",
      ],
    },
    {
      h: "Zahlungen und Rückerstattungen",
      p: [
        "Zahlungen werden von Dodo Payments abgewickelt, das als Händler (Merchant of Record) auftritt und Abrechnung, Steuern und Belege übernimmt. Die Preise auf unserer Preisseite sind in US-Dollar angegeben.",
        "Du kannst innerhalb von 7 Tagen nach dem Kauf eine Rückerstattung verlangen. Nach 7 Tagen sind keine Rückerstattungen möglich. Schreib dafür an {email}, von der Adresse, mit der du gekauft hast. Rückerstattungen gehen über Dodo Payments an deine ursprüngliche Zahlungsmethode zurück. Eine erstattete Zahlung beendet deine Lizenz.",
        "Über AppSumo gekauft? AppSumo bearbeitet deine Rückerstattung nach eigenen Regeln. Ein erstatteter Code beendet deine Lizenz.",
      ],
    },
    {
      h: "Dein Cloudflare-Konto",
      p: [
        "Aufnahmen werden in deinem eigenen Cloudflare-Konto gespeichert. Du bist für dieses Konto verantwortlich, einschließlich aller Kosten, die Cloudflare dir über das kostenlose Kontingent hinaus berechnet, und dafür, dass es aktiv bleibt. Löschst du die Showthrough-Video-App oder den Speicher in Cloudflare, funktionieren deine Aufnahmen und Links nicht mehr.",
      ],
    },
    {
      h: "Deine Inhalte",
      p: [
        "Deine Aufnahmen gehören dir. Nutze Showthrough nicht, um etwas Illegales aufzunehmen oder zu teilen, etwas, das du nicht teilen darfst, oder Personen, die einer Aufnahme nicht zugestimmt haben, wo das Gesetz ihre Zustimmung verlangt. Jeder mit einem Link kann das Video ansehen, teile Links also mit Bedacht.",
      ],
    },
    { h: "Missbrauch", p: ["Wir können ein Konto sperren oder schließen, das gegen diese Bedingungen verstößt oder Showthrough nutzt, um anderen zu schaden."] },
    {
      h: "Keine Gewährleistung",
      p: [
        "Showthrough wird so bereitgestellt, wie es ist. Wir arbeiten hart daran, dass es zuverlässig läuft, können aber nicht garantieren, dass es immer verfügbar oder fehlerfrei ist. Soweit gesetzlich zulässig, haften wir nicht für verlorene Aufnahmen oder andere indirekte Schäden, und unsere Gesamthaftung ist auf den Betrag begrenzt, den du uns gezahlt hast.",
      ],
    },
    { h: "Änderungen", p: ["Wir können diese Bedingungen anpassen, wenn sich Showthrough ändert. Dann aktualisieren wir das Datum oben auf dieser Seite."] },
    { h: "Kontakt", p: ["Fragen? Schreib an {email}."] },
  ],
};
