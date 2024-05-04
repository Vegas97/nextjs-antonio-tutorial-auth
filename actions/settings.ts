"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { db } from "@/lib/db";
import { unstable_update } from "@/auth";
import { UserRole } from "@prisma/client";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const validatedFields = SettingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  let newValues: Partial<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isTwoFactorEnabled: boolean;
  }> = {};

  newValues.name = values.name;
  newValues.email = values.email;
  newValues.role = values.role;
  newValues.isTwoFactorEnabled = values.isTwoFactorEnabled;

  // todo: check if isOAuth is true
  if (user.isOAuth) {
    newValues.email = values.email = undefined;
    newValues.password = values.password = undefined;
    values.newPassword = undefined;
    newValues.isTwoFactorEnabled = values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent!" };
  }

  if (
    values.password &&
    values.newPassword &&
    values.confirmNewPassword &&
    dbUser.password
  ) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const newPasswordsMatch = values.newPassword === values.confirmNewPassword;

    if (!newPasswordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedNewPassword = await bcrypt.hash(values.newPassword, 10);
    newValues.password = hashedNewPassword;
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...newValues,
    },
  });

  // inject the isOAuth value from token into the updated user because it's not in the schema,
  // but also because is strict related to the login method, so you cant change it while you are logged in.
  const session = await unstable_update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      isOAuth: user.isOAuth,
    },
  });

  const userSession = session?.user;

  return { success: `Settings Updated for ${values.name}` };
};
