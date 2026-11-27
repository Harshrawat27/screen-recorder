import { NextResponse } from "next/server";

/**
 * What an API route answers when a free account uses a paid feature. `plan: true` makes the
 * browser open the upgrade popup (components/upgrade.tsx), wherever the request came from.
 */
export const planRequired = (message = "This comes with the paid plan.") => NextResponse.json({ error: message, plan: true }, { status: 402 });
