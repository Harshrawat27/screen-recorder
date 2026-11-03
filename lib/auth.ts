import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { pool } from "@/lib/db";

// Accounts for the Showthrough website and dashboard. Users, sessions and linked
// Google accounts are stored in our Postgres (Neon) database.
//
// This is not where the Cloudflare connection happens: that runs in the user's
// browser so our server never holds their Cloudflare access.
export const auth = betterAuth({
  appName: "Showthrough",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: pool,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },
  trustedOrigins: ["https://www.showthrough.com", "https://showthrough.com", "http://localhost:3000"],
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh the expiry at most once a day
  },
  plugins: [nextCookies()], // must stay last
});

export type Session = typeof auth.$Infer.Session;
