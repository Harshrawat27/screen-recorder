// The visitor's country, asked once per page load and shared by everything that needs it
// (the cookie banner, country offers). Browser only.

export type Region = { ask: boolean; country: string };

let pending: Promise<Region> | null = null;

export function getRegion(): Promise<Region> {
  pending ??= fetch("/api/consent-region")
    .then((res) => res.json() as Promise<Partial<Region>>)
    .then((data) => ({ ask: Boolean(data.ask), country: String(data.country ?? "") }))
    .catch(() => {
      pending = null;
      return { ask: false, country: "" };
    });
  return pending;
}
