import { NextResponse } from "next/server";
import { redeemCode } from "@/lib/appsumo";
import { requestOrigin } from "@/lib/origin";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// The form on /appsumo posts here. Success: on to the dashboard to connect Cloudflare.
// Anything else: back to /appsumo with the reason, keeping what they typed.
export async function POST(request: Request) {
  const origin = await requestOrigin();
  const form = await request.formData().catch(() => null);
  const code = String(form?.get("code") ?? "").slice(0, 200);
  const back = (error: string) =>
    NextResponse.redirect(`${origin}/appsumo?error=${error}&code=${encodeURIComponent(code)}`, 303);

  const session = await getSession();
  if (!session) return NextResponse.redirect(`${origin}/login?next=${encodeURIComponent(`/appsumo?code=${code}`)}`, 303);

  const result = await redeemCode(session.user.id, code);
  if (!result.ok) return back(result.reason);
  return NextResponse.redirect(`${origin}/dashboard?redeemed=appsumo`, 303);
}
