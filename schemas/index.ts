import * as z from "zod";
import { UserRole } from "@prisma/client";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    isTwoFactorEnabled: z.optional(z.boolean()),
    password: z
      .string()
      .min(6, { message: "Minimum of 6 characters required" })
      .optional()
      .or(z.literal("")),
    newPassword: z
      .string()
      .min(6, { message: "Minimum of 6 characters required" })
      .optional()
      .or(z.literal("")),
    confirmNewPassword: z
      .string()
      .min(6, { message: "Minimum of 6 characters required" })
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      console.log({ data });
      return !(data.password && !data.newPassword);
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  )
  .refine((data) => !(data.newPassword && !data.password), {
    message: "Current Password is required!",
    path: ["password"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "New Passwords do not match",
  });

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordWithRepeatSchema = z
  .object({
    // password: z.string().min(8, { message: "Minimum of 8 characters required" })
    //     .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/, {
    //       message: "Password must contain at least one lowercase, uppercase, number, and special character"
    //     }),
    password: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
