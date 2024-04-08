import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
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
    message: "Passwords does not match",
  });
