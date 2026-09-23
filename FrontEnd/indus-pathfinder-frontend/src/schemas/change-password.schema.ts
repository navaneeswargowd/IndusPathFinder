// import {
//   z,
// } from "zod";

// export const changePasswordSchema =
//   z
//     .object({
//       oldPassword:
//         z
//           .string()
//           .min(
//             1,
//             "Current password is required"
//           ),

//       newPassword:
//         z
//           .string()
//           .min(
//             8,
//             "New password must contain at least 8 characters"
//           )
//           .regex(
//             /[A-Z]/,
//             "Password must contain an uppercase letter"
//           )
//           .regex(
//             /[a-z]/,
//             "Password must contain a lowercase letter"
//           )
//           .regex(
//             /\d/,
//             "Password must contain a number"
//           ),

//       confirmPassword:
//         z
//           .string()
//           .min(
//             1,
//             "Confirm password is required"
//           ),
//     })
//     .refine(
//       (
//         values
//       ) =>
//         values.newPassword ===
//         values.confirmPassword,
//       {
//         path: [
//           "confirmPassword",
//         ],

//         message:
//           "Passwords do not match",
//       }
//     );

// export type ChangePasswordFormValues =
//   z.infer<
//     typeof changePasswordSchema
//   >;



import { z } from "zod";

import {
  PASSWORD_REGEX,
} from "../utils/validation.utils";

export const changePasswordSchema =
  z
    .object({
      oldPassword:
        z
          .string()
          .min(
            1,
            "Current Password is required"
          ),

      newPassword:
        z
          .string()
          .min(
            1,
            "New Password is required"
          )
          .regex(
            PASSWORD_REGEX,
            "Password must contain 6-50 characters, one uppercase letter, one lowercase letter, one number, and one special character, with no spaces"
          ),

      confirmPassword:
        z
          .string()
          .min(
            1,
            "Confirm New Password is required"
          ),
    })
    .refine(
      (data) =>
        data.newPassword ===
        data.confirmPassword,
      {
        message:
          "New Password and Confirm New Password must match",

        path: [
          "confirmPassword",
        ],
      }
    );

export type ChangePasswordFormValues =
  z.infer<
    typeof changePasswordSchema
  >;

