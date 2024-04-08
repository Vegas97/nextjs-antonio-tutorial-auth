import { UserRole } from "@prisma/client";

// export type ExtendedUser = DefaultSession["user"] & {
//   role: UserRole;
// };

declare module "next-auth" {
  interface User {
    role: UserRole;
    emailVerified: Date;
    isTwoFactorEnabled: boolean;
  }

  interface Session {
    user: User;
  }
}
