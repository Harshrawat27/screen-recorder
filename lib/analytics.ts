// Product analytics with PostHog (US cloud). The project key is public by design: it can only
// send events, not read them. Browsers talk to PostHog through our own /ingest path (see
// next.config.ts), so ad blockers don't hide visits.

export const POSTHOG_KEY = "phc_m2KVKmsFQRg5z36E7h53DtSEVKem9tzrrAA3L4NvonxH";
export const POSTHOG_HOST = "https://us.i.posthog.com";
export const POSTHOG_ASSETS = "https://us-assets.i.posthog.com";
export const POSTHOG_UI = "https://us.posthog.com";

/** Pages PostHog never runs on: shared videos belong to our customers' viewers, not our visitors. */
// Share pages and embeds (which run on other people's websites) aren't tracked and show no cookie banner.
export const untracked = (path: string) => path.startsWith("/v/") || path.startsWith("/embed/");

/**
 * Records something that happened on the server (a purchase, a connection) against a signed-in
 * account. Uses the account's internal id, never the email. Never throws: analytics must not
 * break a payment or a setup step. `id` makes a retry count once.
 */
export async function track(userId: string, event: string, properties: Record<string, unknown> = {}, id?: string) {
  try {
    await fetch(`${POSTHOG_HOST}/i/v0/e/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event,
        distinct_id: userId,
        properties: { ...properties, ...(id ? { $insert_id: id } : {}) },
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch (err) {
    console.error(`Analytics event ${event} not sent`, err);
  }
}
