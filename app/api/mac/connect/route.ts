import { redeemHandoff } from "@/lib/mac-handoff";

// The Mac app trades the one-time code from showthrough://connect for its accounts.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { code?: unknown } | null;
  const code = typeof body?.code === "string" ? body.code : "";
  const accounts = code ? await redeemHandoff(code) : null;
  if (!accounts) return Response.json({ error: "This connect link has expired. Press Connect in the app again." }, { status: 410 });
  return Response.json({ accounts }, { headers: { "cache-control": "no-store" } });
}
