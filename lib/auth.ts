import { auth } from "@/auth";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  // TODO: why .role is not suggested by the IDE ??
  return session?.user?.role;
};
