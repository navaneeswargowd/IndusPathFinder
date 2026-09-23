import {
  z,
} from "zod";

import {
  PASSWORD_REGEX,
} from "../utils/validation.utils";

const passwordSchema =
  z
    .string()
    .min(
      8,
      "Password must contain at least 8 characters"
    )
    .regex(
      /[A-Z]/,
      "Password must contain at least one uppercase letter"
    )
    .regex(
      /[a-z]/,
      "Password must contain at least one lowercase letter"
    )
    .regex(
      /[0-9]/,
      "Password must contain at least one number"
    )
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    );

export const resetPasswordSchema =
  z
    .object({
      email: z
        .string()
        .trim()
        .email(
          "Enter a valid email address"
        ),

      otp: z
        .string()
        .trim()
        .min(
          1,
          "OTP is required"
        ),

       newPassword:
        z
          .string()
          .min(
            1,
            "New password is required"
          )
          .min(
            8,
            "Password must contain at least 8 characters"
          )
          .max(
            50,
            "Password cannot exceed 50 characters"
          )
          .regex(
            PASSWORD_REGEX,
            "Password must contain uppercase, lowercase, number and special character"
          ),


      confirmPassword:
        z
          .string()
          .min(
            1,
            "Confirm password is required"
          )
          .max(
            50,
            "Confirm password cannot exceed 50 characters"
          ),
    })
    .refine(
      (data) =>
        data.newPassword ===
        data.confirmPassword,
      {
        message:
          "New password and confirm password do not match",

        path: [
          "confirmPassword",
        ],
      }
    );

export type ResetPasswordFormValues =
  z.infer<
    typeof resetPasswordSchema
  >;