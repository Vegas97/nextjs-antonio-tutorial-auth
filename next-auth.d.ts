import { UserRole } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  emailVerified: Date;
  isTwoFactorEnabled: boolean;
};

declare module "next-auth" {
  interface User extends ExtendedUser {}

  interface Session {
    user: ExtendedUser;
  }
}
