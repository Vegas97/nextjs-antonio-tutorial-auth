import { db } from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verificiation-token";
import { v4 as uuidv4 } from "uuid";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import crypto from "crypto";

const DEFAULT_TOKEN_EXPIRATION_FAST = 5 * 60 * 1000; // 5 minutes (in milliseconds)
const DEFAULT_TOKEN_EXPIRATION_NORMAL = 5 * 60 * 1000; // 1 hour (in milliseconds)

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(
    new Date().getTime() + DEFAULT_TOKEN_EXPIRATION_FAST,
  );

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  // token expires in 1 hour
  const expires = new Date(
    new Date().getTime() + DEFAULT_TOKEN_EXPIRATION_NORMAL,
  );

  // search for existing token
  const existingToken = await getVerificationTokenByEmail(email);

  // if token exists, delete it
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // create a new token
  const verficationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verficationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  // token expires in 1 hour
  const expires = new Date(
    new Date().getTime() + DEFAULT_TOKEN_EXPIRATION_NORMAL,
  );

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
