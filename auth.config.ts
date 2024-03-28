import Credentials from "next-auth/providers/credentials";

import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs"; // this will be imported in the middleware.

// this will be imported in the middleware.
// and as yiu can see there is no prisma here,
// so will be fine for him.

export default {
  providers: [
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
          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
