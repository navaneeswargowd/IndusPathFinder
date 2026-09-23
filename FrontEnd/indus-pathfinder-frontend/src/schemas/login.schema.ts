import {
  z,
} from "zod";

export const loginSchema =
  z.object({
    email:
      z
        .string()
        .trim()
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
            !/\s/.test(
              value
            ),
          {
            message:
              "Email cannot contain spaces",
          }
        )
        .email(
          "Enter a valid email address"
        ),

password:
  z
    .string()
    .min(
      1,
      "Password is required"
    )
    .min(
      6,
      "Password must contain at least 6 characters"
    )
    .max(
      50,
      "Password cannot exceed 50 characters"
    )
    // .regex(
    //   /[A-Z]/,
    //   "Password must contain at least one uppercase letter"
    // )
    // .regex(
    //   /[a-z]/,
    //   "Password must contain at least one lowercase letter"
    // )
    // .regex(
    //   /[0-9]/,
    //   "Password must contain at least one number"
    // )
    // .regex(
    //   /[^A-Za-z0-9]/,
    //   "Password must contain at least one special character"
    // )
    .refine(
      (value) =>
        !/\s/.test(value),
      {
        message:
          "Password cannot contain spaces",
      }
    ),
  });

export type LoginFormValues =
  z.infer<
    typeof loginSchema
  >;