import { NextResponse } from "next/server";
import { createCheckout, getAccess } from "@/lib/billing";
import { requestOrigin } from "@/lib/origin";
import { getSession } from "@/lib/session";
import { PUBLIC_CODES } from "@/lib/pricing";

export const dynamic = "force-dynamic";

// Every "Buy" button points here. Signed out: sign in first and come back. Already paid:
// straight to the dashboard. Otherwise: open a Dodo checkout for the tier on sale.
export async function GET(request: Request) {
  const origin = await requestOrigin();
  // An optional discount code, e.g. /buy?code=INDIA50. Only codes we publish are passed on.
  const asked = new URL(request.url).searchParams.get("code")?.toUpperCase() ?? null;
  const code = asked && (PUBLIC_CODES as readonly string[]).includes(asked) ? asked : null;
  const back = code ? `/buy?code=${code}` : "/buy";
  const session = await getSession();
  if (!session) return NextResponse.redirect(`${origin}/login?next=${encodeURIComponent(back)}`);

  const access = await getAccess(session.user);
  if (access.paid) return NextResponse.redirect(`${origin}/dashboard`);

  try {
    const checkout = await createCheckout(session.user, origin, code);
    if (!checkout) return NextResponse.redirect(`${origin}/pricing?soldout=1`);
    return NextResponse.redirect(checkout.url);
  } catch (err) {
    console.error("Could not start checkout", err);
    return NextResponse.redirect(`${origin}/pricing?error=checkout`);
  }
}
