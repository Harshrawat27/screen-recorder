import { NextResponse } from "next/server";

// The visitor's country (Vercel tells us from the request; nothing is stored), and whether they
// must be asked before analytics load: the EU, the rest of the EEA, the UK and Switzerland.
// Also used for country offers (components/india-offer.tsx).

export const dynamic = "force-dynamic";

const ASK = new Set(
  "AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO GB CH".split(" "),
);

export function GET(request: Request) {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase() ?? "";
  return NextResponse.json({ ask: ASK.has(country), country }, { headers: { "cache-control": "private, no-store" } });
}
