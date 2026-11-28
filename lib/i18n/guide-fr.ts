import type { GuideCopy } from "@/lib/i18n/guide-types";

export const guideFr: GuideCopy = {
  title: "Installer Showthrough",
  description: "Connectez Showthrough à votre propre Cloudflare et enregistrez votre première vidéo. Environ deux minutes, une seule fois.",
  lead: "Connectez Showthrough à votre propre Cloudflare, puis enregistrez. Environ deux minutes, et vous ne le faites qu’une fois.",
  need: {
    title: "Il vous faut",
    lines: ["Un compte Showthrough (connexion avec Google)", "Google Chrome", "Une carte pour Cloudflare. Vos 10 premiers Go chaque mois ne vous coûtent rien."],
  },
  stepsTitle: "Les étapes",
  step: "Étape {n}",
  english: "Les captures d’écran montrent l’interface en anglais de Showthrough et de Cloudflare.",
  steps: {
    "create-cloudflare-account": {
      title: "Créer un compte Cloudflare",
      lead: "Vos vidéos sont stockées dans votre propre compte Cloudflare. La création est gratuite.",
      actions: ["Ouvrez l’[[inscription Cloudflare|https://dash.cloudflare.com/sign-up]].", "Continuez avec Google, ou utilisez un e-mail et un mot de passe."],
      notes: [{ title: "Vous avez déjà un compte ?", lines: ["Connectez-vous simplement et passez à l’étape suivante."] }],
    },
    "turn-on-r2": {
      title: "Activer R2",
      lead: "R2 est la partie de Cloudflare qui stocke vos vidéos. La plupart des services Cloudflare fonctionnent sans carte, mais R2 en demande une avant de s’activer.",
      notesBefore: [
        {
          title: "Vous ajoutez une carte, mais vous payez 0 $",
          lines: [
            "Vos 10 premiers Go chaque mois sont gratuits. Cela représente environ 8 heures d’enregistrements, et vous pouvez supprimer les anciennes vidéos à tout moment.",
            "Regarder vos vidéos est toujours gratuit.",
            "Vous ne payez qu’au-delà de 10 Go : 0,015 $ par Go et par mois, donc 110 Go coûtent environ 1,50 $ par mois.",
          ],
        },
      ],
      actions: ["Dans la barre latérale, ouvrez **Storage & databases** → **R2 Object Storage**.", "Cliquez sur **Add R2 subscription to my account**."],
      actionsAfterShot: ["Ajoutez une carte, Apple Pay ou PayPal.", "Confirmez. **Due today: $0.**"],
    },
    "connect-cloudflare": {
      title: "Connecter Cloudflare",
      lead: "Revenez maintenant sur Showthrough et laissez-le tout installer pour vous.",
      actions: ["Ouvrez votre [[bibliothèque Showthrough|/dashboard]] et cliquez sur **Connect Cloudflare**.", "Sur Cloudflare, cliquez sur **Authorize**."],
      notes: [
        {
          title: "À quoi Showthrough a-t-il accès ?",
          lines: [
            "Seulement à ce dont il a besoin pour créer son propre stockage, sa base de données et son backend vidéo. Il ne touche pas à vos autres projets.",
            "Nous utilisons l’autorisation une fois, puis nous la supprimons. Nous ne gardons aucun accès à votre compte.",
          ],
        },
        { title: "Plusieurs comptes Cloudflare ?", lines: ["Cliquez sur Edit sur la page Authorize et choisissez celui où vous avez activé R2."] },
      ],
    },
    "wait-for-setup": {
      title: "Attendre environ 30 secondes",
      lead: "Showthrough crée votre stockage et votre backend vidéo. Gardez la page ouverte.",
      after: "Une fois terminé, vous revenez dans votre bibliothèque avec l’étape 1 marquée **Done**.",
    },
    "add-extension": {
      title: "Ajouter l’extension Chrome",
      lead: "C’est l’extension qui enregistre.",
      actions: ["Ouvrez [[Showthrough sur le Chrome Web Store|CHROME]].", "Cliquez sur **Add to Chrome** (Ajouter à Chrome)."],
      notes: [{ title: "Astuce", lines: ["Épinglez-la : cliquez sur l’icône puzzle dans la barre de Chrome, puis sur l’épingle à côté de Showthrough."] }],
    },
    "connect-extension": {
      title: "Connecter l’extension",
      lead: "Cela indique à l’extension où enregistrer vos vidéos. Aucune clé à copier.",
      actions: ["Dans votre bibliothèque, cliquez sur **Connect extension**.", "Vous verrez **Extension connected**."],
    },
    record: {
      title: "Enregistrer votre première vidéo",
      lead: "Tout est prêt. On enregistre.",
      actions: [
        "Cliquez sur **New video** dans votre bibliothèque, ou sur l’icône Showthrough dans la barre de Chrome.",
        "Choisissez votre caméra et votre micro, puis **Start recording**.",
        "Appuyez sur Stop quand vous avez fini. Le lien est copié pour vous.",
      ],
    },
    troubleshooting: {
      title: "Si quelque chose ne va pas",
      lead: "Les solutions habituelles. La plupart prennent quelques secondes.",
      notes: [
        { title: "« R2 isn’t turned on »", lines: ["Suivez l’étape [[Activer R2|#turn-on-r2]], puis cliquez de nouveau sur Connect Cloudflare."] },
        {
          title: "Mauvais compte Cloudflare connecté",
          lines: ["Allez dans Profile, cliquez sur Disconnect Cloudflare, puis reconnectez-vous. Sur la page Authorize, cliquez sur Edit pour choisir le bon compte."],
        },
        { title: "Connect extension ne trouve pas l’extension", lines: ["Vérifiez qu’elle est bien ajoutée à Chrome, puis rechargez votre bibliothèque et réessayez."] },
        { title: "Toujours bloqué ?", lines: ["Écrivez à {email}. Je réponds moi-même (en anglais)."] },
      ],
    },
  },
  alts: {
    "cloudflare-sign-up": "La page d’inscription Cloudflare, avec « Continue with Google » en haut",
    "r2-get-started": "La page R2 de Cloudflare, avec l’usage mensuel gratuit et le bouton « Add R2 subscription »",
    "r2-add-card": "La page « Activate R2 » : carte à gauche, 0 $ à payer aujourd’hui à droite",
    "connect-screen": "La bibliothèque Showthrough avec les trois étapes d’installation et le bouton « Connect Cloudflare »",
    authorize: "Cloudflare demande si Showthrough peut accéder à votre compte, avec le bouton « Authorize »",
    "setting-up": "Showthrough configure votre Cloudflare, quatre étapes se cochent",
    "chrome-web-store": "L’extension Showthrough sur le Chrome Web Store, avec le bouton « Add to Chrome »",
    "cloudflare-done": "La bibliothèque avec Cloudflare connecté et le bouton « Connect extension »",
    "extension-connected": "Showthrough confirme que l’extension est connectée",
    "new-video": "La bibliothèque avec toutes les étapes terminées et le bouton « New video »",
    "toolbar-icon": "L’icône Showthrough dans la barre d’outils de Chrome",
    "record-panel": "Le panneau Showthrough avec la caméra, le micro et le bouton « Start recording »",
  },
};
