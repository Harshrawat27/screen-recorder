import type { LegalDoc } from "@/lib/i18n/legal-types";

export const privacyFr: LegalDoc = {
  title: "Politique de confidentialité",
  description:
    "Ce que Showthrough conserve, ce qu’il ne voit jamais, et comment fonctionnent l’analyse et les cookies. Vos vidéos restent dans votre propre compte Cloudflare, pas sur nos serveurs.",
  updated: "21 novembre 2026",
  intro: [
    "Showthrough est un enregistreur d’écran (un site web et une extension Chrome) conçu pour que vos enregistrements restent dans votre propre compte Cloudflare, pas dans le nôtre. Cette page explique ce que nous conservons, ce qui transite par nos services et ce que l’extension fait sur votre ordinateur.",
  ],
  sections: [
    {
      h: "Ce que nous conservons sur vous",
      ul: [
        "**Votre compte :** votre nom, votre adresse e-mail et votre photo de profil Google, pour vous connecter. Notre système de connexion conserve aussi les informations de connexion fournies par Google, utilisées uniquement pour vous connecter.",
        "**Un cookie de connexion** qui vous garde connecté sur notre site.",
        "**Votre achat :** votre offre, le montant et la devise payés, la date et l’identifiant de paiement de notre prestataire. Nous ne voyons et ne conservons jamais vos informations de carte.",
        "**Votre connexion Cloudflare :** l’identifiant et le nom de votre compte Cloudflare, le nom du bucket de stockage et l’adresse de la petite app vidéo (un Cloudflare Worker) installée dans votre compte, ainsi que la clé d’envoi de cette app. Cette clé permet à l’extension d’envoyer les enregistrements et à votre tableau de bord de les lister. Elle ne fonctionne qu’avec cette app vidéo et son stockage, pas avec le reste de votre compte Cloudflare.",
        "La date à laquelle vous avez connecté l’extension Chrome à votre compte.",
      ],
    },
    {
      h: "L’accès Cloudflare pendant l’installation",
      p: [
        "Quand vous cliquez sur « Connecter Cloudflare » (ou « Mettre à jour » quand une nouvelle version est disponible), Cloudflare nous donne un jeton d’accès temporaire. Notre serveur l’utilise une fois, pendant quelques secondes, pour créer ou mettre à jour votre bucket de stockage, votre base de données et votre app vidéo, puis le supprime. Nous ne le conservons pas et ne pouvons plus l’utiliser ensuite. Nous ne touchons à rien d’autre dans votre compte Cloudflare, comme vos sites, vos DNS ou votre facturation.",
      ],
    },
    {
      h: "Vos vidéos",
      ul: [
        "Les enregistrements, miniatures et détails des vidéos sont stockés dans votre compte Cloudflare, pas sur nos serveurs.",
        "Quand quelqu’un ouvre un lien de partage, la vidéo est diffusée depuis votre stockage Cloudflare via notre adresse média (media.showthrough.com), qui peut garder une copie en cache de courte durée pour accélérer la lecture.",
        "Quand vous ouvrez votre tableau de bord, notre serveur demande à votre app vidéo la liste de vos vidéos (titres, dates et durées) pour vous l’afficher. Nous ne conservons pas cette liste.",
        "Nous ne copions, ne conservons, ne regardons ni n’analysons vos vidéos.",
        "Les commentaires, réactions et nombres de vues sont stockés dans le compte Cloudflare du propriétaire de la vidéo (dans une base de données créée pendant l’installation), pas sur nos serveurs.",
        "Toute personne disposant d’un lien de partage peut regarder la vidéo. Ne partagez les liens qu’avec les personnes concernées.",
      ],
    },
    {
      h: "Commentaires, réactions et vues",
      ul: [
        "Vous devez vous connecter pour commenter ou réagir. Votre commentaire ou réaction est enregistré dans le Cloudflare du propriétaire de la vidéo avec votre nom, votre photo de profil et un identifiant de compte Showthrough, pour qu’il sache de qui il vient. Toute personne pouvant ouvrir la vidéo voit votre nom, votre photo et vos commentaires.",
        "Notre serveur transmet votre commentaire au Cloudflare du propriétaire et vérifie que vous êtes connecté ; il n’en garde pas de copie.",
        "Vous pouvez supprimer vos propres commentaires, et le propriétaire de la vidéo peut supprimer n’importe quel commentaire sur ses vidéos.",
        "Si vous avez un espace de travail Showthrough, les 25 dernières vidéos regardées et vos vidéos « À regarder plus tard » sont conservées dans votre propre base de données Cloudflare, pour que vous les retrouviez. Nous ne les conservons pas.",
        "Pour compter les vues, nous plaçons un cookie pendant 30 minutes après la lecture d’une vidéo, afin que le même navigateur ne soit pas compté deux fois. Les vues ne sont que des nombres ; nous n’enregistrons pas qui a regardé.",
      ],
    },
    {
      h: "L’extension Chrome",
      ul: [
        "Elle utilise votre écran, votre caméra et votre micro uniquement pendant l’installation ou un enregistrement, et seulement après votre autorisation dans Chrome.",
        "Les commandes d’enregistrement n’apparaissent que dans l’onglet où vous cliquez sur l’icône Showthrough. L’extension ne lit ni ne collecte le contenu des pages que vous visitez.",
        "Pendant l’enregistrement, des parties de la vidéo sont gardées dans le stockage de votre navigateur jusqu’à leur envoi vers votre Cloudflare. Si un envoi est interrompu, elles y restent pour qu’il puisse se terminer plus tard.",
        "Elle enregistre vos informations de connexion (l’adresse de votre app vidéo et sa clé d’envoi) ainsi que vos choix de caméra, de micro et d’audio dans votre navigateur.",
        "Les enregistrements sont envoyés uniquement vers l’app vidéo de votre propre compte Cloudflare.",
        "L’extension ne contient ni publicité, ni traceurs, ni outil d’analyse, et nous ne vendons ni ne partageons vos données.",
      ],
    },
    {
      h: "Notre site web",
      id: "analytics",
      ul: [
        "Nous utilisons Vercel Web Analytics pour compter les visites. Il n’utilise pas de cookies.",
        "Nous utilisons aussi PostHog pour comprendre comment notre site est utilisé : quelles pages sont visitées, où l’on clique, et comment on passe de la page d’accueil à l’inscription, à l’achat et à l’installation. PostHog place un cookie (nommé ph_…_posthog) et reçoit votre adresse IP, votre navigateur et les pages visitées. Il peut enregistrer votre visite sous forme de relecture des clics et du défilement, tout ce que vous tapez restant masqué. PostHog stocke ces données aux États-Unis et les traite selon sa propre politique de confidentialité. Il n’y a pas de publicité.",
        "Quand vous vous connectez, nous relions ces visites à votre compte Showthrough via un identifiant interne, jamais votre e-mail. Nous notons aussi quand vous achetez, connectez Cloudflare et connectez l’extension, pour voir où les gens bloquent.",
        "PostHog ne fonctionne pas sur les pages de vidéos partagées : les personnes qui regardent vos enregistrements ne sont pas suivies.",
        "Les visiteurs en Europe (UE, EEE, Royaume-Uni et Suisse) sont d’abord consultés, et PostHog ne se charge que s’ils choisissent « Autoriser ». Les autres peuvent le désactiver à tout moment : choisissez « Cookie settings » en bas de n’importe quelle page, puis « Decline », et le cookie PostHog est supprimé.",
        "Les personnes qui regardent un lien de partage n’ont pas besoin de compte. Comme pour tout site, nos hébergeurs (Vercel et Cloudflare) traitent des informations de base sur les requêtes, comme les adresses IP, pour livrer la page et la vidéo.",
      ],
    },
    {
      h: "Les services que nous utilisons",
      ul: [
        "Google, pour vous connecter.",
        "Dodo Payments, pour les paiements. Il reçoit votre nom et votre e-mail pour le paiement et les reçus.",
        "Vercel, pour héberger notre site et notre base de données.",
        "PostHog, pour l’analyse du site, comme décrit ci-dessus.",
        "Cloudflare, pour votre stockage et votre app vidéo (dans votre propre compte) et pour notre adresse média.",
      ],
    },
    {
      h: "Retirer l’accès et supprimer vos données",
      p: [
        "Vous pouvez supprimer l’app vidéo Showthrough et le bucket de stockage depuis votre tableau de bord Cloudflare à tout moment. La clé d’envoi que nous détenons cesse alors de fonctionner, tout comme vos liens de partage.",
        "Pour supprimer votre compte Showthrough et tout ce qui figure sous « Ce que nous conservons sur vous », écrivez à {email}. Vos vidéos sont dans votre compte Cloudflare : vous pouvez les y garder ou les supprimer.",
      ],
    },
    { h: "Contact", p: ["Des questions sur la confidentialité ? Écrivez à {email}."] },
  ],
};

export const termsFr: LegalDoc = {
  title: "Conditions d’utilisation",
  description: "Les conditions de Showthrough : licence, paiements, remboursement sous 7 jours, votre compte Cloudflare et vos contenus.",
  updated: "28 novembre 2026",
  intro: [
    "Ces conditions couvrent Showthrough : le site web, le tableau de bord, les pages de partage et l’extension Chrome. En utilisant Showthrough, vous les acceptez. Elles sont courtes exprès.",
  ],
  sections: [
    {
      h: "Votre licence",
      p: [
        "Showthrough est un achat unique, pas un abonnement. Votre paiement donne à votre équipe une licence d’utilisation de Showthrough tant que le produit existe.",
        "Les achats effectués à 29 $ ou 39 $ (y compris l’offre Black Friday et le prix à vie actuel de 39 $) incluent toutes les mises à jour futures. Si le prix change plus tard, par exemple à 79 $ au lancement de l’app Mac, les achats au nouveau prix pourront n’inclure que la version disponible au moment de l’achat, comme indiqué alors sur la page des tarifs ; cette version continue de fonctionner.",
      ],
    },
    {
      h: "Paiements et remboursements",
      p: [
        "Les paiements sont traités par Dodo Payments, qui agit en tant que vendeur officiel (merchant of record) et gère la facturation, les taxes et les reçus. Les prix sont affichés en dollars américains sur notre page des tarifs.",
        "Vous pouvez demander un remboursement dans les 7 jours suivant votre achat. Après 7 jours, aucun remboursement n’est possible. Pour le demander, écrivez à {email} depuis l’adresse utilisée pour l’achat. Les remboursements sont versés via Dodo Payments sur votre moyen de paiement d’origine. Un achat remboursé met fin à votre licence.",
        "Acheté sur AppSumo ? AppSumo gère votre remboursement selon sa propre politique. Un code remboursé met fin à votre licence.",
      ],
    },
    {
      h: "Votre compte Cloudflare",
      p: [
        "Les enregistrements sont stockés dans votre propre compte Cloudflare. Vous êtes responsable de ce compte, y compris des frais que Cloudflare vous facture au-delà de son offre gratuite, et de son maintien actif. Si vous supprimez l’app vidéo ou le stockage Showthrough dans Cloudflare, vos enregistrements et liens de partage cessent de fonctionner.",
      ],
    },
    {
      h: "Vos contenus",
      p: [
        "Vos enregistrements vous appartiennent. N’utilisez pas Showthrough pour enregistrer ou partager quoi que ce soit d’illégal, quelque chose que vous n’avez pas le droit de partager, ou une personne qui n’a pas accepté d’être enregistrée lorsque la loi exige son consentement. Toute personne disposant d’un lien peut regarder la vidéo : partagez vos liens avec soin.",
      ],
    },
    { h: "Usage abusif", p: ["Nous pouvons suspendre ou fermer un compte qui enfreint ces conditions ou utilise Showthrough pour nuire à autrui."] },
    {
      h: "Absence de garantie",
      p: [
        "Showthrough est fourni tel quel. Nous faisons tout pour qu’il reste fiable, mais nous ne pouvons pas garantir qu’il sera toujours disponible ou exempt de bugs. Dans les limites permises par la loi, nous ne sommes pas responsables des enregistrements perdus ni d’autres pertes indirectes, et notre responsabilité totale est limitée au montant que vous nous avez payé.",
      ],
    },
    { h: "Modifications", p: ["Nous pouvons mettre à jour ces conditions à mesure que Showthrough évolue. Le cas échéant, nous mettrons à jour la date en haut de cette page."] },
    { h: "Contact", p: ["Des questions ? Écrivez à {email}."] },
  ],
};
