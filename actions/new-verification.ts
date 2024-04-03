"use server";

import { getUserByEmail, verifyUser } from "@/data/user";
import {
  deleteVerificationToken,
  getVerificationTokenByToken,
} from "@/data/verificiation-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  try {
    await verifyUser(existingUser.id, existingToken.email);

    await deleteVerificationToken(existingToken.id);
  } catch (e) {
    return { error: "Something went wrong!" };
  }

  return { success: "Email verified!" };
};
