"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { unstable_update } from "@/auth";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  console.log({
    settingsUser: {
      user,
      values,
    },
  });

  if (!user) {
    return { error: `Unauthorized for ${values.name}` };
  }

  const dbUser = await getUserById(user.id);

  console.log({
    settingsDbUser: {
      dbUser,
    },
  });

  if (!dbUser) {
    return { error: `Unauthorized for ${values.name}` };
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  const session = await unstable_update({ user: updatedUser });

  const userSession = session?.user;

  console.log({
    settingsRes: {
      updatedUser,
      userSession,
    },
  });

  return { success: `Settings Updated for ${values.name}` };
};
