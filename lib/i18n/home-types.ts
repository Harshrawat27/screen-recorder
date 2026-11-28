// The words on the home page, privacy, terms and setup guide shells, per language.
// Placeholders like {price} are filled in with fill() from lib/i18n.

export type HomeCopy = {
  meta: { title: string; description: string };
  nav: {
    how: string;
    pricing: string;
    guide: string;
    blog: string;
    chrome: string;
    signIn: string;
    startFree: string;
    cta: string; // the navbar button, kept short so it fits on phones
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    phoneNote: string;
    phoneSend: string;
    phoneCopied: string;
    phoneShareText: string;
    pillLabel: string;
    pillPrice: string; // {price}
    pillUpdates: string;
    pillAfterMac: string; // {mac}
    h1: string;
    line1: string;
    sayNo: string;
    items: { no: string; yes: string }[];
    sub: string;
    startFree: string;
    seeHow: string;
    freeLine: string;
    paidLead: string;
    paidLink: string; // {price}
    noSub: string;
    appsumo: string;
    cfLine: string;
    cfFaq: string;
  };
  features: {
    title: string;
    body: string;
    stop: { title: string; body: string };
    cloud: { title: string; body: string };
    price: { title: string; body: string }; // {price}
    bubble: { title: string; body: string };
    viewer: { title: string; body: string };
    safe: { title: string; body: string };
    team: { title: string; body: string };
    download: { title: string; body: string };
    talk: { title: string; body: string };
    soon: string;
    v: {
      stop: string;
      linkCopied: string;
      pasteIt: string;
      yourBrowser: string;
      records: string;
      yourCloudflare: string;
      stores: string;
      loomTeam: string;
      oursForever: string; // {name}
      noSignup: string;
      anyBrowser: string;
      safeRows: [string, string, string];
      you: string;
      admin: string;
      invite: string;
      teammate: string;
      savedTo: string;
      comment1: string;
      comment2: string;
      views: string;
    };
  };
  pricing: {
    title: string;
    body: string;
    free: string;
    forever: string;
    noCard: string;
    freeNote: string;
    startFree: string;
    freeIncludes: string[];
    paidHeading: string;
    macEverything: string; // first line of the $79 card
    savingsTitle: string; // heading above the Loom calculator
    tiers: { first100: { name: string; updates: string; note: string }; launch: { name: string; updates: string; note: string } };
    badges: { open: string; closed: string; ended: string; later: string };
    once: string;
    buy: string; // {price}
    laterButton: string;
    paidIncludes: string;
    included: string[];
    updatesBefore: string;
    updatesLink: string;
    updatesAfter: string; // {price} {mac}
    footnote: string;
  };
  savings: { people: string; loomOver: string; oursEver: string; keeps: string; note: string };
  faqTitle: string;
  faqs: { q: string; a: string }[];
  cta: { title: string; body: string; start: string; buy: string }; // body {price}, buy {price}
  footer: {
    tagline: string;
    product: string;
    compare: string;
    company: string;
    features: string;
    pricing: string;
    faq: string;
    roadmap: string;
    blog: string;
    guide: string;
    teamGuide: string;
    support: string;
    loomAlt: string;
    capAlt: string;
    vidyardAlt: string;
    screencastifyAlt: string;
    allAlts: string;
    about: string;
    privacy: string;
    terms: string;
    notAffiliated: string;
    language: string;
  };
  legal: { lastUpdated: string; translationNote: string; privacyTitle: string; termsTitle: string };
};
