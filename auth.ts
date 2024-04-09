import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

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
    // async signIn({ user }) {
    //   console.log({ fromEventSignIn: user });
    // },
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

      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      // Prevent sign in without email verification
      if (!user.emailVerified) {
        return false;
      }

      if (user.isTwoFactorEnabled && user.id) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          user.id,
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async jwt({ token, user, session, profile, account }) {
      // if user exist, means we are on signIn, we add the user role to the token
      if (user && user.role) {
        token.role = user.role;
      }

      if (user && user.hasOwnProperty("isTwoFactorEnabled")) {
        token.isTwoFactorEnabled = user.isTwoFactorEnabled;
      }

      if (user) {
        console.log({
          fromCallbackJWT: {
            token,
            user,
            session,
            profile,
            account,
          },
        });
      }

      return token;
    },
    async session({ token, session, user, newSession }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (token.hasOwnProperty("isTwoFactorEnabled") && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
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
