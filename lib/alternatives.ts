// Comparison pages at /alternatives/<slug>. One entry per competitor.
//
// Rules for this file (they keep the pages honest and indexable):
// - Every price and limit comes from the competitor's own pricing page, checked on the date in `checked`.
//   Re-check before changing a number, and update `checked` and `updated` when you do.
// - Each page is written for that product. Don't copy rows between entries: pages that only swap
//   the competitor's name get skipped by Google as duplicates.
// - Showthrough features that aren't built yet are written as "coming soon", never as available.
// - "{price}" in any Showthrough text is replaced with the live price on the page.

export type Alternative = {
  slug: string;
  name: string;
  pricingUrl: string;
  /** When the prices on this page were read from the vendor's pricing page. */
  checked: string;
  /** Last content change, for the sitemap (YYYY-MM-DD). */
  updated: string;
  /** Meta title, without the " | Showthrough" suffix. Keep it under ~55 characters. */
  title: string;
  /** Meta description, 140 to 160 characters. */
  description: string;
  h1: string;
  intro: string[];
  /** One line for the /alternatives hub. */
  summary: string;
  freePlan: string;
  paidFrom: string;
  bestFor: string;
  pricing: { plan: string; price: string; notes: string }[];
  pricingNote?: string;
  rows: { label: string; them: string; us: string }[];
  theyWin: string[];
  weWin: string[];
  pickThem: string;
  pickUs: string;
  faqs: { q: string; a: string }[];
};

export const alternatives: Alternative[] = [
  {
    slug: "loom",
    name: "Loom",
    pricingUrl: "https://www.loom.com/pricing",
    checked: "10 November 2026",
    updated: "2026-11-10",
    title: "Loom alternative you pay for once, with no limits",
    description:
      "Showthrough vs Loom: no 25-video or 5-minute cap, no per-user bill, and videos stored in your own Cloudflare. An honest comparison, including what Loom does better.",
    h1: "A Loom alternative with no video limits and no monthly bill",
    intro: [
      "Loom made sending a quick screen recording normal. Its free Starter plan now stops at 25 videos per person and 5 minutes per screen recording, and the paid Business plan costs $18 per user every month.",
      "Showthrough records your screen, camera and voice from Chrome and copies the link the moment you stop, like Loom. The difference is how you pay and where the videos live: one payment instead of a subscription, and every recording stored in your own Cloudflare account.",
    ],
    summary: "The best-known async video tool. Polished, with AI and apps everywhere, but billed per user every month.",
    freePlan: "25 videos per person, 5 minutes each, 720p",
    paidFrom: "$18 per user per month",
    bestFor: "Teams that want AI summaries and a desktop and mobile app",
    pricing: [
      { plan: "Starter", price: "Free", notes: "25 videos per person, 5-minute screen recordings, up to 720p, up to 50 members" },
      { plan: "Business", price: "$18 per user per month", notes: "Unlimited videos and recording length. Annual billing saves up to 17%." },
      { plan: "Business + AI", price: "$24 per user per month", notes: "Adds Loom AI: titles, summaries, chapters, filler word removal and more" },
      { plan: "Enterprise", price: "Contact sales", notes: "Everything in Business + AI, with enterprise controls" },
    ],
    pricingNote:
      "On Business at monthly billing, a team of 5 pays 5 × $18 × 12 = $1,080 a year, and the bill grows with every person you add.",
    rows: [
      { label: "How you pay", them: "Per user, every month", us: "One payment ({price})" },
      { label: "Free plan", them: "25 videos per person, 5 minutes each", us: "No free plan" },
      { label: "Videos and length", them: "Unlimited on Business", us: "Unlimited, no time limit" },
      { label: "Where videos are stored", them: "Loom's servers", us: "Your own Cloudflare account" },
      { label: "Link ready when you stop", them: "Yes", us: "Yes, the video uploads while you record" },
      { label: "Apps", them: "Mac, Windows, iOS, Android, Chrome", us: "Chrome on Mac, Windows, Linux and ChromeOS. Mac app coming soon." },
      { label: "AI titles and summaries", them: "On Business + AI", us: "Coming soon" },
      { label: "Editing", them: "Trim and edit in Loom", us: "Coming soon" },
      { label: "Comments and reactions", them: "Yes", us: "Yes, pinned to the moment in the video" },
      { label: "Password-protected links", them: "Yes", us: "Coming soon" },
      { label: "Team library and invites", them: "Yes", us: "Coming soon, at no extra cost" },
    ],
    theyWin: [
      "Loom AI writes titles, summaries and chapters and removes filler words. Showthrough has no AI yet.",
      "Loom has desktop and mobile apps. Showthrough records from Chrome only for now.",
      "Loom has editing, viewer insights, password-protected links and deep Slack and Atlassian integrations. These are on Showthrough's roadmap, not built.",
      "Loom has a free plan you can start on today. Showthrough is paid from day one.",
    ],
    weWin: [
      "You pay once instead of per user, per month. The price doesn't grow as your team does.",
      "No cap on the number of videos or their length, ever. The only limit is your own Cloudflare storage.",
      "Your recordings live in your own Cloudflare account. If you stop using Showthrough, the videos are still yours.",
      "Cloudflare's free plan includes 10 GB of storage, and viewing is always free, so most small teams pay Cloudflare nothing.",
    ],
    pickThem:
      "Pick Loom if you need AI summaries, a mobile app or a video editor today, or if your company already runs on Atlassian.",
    pickUs:
      "Pick Showthrough if you mostly send quick walkthroughs and updates, want to stop paying per person, and like owning your videos.",
    faqs: [
      {
        q: "Is Loom free?",
        a: "Loom's Starter plan is free, but it limits each person to 25 videos and each screen recording to 5 minutes, at up to 720p. Removing those limits means the Business plan at $18 per user per month.",
      },
      {
        q: "How much does Loom cost for a team?",
        a: "Business is $18 per user per month on monthly billing, so 5 people pay $90 a month, or $1,080 a year. Annual billing saves up to 17%.",
      },
      {
        q: "Can Showthrough import my Loom videos?",
        a: "Not yet. Import from Loom is on the roadmap. Until then, you can keep your Loom account for old videos and record new ones with Showthrough.",
      },
      {
        q: "Do viewers need an account to watch?",
        a: "No. Anyone with a Showthrough link can watch in any browser, on any device. Viewers only sign in with Google if they want to leave a comment.",
      },
    ],
  },
  {
    slug: "vidyard",
    name: "Vidyard",
    pricingUrl: "https://www.vidyard.com/pricing/",
    checked: "10 November 2026",
    updated: "2026-11-10",
    title: "Vidyard alternative for freelancers and small teams",
    description:
      "Showthrough vs Vidyard: Vidyard is built for sales teams and CRM tracking. Showthrough is a simple pay-once recorder for client updates and walkthroughs.",
    h1: "A simpler Vidyard alternative for client updates, not sales sequences",
    intro: [
      "Vidyard is a video platform for sales teams. Its strengths are CRM integrations, viewer analytics, calls to action and AI avatars, and most of its paid plans need a conversation with sales.",
      "If you are a freelancer, an agency or a small team that just needs to record a walkthrough and send a link, most of that goes unused. Showthrough does the recording and sharing part, for one payment.",
    ],
    summary: "A video platform for sales teams, with CRM tracking, analytics and AI avatars.",
    freePlan: "5 recordings a month, up to 30 minutes each",
    paidFrom: "Not listed publicly",
    bestFor: "Sales teams that track video views in their CRM",
    pricing: [
      { plan: "Free", price: "Free", notes: "5 recordings a month, up to 30 minutes each, 15 AI videos, limited integrations" },
      { plan: "Starter", price: "Not listed", notes: "Unlimited recordings, full video analytics, CTAs, password-protected videos. 14-day trial." },
      { plan: "Teams", price: "Custom pricing", notes: "CRM and marketing automation integrations, captions, advanced analytics" },
      { plan: "Enterprise", price: "Custom pricing", notes: "SSO, API access, custom security" },
    ],
    pricingNote: "Vidyard's pricing page shows no dollar amounts. It says annual billing saves 30% and that licences are per seat.",
    rows: [
      { label: "Built for", them: "Sales prospecting and outreach", us: "Async updates, client walkthroughs, bug reports" },
      { label: "How you pay", them: "Per seat; Teams and up through sales", us: "One payment ({price}), no sales call" },
      { label: "Free plan", them: "5 recordings a month", us: "No free plan" },
      { label: "Recording limit", them: "30 minutes on Free", us: "No time limit" },
      { label: "CRM integrations", them: "Salesforce, HubSpot, Marketo, Salesloft and more", us: "None" },
      { label: "Viewer analytics", them: "Full analytics on paid plans", us: "View counts. Who watched and how far: coming soon." },
      { label: "AI videos and avatars", them: "Yes", us: "No" },
      { label: "Where videos are stored", them: "Vidyard's servers", us: "Your own Cloudflare account" },
    ],
    theyWin: [
      "Vidyard connects to Salesforce, HubSpot and other sales tools and logs who watched. Showthrough has no CRM integrations.",
      "Vidyard has detailed viewer analytics, calls to action and branded sharing pages.",
      "Vidyard can generate AI videos and avatars. Showthrough records real screens and cameras only.",
    ],
    weWin: [
      "The price is on the page and you pay it once. No seat count and no sales call.",
      "No limit on how many videos you record or how long they run.",
      "Videos stay in your own Cloudflare account, which matters when the recordings show client work.",
      "Fewer moving parts: click the icon, record, and the link is copied when you stop.",
    ],
    pickThem: "Pick Vidyard if you run sales outreach and need video views tracked in your CRM.",
    pickUs: "Pick Showthrough if you send updates and walkthroughs to clients or teammates and don't want a sales tool.",
    faqs: [
      {
        q: "Is Vidyard free?",
        a: "Vidyard has a free plan with 5 recordings a month, each up to 30 minutes. Paid plans add unlimited recordings and analytics; Vidyard doesn't list their prices on its pricing page.",
      },
      {
        q: "Does Showthrough show who watched my video?",
        a: "Showthrough shows view counts today. Seeing who watched and how far they got is on the roadmap.",
      },
      {
        q: "Can I use Showthrough for sales outreach?",
        a: "You can record and send a link to anyone, and they can watch without an account. There are no CRM integrations or email tracking, so for a full sales workflow Vidyard is the better fit.",
      },
    ],
  },
  {
    slug: "screencastify",
    name: "Screencastify",
    pricingUrl: "https://www.screencastify.com/pricing",
    checked: "10 November 2026",
    updated: "2026-11-10",
    title: "Screencastify alternative with no time limit",
    description:
      "Showthrough vs Screencastify: both record from Chrome. Screencastify caps free videos at 10 and 30 minutes; Showthrough has no caps and you pay once.",
    h1: "A Screencastify alternative with no video cap or time limit",
    intro: [
      "Screencastify and Showthrough are both Chrome screen recorders, so this is a close comparison. Screencastify is built around education: quizzes, assignments and grade sync for schools.",
      "Its free plan allows 10 videos of up to 30 minutes, with a watermark, and paid plans are billed per user. Showthrough has no video count, no time limit and no watermark, and you pay once.",
    ],
    summary: "A Chrome recorder built for classrooms, with quizzes, assignments and LMS grade sync.",
    freePlan: "10 videos, 30 minutes each, watermark",
    paidFrom: "$7 per user per month, billed annually",
    bestFor: "Teachers and schools",
    pricing: [
      { plan: "Free", price: "Free", notes: "Up to 10 videos, 30-minute recordings, Castify watermark" },
      { plan: "Starter", price: "$7 per user per month annually, or $18 monthly", notes: "Unlimited videos, 60-minute recordings, no watermark on new videos" },
      { plan: "Pro", price: "$10 per user per month annually, or $24 monthly", notes: "180-minute recordings, AI features, captions, transcripts, LMS grade sync" },
      { plan: "Enterprise & EDU", price: "Custom", notes: "For schools, districts and organisations" },
    ],
    rows: [
      { label: "Works as", them: "Chrome extension", us: "Chrome extension" },
      { label: "Built for", them: "Classrooms and schools", us: "Freelancers, agencies and small teams" },
      { label: "How you pay", them: "Per user, monthly or yearly", us: "One payment ({price})" },
      { label: "Number of videos", them: "10 on Free, unlimited on paid", us: "Unlimited" },
      { label: "Recording length", them: "30, 60 or 180 minutes depending on plan", us: "No limit" },
      { label: "Watermark", them: "On the free plan", us: "Never" },
      { label: "Quizzes and assignments", them: "Yes, with LMS grade sync", us: "No" },
      { label: "Editing and captions", them: "Editing on all plans; captions on Pro", us: "Coming soon" },
      { label: "Where videos are stored", them: "Screencastify's servers", us: "Your own Cloudflare account" },
    ],
    theyWin: [
      "Screencastify has tools for teaching: questions inside videos, assignments, and grade sync with an LMS.",
      "It includes editing tools, a teleprompter and, on Pro, captions, transcripts and translations.",
      "It has a free plan and education pricing for schools.",
    ],
    weWin: [
      "No recording time limit on any plan. Screencastify stops at 30, 60 or 180 minutes depending on what you pay.",
      "One payment instead of a per-user subscription.",
      "No watermark, ever.",
      "The video uploads while you record, so the link works the second you stop.",
    ],
    pickThem: "Pick Screencastify if you teach and want quizzes, assignments and grade sync built in.",
    pickUs: "Pick Showthrough if you record for clients or a team, need long recordings, and want to stop paying monthly.",
    faqs: [
      {
        q: "What is Screencastify's time limit?",
        a: "30 minutes per recording on the free plan, 60 minutes on Starter and 180 minutes on Pro. Showthrough has no time limit.",
      },
      {
        q: "Does Showthrough add a watermark?",
        a: "No. Showthrough never adds a watermark to your videos.",
      },
      {
        q: "Does Showthrough work on a Chromebook?",
        a: "Yes. Showthrough is a Chrome extension, so it works on ChromeOS as well as Mac, Windows and Linux.",
      },
    ],
  },
  {
    slug: "snagit",
    name: "Snagit",
    pricingUrl: "https://www.techsmith.com/store/snagit",
    checked: "10 November 2026",
    updated: "2026-11-10",
    title: "Snagit alternative for screen recording and sharing",
    description:
      "Showthrough vs Snagit: Snagit is a desktop screenshot tool with a yearly subscription. Showthrough records screen and camera from Chrome and shares a link instantly.",
    h1: "A Snagit alternative for recording and sharing video",
    intro: [
      "Snagit is mainly a screenshot tool. It is excellent at capturing, annotating and turning screenshots into step-by-step guides, and it is now sold as a yearly subscription for Mac and Windows.",
      "Showthrough does a different job: it records your screen, camera and voice and gives you a share link the moment you stop. Many people will want both. This page is for the video side.",
    ],
    summary: "A desktop screenshot and annotation tool, sold as a yearly subscription.",
    freePlan: "None; 14-day money-back guarantee",
    paidFrom: "$39 per user per year",
    bestFor: "Annotated screenshots and step-by-step guides",
    pricing: [
      { plan: "Individual", price: "$39 per user per year", notes: "Yearly subscription, non-transferable. Mac and Windows." },
      { plan: "Snagit with Camtasia", price: "From $39 per user per year", notes: "Bundles with TechSmith's video editor" },
    ],
    pricingNote: "TechSmith's store lists subscriptions only and a 14-day money-back guarantee.",
    rows: [
      { label: "Main job", them: "Screenshots, annotation and guides", us: "Screen and camera recording with instant links" },
      { label: "How you pay", them: "Every year, per user", us: "One payment ({price})" },
      { label: "Runs on", them: "Mac and Windows desktop app", us: "Chrome on Mac, Windows, Linux and ChromeOS" },
      { label: "Screenshots", them: "Yes, its strength", us: "No" },
      { label: "Share link", them: "Through TechSmith's hosting", us: "Copied the moment you stop" },
      { label: "Where videos are stored", them: "Your computer or TechSmith's hosting", us: "Your own Cloudflare account" },
    ],
    theyWin: [
      "Snagit is one of the best screenshot tools: scrolling capture, annotation, blur, and templates for guides. Showthrough takes no screenshots.",
      "It works offline as a desktop app.",
      "It pairs with Camtasia if you need a full video editor.",
    ],
    weWin: [
      "Built for video messages: the link is copied the moment you stop, and viewers watch in any browser.",
      "Viewers can comment at the exact moment in the video and react with emoji.",
      "One payment instead of a yearly renewal.",
      "Works on Chromebooks and Linux, anywhere Chrome runs.",
    ],
    pickThem: "Keep Snagit if most of what you send is screenshots and written guides.",
    pickUs: "Add Showthrough if you'd rather show something in a two-minute video than write it up.",
    faqs: [
      {
        q: "Is Snagit a one-time purchase?",
        a: "TechSmith now sells Snagit as a subscription: $39 per user per year for an individual licence, according to its store page.",
      },
      {
        q: "Can Showthrough take screenshots?",
        a: "No. Showthrough records video only. For screenshots, a tool like Snagit is still the better choice.",
      },
      {
        q: "Do I need to install an app?",
        a: "No desktop app. Showthrough is a Chrome extension: add it from the Chrome Web Store and click the icon on any tab to record.",
      },
    ],
  },
  {
    slug: "tella",
    name: "Tella",
    pricingUrl: "https://www.tella.com/pricing",
    checked: "10 November 2026",
    updated: "2026-11-10",
    title: "Tella alternative for quick, unedited recordings",
    description:
      "Showthrough vs Tella: Tella is a recorder and editor for polished videos with no free plan. Showthrough is for quick recordings you share the moment you stop.",
    h1: "A Tella alternative for videos you send in two minutes, not polish for an hour",
    intro: [
      "Tella is a recorder and editor for polished videos: layouts, auto zoom, transcript editing and an AI editor. It is a good choice for product demos and course lessons.",
      "A lot of screen recording is not that. It's a quick walkthrough for a client or a bug report for a developer. Showthrough skips the editing step and gives you the link the moment you stop.",
    ],
    summary: "A recorder and editor for polished demos and lessons, with an AI editor.",
    freePlan: "None; 7-day free trial",
    paidFrom: "$13 per user per month, billed annually",
    bestFor: "Edited product demos, launch videos and courses",
    pricing: [
      { plan: "Pro", price: "$13 per user per month, billed annually", notes: "4K export, transcription, team collaboration, analytics" },
      { plan: "Premium", price: "$19 per user per month, billed annually", notes: "Custom domain, remove Tella branding, 60 fps export, advanced analytics" },
      { plan: "Enterprise", price: "Contact sales", notes: "SSO and SCIM, SOC 2 report" },
    ],
    pricingNote: "Tella has no free plan; new accounts get a 7-day free trial. Its page lists annual prices only.",
    rows: [
      { label: "Built for", them: "Polished, edited videos", us: "Quick recordings shared instantly" },
      { label: "How you pay", them: "Per user, billed annually", us: "One payment ({price})" },
      { label: "Free plan", them: "No, 7-day trial", us: "No free plan" },
      { label: "Editing", them: "Timeline, transcript and AI editing", us: "Coming soon" },
      { label: "Recording length", them: "6 hours per clip", us: "No limit" },
      { label: "Runs on", them: "Mac and Windows apps, Chrome extension", us: "Chrome on Mac, Windows, Linux and ChromeOS" },
      { label: "Custom domain for links", them: "On Premium", us: "Coming soon" },
      { label: "Where videos are stored", them: "Tella's servers", us: "Your own Cloudflare account" },
    ],
    theyWin: [
      "Tella's editor is the main reason to use it: cut by editing the transcript, remove filler words, add layouts and zooms.",
      "It exports in 4K and has native Mac and Windows recorders.",
      "Premium puts share links on your own domain. On Showthrough that is still coming soon.",
    ],
    weWin: [
      "No editing step. Press Finish and the link is already in your clipboard.",
      "One payment instead of a yearly per-user plan.",
      "Videos live in your own Cloudflare account.",
    ],
    pickThem: "Pick Tella if your videos are published pieces, like product demos, launch videos or lessons, and you want to edit them.",
    pickUs: "Pick Showthrough if most of your recordings are quick updates for clients and teammates that don't need editing.",
    faqs: [
      {
        q: "Does Tella have a free plan?",
        a: "No. Tella offers a 7-day free trial, then plans start at $13 per user per month, billed annually.",
      },
      {
        q: "Can I edit videos in Showthrough?",
        a: "Not yet. You can pause, restart a take or delete it while recording. Trim and cut are on the roadmap.",
      },
      {
        q: "Can I use both?",
        a: "Yes. Some people use Tella for polished videos they publish and a quick recorder for everyday updates.",
      },
    ],
  },
  {
    slug: "zight",
    name: "Zight",
    pricingUrl: "https://zight.com/pricing/",
    checked: "10 November 2026",
    updated: "2026-11-10",
    title: "Zight alternative with no 5-minute limit",
    description:
      "Showthrough vs Zight (formerly CloudApp): Zight's free plan caps recordings at 5 minutes and 1 GB. Showthrough has no time limit and you pay once.",
    h1: "A Zight alternative for longer recordings, paid for once",
    intro: [
      "Zight, formerly CloudApp, does screenshots, GIFs and screen recordings in one app, with annotations and AI on paid plans. It runs on Mac, Windows, iOS, Android and Chrome.",
      "Its free plan stops at 5-minute recordings, 720p and 1 GB of storage. Paid plans are billed per user. Showthrough only does video, with no time limit and one payment.",
    ],
    summary: "Screenshots, GIFs and screen recordings in one app, formerly CloudApp.",
    freePlan: "5-minute recordings, 720p, 1 GB",
    paidFrom: "$9.95 per user per month, billed annually",
    bestFor: "Teams that want screenshots, GIFs and video in one tool",
    pricing: [
      { plan: "Share", price: "Free", notes: "5-minute recordings, 720p, 1 user, 1 GB storage, last 50 captures" },
      { plan: "Create", price: "$9.95 per user per month, billed annually", notes: "Up to 4K, unlimited length, AI transcription and titles, 2 users, 5 GB" },
      { plan: "Collaborate", price: "$12 per user per month, billed annually", notes: "Up to 100 users, branding, password-protected items, unlimited AI" },
      { plan: "Scale", price: "Custom", notes: "SSO, HIPAA, custom S3 storage" },
    ],
    pricingNote: "Zight's page shows annual prices and says annual billing saves 20% over monthly.",
    rows: [
      { label: "Captures", them: "Screenshots, GIFs and video", us: "Video only" },
      { label: "How you pay", them: "Per user, monthly or yearly", us: "One payment ({price})" },
      { label: "Recording length", them: "5 minutes on Free, unlimited on paid", us: "No limit" },
      { label: "Storage", them: "1 GB free, 5 GB on Create", us: "Your Cloudflare: 10 GB free, then about $0.015 per GB a month" },
      { label: "Your own storage", them: "Custom S3 on the Scale plan only", us: "Always: your own Cloudflare account" },
      { label: "AI features", them: "On paid plans", us: "Coming soon" },
      { label: "Runs on", them: "Mac, Windows, iOS, Android, Chrome", us: "Chrome on Mac, Windows, Linux and ChromeOS" },
    ],
    theyWin: [
      "Zight does screenshots, annotated images and GIFs as well as video. Showthrough only records video.",
      "It has desktop and mobile apps.",
      "Paid plans include AI transcription, titles and summaries, and password-protected items.",
    ],
    weWin: [
      "Storing videos in your own cloud is the default, not an enterprise add-on.",
      "No 5-minute limit and no storage cap beyond your own Cloudflare account.",
      "One payment instead of a per-user subscription.",
    ],
    pickThem: "Pick Zight if you want one tool for screenshots, GIFs and video, or need its mobile apps.",
    pickUs: "Pick Showthrough if video is what you send, and you want long recordings stored in your own account.",
    faqs: [
      {
        q: "Is Zight the same as CloudApp?",
        a: "Yes. CloudApp renamed itself Zight. The product does screenshots, GIFs and screen recordings.",
      },
      {
        q: "What is Zight's free plan limit?",
        a: "Zight's free Share plan allows recordings up to 5 minutes at 720p, with 1 GB of storage and the last 50 captures kept.",
      },
      {
        q: "How much storage do I get with Showthrough?",
        a: "Videos go to your own Cloudflare account. Cloudflare's free plan includes 10 GB, and viewing is always free. Past 10 GB, Cloudflare charges about $0.015 per GB a month.",
      },
    ],
  },
  {
    slug: "screenpal",
    name: "ScreenPal",
    pricingUrl: "https://screenpal.com/plans",
    checked: "10 November 2026",
    updated: "2026-11-10",
    title: "ScreenPal alternative with instant share links",
    description:
      "Showthrough vs ScreenPal (formerly Screencast-O-Matic): ScreenPal is a low-cost recorder and editor. Showthrough records from Chrome and the link is ready when you stop.",
    h1: "A ScreenPal alternative for instant share links",
    intro: [
      "ScreenPal, formerly Screencast-O-Matic, is a low-cost recorder with a video editor, hosting, quizzes and a stock library. It is popular with teachers and people making tutorials.",
      "Its free plan limits each recording to 15 minutes. Showthrough has no time limit and no editor yet: it is built for recordings you share straight away.",
    ],
    summary: "A low-cost recorder and editor, formerly Screencast-O-Matic.",
    freePlan: "15-minute recording limit",
    paidFrom: "A few dollars a month, billed annually",
    bestFor: "Tutorials and lessons on a small budget",
    pricing: [
      { plan: "Free", price: "Free", notes: "15-minute limit per recording, unlimited number of recordings" },
      { plan: "Solo plans (Deluxe, Premier, Max)", price: "From a few dollars a month, billed annually", notes: "No recording limit, editing tools, more hosting and stock assets" },
      { plan: "Team Business", price: "Per user", notes: "Team features and admin" },
    ],
    pricingNote:
      "ScreenPal's plans page shows sale prices that change often, so check it for today's numbers. The 15-minute free limit is confirmed in ScreenPal's help centre.",
    rows: [
      { label: "Built for", them: "Tutorials, lessons, edited videos", us: "Quick updates and walkthroughs" },
      { label: "How you pay", them: "Yearly or monthly subscription", us: "One payment ({price})" },
      { label: "Recording length", them: "15 minutes on Free, unlimited on paid", us: "No limit" },
      { label: "Editor", them: "Yes", us: "Coming soon" },
      { label: "Quizzes and stock library", them: "Yes", us: "No" },
      { label: "Where videos are stored", them: "ScreenPal's hosting", us: "Your own Cloudflare account" },
    ],
    theyWin: [
      "ScreenPal includes a video editor, a stock library, screenshots and quizzes.",
      "Its paid plans are among the cheapest recurring plans in this category.",
      "It has a free plan.",
    ],
    weWin: [
      "The link works the second you stop recording, because the video uploads while you talk.",
      "Viewers comment at the exact moment and react with emoji, with no account needed to watch.",
      "One payment and your videos stay in your own Cloudflare account.",
    ],
    pickThem: "Pick ScreenPal if you make edited tutorials or lessons and want the lowest monthly cost.",
    pickUs: "Pick Showthrough if you send recordings to clients and teammates and want them out the door instantly.",
    faqs: [
      {
        q: "Is ScreenPal the same as Screencast-O-Matic?",
        a: "Yes. Screencast-O-Matic renamed itself ScreenPal.",
      },
      {
        q: "What is ScreenPal's free time limit?",
        a: "ScreenPal's free plan limits each recording to 15 minutes, according to its help centre. Paid plans remove the limit.",
      },
      {
        q: "Does Showthrough have a time limit?",
        a: "No. Record as long as you like. The only limit is the storage in your own Cloudflare account.",
      },
    ],
  },
  {
    slug: "cap",
    name: "Cap",
    pricingUrl: "https://cap.so/pricing",
    checked: "10 November 2026",
    updated: "2026-11-10",
    title: "Cap alternative: own your videos without self-hosting",
    description:
      "Showthrough vs Cap: Cap is an open-source recorder you can self-host. Showthrough puts videos in your own Cloudflare in one click, for one payment for the whole team.",
    h1: "A Cap alternative: your own storage, without running servers",
    intro: [
      "Cap is an open-source screen recorder for Mac, Windows and Linux, with a good editor. You can self-host it, or pay for Cap Pro to use cloud sharing and your own S3 bucket.",
      "Showthrough starts from the same idea, that you should own your recordings, and makes it one click. It sets up storage in your own Cloudflare account for you, with no servers to run.",
    ],
    summary: "An open-source recorder for Mac, Windows and Linux that you can self-host.",
    freePlan: "Personal use; 25 share links a month, 5 minutes each",
    paidFrom: "$58 one-time per user (desktop) or $8.16 per user per month (Pro)",
    bestFor: "Developers who want open source and a desktop editor",
    pricing: [
      { plan: "Free", price: "Free", notes: "Personal use only. 25 shareable links a month, up to 5 minutes each." },
      { plan: "Desktop License", price: "$29 per year or $58 one-time, per user", notes: "Commercial use of the desktop app. Cloud sharing and custom storage are not included." },
      { plan: "Cap Pro", price: "$12 per user per month, or $8.16 billed annually", notes: "Cloud sharing, AI features, your own S3 bucket" },
    ],
    rows: [
      { label: "Open source", them: "Yes, on GitHub", us: "No" },
      { label: "Runs on", them: "Mac, Windows and Linux desktop app", us: "Chrome on Mac, Windows, Linux and ChromeOS" },
      { label: "Your own storage", them: "Self-host, or your S3 bucket on Cap Pro", us: "Your Cloudflare, set up in one click" },
      { label: "How you pay for sharing", them: "Per user: Cap Pro subscription", us: "One payment ({price})" },
      { label: "Share link limits", them: "25 a month, 5 minutes each on Free", us: "None" },
      { label: "Editor", them: "Yes, Studio Mode", us: "Coming soon" },
      { label: "AI features", them: "On Cap Pro", us: "Coming soon" },
    ],
    theyWin: [
      "Cap is open source. You can read the code and run the whole thing yourself.",
      "It is a desktop app with a full editor and 4K export.",
      "Its Desktop License is a one-time purchase if you only need local recordings.",
    ],
    weWin: [
      "Owning your videos takes one click: Showthrough creates the storage, video app and database inside your own Cloudflare account. No servers to run or update.",
      "Sharing isn't billed per user per month. One payment covers sharing too.",
      "Nothing to install beyond a Chrome extension, so it works on Chromebooks.",
    ],
    pickThem: "Pick Cap if open source matters to you, you want a desktop editor, or you're happy to self-host.",
    pickUs: "Pick Showthrough if you want your videos in your own cloud without running anything, and one price for sharing.",
    faqs: [
      {
        q: "Is Showthrough open source?",
        a: "No. Showthrough isn't open source, but your videos, titles, comments and views live in your own Cloudflare account, not on our servers.",
      },
      {
        q: "Does Cap have a lifetime licence?",
        a: "Cap sells a Desktop License for $58 one-time per user. It covers commercial use of the desktop app; cloud sharing and custom storage need Cap Pro, a monthly or yearly plan.",
      },
      {
        q: "What does Showthrough set up in my Cloudflare?",
        a: "Private R2 storage for videos, a small video Worker, and a D1 database. You don't set any of it up yourself: it's one click to sign in to Cloudflare and press Allow, and we handle the rest in about 30 seconds.",
      },
    ],
  },
];

export function getAlternative(slug: string) {
  return alternatives.find((a) => a.slug === slug);
}
