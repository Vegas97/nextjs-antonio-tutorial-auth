import Credentials from "next-auth/providers/credentials";

import type { NextAuthConfig, User } from "next-auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { env } from "@/lib/env"; // this will be imported in the middleware.

// this will be imported in the middleware.
// and as yiu can see there is no prisma here,
// so will be fine for him.

env.checkNotEmptyEnvVars([
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
]);

export default {
  providers: [
    Google({
      clientId: env.get.googleClientId,
      clientSecret: env.get.googleClientSecret,
      // allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: env.get.githubClientId,
      clientSecret: env.get.githubSecret,
    }),
    Credentials({
      async authorize(credentials) {
        // parse the credentials with LoginSchema
        const validatedFields = LoginSchema.safeParse(credentials);

        // check if the fields are valid
        if (validatedFields.success) {
          // we get the fields
          const { email, password } = validatedFields.data;

          // we search the user in our db by email
          const user = await getUserByEmail(email);

          // if the user exists but the password is empty, means the user is signed up with a provider (google, github, etc)
          if (!user || !user.password) return null;

          // we compare the password with the hashed password in the db
          const passwordsMatch = await bcrypt.compare(password, user.password);

          // if the passwords match we return the user
          if (passwordsMatch) return user as User;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
