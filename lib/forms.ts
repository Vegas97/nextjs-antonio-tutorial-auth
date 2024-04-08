import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginSchema } from "@/schemas";

export const useLoginFormWithCode = (showTwoFactor: boolean) => {
  return useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(
      LoginSchema.refine((data) => !(showTwoFactor && !data.code), {
        path: ["code"],
        message: "Code is required",
      }),
    ),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });
};
