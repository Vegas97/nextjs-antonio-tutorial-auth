import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch {
    return null;
  }
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

export const verifyUser = async (id: string, email: string) => {
  const user = await db.user.update({
    where: { id },
    data: {
      emailVerified: new Date(),
      email,
    },
  });

  return user;
};
