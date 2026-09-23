import {
  z,
} from "zod";

export const forgotPasswordSchema =
  z.object({
    email: z
      .string()
      .min(
        1,
        "Email is required"
      )
      .max(
        100,
        "Email cannot exceed 100 characters"
      )
      .refine(
        (value) =>
          !/\s/.test(value),
        {
          message:
            "Email cannot contain spaces",
        }
      )
      .email(
        "Enter a valid email address"
      ),
  });

export type ForgotPasswordFormValues =
  z.infer<
    typeof forgotPasswordSchema
  >;