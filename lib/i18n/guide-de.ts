import type { GuideCopy } from "@/lib/i18n/guide-types";

export const guideDe: GuideCopy = {
  title: "Showthrough einrichten",
  description: "Verbinde Showthrough mit deinem eigenen Cloudflare und nimm dein erstes Video auf. Etwa zwei Minuten, und du machst es nur einmal.",
  lead: "Verbinde Showthrough mit deinem eigenen Cloudflare, dann nimm auf. Etwa zwei Minuten, und du machst es nur einmal.",
  need: {
    title: "Du brauchst",
    lines: ["Ein Showthrough-Konto (Anmeldung mit Google)", "Google Chrome", "Eine Karte für Cloudflare. Deine ersten 10 GB pro Monat kosten nichts."],
  },
  stepsTitle: "Die Schritte",
  step: "Schritt {n}",
  english: "Die Screenshots zeigen die englische Oberfläche von Showthrough und Cloudflare.",
  steps: {
    "create-cloudflare-account": {
      title: "Ein Cloudflare-Konto erstellen",
      lead: "Deine Videos werden in deinem eigenen Cloudflare-Konto gespeichert. Es ist kostenlos.",
      actions: ["Öffne die [[Cloudflare-Anmeldung|https://dash.cloudflare.com/sign-up]].", "Fahre mit Google fort oder nutze E-Mail und Passwort."],
      notes: [{ title: "Schon ein Konto?", lines: ["Melde dich einfach an und geh zum nächsten Schritt."] }],
    },
    "turn-on-r2": {
      title: "R2 aktivieren",
      lead: "R2 ist der Teil von Cloudflare, der deine Videos speichert. Das meiste in Cloudflare funktioniert ohne Karte, aber R2 fragt vor dem Aktivieren nach einer.",
      notesBefore: [
        {
          title: "Du hinterlegst eine Karte, zahlst aber 0 $",
          lines: [
            "Deine ersten 10 GB pro Monat sind kostenlos. Das sind etwa 8 Stunden Aufnahmen, und du kannst alte Videos jederzeit löschen.",
            "Das Ansehen deiner Videos ist immer kostenlos.",
            "Kosten entstehen nur über 10 GB: 0,015 $ pro GB und Monat, 110 GB kosten also etwa 1,50 $ im Monat.",
          ],
        },
      ],
      actions: ["Öffne in der Seitenleiste **Storage & databases** → **R2 Object Storage**.", "Klick auf **Add R2 subscription to my account**."],
      actionsAfterShot: ["Füge eine Karte, Apple Pay oder PayPal hinzu.", "Bestätige. **Due today: $0.**"],
    },
    "connect-cloudflare": {
      title: "Cloudflare verbinden",
      lead: "Geh jetzt zurück zu Showthrough und lass es alles für dich einrichten.",
      actions: ["Öffne deine [[Showthrough-Bibliothek|/dashboard]] und klick auf **Connect Cloudflare**.", "Klick bei Cloudflare auf **Authorize**."],
      notes: [
        {
          title: "Was bekommt Showthrough?",
          lines: [
            "Nur, was es braucht, um seinen eigenen Speicher, seine Datenbank und sein Video-Backend zu erstellen. Deine anderen Projekte bleiben unberührt.",
            "Wir nutzen die Berechtigung einmal und verwerfen sie dann. Wir behalten keinen Zugriff auf dein Konto.",
          ],
        },
        { title: "Mehr als ein Cloudflare-Konto?", lines: ["Klick auf der Authorize-Seite auf Edit und wähle das Konto, in dem du R2 aktiviert hast."] },
      ],
    },
    "wait-for-setup": {
      title: "Etwa 30 Sekunden warten",
      lead: "Showthrough erstellt deinen Speicher und dein Video-Backend. Lass die Seite geöffnet.",
      after: "Danach bist du wieder in deiner Bibliothek, und Schritt 1 ist als **Done** markiert.",
    },
    "add-extension": {
      title: "Die Chrome-Erweiterung hinzufügen",
      lead: "Die Erweiterung übernimmt die Aufnahme.",
      actions: ["Öffne [[Showthrough im Chrome Web Store|CHROME]].", "Klick auf **Add to Chrome** (Zu Chrome hinzufügen)."],
      notes: [{ title: "Tipp", lines: ["Pinne sie an: Klick auf das Puzzle-Symbol in der Chrome-Leiste und dann auf die Nadel neben Showthrough."] }],
    },
    "connect-extension": {
      title: "Die Erweiterung verbinden",
      lead: "So weiß die Erweiterung, wo sie deine Videos speichert. Keine Schlüssel zu kopieren.",
      actions: ["Klick in deiner Bibliothek auf **Connect extension**.", "Du siehst **Extension connected**."],
    },
    record: {
      title: "Dein erstes Video aufnehmen",
      lead: "Alles bereit. Los geht’s.",
      actions: [
        "Klick in deiner Bibliothek auf **New video** oder auf das Showthrough-Symbol in der Chrome-Leiste.",
        "Wähle Kamera und Mikrofon, dann **Start recording**.",
        "Drück auf Stopp, wenn du fertig bist. Der Link wird für dich kopiert.",
      ],
    },
    troubleshooting: {
      title: "Wenn etwas schiefgeht",
      lead: "Die üblichen Lösungen. Die meisten dauern ein paar Sekunden.",
      notes: [
        { title: "„R2 isn’t turned on“", lines: ["Mach [[R2 aktivieren|#turn-on-r2]] und klick dann erneut auf Connect Cloudflare."] },
        {
          title: "Falsches Cloudflare-Konto verbunden",
          lines: ["Geh zu Profile, drück auf Disconnect Cloudflare und verbinde neu. Klick auf der Authorize-Seite auf Edit, um das richtige Konto zu wählen."],
        },
        { title: "Connect extension findet die Erweiterung nicht", lines: ["Prüfe, ob sie zu Chrome hinzugefügt ist, lade deine Bibliothek neu und versuch es noch einmal."] },
        { title: "Kommst du nicht weiter?", lines: ["Schreib an {email}. Ich antworte selbst (auf Englisch)."] },
      ],
    },
  },
  alts: {
    "cloudflare-sign-up": "Die Cloudflare-Anmeldeseite mit „Continue with Google“ oben",
    "r2-get-started": "Die R2-Seite von Cloudflare mit der kostenlosen Monatsnutzung und dem Button „Add R2 subscription“",
    "r2-add-card": "Die Seite „Activate R2“: Kartendaten links, 0 $ heute fällig rechts",
    "connect-screen": "Die Showthrough-Bibliothek mit den drei Einrichtungsschritten und dem Button „Connect Cloudflare“",
    authorize: "Cloudflare fragt, ob Showthrough auf dein Konto zugreifen darf, mit dem Button „Authorize“",
    "setting-up": "Showthrough richtet dein Cloudflare ein, vier Schritte werden abgehakt",
    "chrome-web-store": "Die Showthrough-Erweiterung im Chrome Web Store mit dem Button „Add to Chrome“",
    "cloudflare-done": "Die Bibliothek mit verbundenem Cloudflare und dem Button „Connect extension“",
    "extension-connected": "Showthrough bestätigt, dass die Erweiterung verbunden ist",
    "new-video": "Die Bibliothek mit allen erledigten Schritten und dem Button „New video“",
    "toolbar-icon": "Das Showthrough-Symbol in der Chrome-Leiste",
    "record-panel": "Das Showthrough-Fenster mit Kamera, Mikrofon und dem Button „Start recording“",
  },
};
