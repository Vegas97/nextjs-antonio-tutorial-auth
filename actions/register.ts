"use server";

// Schema Imports
import { z } from "zod";
import { RegisterSchema } from "@/schemas";

// Data Imports
import { createUser, getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";

// Mail Imports
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already taken!" };
  }

  try {
    await createUser(name, email, password);

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
  } catch (e) {
    return { error: "Something went wrong!" };
  }

  return { success: "Confirmation email sent!" };
};
