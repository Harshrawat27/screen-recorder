import { NextResponse } from "next/server";
import { markRefunded, recordPayment, verifyWebhook } from "@/lib/billing";

// Dodo calls this when a payment succeeds or is refunded.
// Set it up in Dodo as https://www.showthrough.com/api/dodo/webhook.
export async function POST(request: Request) {
  const body = await request.text();
  if (!verifyWebhook(body, request.headers)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body) as { type?: string; data?: Record<string, unknown> };
  const data = event.data ?? {};

  try {
    if (event.type === "payment.succeeded") {
      await recordPayment(data as Parameters<typeof recordPayment>[0]);
    } else if (event.type === "refund.succeeded" && typeof data.payment_id === "string") {
      await markRefunded(data.payment_id);
    }
  } catch (err) {
    console.error("Dodo webhook failed", event.type, err);
    // A non-2xx answer makes Dodo retry later.
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
