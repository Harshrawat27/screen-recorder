import { NextResponse } from "next/server";
import { createCheckout, getAccess } from "@/lib/billing";
import { requestOrigin } from "@/lib/origin";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// Every "Buy" button points here. Signed out: sign in first and come back. Already paid:
// straight to the dashboard. Otherwise: open a Dodo checkout for the tier on sale.
export async function GET() {
  const origin = await requestOrigin();
  const session = await getSession();
  if (!session) return NextResponse.redirect(`${origin}/login?next=/buy`);

  const access = await getAccess(session.user);
  if (access.paid) return NextResponse.redirect(`${origin}/dashboard`);

  try {
    const checkout = await createCheckout(session.user, origin);
    if (!checkout) return NextResponse.redirect(`${origin}/pricing?soldout=1`);
    return NextResponse.redirect(checkout.url);
  } catch (err) {
    console.error("Could not start checkout", err);
    return NextResponse.redirect(`${origin}/pricing?error=checkout`);
  }
}
