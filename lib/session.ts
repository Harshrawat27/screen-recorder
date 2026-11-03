import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** For signed-in pages: returns the session or sends the visitor to /login. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
