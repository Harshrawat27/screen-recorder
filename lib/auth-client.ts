import { createAuthClient } from "better-auth/react";

// Talks to /api/auth on the same site, so no base URL is needed.
export const authClient = createAuthClient();
