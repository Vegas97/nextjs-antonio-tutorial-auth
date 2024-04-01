import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: UserRole;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      console.log({ fromEventLinkAccount: user });

      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
    async signIn({ user }) {
      console.log({ fromEventSignIn: user });
    },
  },
  callbacks: {
    async signIn({ credentials, account, profile, user, email }) {
      console.log({
        fromCallbackSignIn: {
          credentials,
          account,
          profile,
          email,
          user,
        },
      });

      return true;
    },
    async jwt({ token, user, session, profile, account }) {
      // if user exist, means we are on signIn, we add the user role to the token
      if (user && user.role) {
        token.role = user.role;
      }

      // option2. calling db each time

      // // if sub is not set, return the token as is (we do nothing)
      // if (!token.sub) return token;

      // // we get the user from db
      // const existingUser = await getUserById(token.sub);

      // // if user does not exist, return the token as is (we do nothing)
      // if (!existingUser) return token;

      // // if user exist we add the user role to the token
      // token.role = existingUser.role;

      console.log({
        fromCallbackJWT: {
          token,
          user,
          session,
          profile,
          account,
        },
      });

      return token;
    },
    async session({ token, session, user, newSession }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        // Conversion from string to enum
        // session.user.role = UserRole[token.role as keyof typeof UserRole]; // option 1.
        session.user.role = token.role as UserRole;
      }

      console.log({
        fromCallbackSession: {
          token,
          session,
          sessionUser: session.user,
          newSession,
          user,
        },
      });

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
