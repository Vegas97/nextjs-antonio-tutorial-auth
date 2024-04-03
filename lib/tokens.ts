import { db } from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verificiation-token";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

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
