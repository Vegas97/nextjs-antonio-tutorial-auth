import { UserRole } from "@prisma/client";
// import {DefaultSession} from "next-auth"; // if you import you get errors in auth.ts :-(

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  emailVerified: Date;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface User extends ExtendedUser {}

  interface Session {
    user: ExtendedUser;
  }
}
