import { NextResponse } from "next/server";
import { TEAM_SIZES, saveInterest } from "@/lib/interest";

// The form on /service-as-a-software. Saves to its own table (lib/interest.ts).

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const text = (value: unknown, max: number) => String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max);

export async function POST(request: Request) {
  const input = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!input) return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 400 });

  // Bots fill every field, including the hidden one, and send the form instantly.
  if (text(input.website, 200) || Number(input.elapsed) < 1500) return NextResponse.json({ ok: true });

  const name = text(input.name, 120);
  const email = text(input.email, 254).toLowerCase();
  if (!name) return NextResponse.json({ error: "Add your name." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: "That email doesn’t look right." }, { status: 400 });

  const teamSize = TEAM_SIZES.includes(input.teamSize as (typeof TEAM_SIZES)[number]) ? String(input.teamSize) : null;
  const tools = Array.isArray(input.replaceTools) ? input.replaceTools : [];
  const replaceTools = [...new Set(tools.map((t) => text(t, 60)).filter(Boolean))].slice(0, 20);
  const note = String(input.note ?? "").trim().slice(0, 3000) || null;

  try {
    await saveInterest({
      name,
      email,
      company: text(input.company, 160) || null,
      teamSize,
      replaceTools,
      note,
      source: text(input.source, 300) || null,
    });
  } catch (err) {
    console.error("Could not save interest", err);
    return NextResponse.json({ error: "We couldn’t save that just now. Try again in a minute." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
