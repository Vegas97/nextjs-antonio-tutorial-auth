import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

const showLogs = false;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
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
      if (showLogs) {
        console.log({
          fromCallbackSignIn: {
            credentials,
            account,
            profile,
            email,
            user,
          },
        });
      }

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
    async jwt({ token, user, session, profile, account, trigger }) {
      if (trigger !== undefined) {
        if ((trigger === "signIn" || trigger === "signUp") && user) {
          if (user.role) {
            token.role = user.role;
          }

          if (user.email) {
            token.email = user.email;
          }

          if (user.name) {
            token.name = user.name;
          }

          if (user.hasOwnProperty("isTwoFactorEnabled")) {
            token.isTwoFactorEnabled = user.isTwoFactorEnabled;
          }
        } else if (trigger === "update" && session && session.user) {
          if (session.user.role) {
            token.role = session.user.role;
          }

          if (session.user.email) {
            token.email = session.user.email;
          }

          if (session.user.name) {
            token.name = session.user.name;
          }

          if (session.user.hasOwnProperty("isTwoFactorEnabled")) {
            token.isTwoFactorEnabled = session.user.isTwoFactorEnabled;
          }

          if (showLogs) {
            console.log({
              fromCallbackJWT: {
                trigger,
                token,
                user,
                session,
                profile,
                account,
              },
            });
          }
        }
      }

      if (showLogs) {
        // if (user) {
        console.log({
          fromCallbackJWT: {
            trigger,
            token,
            user,
            session,
            profile,
            account,
          },
        });
        // }
      }

      return token;
    },
    async session({ token, session, user, newSession, trigger }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.role) {
          session.user.role = token.role as UserRole;
        }

        if (token.name) {
          session.user.name = token.name;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        if (token.hasOwnProperty("isTwoFactorEnabled")) {
          session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        }
      }

      if (showLogs) {
        console.log({
          fromCallbackSession: {
            trigger,
            token,
            session,
            sessionUser: session.user,
            newSession,
            user,
          },
        });
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
