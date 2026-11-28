// The translated setup guide: every step on one page. Text can use **bold**,
// [[label|href]] links and {email}. Screenshots are shared with the English guide.
export type GuideNote = { title: string; lines: string[] };
export type GuideStep = {
  title: string;
  lead: string;
  actions?: string[];
  notesBefore?: GuideNote[];
  actionsAfterShot?: string[]; // numbered on from `actions`, shown after the first screenshot
  after?: string;
  notes?: GuideNote[];
};
export type GuideSlug =
  | "create-cloudflare-account"
  | "turn-on-r2"
  | "connect-cloudflare"
  | "wait-for-setup"
  | "add-extension"
  | "connect-extension"
  | "record"
  | "troubleshooting";
export type GuideCopy = {
  title: string;
  description: string;
  lead: string;
  need: GuideNote;
  stepsTitle: string;
  step: string; // "Step {n}"
  english: string; // note that screenshots show the English interface
  steps: Record<GuideSlug, GuideStep>;
  alts: Record<string, string>;
};
