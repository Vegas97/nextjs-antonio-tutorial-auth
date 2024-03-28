import GitHub from "next-auth/providers/github";

import type { NextAuthConfig } from "next-auth";

// this will be imported in the middleware.
// and as yiu can see there is no prisma here,
// so will be fine for him.

export default {
  providers: [GitHub],
} satisfies NextAuthConfig;
